'use client'

import { useEffect, useState } from 'react'
import { Bar, Line, Pie } from 'react-chartjs-2'
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
  Legend,
} from 'chart.js'

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

export function DashboardCharts() {
  const [chartData, setChartData] = useState<any>(null)

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const [chartResponse, recentSalesResponse] = await Promise.all([
          fetch('/api/dashboard/charts'),
          fetch('/api/dashboard/recent-sales')
        ])
        
        const chartData = await chartResponse.json()
        const salesData = await recentSalesResponse.json()

        setChartData({
          productsByCategory: {
            labels: chartData.productsByCategory.map((item: any) => item.category),
            datasets: [{
              label: 'Products',
              data: chartData.productsByCategory.map((item: any) => item.count),
              backgroundColor: 'rgba(99, 102, 241, 0.8)',
              borderColor: 'rgb(99, 102, 241)',
              borderWidth: 1
            }]
          },
          customerGrowth: {
            labels: chartData.customerGrowth.map((item: any) => item.month),
            datasets: [{
              label: 'New Customers',
              data: chartData.customerGrowth.map((item: any) => item.new_customers),
              borderColor: 'rgb(34, 197, 94)',
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              tension: 0.3,
              fill: true
            }]
          },
          companyDistribution: {
            labels: chartData.companyDistribution.map((item: any) => item.status),
            datasets: [{
              data: chartData.companyDistribution.map((item: any) => item.count),
              backgroundColor: [
                'rgba(239, 68, 68, 0.8)',
                'rgba(34, 197, 94, 0.8)',
                'rgba(59, 130, 246, 0.8)',
                'rgba(168, 85, 247, 0.8)'
              ],
              borderWidth: 1
            }]
          },
          productTimeline: {
            labels: chartData.productTimeline.map((item: any) => item.month),
            datasets: [{
              label: 'New Products',
              data: chartData.productTimeline.map((item: any) => item.new_products),
              borderColor: 'rgb(249, 115, 22)',
              backgroundColor: 'rgba(249, 115, 22, 0.1)',
              tension: 0.3,
              fill: true
            }]
          }
        })
      } catch (error) {
        console.error('Error fetching chart data:', error)
      }
    }

    fetchChartData()
  }, [])

  if (!chartData) return <div>Loading...</div>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="p-4 bg-white rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Products by Category</h3>
        <div className="h-[300px]">
          <Bar
            data={chartData.productsByCategory}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: { precision: 0 }
                }
              }
            }}
          />
        </div>
      </div>

      <div className="p-4 bg-white rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Customer Growth</h3>
        <div className="h-[300px]">
          <Line
            data={chartData.customerGrowth}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: { precision: 0 }
                }
              }
            }}
          />
        </div>
      </div>

      <div className="p-4 bg-white rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Company Status Distribution</h3>
        <div className="h-[300px] flex items-center justify-center">
          <Pie
            data={chartData.companyDistribution}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom'
                }
              }
            }}
          />
        </div>
      </div>

      <div className="p-4 bg-white rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Product Creation Timeline</h3>
        <div className="h-[300px]">
          <Line
            data={chartData.productTimeline}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: { precision: 0 }
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  )
} 