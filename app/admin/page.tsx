'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProductManagement } from '@/components/ProductManagement'
import { CustomerManagement } from '@/components/CustomerManagement'
import { CompanyManagement } from '@/components/CompanyManagement'
import { Package, Users, Building2, BarChart2 } from 'lucide-react'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="grid grid-cols-4 gap-4 bg-transparent">
          <TabsTrigger value="dashboard" className="data-[state=active]:bg-white data-[state=active]:shadow-md dark:data-[state=active]:bg-gray-800">
            <BarChart2 className="mr-2 h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="products" className="data-[state=active]:bg-white data-[state=active]:shadow-md dark:data-[state=active]:bg-gray-800">
            <Package className="mr-2 h-4 w-4" />
            Products
          </TabsTrigger>
          <TabsTrigger value="customers" className="data-[state=active]:bg-white data-[state=active]:shadow-md dark:data-[state=active]:bg-gray-800">
            <Users className="mr-2 h-4 w-4" />
            Customers
          </TabsTrigger>
          <TabsTrigger value="company" className="data-[state=active]:bg-white data-[state=active]:shadow-md dark:data-[state=active]:bg-gray-800">
            <Building2 className="mr-2 h-4 w-4" />
            Company
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

        <TabsContent value="customers">
          <Card>
            <CardHeader>
              <CardTitle>Customer Management</CardTitle>
              <CardDescription>Manage your customers</CardDescription>
            </CardHeader>
            <CardContent>
              <CustomerManagement onUpdate={() => {}} />
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
      </Tabs>
    </div>
  )
}
