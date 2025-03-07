"use client"

import { useEffect, useState } from "react"
import { Calendar, ChevronRight, ClipboardList, Package, Search, ShoppingBag, Tag, Truck } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"

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
  const [activeTab, setActiveTab] = useState("products")
  const [searchQuery, setSearchQuery] = useState("")
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
    if (activeTab === "orders") {
      fetchOrders()
    }
  }, [activeTab])

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
      if (activeTab === "orders") {
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

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.style.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.vendor.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-6 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Manage your products and orders</p>
        </div>
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            className="pl-8 w-full md:w-[250px] lg:w-[300px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="products" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span>Products</span>
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            <span>My Orders</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <CardHeader className="p-0">
                    <Skeleton className="h-48 w-full rounded-none" />
                  </CardHeader>
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <div className="flex gap-2 mb-4">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No products found</h3>
              <p className="text-muted-foreground">Try adjusting your search query</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden flex flex-col h-full">
                  <CardHeader className="p-0">
                    <div className="relative h-48 w-full bg-muted">
                      <Image
                        src={product.image || "/placeholder.svg?height=192&width=384"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
                        <p className="text-muted-foreground text-sm">{product.style}</p>
                      </div>
                      <Badge variant="outline" className="ml-2 whitespace-nowrap">
                        {product.total_quantity} in stock
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
                      <div className="flex items-center gap-1.5">
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        <span>{product.fabric}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Truck className="h-4 w-4 text-muted-foreground" />
                        <span>{product.vendor}</span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm font-medium mb-1.5">Available sizes:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {product.available_sizes.map(({ size, quantity }) => (
                          <Badge
                            key={size}
                            variant={quantity > 0 ? "secondary" : "outline"}
                            className={quantity === 0 ? "opacity-50" : ""}
                          >
                            {size} ({quantity})
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="px-6 pb-6 pt-0">
                    <Button
                      className="w-full"
                      onClick={() => {
                        setSelectedProduct(product)
                        setShowOrderDialog(true)
                      }}
                      disabled={product.total_quantity === 0}
                    >
                      {product.total_quantity > 0 ? "Place Order" : "Out of Stock"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">My Orders</CardTitle>
              <CardDescription>View and track your order history</CardDescription>
            </CardHeader>
            <CardContent>
              {ordersLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-5 w-1/3" />
                        <Skeleton className="h-4 w-1/4" />
                      </div>
                      <Skeleton className="h-8 w-24" />
                    </div>
                  ))}
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No orders yet</h3>
                  <p className="text-muted-foreground mb-4">You haven't placed any orders yet</p>
                  <Button variant="outline" onClick={() => setActiveTab("products")}>
                    Browse Products
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="flex flex-col md:flex-row md:items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <Avatar className="h-12 w-12 border">
                          <AvatarImage src={`/placeholder.svg?text=${order.product.charAt(0)}`} alt={order.product} />
                          <AvatarFallback>{order.product.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{order.product}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>Size: {order.size}</span>
                            <span>•</span>
                            <span>Qty: {order.quantity}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between md:justify-end gap-4 mt-2 md:mt-0">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{order.date}</span>
                        </div>
                        <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                        <Button variant="ghost" size="icon" className="ml-2">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showOrderDialog} onOpenChange={setShowOrderDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Place Order</DialogTitle>
          </DialogHeader>

          {selectedProduct && (
            <div className="grid gap-6 py-4">
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 rounded-md overflow-hidden bg-muted">
                  <Image
                    src={selectedProduct.image || "/placeholder.svg?height=64&width=64"}
                    alt={selectedProduct.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium">{selectedProduct.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedProduct.style}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="size-select" className="text-sm font-medium">
                    Select Size
                  </label>
                  <Select onValueChange={setSelectedSize} value={selectedSize}>
                    <SelectTrigger id="size-select">
                      <SelectValue placeholder="Choose a size" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedProduct.available_sizes.map(({ size, quantity }) => (
                        <SelectItem key={size} value={size} disabled={quantity <= 0}>
                          {size} ({quantity} available)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="quantity-input" className="text-sm font-medium">
                    Quantity
                  </label>
                  <Input
                    id="quantity-input"
                    type="number"
                    min="1"
                    max={selectedProduct.available_sizes.find((s) => s.size === selectedSize)?.quantity || 1}
                    value={orderQuantity}
                    onChange={(e) => setOrderQuantity(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setShowOrderDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleOrder} disabled={!selectedSize || orderQuantity < 1}>
              Place Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

