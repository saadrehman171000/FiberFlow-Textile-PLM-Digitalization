'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Order = {
  id: number;
  customer: string;
  product: string;
  size: string;
  quantity: number;
  date: string;
  status: string;
  company?: string;
}

type Company = {
  id: number
  name: string
}

export function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [newOrder, setNewOrder] = useState<Omit<Order, 'id' | 'date'>>({ customer: '', product: '', size: '', quantity: 0, status: 'Pending' })
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  const [companies, setCompanies] = useState<Company[]>([
    { id: 1, name: 'ABC Corp' },
    { id: 2, name: 'XYZ Ltd' },
    { id: 3, name: '123 Industries' },
  ])
  const [newCompany, setNewCompany] = useState('')
  const [isAddingNewCompany, setIsAddingNewCompany] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<string>('All')
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/admin/orders')
        if (!response.ok) throw new Error('Failed to fetch orders')
        const data = await response.json()
        setOrders(data)
        setFilteredOrders(data)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  useEffect(() => {
    if (selectedCompany === 'All') {
      setFilteredOrders(orders)
    } else {
      setFilteredOrders(orders.filter(order => order.company === selectedCompany))
    }
  }, [selectedCompany, orders])

  const handleCreateOrder = () => {
    const order: Order = {
      ...newOrder,
      id: orders.length + 1,
      date: new Date().toISOString()
    }
    setOrders([...orders, order])
    setNewOrder({ customer: '', product: '', size: '', quantity: 0, status: 'Pending' })
  }

  const handleUpdateOrder = () => {
    if (editingOrder) {
      setOrders(orders.map(order => order.id === editingOrder.id ? editingOrder : order))
      setEditingOrder(null)
    }
  }

  const handleDeleteOrder = (id: number) => {
    setOrders(orders.filter(order => order.id !== id))
  }

  const handleAddCompany = () => {
    if (newCompany && !companies.some(company => company.name.toLowerCase() === newCompany.toLowerCase())) {
      const newCompanyObj = { id: companies.length + 1, name: newCompany };
      setCompanies(prevCompanies => [...prevCompanies, newCompanyObj]);
  
      // Safeguard against null values for editingOrder or newOrder
      if (editingOrder) {
        setEditingOrder(prev => prev ? { ...prev, company: newCompanyObj.name } : prev);
      } else {
        setNewOrder(prev => prev ? { ...prev, company: newCompanyObj.name } : prev);
      }
  
      setNewCompany('');
      setIsAddingNewCompany(false);
    }
  };
  

  const getStatusBadge = (status: string) => {
    // Make status check case-insensitive
    const statusLower = status.toLowerCase()
    switch (statusLower) {
      case 'pending':
        return <Badge variant="secondary">{status}</Badge>
      case 'processing':
        return <Badge variant="default">{status}</Badge>
      case 'completed':
        return <Badge variant="outline">{status}</Badge>
      case 'cancelled':
        return <Badge variant="destructive">{status}</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Orders</h2>
        <div className="flex items-center space-x-2">
          <Select value={selectedCompany} onValueChange={setSelectedCompany}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by company" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Companies</SelectItem>
              {companies.map((company) => (
                <SelectItem key={company.id} value={company.name}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Create New Order</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Order</DialogTitle>
                <DialogDescription>Enter the details for the new order.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="customer" className="text-right">Customer</Label>
                  <Input
                    id="customer"
                    value={newOrder.customer}
                    onChange={(e) => setNewOrder({ ...newOrder, customer: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="product" className="text-right">Product</Label>
                  <Input
                    id="product"
                    value={newOrder.product}
                    onChange={(e) => setNewOrder({ ...newOrder, product: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="size" className="text-right">Size</Label>
                  <Input
                    id="size"
                    value={newOrder.size}
                    onChange={(e) => setNewOrder({ ...newOrder, size: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="quantity" className="text-right">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={newOrder.quantity}
                    onChange={(e) => setNewOrder({ ...newOrder, quantity: parseInt(e.target.value) })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="company" className="text-right">Company</Label>
                  <div className="col-span-3 flex gap-2">
                    {isAddingNewCompany ? (
                      <>
                        <Input
                          value={newCompany}
                          onChange={(e) => setNewCompany(e.target.value)}
                          placeholder="Enter new company name"
                          className="flex-grow"
                        />
                        <Button onClick={handleAddCompany} type="button">Add</Button>
                        <Button onClick={() => setIsAddingNewCompany(false)} type="button" variant="outline">Cancel</Button>
                      </>
                    ) : (
                      <>
                        <Select
                          value={newOrder.company}
                          onValueChange={(value) => setNewOrder({ ...newOrder, company: value })}
                        >
                          <SelectTrigger className="flex-grow">
                            <SelectValue placeholder="Select a company" />
                          </SelectTrigger>
                          <SelectContent>
                            {companies.map((company) => (
                              <SelectItem key={company.id} value={company.name}>
                                {company.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button onClick={() => setIsAddingNewCompany(true)} type="button">New Company</Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreateOrder}>Create Order</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">No orders found</TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>#{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.product}</TableCell>
                  <TableCell>{order.size}</TableCell>
                  <TableCell>{order.quantity}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="mr-2" onClick={() => setEditingOrder(order)}>
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Order</DialogTitle>
                          <DialogDescription>Update the details for this order.</DialogDescription>
                        </DialogHeader>
                        {editingOrder && (
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-customer" className="text-right">Customer</Label>
                              <Input
                                id="edit-customer"
                                value={editingOrder.customer}
                                onChange={(e) => setEditingOrder({ ...editingOrder, customer: e.target.value })}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-product" className="text-right">Product</Label>
                              <Input
                                id="edit-product"
                                value={editingOrder.product}
                                onChange={(e) => setEditingOrder({ ...editingOrder, product: e.target.value })}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-size" className="text-right">Size</Label>
                              <Input
                                id="edit-size"
                                value={editingOrder.size}
                                onChange={(e) => setEditingOrder({ ...editingOrder, size: e.target.value })}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-quantity" className="text-right">Quantity</Label>
                              <Input
                                id="edit-quantity"
                                type="number"
                                value={editingOrder.quantity}
                                onChange={(e) => setEditingOrder({ ...editingOrder, quantity: parseInt(e.target.value) })}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-status" className="text-right">Status</Label>
                              <Select
                                value={editingOrder.status}
                                onValueChange={(value: Order['status']) => setEditingOrder({ ...editingOrder, status: value })}
                              >
                                <SelectTrigger className="col-span-3">
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Pending">Pending</SelectItem>
                                  <SelectItem value="In Progress">In Progress</SelectItem>
                                  <SelectItem value="Completed">Completed</SelectItem>
                                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-company" className="text-right">Company</Label>
                              <div className="col-span-3 flex gap-2">
                                {isAddingNewCompany ? (
                                  <>
                                    <Input
                                      value={newCompany}
                                      onChange={(e) => setNewCompany(e.target.value)}
                                      placeholder="Enter new company name"
                                      className="flex-grow"
                                    />
                                    <Button onClick={handleAddCompany} type="button">Add</Button>
                                    <Button onClick={() => setIsAddingNewCompany(false)} type="button" variant="outline">Cancel</Button>
                                  </>
                                ) : (
                                  <>
                                    <Select
                                      value={editingOrder.company}
                                      onValueChange={(value) => setEditingOrder({ ...editingOrder, company: value })}
                                    >
                                      <SelectTrigger className="flex-grow">
                                        <SelectValue placeholder="Select a company" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {companies.map((company) => (
                                          <SelectItem key={company.id} value={company.name}>
                                            {company.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <Button onClick={() => setIsAddingNewCompany(true)} type="button">New Company</Button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                        <DialogFooter>
                          <Button onClick={handleUpdateOrder}>Update Order</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteOrder(order.id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
