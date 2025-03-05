'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { format } from 'date-fns'

export function AdminManagement() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [admins, setAdmins] = useState([])
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/admin/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email })
      })

      if (!response.ok) throw new Error('Failed to add admin')
      
      toast({ title: "Success", description: "Admin added successfully" })
      setName('')
      setEmail('')
      fetchAdmins()
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to add admin", 
        variant: "destructive" 
      })
    }
  }

  const fetchAdmins = async () => {
    const response = await fetch('/api/admin/manage')
    if (response.ok) {
      const data = await response.json()
      setAdmins(data)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">Add New Admin</h2>
        <p className="text-sm text-gray-500">
          Create a new admin user
        </p>
        
        <form onSubmit={handleSubmit} className="grid gap-4 mt-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter admin name"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter admin email"
              required
            />
          </div>

          <Button type="submit" className="w-fit">
            Add Admin
          </Button>
        </form>
      </div>

      <div className="rounded-md border">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Created At</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin: any) => (
              <tr key={admin.id} className="border-b">
                <td className="p-4">{admin.name}</td>
                <td className="p-4">{admin.email}</td>
                <td className="p-4">{format(new Date(admin.created_at), 'PPp')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 