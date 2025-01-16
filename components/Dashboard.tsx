'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Bar, Line, Pie } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { useUser } from '@clerk/nextjs'
import { Package, Users, Building2, ShoppingCart } from 'lucide-react'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

export function Dashboard() {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      }
    }
  };

  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useUser()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/dashboard/charts')
        const result = await response.json()
        setData(result)
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {user?.firstName || 'Admin'}! 👋
        </h1>
        <p className="text-muted-foreground">
          Here's an overview of your business metrics for the last 12 months.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.stats?.totalProducts || 0}</div>
            <p className="text-xs text-muted-foreground">Products in inventory</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.stats?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.stats?.totalCompanies || 0}</div>
            <p className="text-xs text-muted-foreground">Registered companies</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.stats?.activeOrders || 0}</div>
            <p className="text-xs text-muted-foreground">Orders in progress</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Monthly Growth</CardTitle>
            <CardDescription>User registration trend over time</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {data?.monthlyRegistrations && data.monthlyRegistrations.length > 0 ? (
              <Line
                data={{
                  labels: data.monthlyRegistrations.map((item: any) => 
                    new Date(item.month).toLocaleDateString('default', { month: 'short', year: 'numeric' })
                  ),
                  datasets: [{
                    label: 'New Users',
                    data: data.monthlyRegistrations.map((item: any) => item.total),
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    tension: 0.3
                  }]
                }}
                options={chartOptions}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>User Industries</CardTitle>
            <CardDescription>Distribution of users by industry</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {data?.userIndustries && data.userIndustries.length > 0 ? (
              <Pie
                data={{
                  labels: data.userIndustries.map((item: any) => item.industry),
                  datasets: [{
                    data: data.userIndustries.map((item: any) => item.total),
                    backgroundColor: [
                      '#FF6384',
                      '#36A2EB',
                      '#FFCE56',
                      '#4BC0C0',
                      '#9966FF'
                    ]
                  }]
                }}
                options={chartOptions}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Product Distribution</CardTitle>
            <CardDescription>Products by size category</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {data?.productSizes && data.productSizes.length > 0 ? (
              <Bar
                data={{
                  labels: data.productSizes.map((item: any) => item.size),
                  datasets: [{
                    label: 'Products',
                    data: data.productSizes.map((item: any) => item.total_quantity),
                    backgroundColor: 'rgba(75, 192, 192, 0.6)'
                  }]
                }}
                options={chartOptions}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Company Growth</CardTitle>
            <CardDescription>Company registration trend over time</CardDescription>
          </CardHeader>
          {/* Rest of Company Growth chart */}
        </Card>
      </div>
    </div>
  )
} 