'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line, Bar, Pie } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { Users, Package, Building2, BoxesIcon } from "lucide-react"

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

type ChartData = {
  monthlyRegistrations: Array<{
    month: string;
    companies: number;
    customers: number;
  }>;
  companyStatus: Array<{
    status: string;
    count: number;
  }>;
  productSizes: Array<{
    size: string;
    total_quantity: number;
  }>;
  customerIndustries: Array<{
    industry: string;
    count: number;
  }>;
}

interface DashboardStats {
  total_products: number;
  total_customers: number;
  total_companies: number;
  total_quantities: number;
}

export function Dashboard() {
  const [data, setData] = useState<ChartData | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    Promise.all([
      // Fetch charts data
      fetch('/api/dashboard/charts').then(res => res.json()),
      // Fetch stats data
      fetch('/api/dashboard/stats').then(res => res.json())
    ]).then(([chartData, statsData]) => {
      setData(processChartData(chartData));
      setStats(statsData);
    }).catch(error => {
      console.error('Failed to fetch dashboard data:', error);
    });
  }, []);

  if (!data || !stats) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_products}</div>
            <p className="text-xs text-muted-foreground">Products in inventory</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_customers}</div>
            <p className="text-xs text-muted-foreground">Active customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_companies}</div>
            <p className="text-xs text-muted-foreground">Registered companies</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inventory</CardTitle>
            <BoxesIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_quantities}</div>
            <p className="text-xs text-muted-foreground">Total items in stock</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        {/* Monthly Growth */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Monthly Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <Line
              data={{
                labels: data.monthlyRegistrations.map(item => item.month),
                datasets: [
                  {
                    label: 'Companies',
                    data: data.monthlyRegistrations.map(item => item.companies),
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.5)',
                    tension: 0.4
                  },
                  {
                    label: 'Customers',
                    data: data.monthlyRegistrations.map(item => item.customers),
                    borderColor: 'rgb(16, 185, 129)',
                    backgroundColor: 'rgba(16, 185, 129, 0.5)',
                    tension: 0.4
                  }
                ]
              }}
            />
          </CardContent>
        </Card>

        {/* Company Status */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Company Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Bar
              data={{
                labels: data.companyStatus.map(item => item.status),
                datasets: [{
                  data: data.companyStatus.map(item => item.count),
                  backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(161, 161, 170, 0.8)'
                  ]
                }]
              }}
              options={{
                plugins: {
                  legend: {
                    display: false
                  }
                }
              }}
            />
          </CardContent>
        </Card>

        {/* Product Sizes */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Product Size Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div style={{ width: '100%', height: '300px' }}>
              <Pie
                data={{
                  labels: data.productSizes.map(item => item.size),
                  datasets: [{
                    data: data.productSizes.map(item => item.total_quantity),
                    backgroundColor: [
                      'rgba(59, 130, 246, 0.8)',
                      'rgba(16, 185, 129, 0.8)',
                      'rgba(239, 68, 68, 0.8)',
                      'rgba(251, 191, 36, 0.8)'
                    ]
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Customer Industries */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Customer Industries</CardTitle>
          </CardHeader>
          <CardContent>
            <Bar
              data={{
                labels: data.customerIndustries.map(item => item.industry || 'Not Specified'),
                datasets: [{
                  data: data.customerIndustries.map(item => item.count),
                  backgroundColor: 'rgba(59, 130, 246, 0.8)'
                }]
              }}
              options={{
                indexAxis: 'y',
                plugins: {
                  legend: {
                    display: false
                  }
                }
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Helper function to process chart data
function processChartData(chartData: any): ChartData {
  return {
    ...chartData,
    monthlyRegistrations: chartData.monthlyRegistrations.map((item: any) => ({
      ...item,
      companies: Number(item.companies),
      customers: Number(item.customers)
    })),
    companyStatus: chartData.companyStatus.map((item: any) => ({
      ...item,
      count: Number(item.count)
    })),
    productSizes: chartData.productSizes
      .filter((item: any) => item.size !== null)
      .map((item: any) => ({
        ...item,
        total_quantity: Number(item.total_quantity)
      })),
    customerIndustries: chartData.customerIndustries.map((item: any) => ({
      ...item,
      count: Number(item.count)
    }))
  };
} 