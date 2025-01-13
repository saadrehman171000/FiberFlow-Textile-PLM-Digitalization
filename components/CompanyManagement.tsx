'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

type Representative = {
  id: number
  companyName: string
  name: string
  designation: string
  email: string
  phoneNumber: string
  whatsappNumber?: string
  address: string
  cnicNumber: string
  status: 'active' | 'inactive' | 'none'
}

interface CompanyManagementProps {
  onUpdate: () => void;
}

export function CompanyManagement({ onUpdate }: CompanyManagementProps) {
  const [representatives, setRepresentatives] = useState<Representative[]>([
    { id: 1, companyName: 'ABC Corp', name: 'John Doe', designation: 'Manager', email: 'john@example.com', phoneNumber: '1234567890', address: '123 Main St', cnicNumber: '12345-6789012-3', status: 'active' },
    { id: 2, companyName: 'XYZ Ltd', name: 'Jane Smith', designation: 'Director', email: 'jane@example.com', phoneNumber: '0987654321', whatsappNumber: '0987654321', address: '456 Elm St', cnicNumber: '98765-4321098-7', status: 'inactive' },
  ])
  const [newRepresentative, setNewRepresentative] = useState<Omit<Representative, 'id'>>({
    companyName: '',
    name: '',
    designation: '',
    email: '',
    phoneNumber: '',
    whatsappNumber: '',
    address: '',
    cnicNumber: '',
    status: 'none'
  })
  const [editingRepresentative, setEditingRepresentative] = useState<Representative | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [representativeToDelete, setRepresentativeToDelete] = useState<number | null>(null)
  const { toast } = useToast()

  const fetchRepresentatives = useCallback(async () => {
    try {
      const response = await fetch('/api/representatives')
      if (!response.ok) throw new Error('Failed to fetch representatives')
      const data = await response.json()
      setRepresentatives(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch representatives",
        variant: "destructive",
      })
    }
  }, [toast])

  const handleCreateRepresentative = async () => {
    if (!validateFields(newRepresentative)) {
      toast({
        title: "Error",
        description: "Please fill all the fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('/api/representatives', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRepresentative),
      })

      if (!response.ok) throw new Error('Failed to create representative')

      await fetchRepresentatives()
      setNewRepresentative({
        companyName: '',
        name: '',
        designation: '',
        email: '',
        phoneNumber: '',
        whatsappNumber: '',
        address: '',
        cnicNumber: '',
        status: 'none'
      })
      setIsAddDialogOpen(false)
      toast({
        title: "Success",
        description: "Representative created successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create representative",
        variant: "destructive",
      })
    }
  }

  const handleUpdateRepresentative = async () => {
    if (!editingRepresentative || !validateFields(editingRepresentative)) {
      toast({
        title: "Error",
        description: "Please fill all the fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`/api/representatives/${editingRepresentative.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingRepresentative),
      })

      if (!response.ok) throw new Error('Failed to update representative')

      await fetchRepresentatives()
      setEditingRepresentative(null)
      setIsEditDialogOpen(false)
      toast({
        title: "Success",
        description: "Representative updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update representative",
        variant: "destructive",
      })
    }
  }

  const handleDeleteRepresentative = async (id: number) => {
    try {
      const response = await fetch(`/api/representatives/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete representative')

      await fetchRepresentatives()
      setIsDeleteDialogOpen(false)
      setRepresentativeToDelete(null)
      toast({
        title: "Success",
        description: "Representative deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete representative",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchRepresentatives()
  }, [fetchRepresentatives])

  const getStatusBadge = (status: Representative['status']) => {
    switch (status) {
      case 'active':
        return <Badge variant="default">Active</Badge>
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>
      case 'none':
        return <Badge variant="outline">Not Set</Badge>
    }
  }

  const validateFields = (representative: Omit<Representative, 'id'>) => {
    return Object.values(representative).every(value => value !== '');
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Company Representatives</CardTitle>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Create New Representative</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Representative</DialogTitle>
              <DialogDescription>Enter the details for the new company representative.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="companyName" className="text-right">Company Name</Label>
                <Input
                  id="companyName"
                  value={newRepresentative.companyName}
                  onChange={(e) => setNewRepresentative({ ...newRepresentative, companyName: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input
                  id="name"
                  value={newRepresentative.name}
                  onChange={(e) => setNewRepresentative({ ...newRepresentative, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="designation" className="text-right">Designation</Label>
                <Input
                  id="designation"
                  value={newRepresentative.designation}
                  onChange={(e) => setNewRepresentative({ ...newRepresentative, designation: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newRepresentative.email}
                  onChange={(e) => setNewRepresentative({ ...newRepresentative, email: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phoneNumber" className="text-right">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  value={newRepresentative.phoneNumber}
                  onChange={(e) => setNewRepresentative({ ...newRepresentative, phoneNumber: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="whatsappNumber" className="text-right">WhatsApp Number</Label>
                <Input
                  id="whatsappNumber"
                  value={newRepresentative.whatsappNumber}
                  onChange={(e) => setNewRepresentative({ ...newRepresentative, whatsappNumber: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">Address</Label>
                <Input
                  id="address"
                  value={newRepresentative.address}
                  onChange={(e) => setNewRepresentative({ ...newRepresentative, address: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="cnicNumber" className="text-right">CNIC Number</Label>
                <Input
                  id="cnicNumber"
                  value={newRepresentative.cnicNumber}
                  onChange={(e) => setNewRepresentative({ ...newRepresentative, cnicNumber: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">Status</Label>
                <Select
                  value={newRepresentative.status}
                  onValueChange={(value: Representative['status']) => setNewRepresentative({ ...newRepresentative, status: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="none">Not Set</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateRepresentative}>Create Representative</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Company Name</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Designation</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>WhatsApp Number</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>CNIC Number</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {representatives.map((representative) => (
              <TableRow key={representative.id}>
                <TableCell>{representative.id}</TableCell>
                <TableCell>{representative.companyName}</TableCell>
                <TableCell>{representative.name}</TableCell>
                <TableCell>{representative.designation}</TableCell>
                <TableCell>{representative.email}</TableCell>
                <TableCell>{representative.phoneNumber}</TableCell>
                <TableCell>{representative.whatsappNumber || 'N/A'}</TableCell>
                <TableCell>{representative.address}</TableCell>
                <TableCell>{representative.cnicNumber}</TableCell>
                <TableCell>{getStatusBadge(representative.status)}</TableCell>
                <TableCell className="text-right">
                  <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="mr-2" onClick={() => setEditingRepresentative(representative)}>
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Representative</DialogTitle>
                        <DialogDescription>Update the details for this representative.</DialogDescription>
                      </DialogHeader>
                      {editingRepresentative && (
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-companyName" className="text-right">Company Name</Label>
                            <Input
                              id="edit-companyName"
                              value={editingRepresentative.companyName}
                              onChange={(e) => setEditingRepresentative({ ...editingRepresentative, companyName: e.target.value })}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-name" className="text-right">Name</Label>
                            <Input
                              id="edit-name"
                              value={editingRepresentative.name}
                              onChange={(e) => setEditingRepresentative({ ...editingRepresentative, name: e.target.value })}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-designation" className="text-right">Designation</Label>
                            <Input
                              id="edit-designation"
                              value={editingRepresentative.designation}
                              onChange={(e) => setEditingRepresentative({ ...editingRepresentative, designation: e.target.value })}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-email" className="text-right">Email</Label>
                            <Input
                              id="edit-email"
                              type="email"
                              value={editingRepresentative.email}
                              onChange={(e) => setEditingRepresentative({ ...editingRepresentative, email: e.target.value })}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-phoneNumber" className="text-right">Phone Number</Label>
                            <Input
                              id="edit-phoneNumber"
                              value={editingRepresentative.phoneNumber}
                              onChange={(e) => setEditingRepresentative({ ...editingRepresentative, phoneNumber: e.target.value })}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-whatsappNumber" className="text-right">WhatsApp Number</Label>
                            <Input
                              id="edit-whatsappNumber"
                              value={editingRepresentative.whatsappNumber}
                              onChange={(e) => setEditingRepresentative({ ...editingRepresentative, whatsappNumber: e.target.value })}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-address" className="text-right">Address</Label>
                            <Input
                              id="edit-address"
                              value={editingRepresentative.address}
                              onChange={(e) => setEditingRepresentative({ ...editingRepresentative, address: e.target.value })}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-cnicNumber" className="text-right">CNIC Number</Label>
                            <Input
                              id="edit-cnicNumber"
                              value={editingRepresentative.cnicNumber}
                              onChange={(e) => setEditingRepresentative({ ...editingRepresentative, cnicNumber: e.target.value })}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-status" className="text-right">Status</Label>
                            <Select
                              value={editingRepresentative.status}
                              onValueChange={(value: Representative['status']) => setEditingRepresentative({ ...editingRepresentative, status: value })}
                            >
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                                <SelectItem value="none">Not Set</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                      <DialogFooter>
                        <Button onClick={handleUpdateRepresentative}>Update Representative</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setRepresentativeToDelete(representative.id)}
                      >
                        Delete
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete this representative? This action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleDeleteRepresentative(representativeToDelete!)}
                        >
                          Delete
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
