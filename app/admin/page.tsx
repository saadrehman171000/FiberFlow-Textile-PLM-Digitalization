'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProductManagement } from '@/components/ProductManagement'
import { CompanyManagement } from '@/components/CompanyManagement'
import { Package, Users, Building2, BarChart2, UserPlus } from 'lucide-react'
import { UserManagement } from '@/components/UserManagement'
import { useAuth } from '@clerk/nextjs';

export default function AdminDashboard() {
  const { userId } = useAuth();
  
  useEffect(() => {
    console.log('Admin page - Current user ID:', userId);
  }, [userId]);
  
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="container mx-auto px-4 py-8">
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
  )
}
