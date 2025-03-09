"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProductManagement } from "@/components/ProductManagement"
import { CompanyManagement } from "@/components/CompanyManagement"
import { Package, Users, Building2, BarChart2, UserPlus, UserCircle, Sun, Moon, ShoppingCart, MapPin } from "lucide-react"
import { UserManagement } from "@/components/UserManagement"
import { useAuth } from "@clerk/nextjs"
import { UserButton } from "@clerk/nextjs"
import Link from "next/link"
import { AdminManagement } from "@/components/AdminManagement"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

interface Order {
  id: number;
  customer: string;
  product: string;
  size: string;
  quantity: number;
  date: string;
  status: string;
}

interface UserLocation {
  name: string;
  email: string;
  country: string;
  city: string;
  ip_address: string;
  last_accessed: string;
}

export default function AdminDashboard() {
  const { userId } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [theme, setTheme] = useState("dark")
  const [scrollY, setScrollY] = useState(0)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showMessages, setShowMessages] = useState(false)
  const [dashboardData, setDashboardData] = useState(null)
  const [adminInfo, setAdminInfo] = useState(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoadingOrders, setIsLoadingOrders] = useState(true)
  const [userLocations, setUserLocations] = useState<UserLocation[]>([])
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark"
    setTheme(savedTheme)
    document.documentElement.classList.toggle("dark", savedTheme === "dark")
  }, [])

  useEffect(() => {
    console.log("Admin page - Current user ID:", userId)
  }, [userId])

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch admin info and dashboard data
        const response = await fetch("/api/admin/dashboard")
        const data = await response.json()
        setDashboardData(data.stats)
        setAdminInfo(data.adminInfo)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      }
    }

    if (userId) {
      fetchDashboardData()
    }
  }, [userId])

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoadingOrders(true)
        const response = await fetch("/api/admin/orders")
        if (!response.ok) throw new Error("Failed to fetch orders")
        const data = await response.json()
        setOrders(data)
      } catch (error) {
        console.error("Error fetching orders:", error)
        toast({
          title: "Error",
          description: "Failed to fetch orders data",
          variant: "destructive",
        })
      } finally {
        setIsLoadingOrders(false)
      }
    }

    if (userId) {
      fetchOrders()
    }
  }, [userId, toast])

  useEffect(() => {
    const fetchUserLocations = async () => {
      try {
        const response = await fetch('/api/admin/user-locations')
        if (!response.ok) throw new Error('Failed to fetch user locations')
        const data = await response.json()
        console.log('Fetched location data:', data)
        setUserLocations(data)
      } catch (error) {
        console.error('Error fetching user locations:', error)
        toast({
          title: "Error",
          description: "Failed to fetch user location data",
          variant: "destructive",
        })
      }
    }

    if (userId) {
      fetchUserLocations()
    }
  }, [userId, toast])

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const response = await fetch('/api/check-admin')
        if (!response.ok) {
          throw new Error('Not authorized')
        }
        setIsAuthorized(true)
      } catch (error) {
        console.error('Not an admin user')
        router.push('/')
      } finally {
        setIsLoading(false)
      }
    }

    if (userId) {
      checkAdminStatus()
    }
  }, [userId, router])

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
  }

  const [activeTab, setActiveTab] = useState("dashboard")

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) throw new Error("Failed to update order status")

      // Update local state
      setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))

      toast({
        title: "Success",
        description: `Order #${orderId} status updated to ${newStatus}`,
      })
    } catch (error) {
      console.error("Error updating order status:", error)
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  if (!dashboardData || !adminInfo) return <div>Loading...</div>

  return (
    <div className={`min-h-screen ${theme === "dark" ? "dark bg-[#0B1121]" : "bg-white"}`}>
      <nav
        className={`fixed top-0 w-full z-50 ${theme === "dark" ? "bg-[#0F172A] border-[#1E293B]" : "bg-white border-gray-200"} border-b`}
      >
        <div className="flex items-center justify-between px-4 h-16">
          <Link href="/admin" className="flex items-center space-x-2">
            <svg className="h-8 w-8 text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 2L2 7L12 12L22 7L12 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 17L12 22L22 17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12L12 17L22 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>FiberFlow</span>
          </Link>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg ${theme === "dark" ? "bg-[#1E293B] text-gray-300 hover:bg-[#2D3B4E]" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div className={`flex items-center space-x-4 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              <div className="flex items-center space-x-1">
                <UserCircle className="h-5 w-5" />
                <span className="text-sm">Admin</span>
              </div>
              <div className="flex items-center space-x-1">
                <Building2 className="h-5 w-5" />
                <span className="text-sm">FiberFlow HQ</span>
              </div>
            </div>

            <UserButton />
          </div>
        </div>
      </nav>

      <main className={`pt-20 px-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
        <div className="max-w-7xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-7 w-full gap-4 bg-transparent mb-4">
              <TabsTrigger value="dashboard" className="flex-1">
                <BarChart2 className="mr-2 h-4 w-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="products" className="flex-1">
                <Package className="mr-2 h-4 w-4" />
                Products
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex-1">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Orders
              </TabsTrigger>
              <TabsTrigger value="company" className="flex-1">
                <Building2 className="mr-2 h-4 w-4" />
                Company
              </TabsTrigger>
              <TabsTrigger value="users" className="flex-1">
                <UserPlus className="mr-2 h-4 w-4" />
                Users
              </TabsTrigger>
              <TabsTrigger value="admins" className="flex-1">
                <Users className="mr-2 h-4 w-4" />
                Admins
              </TabsTrigger>
              <TabsTrigger value="locations" className="flex-1">
                <MapPin className="mr-2 h-4 w-4" />
                Locations
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <Card
                className={`p-4 rounded-lg ${theme === "dark" ? "bg-[#0F172A] border-[#1E293B]" : "bg-white border-gray-200"} border`}
              >
                <CardHeader className="pb-2">
                  <CardTitle>Dashboard</CardTitle>
                  <CardDescription>Overview of your business metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <iframe
                    src="/dashboard"
                    className="w-full min-h-[600px] border-none bg-background"
                    title="Dashboard"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="products">
              <Card
                className={`p-4 rounded-lg ${theme === "dark" ? "bg-[#0F172A] border-[#1E293B]" : "bg-white border-gray-200"} border`}
              >
                <CardHeader className="pb-2">
                  <CardTitle>Product Management</CardTitle>
                  <CardDescription>Add, edit, and manage products</CardDescription>
                </CardHeader>
                <CardContent>
                  <ProductManagement onUpdate={() => {}} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders">
              <Card
                className={`p-4 rounded-lg ${theme === "dark" ? "bg-[#0F172A] border-[#1E293B]" : "bg-white border-gray-200"} border`}
              >
                <CardHeader className="pb-2">
                  <CardTitle>Order Management</CardTitle>
                  <CardDescription>View and manage customer orders</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingOrders ? (
                    <div className="flex justify-center items-center h-64">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Product</TableHead>
                            <TableHead>Size</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {orders.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={8} className="text-center py-8">
                                No orders found
                              </TableCell>
                            </TableRow>
                          ) : (
                            orders.map((order) => (
                              <TableRow key={order.id}>
                                <TableCell className="font-medium">#{order.id}</TableCell>
                                <TableCell>{order.customer}</TableCell>
                                <TableCell>{order.product}</TableCell>
                                <TableCell>{order.size}</TableCell>
                                <TableCell>{order.quantity}</TableCell>
                                <TableCell>{order.date}</TableCell>
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
                                <TableCell>
                                  <Select
                                    defaultValue={order.status}
                                    onValueChange={(value) => updateOrderStatus(order.id, value)}
                                  >
                                    <SelectTrigger className="w-[130px]">
                                      <SelectValue placeholder="Update status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="pending">Pending</SelectItem>
                                      <SelectItem value="processing">Processing</SelectItem>
                                      <SelectItem value="completed">Completed</SelectItem>
                                      <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="company">
              <Card
                className={`p-4 rounded-lg ${theme === "dark" ? "bg-[#0F172A] border-[#1E293B]" : "bg-white border-gray-200"} border`}
              >
                <CardHeader className="pb-2">
                  <CardTitle>Company Management</CardTitle>
                  <CardDescription>Manage company information</CardDescription>
                </CardHeader>
                <CardContent>
                  <CompanyManagement onUpdate={() => {}} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users">
              <Card
                className={`p-4 rounded-lg ${theme === "dark" ? "bg-[#0F172A] border-[#1E293B]" : "bg-white border-gray-200"} border`}
              >
                <CardHeader className="pb-2">
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Add and manage system users</CardDescription>
                </CardHeader>
                <CardContent>
                  <UserManagement onUpdate={() => {}} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="admins">
              <Card
                className={`p-4 rounded-lg ${theme === "dark" ? "bg-[#0F172A] border-[#1E293B]" : "bg-white border-gray-200"} border`}
              >
                <CardHeader className="pb-2">
                  <CardTitle>Admin Management</CardTitle>
                  <CardDescription>Add and manage admin users</CardDescription>
                </CardHeader>
                <CardContent>
                  <AdminManagement />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="locations">
              <Card className={`p-4 rounded-lg ${theme === "dark" ? "bg-[#0F172A] border-[#1E293B]" : "bg-white border-gray-200"} border`}>
                <CardHeader className="pb-2">
                  <CardTitle>User Locations</CardTitle>
                  <CardDescription>View geographical distribution of users</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Country</TableHead>
                          <TableHead>City</TableHead>
                          <TableHead>IP Address</TableHead>
                          <TableHead>Last Accessed</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {userLocations.map((location) => (
                          <TableRow key={location.email}>
                            <TableCell>{location.name}</TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {location.country}
                              </Badge>
                            </TableCell>
                            <TableCell>{location.city}</TableCell>
                            <TableCell>
                              <code className="text-sm">{location.ip_address}</code>
                            </TableCell>
                            <TableCell>{location.last_accessed}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

