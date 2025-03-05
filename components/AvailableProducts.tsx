'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

interface Product {
  id: number
  name: string
  style: string
  fabric: string
  vendor: string
  sizeQuantities: Record<string, number>
}

export function AvailableProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [orderDialogOpen, setOrderDialogOpen] = useState(false)
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const { toast } = useToast()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const handleOrderClick = (product: Product) => {
    setSelectedProduct(product)
    setOrderDialogOpen(true)
  }

  const handlePlaceOrder = async () => {
    if (!selectedProduct || !selectedSize) return

    const availableQuantity = selectedProduct.sizeQuantities[selectedSize] || 0
    if (quantity > availableQuantity) {
      toast({
        title: "Error",
        description: `Only ${availableQuantity} items available in size ${selectedSize}`,
        variant: "destructive"
      })
      return
    }

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: selectedProduct.name,
          quantity,
          status: 'pending',
          total: quantity * 100, // You might want to add price to your product model
          notes: `Size: ${selectedSize}`
        })
      })

      if (!response.ok) throw new Error('Failed to place order')

      toast({ title: "Success", description: "Order placed successfully" })
      setOrderDialogOpen(false)
      setSelectedProduct(null)
      setSelectedSize('')
      setQuantity(1)
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to place order", 
        variant: "destructive" 
      })
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Available Products</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products.map(product => (
          <Card key={product.id}>
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Style:</strong> {product.style}</p>
                <p><strong>Fabric:</strong> {product.fabric}</p>
                <p><strong>Vendor:</strong> {product.vendor}</p>
                <p><strong>Available Sizes:</strong></p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(product.sizeQuantities).map(([size, qty]) => (
                    qty > 0 && (
                      <span key={size} className="px-2 py-1 bg-gray-100 rounded">
                        {size}: {qty}
                      </span>
                    )
                  ))}
                </div>
                <Button 
                  className="w-full mt-4" 
                  onClick={() => handleOrderClick(product)}
                  disabled={Object.values(product.sizeQuantities).every(qty => qty === 0)}
                >
                  {Object.values(product.sizeQuantities).every(qty => qty === 0) 
                    ? 'Out of Stock' 
                    : 'Place Order'
                  }
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={orderDialogOpen} onOpenChange={setOrderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Place Order - {selectedProduct?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Size</label>
              <Select value={selectedSize} onValueChange={setSelectedSize}>
                <SelectTrigger>
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {selectedProduct && Object.entries(selectedProduct.sizeQuantities).map(([size, qty]) => (
                    qty > 0 && (
                      <SelectItem key={size} value={size}>
                        {size} ({qty} available)
                      </SelectItem>
                    )
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Quantity</label>
              <Input 
                type="number" 
                min="1" 
                max={selectedProduct?.sizeQuantities[selectedSize] || 1}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
              />
            </div>
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => setOrderDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handlePlaceOrder}>
                Place Order
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 