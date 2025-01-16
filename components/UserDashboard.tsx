'use client'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
} from 'chart.js'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
)

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, Bar, Pie } from "react-chartjs-2"
import { useEffect, useState } from "react"
import { Package, ShoppingCart, Clock, TrendingUp } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

interface UserDashboardData {
  stats: {
    total_orders: number;
    pending_orders: number;
    total_products: number;
    monthly_growth: number;
  };
  recentOrders: Array<{
    id: number;
    date: string;
    status: string;
    total_items: number;
    total_amount: number;
  }>;
  ordersByStatus: Array<{
    status: string;
    count: number;
  }>;
  monthlyOrders: Array<{
    month: string;
    orders: number;
    amount: number;
  }>;
  topProducts: Array<{
    name: string;
    quantity: number;
  }>;
}

export function UserDashboard() {
  const [data, setData] = useState<UserDashboardData | null>(null);
  const [isAddingOrder, setIsAddingOrder] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/user-dashboard');
        const dashboardData = await response.json();
        setData(dashboardData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  const handleAddOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          total: Number(formData.get('total')),
          status: formData.get('status'),
        }),
      });

      if (!response.ok) throw new Error('Failed to add order');
      
      // Refresh dashboard data
      const dashboardResponse = await fetch('/api/user-dashboard');
      const dashboardData = await dashboardResponse.json();
      setData(dashboardData);
      setIsAddingOrder(false);
    } catch (error) {
      console.error('Failed to add order:', error);
    }
  };

  if (!data) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Dialog open={isAddingOrder} onOpenChange={setIsAddingOrder}>
          <DialogTrigger asChild>
            <Button>Add Order</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Order</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddOrder} className="space-y-4">
              <div>
                <label htmlFor="total" className="block text-sm font-medium mb-1">
                  Total Amount
                </label>
                <Input
                  id="total"
                  name="total"
                  type="number"
                  step="0.01"
                  required
                  placeholder="Enter total amount"
                />
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium mb-1">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="flex justify-end">
                <Button type="submit">Add Order</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.total_orders}</div>
            <p className="text-xs text-muted-foreground">All time orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.pending_orders}</div>
            <p className="text-xs text-muted-foreground">Awaiting processing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products Ordered</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.total_products}</div>
            <p className="text-xs text-muted-foreground">Total items ordered</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.stats.monthly_growth}%
            </div>
            <p className="text-xs text-muted-foreground">Compared to last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        {/* Monthly Orders Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Order History</CardTitle>
          </CardHeader>
          <CardContent>
            <Line
              data={{
                labels: data.monthlyOrders.map(item => item.month),
                datasets: [
                  {
                    label: 'Orders',
                    data: data.monthlyOrders.map(item => item.orders),
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.5)',
                  },
                  {
                    label: 'Amount ($)',
                    data: data.monthlyOrders.map(item => item.amount),
                    borderColor: 'rgb(16, 185, 129)',
                    backgroundColor: 'rgba(16, 185, 129, 0.5)',
                  }
                ]
              }}
            />
          </CardContent>
        </Card>

        {/* Order Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Pie
              data={{
                labels: data.ordersByStatus.map(item => item.status),
                datasets: [{
                  data: data.ordersByStatus.map(item => item.count),
                  backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(251, 191, 36, 0.8)'
                  ]
                }]
              }}
            />
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Items</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.recentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>#{order.id}</TableCell>
                  <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>{order.total_items}</TableCell>
                  <TableCell className="text-right">${order.total_amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 