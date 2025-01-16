'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProductManagement } from '@/components/ProductManagement'
import { CompanyManagement } from '@/components/CompanyManagement'
import { Package, Users, Building2, BarChart2, UserPlus, MessageCircle, X, UserCircle } from 'lucide-react'
import { UserManagement } from '@/components/UserManagement'
import { useAuth } from '@clerk/nextjs';
import { Bell } from 'lucide-react'
import { UserButton } from '@clerk/nextjs'

export default function AdminDashboard() {
  const { userId } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showMessages, setShowMessages] = useState(false)

  useEffect(() => {
    console.log('Admin page - Current user ID:', userId);
  }, [userId]);
  
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode)

  const [activeTab, setActiveTab] = useState("dashboard")

  // Sample data - in a real app, this would come from your backend
  const notifications = [
    { id: 1, text: "New order received", time: "5 mins ago", isRead: false },
    { id: 2, text: "Product inventory low", time: "1 hour ago", isRead: false },
  ]

  const messages = [
    { id: 1, sender: "John Doe", text: "When will the order be ready?", time: "10 mins ago", isRead: false },
    { id: 2, sender: "Jane Smith", text: "Please check the new samples", time: "30 mins ago", isRead: false },
    { id: 3, sender: "Mike Johnson", text: "Updated the pricing", time: "2 hours ago", isRead: false },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed w-full z-50 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <svg className="h-8 w-8 text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-2xl font-bold text-gray-900">FiberFlow</span>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-8">
              {/* User Info */}
              <div className="flex items-center space-x-6 border-r pr-6">
                <div className="flex items-center space-x-2 text-gray-600">
                  <UserCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">Admin</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Building2 className="h-5 w-5" />
                  <span className="text-sm font-medium">FiberFlow HQ</span>
                </div>
              </div>

              {/* User Profile */}
              <UserButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-16 text-gray-900">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid grid-cols-4 w-full gap-4 bg-transparent mb-4">
            <TabsTrigger value="dashboard" className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-md dark:data-[state=active]:bg-gray-800">
              <BarChart2 className="mr-2 h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="products" className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-md dark:data-[state=active]:bg-gray-800">
              <Package className="mr-2 h-4 w-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="company" className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-md dark:data-[state=active]:bg-gray-800">
              <Building2 className="mr-2 h-4 w-4" />
              Company
            </TabsTrigger>
            <TabsTrigger value="users" className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-md dark:data-[state=active]:bg-gray-800">
              <UserPlus className="mr-2 h-4 w-4" />
              Users
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Card>
              <CardHeader>
                <CardTitle>Dashboard</CardTitle>
                <CardDescription>Overview of your business metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <iframe 
                  src="/dashboard" 
                  className="w-full min-h-[600px] border-none"
                  title="Dashboard"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Product Management</CardTitle>
                <CardDescription>Add, edit, and manage products</CardDescription>
              </CardHeader>
              <CardContent>
                <ProductManagement onUpdate={() => {}} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="company">
            <Card>
              <CardHeader>
                <CardTitle>Company Management</CardTitle>
                <CardDescription>Manage company information</CardDescription>
              </CardHeader>
              <CardContent>
                <CompanyManagement onUpdate={() => {}} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Add and manage system users</CardDescription>
              </CardHeader>
              <CardContent>
                <UserManagement onUpdate={() => {}} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
