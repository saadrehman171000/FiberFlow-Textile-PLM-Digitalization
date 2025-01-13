'use client'

import { useEffect, useState } from 'react'
import { ShoppingBag, Settings, CreditCard, Home, Package } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { useUser } from '@clerk/nextjs'
import Header from '@/components/Header'

interface Order {
  id: string
  product: string
  quantity: number
  status: 'Pending' | 'In Progress' | 'Completed'
  total: number
  date: string
}

export default function UserDashboard() {
  const user = useUser()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Replace this URL with your actual API endpoint
        const response = await fetch('/api/orders')
        if (!response.ok) {
          throw new Error('Failed to fetch orders')
        }
        const data = await response.json()
        setOrders(data)
      } catch (error) {
        console.error('Error fetching orders:', error)
        // Optionally, set an error state here to show an error message to the user
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const handlePlaceOrder = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    const newOrder = {
      product: formData.get('product') as string,
      quantity: Number(formData.get('quantity')),
      price: Number(formData.get('price')),
      notes: formData.get('notes') as string,
    }

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newOrder),
      })

      if (!response.ok) {
        throw new Error('Failed to create order')
      }

      const createdOrder = await response.json()
      setOrders([...orders, createdOrder])
      setActiveTab('dashboard')
      // Optionally, show a success message to the user
    } catch (error) {
      console.error('Error creating order:', error)
      // Show an error message to the user
    }
  }

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'Pending':
        return <Badge variant="secondary">{status}</Badge>
      case 'In Progress':
        return <Badge variant="default">{status}</Badge>
      case 'Completed':
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  const totalRevenue = (Array.isArray(orders) ? orders : [])
    .reduce((sum: number, order: Order) => sum + (order.total || 0), 0);

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'dark' : ''}`}>
      <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 flex-grow">
        {/* Header */}
        <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8 flex-grow">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-5 lg:w-[600px]">
              <TabsTrigger value="dashboard">
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="orders">
                <Package className="mr-2 h-4 w-4" />
                Orders
              </TabsTrigger>
              <TabsTrigger value="new-order">
                <CreditCard className="mr-2 h-4 w-4" />
                New Order
              </TabsTrigger>

              <TabsTrigger value="settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            {/* Dashboard */}
            <TabsContent value="dashboard" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Welcome back, {user.user?.fullName || user.user?.firstName || user.user?.lastName}!</CardTitle>
                  <CardDescription>Here&apos;s a summary of your recent activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{orders.length}</div>
                        <p className="text-xs text-muted-foreground">+15% from last month</p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Orders */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Your last 5 orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.slice(0, 5).map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{order.product}</TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell>${order.total ? order.total.toFixed(2) : '0.00'}</TableCell>
                          <TableCell>{order.date}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" onClick={() => setActiveTab('orders')}>
                    View All Orders
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Orders */}
            <TabsContent value="orders" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                  <CardDescription>View and manage your orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{order.product}</TableCell>
                          <TableCell>{order.quantity}</TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell>${order.total ? order.total.toFixed(2) : '0.00'}</TableCell>
                          <TableCell>{order.date}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* New Order */}
            <TabsContent value="new-order">
              <Card>
                <CardHeader>
                  <CardTitle>Place New Order</CardTitle>
                  <CardDescription>Fill out the form to place a new order</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePlaceOrder}>
                    <div className="grid w-full items-center gap-4">
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="product">Product</Label>
                        <Select name="product" required>
                          <SelectTrigger id="product">
                            <SelectValue placeholder="Select a product" />
                          </SelectTrigger>
                          <SelectContent position="popper">
                            <SelectItem value="tshirt">Cotton T-Shirt</SelectItem>
                            <SelectItem value="jeans">Denim Jeans</SelectItem>
                            <SelectItem value="jacket">Leather Jacket</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input type="number" id="quantity" name="quantity" placeholder="Enter quantity" required min="1" />
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="price">Price</Label>
                        <Input type="number" id="price" name="price" placeholder="Enter price" required min="1" />
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="notes">Additional Notes</Label>
                        <Textarea id="notes" name="notes" placeholder="Enter any additional notes" />
                      </div>
                    </div>
                    <CardFooter className="mt-4 p-0">
                      <Button type="submit">Place Order</Button>
                    </CardFooter>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>


            {/* Settings */}
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your account preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium">Email Notifications</h3>
                        <p className="text-sm text-gray-500">Receive email updates about your account activity</p>
                      </div>
                      <Input type="checkbox" className="toggle" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                        <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                      </div>
                      <Input type="checkbox" className="toggle" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Save Changes</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
