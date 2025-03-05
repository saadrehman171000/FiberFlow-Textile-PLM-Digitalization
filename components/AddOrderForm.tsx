'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

export function AddOrderForm({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('pending')
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      product: formData.get('product') as string,
      quantity: parseInt(formData.get('quantity') as string),
      status: status,
      total: parseFloat(formData.get('total') as string),
      notes: formData.get('notes') as string
    }

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create order')
      }

      toast({ title: "Success", description: "Order created successfully" })
      onClose()
    } catch (error) {
      console.error('Failed to create order:', error)
      toast({ 
        title: "Error", 
        description: error instanceof Error ? error.message : "Failed to create order", 
        variant: "destructive" 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="product" className="block text-sm font-medium mb-1">
          Product
        </label>
        <Input 
          id="product" 
          name="product" 
          required 
          placeholder="Enter product name"
        />
      </div>

      <div>
        <label htmlFor="quantity" className="block text-sm font-medium mb-1">
          Quantity
        </label>
        <Input 
          id="quantity" 
          name="quantity" 
          type="number" 
          min="1" 
          required 
          placeholder="Enter quantity"
        />
      </div>

      <div>
        <label htmlFor="total" className="block text-sm font-medium mb-1">
          Total Amount
        </label>
        <Input 
          id="total" 
          name="total" 
          type="number" 
          min="0.01" 
          step="0.01" 
          required 
          placeholder="Enter total amount"
        />
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium mb-1">
          Status
        </label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium mb-1">
          Notes
        </label>
        <Textarea 
          id="notes" 
          name="notes" 
          required 
          placeholder="Enter order notes"
        />
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Order'}
        </Button>
      </div>
    </form>
  )
} 