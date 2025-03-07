"use client"

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
  id: number
  name: string
  style: string
  fabric: string
  vendor: string
  podate: string
  image?: string
  available_sizes: Array<{
    size: string
    quantity: number
  }>
  total_quantity: number
}

interface Order {
  id: number
  customer: string
  product: string
  size: string
  quantity: number
  date: string
  status: string
}

export function UserDashboard() {
  const [loading, setLoading] = useState(true)
  const [ordersLoading, setOrdersLoading] = useState(false)
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
      const productsRes = await fetch("/api/user-dashboard")

      if (!productsRes.ok) throw new Error("Failed to fetch products")

      const productsData = await productsRes.json()
      setProducts(productsData)
    } catch (error) {
      console.error("Error fetching products:", error)
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true)
      const response = await fetch("/api/user/orders")
      if (!response.ok) throw new Error("Failed to fetch orders")
      const data = await response.json()
      setOrders(data)
    } catch (error) {
      console.error("Error fetching orders:", error)
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive",
      })
    } finally {
      setOrdersLoading(false)
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
    if (!selectedProduct || !selectedSize || orderQuantity < 1) {
      toast({
        title: "Error",
        description: "Please select a size and quantity",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/user/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: selectedProduct.id,
          size: selectedSize,
          quantity: orderQuantity,
        }),
      })

      if (!response.ok) throw new Error("Failed to place order")

      toast({
        title: "Success",
        description: "Order placed successfully",
      })
      setShowOrderDialog(false)
      // Reset selection
      setSelectedSize("")
      setOrderQuantity(1)

      // If we're already showing orders, refresh them
      if (showOrders) {
        fetchOrders()
      }
    } catch (error) {
      console.error("Error placing order:", error)
      toast({
        title: "Error",
        description: "Failed to place order",
        variant: "destructive",
      })
    }
  }

  if (loading && !showOrders) return <div className="p-6">Loading products...</div>

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{showOrders ? "My Orders" : "Available Products"}</h2>
        <Button onClick={() => setShowOrders(!showOrders)}>{showOrders ? "View Products" : "View My Orders"}</Button>
      </div>

      {showOrders ? (
        <Card className="w-full">
          <CardContent className="pt-6">
            {ordersLoading ? (
              <div className="py-4 text-center">Loading orders...</div>
            ) : (
              <div className="w-full overflow-auto">
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
                        <TableRow key={order.id || index}>
                          <TableCell>{order.product}</TableCell>
                          <TableCell>{order.size}</TableCell>
                          <TableCell>{order.quantity}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                order.status === "completed"
                                  ? "default"
                                  : order.status === "processing"
                                    ? "secondary"
                                    : order.status === "cancelled"
                                      ? "destructive"
                                      : "outline"
                              }
                            >
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{order.date}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
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
                      {product.available_sizes?.map((sq) => `${sq.size}(${sq.quantity})`).join(", ")}
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => {
                          setSelectedProduct(product)
                          setShowOrderDialog(true)
                        }}
                      >
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
              <Select onValueChange={setSelectedSize} value={selectedSize}>
                <SelectTrigger className="col-span-2">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {selectedProduct?.available_sizes.map(({ size, quantity }) => (
                    <SelectItem key={size} value={size} disabled={quantity <= 0}>
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
            <Button onClick={handleOrder} disabled={!selectedSize || orderQuantity < 1}>
              Place Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

