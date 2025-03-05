'use client'

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface Product {
  id: number;
  name: string;
  style: string;
  fabric: string;
  vendor: string;
  podate: string;
  image?: string;
  available_sizes: Array<{
    size: string;
    quantity: number;
  }>;
  total_quantity: number;
}

interface Order {
  Product: string;
  Size: string;
  Quantity: number;
  Status: string;
  "Order Date": string;
}

export function UserDashboard() {
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedSize, setSelectedSize] = useState("")
  const [orderQuantity, setOrderQuantity] = useState(1)
  const [showOrderDialog, setShowOrderDialog] = useState(false)
  const [showOrders, setShowOrders] = useState(false)
  const { toast } = useToast()

  const fetchData = async () => {
    try {
      const [productsRes, ordersRes] = await Promise.all([
        fetch('/api/user-dashboard'),
        fetch('/api/user/orders')
      ])
      
      if (!productsRes.ok || !ordersRes.ok) throw new Error('Failed to fetch data')
      
      const productsData = await productsRes.json()
      const ordersData = await ordersRes.json()
      
      setProducts(productsData)
      setOrders(ordersData)
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/user/orders')
      if (!response.ok) throw new Error('Failed to fetch orders')
      const data = await response.json()
      setOrders(data)
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive"
      })
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (showOrders) {
      fetchOrders()
    }
  }, [showOrders])

  const handleOrder = async () => {
    try {
      const response = await fetch('/api/user/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: selectedProduct?.id,
          size: selectedSize,
          quantity: orderQuantity
        }),
      })

      if (!response.ok) throw new Error('Failed to place order')

      toast({
        title: "Success",
        description: "Order placed successfully",
      })
      setShowOrderDialog(false)
      fetchData() // Refresh data
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to place order",
        variant: "destructive"
      })
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {showOrders ? 'My Orders' : 'Available Products'}
        </h2>
        <Button onClick={() => setShowOrders(!showOrders)}>
          {showOrders ? 'View Products' : 'View My Orders'}
        </Button>
      </div>

      {showOrders ? (
        <Card>
          <CardContent>
            {loading ? (
              <div>Loading orders...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Order Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        No orders found
                      </TableCell>
                    </TableRow>
                  ) : (
                    orders.map((order, index) => (
                      <TableRow key={index}>
                        <TableCell>{order.Product}</TableCell>
                        <TableCell>{order.Size}</TableCell>
                        <TableCell>{order.Quantity}</TableCell>
                        <TableCell>
                          <Badge variant={
                            order.Status === 'completed' ? 'default' :
                            order.Status === 'processing' ? 'secondary' :
                            order.Status === 'cancelled' ? 'destructive' :
                            'outline'
                          }>
                            {order.Status}
                          </Badge>
                        </TableCell>
                        <TableCell>{order["Order Date"]}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Style</TableHead>
                  <TableHead>Fabric</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Sizes</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products?.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.style}</TableCell>
                    <TableCell>{product.fabric}</TableCell>
                    <TableCell>{product.vendor}</TableCell>
                    <TableCell>
                      {product.available_sizes?.map(sq => 
                        `${sq.size}(${sq.quantity})`
                      ).join(', ')}
                    </TableCell>
                    <TableCell>
                      <Button onClick={() => {
                        setSelectedProduct(product)
                        setShowOrderDialog(true)
                      }}>
                        Order
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Dialog open={showOrderDialog} onOpenChange={setShowOrderDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Place Order - {selectedProduct?.name}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Select onValueChange={setSelectedSize}>
                <SelectTrigger>
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {selectedProduct?.available_sizes.map(({ size, quantity }) => (
                    <SelectItem key={size} value={size}>
                      {size} ({quantity} available)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                min="1"
                value={orderQuantity}
                onChange={(e) => setOrderQuantity(Number(e.target.value))}
                className="col-span-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleOrder}>Place Order</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 