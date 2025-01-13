'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Customer {
  id: number
  name: string
  email: string
  industry: string
}

interface CustomerManagementProps {
  onUpdate: () => void;
}

export function CustomerManagement({ onUpdate }: CustomerManagementProps) {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddingCustomer, setIsAddingCustomer] = useState(false)
  const [isEditingCustomer, setIsEditingCustomer] = useState(false)
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '', industry: '' })
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isViewingCustomer, setIsViewingCustomer] = useState(false)
  const [notification, setNotification] = useState<string | null>(null)

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers')
      const data = await response.json()
      setCustomers(data)
    } catch (error) {
      setNotification('Failed to fetch customers')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const displayNotification = (message: string) => {
    setNotification(message)
    setTimeout(() => setNotification(null), 3000)
  }

  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email)

  const handleAddCustomer = async () => {
    if (!newCustomer.name || !newCustomer.email || !newCustomer.industry) {
      displayNotification('Please fill out all fields')
      return
    }
    if (!validateEmail(newCustomer.email)) {
      displayNotification('Invalid email format')
      return
    }
    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCustomer),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to add customer')
      }

      const customer = await response.json()
      setCustomers((prev) => [customer, ...prev])
      setIsAddingCustomer(false)
      setNewCustomer({ name: '', email: '', industry: '' })
      displayNotification('Customer added successfully')
      onUpdate()
    } catch (error: any) {
      displayNotification(error.message)
    }
  }

  const handleEditCustomer = async () => {
    if (!selectedCustomer) return

    if (!newCustomer.name || !newCustomer.email || !newCustomer.industry) {
      displayNotification('Please fill out all fields')
      return
    }
    if (!validateEmail(newCustomer.email)) {
      displayNotification('Invalid email format')
      return
    }
    try {
      const response = await fetch(`/api/customers/${selectedCustomer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCustomer),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update customer')
      }

      const updatedCustomer = await response.json()
      setCustomers((prev) =>
        prev.map((customer) =>
          customer.id === updatedCustomer.id ? updatedCustomer : customer
        )
      )
      setIsEditingCustomer(false)
      setSelectedCustomer(null)
      setNewCustomer({ name: '', email: '', industry: '' })
      displayNotification('Customer updated successfully')
      onUpdate()
    } catch (error: any) {
      displayNotification(error.message)
    }
  }

  const handleDeleteCustomer = async (id: number) => {
    try {
      const response = await fetch(`/api/customers/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete customer')

      setCustomers((prev) => prev.filter((c) => c.id !== id))
      displayNotification('Customer deleted successfully')
      onUpdate()
    } catch (error) {
      displayNotification('Failed to delete customer')
    }
  }

  const handleViewCustomer = async (id: number) => {
    try {
      const response = await fetch(`/api/customers/${id}`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Customer not found');
      }

      const customer = await response.json();
      setSelectedCustomer(customer);
      setIsViewingCustomer(true);
    } catch (error) {
      console.error('Error fetching customer:', error);
      displayNotification('Failed to fetch customer');
    }
  }

  const handleOpenEditDialog = (customer: Customer) => {
    setSelectedCustomer(customer)
    setNewCustomer({ name: customer.name, email: customer.email, industry: customer.industry })
    setIsEditingCustomer(true)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Companies</h2>
        <Dialog open={isAddingCustomer} onOpenChange={setIsAddingCustomer}>
          <DialogTrigger asChild>
            <Button>Add Customer</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
              <DialogDescription>Enter the details of the new customer.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" value={newCustomer.name} onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input id="email" type="email" value={newCustomer.email} onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="industry" className="text-right">Industry</Label>
                <Input id="industry" value={newCustomer.industry} onChange={(e) => setNewCustomer({ ...newCustomer, industry: e.target.value })} className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddCustomer}>Add</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {notification && <div className="mb-4 p-2 bg-green-100 text-green-800 rounded">{notification}</div>}

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Industry</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.industry}</TableCell>
                <TableCell>
                  <Button className="mr-2" onClick={() => handleViewCustomer(customer.id)}>View</Button>
                  <Button className="mr-2" onClick={() => handleOpenEditDialog(customer)}>Edit</Button>
                  <Button className="mr-2" onClick={() => handleDeleteCustomer(customer.id)} variant="destructive">Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {isViewingCustomer && selectedCustomer && (
        <Dialog open={isViewingCustomer} onOpenChange={setIsViewingCustomer}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Customer Details</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p><strong>Name:</strong> {selectedCustomer.name}</p>
              <p><strong>Email:</strong> {selectedCustomer.email}</p>
              <p><strong>Industry:</strong> {selectedCustomer.industry}</p>
            </div>
            <DialogFooter>
              <Button onClick={() => setIsViewingCustomer(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {isEditingCustomer && selectedCustomer && (
        <Dialog open={isEditingCustomer} onOpenChange={setIsEditingCustomer}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Customer</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" value={newCustomer.name} onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input id="email" type="email" value={newCustomer.email} onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="industry" className="text-right">Industry</Label>
                <Input id="industry" value={newCustomer.industry} onChange={(e) => setNewCustomer({ ...newCustomer, industry: e.target.value })} className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleEditCustomer}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
