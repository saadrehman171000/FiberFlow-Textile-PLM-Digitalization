"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LogOut, Search, User, Bell, ShoppingBag, Settings, CreditCard } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

type Order = {
  id: string
  product: string
  quantity: number
  status: "Pending" | "In Progress" | "Completed"
  total: number
  date: string
}

type User = {
  name: string
  email: string
  avatar: string
}

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [orders, setOrders] = useState<Order[]>([
    { id: "1", product: "Cotton T-Shirt", quantity: 2, status: "Completed", total: 39.98, date: "2023-05-01" },
    { id: "2", product: "Denim Jeans", quantity: 1, status: "In Progress", total: 59.99, date: "2023-05-15" },
    { id: "3", product: "Leather Jacket", quantity: 1, status: "Pending", total: 199.99, date: "2023-05-20" },
  ])
  const [user, setUser] = useState<User>({
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "/placeholder.svg?height=32&width=32",
  })
  const router = useRouter()

  const handlePlaceOrder = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const newOrder: Order = {
      id: (orders.length + 1).toString(),
      product: formData.get("product") as string,
      quantity: Number(formData.get("quantity")),
      status: "Pending",
      total: Math.random() * 100, // This should be calculated based on actual product prices
      date: new Date().toISOString().split("T")[0],
    }
    setOrders([...orders, newOrder])
    setActiveTab("dashboard")
  }

  const handleUpdateProfile = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    setUser({
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      avatar: user.avatar,
    })
  }

  const handleLogout = () => {
    // In a real application, you would clear the user's session here
    router.push("/login")
  }

  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "Pending":
        return <Badge variant="secondary">{status}</Badge>
      case "In Progress":
        return <Badge variant="default">{status}</Badge>
      case "Completed":
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <svg className="h-8 w-8 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">FiberFlow</h1>
          </div>
          <div className="flex items-center space-x-4">
            <form className="relative hidden md:block">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-8 pr-4 py-2 w-[200px] lg:w-[300px] rounded-full border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </form>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[300px]">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Your order has been shipped</DropdownMenuItem>
                <DropdownMenuItem>New product available</DropdownMenuItem>
                <DropdownMenuItem>Your review has been approved</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setActiveTab("profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
            <TabsTrigger value="dashboard">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="new-order">
              <CreditCard className="mr-2 h-4 w-4" />
              New Order
            </TabsTrigger>
            <TabsTrigger value="profile">
              <User className="mr-2 h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>View and manage your recent orders</CardDescription>
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
                        <TableCell>${order.total.toFixed(2)}</TableCell>
                        <TableCell>{order.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

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

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Management</CardTitle>
                <CardDescription>View and update your profile information</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile}>
                  <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" name="name" placeholder="Enter your name" defaultValue={user.name} required />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" placeholder="Enter your email" defaultValue={user.email} required />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="password">New Password</Label>
                      <Input id="password" name="password" type="password" placeholder="Enter new password" />
                    </div>
                  </div>
                  <CardFooter className="mt-4 p-0">
                    <Button type="submit">Update Profile</Button>
                  </CardFooter>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

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
  )
}