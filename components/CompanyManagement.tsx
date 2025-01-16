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
  id: number;
  companyname: string;
  name: string;
  designation: string;
  email: string;
  phonenumber: string;
  whatsappnumber?: string;
  address: string;
  cnicnumber: string;
  status: 'active' | 'inactive' | 'none';
}

interface CompanyManagementProps {
  onUpdate: () => void;
}

export function CompanyManagement({ onUpdate }: CompanyManagementProps) {
  const [representatives, setRepresentatives] = useState<Representative[]>([
    { id: 1, companyname: 'ABC Corp', name: 'John Doe', designation: 'Manager', email: 'john@example.com', phonenumber: '1234567890', address: '123 Main St', cnicnumber: '12345-6789012-3', status: 'active' },
    { id: 2, companyname: 'XYZ Ltd', name: 'Jane Smith', designation: 'Director', email: 'jane@example.com', phonenumber: '0987654321', whatsappnumber: '0987654321', address: '456 Elm St', cnicnumber: '98765-4321098-7', status: 'inactive' },
  ])
  const [newRepresentative, setNewRepresentative] = useState<Omit<Representative, 'id'>>({
    companyname: '',
    name: '',
    designation: '',
    email: '',
    phonenumber: '',
    whatsappnumber: '',
    address: '',
    cnicnumber: '',
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
      const formattedData = {
        companyname: newRepresentative.companyname,
        name: newRepresentative.name,
        designation: newRepresentative.designation,
        email: newRepresentative.email,
        phonenumber: newRepresentative.phonenumber,
        whatsappnumber: newRepresentative.whatsappnumber,
        address: newRepresentative.address,
        cnicnumber: newRepresentative.cnicnumber,
        status: newRepresentative.status
      };

      console.log('Sending create request:', formattedData);
      const response = await fetch('/api/representatives', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedData),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "Error",
          description: data.error || "Failed to create representative",
          variant: "destructive",
        });
        return;
      }

      await fetchRepresentatives();
      setNewRepresentative({
        companyname: '',
        name: '',
        designation: '',
        email: '',
        phonenumber: '',
        whatsappnumber: '',
        address: '',
        cnicnumber: '',
        status: 'none'
      });
      setIsAddDialogOpen(false);
      toast({
        title: "Success",
        description: "Representative created successfully",
      });
    } catch (error) {
      console.error('Create error:', error);
      toast({
        title: "Error",
        description: "Failed to create representative",
        variant: "destructive",
      });
    }
  };

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
      const formattedData = {
        companyname: editingRepresentative.companyname,
        name: editingRepresentative.name,
        designation: editingRepresentative.designation,
        email: editingRepresentative.email,
        phonenumber: editingRepresentative.phonenumber,
        whatsappnumber: editingRepresentative.whatsappnumber,
        address: editingRepresentative.address,
        cnicnumber: editingRepresentative.cnicnumber,
        status: editingRepresentative.status
      };

      console.log('Sending update request:', formattedData);
      const response = await fetch(`/api/representatives/${editingRepresentative.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedData),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "Error",
          description: data.error || "Failed to update representative",
          variant: "destructive",
        });
        return;
      }

      await fetchRepresentatives();
      setEditingRepresentative(null);
      setIsEditDialogOpen(false);
      toast({
        title: "Success",
        description: "Representative updated successfully",
      });
    } catch (error) {
      console.error('Update error:', error);
      toast({
        title: "Error",
        description: "Failed to update representative",
        variant: "destructive",
      });
    }
  };

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

  const handleEditClick = (representative: Representative) => {
    setEditingRepresentative(representative);
    setIsEditDialogOpen(true);
  };

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
                  value={newRepresentative.companyname}
                  onChange={(e) => setNewRepresentative({ ...newRepresentative, companyname: e.target.value })}
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
                  value={newRepresentative.phonenumber}
                  onChange={(e) => setNewRepresentative({ ...newRepresentative, phonenumber: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="whatsappNumber" className="text-right">WhatsApp Number</Label>
                <Input
                  id="whatsappNumber"
                  value={newRepresentative.whatsappnumber}
                  onChange={(e) => setNewRepresentative({ ...newRepresentative, whatsappnumber: e.target.value })}
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
                  value={newRepresentative.cnicnumber}
                  onChange={(e) => setNewRepresentative({ ...newRepresentative, cnicnumber: e.target.value })}
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
                <TableCell>{representative.companyname || 'N/A'}</TableCell>
                <TableCell>{representative.name}</TableCell>
                <TableCell>{representative.designation}</TableCell>
                <TableCell>{representative.email}</TableCell>
                <TableCell>{representative.phonenumber || 'N/A'}</TableCell>
                <TableCell>{representative.whatsappnumber || 'N/A'}</TableCell>
                <TableCell>{representative.address || 'N/A'}</TableCell>
                <TableCell>{representative.cnicnumber || 'N/A'}</TableCell>
                <TableCell>{getStatusBadge(representative.status)}</TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mr-2" 
                    onClick={() => handleEditClick(representative)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setRepresentativeToDelete(representative.id);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
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
                  value={editingRepresentative.companyname}
                  onChange={(e) => setEditingRepresentative({ ...editingRepresentative, companyname: e.target.value })}
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
                  value={editingRepresentative.phonenumber}
                  onChange={(e) => setEditingRepresentative({ ...editingRepresentative, phonenumber: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-whatsappNumber" className="text-right">WhatsApp Number</Label>
                <Input
                  id="edit-whatsappNumber"
                  value={editingRepresentative.whatsappnumber}
                  onChange={(e) => setEditingRepresentative({ ...editingRepresentative, whatsappnumber: e.target.value })}
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
                  value={editingRepresentative.cnicnumber}
                  onChange={(e) => setEditingRepresentative({ ...editingRepresentative, cnicnumber: e.target.value })}
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
    </Card>
  )
}
