'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProductManagement } from '@/components/ProductManagement'
import { CompanyManagement } from '@/components/CompanyManagement'
import { Package, Users, Building2, BarChart2, UserPlus, MessageCircle, X, UserCircle, Sun, Moon } from 'lucide-react'
import { UserManagement } from '@/components/UserManagement'
import { useAuth } from '@clerk/nextjs'
import { Bell } from 'lucide-react'
import { UserButton } from '@clerk/nextjs'
import { Button } from "@/components/ui/button"
import Link from 'next/link'

export default function AdminDashboard() {
  const { userId } = useAuth();
  const [theme, setTheme] = useState('dark')
  const [scrollY, setScrollY] = useState(0)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showMessages, setShowMessages] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark'
    setTheme(savedTheme)
    document.documentElement.classList.toggle('dark', savedTheme === 'dark')
  }, [])

  useEffect(() => {
    console.log('Admin page - Current user ID:', userId);
  }, [userId]);
  
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-[#0B1121]' : 'bg-white'}`}>
      <nav className={`fixed top-0 w-full z-50 ${theme === 'dark' ? 'bg-[#0F172A] border-[#1E293B]' : 'bg-white border-gray-200'} border-b`}>
        <div className="flex items-center justify-between px-4 h-16">
          <Link href="/admin" className="flex items-center space-x-2">
            <svg className="h-8 w-8 text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>FiberFlow</span>
          </Link>

          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-[#1E293B] text-gray-300 hover:bg-[#2D3B4E]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div className={`flex items-center space-x-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
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

      <main className={`pt-20 px-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
        <div className="max-w-7xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-4 w-full gap-4 bg-transparent mb-4">
              <TabsTrigger value="dashboard" className="flex-1">
                <BarChart2 className="mr-2 h-4 w-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="products" className="flex-1">
                <Package className="mr-2 h-4 w-4" />
                Products
              </TabsTrigger>
              <TabsTrigger value="company" className="flex-1">
                <Building2 className="mr-2 h-4 w-4" />
                Company
              </TabsTrigger>
              <TabsTrigger value="users" className="flex-1">
                <UserPlus className="mr-2 h-4 w-4" />
                Users
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <Card className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-[#0F172A] border-[#1E293B]' : 'bg-white border-gray-200'} border`}>
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
              <Card className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-[#0F172A] border-[#1E293B]' : 'bg-white border-gray-200'} border`}>
                <CardHeader className="pb-2">
                  <CardTitle>Product Management</CardTitle>
                  <CardDescription>Add, edit, and manage products</CardDescription>
                </CardHeader>
                <CardContent>
                  <ProductManagement onUpdate={() => {}} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="company">
              <Card className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-[#0F172A] border-[#1E293B]' : 'bg-white border-gray-200'} border`}>
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
              <Card className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-[#0F172A] border-[#1E293B]' : 'bg-white border-gray-200'} border`}>
                <CardHeader className="pb-2">
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
      </main>
    </div>
  )
}

