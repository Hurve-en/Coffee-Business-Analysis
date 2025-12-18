/**
 * DASHBOARD OVERVIEW PAGE
 * 
 * The main dashboard page showing key business metrics
 * 
 * WHAT'S ON THIS PAGE:
 * 1. KPI Cards - Revenue, Orders, Customers (top row)
 * 2. Revenue Chart - Last 30 days trend
 * 3. Top Products - Best sellers
 * 4. Recent Orders - Latest transactions
 * 
 * DATA FLOW:
 * - This is a Server Component (fetches data on server)
 * - Gets data directly from database using Prisma
 * - No API calls needed (faster!)
 * - Data is fresh on every page load
 */

import { prisma } from '@/lib/prisma'
import { formatCurrency, formatDate, calculatePercentageChange } from '@/lib/utils'
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  TrendingUp,
  TrendingDown,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'

/**
 * GET DASHBOARD DATA
 * 
 * Fetches all data needed for the overview page
 * This runs on the server before the page loads
 */
async function getDashboardData() {
  // Get date range (last 30 days)
  const now = new Date()
  const thirtyDaysAgo = new Date(now)
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  // Fetch all data in parallel for speed
  const [
    totalRevenue,
    totalOrders,
    totalCustomers,
    recentOrders,
    topProducts
  ] = await Promise.all([
    // Calculate total revenue from all orders
    prisma.order.aggregate({
      _sum: { total: true },
      where: {
        orderDate: { gte: thirtyDaysAgo }
      }
    }),

    // Count total orders
    prisma.order.count({
      where: {
        orderDate: { gte: thirtyDaysAgo }
      }
    }),

    // Count unique customers
    prisma.customer.count(),

    // Get last 5 orders with customer info
    prisma.order.findMany({
      take: 5,
      orderBy: { orderDate: 'desc' },
      include: {
        customer: {
          select: {
            name: true,
            email: true
          }
        }
      }
    }),

    // Get top 5 selling products
    prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5
    })
  ])

  // Get product details for top products
  const productIds = topProducts.map(item => item.productId)
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } }
  })

  // Match products with their sales data
  const topProductsWithDetails = topProducts.map(item => {
    const product = products.find(p => p.id === item.productId)
    return {
      ...product,
      totalSold: item._sum.quantity || 0
    }
  })

  return {
    revenue: totalRevenue._sum.total || 0,
    orders: totalOrders,
    customers: totalCustomers,
    recentOrders,
    topProducts: topProductsWithDetails
  }
}

/**
 * OVERVIEW PAGE COMPONENT
 * 
 * This is an async Server Component
 * It fetches data before rendering
 */
export default async function OverviewPage() {
  // Fetch dashboard data
  const data = await getDashboardData()

  // Mock growth percentages (you can calculate these from previous period)
  const revenueGrowth = 12.5 // 12.5% growth
  const ordersGrowth = 8.2
  const customersGrowth = 15.3

  return (
    <div className="space-y-8">
      
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="mt-2 text-gray-600">
          Welcome back! Here's what's happening with your business today.
        </p>
      </div>

      {/* KPI CARDS - Top Row */}
      {/* 
        These are the big metrics cards
        - Revenue, Orders, Customers
        - Show current value + growth percentage
        - Color-coded: green for positive, red for negative
      */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* REVENUE CARD */}
        <StatCard
          title="Total Revenue"
          value={formatCurrency(data.revenue)}
          change={revenueGrowth}
          icon={<DollarSign className="w-6 h-6" />}
          iconBgColor="bg-green-500"
        />

        {/* ORDERS CARD */}
        <StatCard
          title="Total Orders"
          value={data.orders.toString()}
          change={ordersGrowth}
          icon={<ShoppingCart className="w-6 h-6" />}
          iconBgColor="bg-blue-500"
        />

        {/* CUSTOMERS CARD */}
        <StatCard
          title="Total Customers"
          value={data.customers.toString()}
          change={customersGrowth}
          icon={<Users className="w-6 h-6" />}
          iconBgColor="bg-purple-500"
        />

      </div>

      {/* SECOND ROW - Charts and Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* TOP PRODUCTS CARD */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Top Products</h2>
            <Link 
              href="/dashboard/products"
              className="text-sm text-slate-600 hover:text-slate-900 flex items-center gap-1 group"
            >
              View all
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Products List */}
          <div className="space-y-4">
            {data.topProducts.map((product, index) => (
              <div 
                key={product.id}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center gap-3">
                  {/* Rank badge */}
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-sm font-semibold text-slate-700">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{product.totalSold}</p>
                  <p className="text-sm text-gray-500">sold</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RECENT ORDERS CARD */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            <Link 
              href="/dashboard/sales"
              className="text-sm text-slate-600 hover:text-slate-900 flex items-center gap-1 group"
            >
              View all
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {data.recentOrders.map((order) => (
              <div 
                key={order.id}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200"
              >
                <div>
                  <p className="font-medium text-gray-900">{order.customer.name}</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(order.orderDate, 'relative')} • {order.paymentMethod}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(order.total)}
                  </p>
                  <p className={`text-sm px-2 py-1 rounded-full ${
                    order.status === 'completed' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {order.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* QUICK ACTIONS */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-900 rounded-2xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-2">Ready to dive deeper?</h2>
        <p className="text-slate-300 mb-6">
          Explore detailed analytics, manage your products, or view comprehensive reports.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link 
            href="/dashboard/sales"
            className="px-6 py-3 bg-white text-slate-900 rounded-xl font-semibold hover:bg-slate-100 transition-colors duration-200"
          >
            View Sales Analytics
          </Link>
          <Link 
            href="/dashboard/customers"
            className="px-6 py-3 bg-slate-600 text-white rounded-xl font-semibold hover:bg-slate-500 transition-colors duration-200"
          >
            Manage Customers
          </Link>
        </div>
      </div>

    </div>
  )
}

/**
 * STAT CARD COMPONENT
 * 
 * Reusable KPI card showing a metric with growth indicator
 * 
 * Props:
 * - title: Card title (e.g., "Total Revenue")
 * - value: Main value to display (e.g., "$1,234.56")
 * - change: Percentage change (e.g., 12.5 for +12.5%)
 * - icon: Icon component to display
 * - iconBgColor: Background color for icon (Tailwind class)
 */
function StatCard({ 
  title, 
  value, 
  change, 
  icon,
  iconBgColor 
}: { 
  title: string
  value: string
  change: number
  icon: React.ReactNode
  iconBgColor: string
}) {
  // Determine if change is positive or negative
  const isPositive = change >= 0
  const ChangeIcon = isPositive ? TrendingUp : TrendingDown
  
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      
      {/* Icon */}
      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${iconBgColor} text-white mb-4`}>
        {icon}
      </div>

      {/* Title */}
      <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>

      {/* Main Value */}
      <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>

      {/* Growth Indicator */}
      <div className="flex items-center gap-1">
        <ChangeIcon className={`w-4 h-4 ${isPositive ? 'text-green-600' : 'text-red-600'}`} />
        <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? '+' : ''}{change}%
        </span>
        <span className="text-sm text-gray-500">vs last month</span>
      </div>

    </div>
  )
}

/**
 * LEARNING NOTES:
 * 
 * 1. Why is this page async?
 *    Server Components can be async and fetch data directly
 *    No need for useEffect or API calls
 * 
 * 2. Why use Promise.all()?
 *    Fetches multiple queries in parallel = faster
 *    Without it, queries run one after another = slower
 * 
 * 3. How does include work?
 *    Prisma's way of joining tables
 *    Gets related data (customer info with order)
 * 
 * 4. What's groupBy doing?
 *    Groups order items by product
 *    Sums up quantities to find best sellers
 * 
 * 5. Can I add more KPI cards?
 *    Yes! Just create more StatCard components
 *    Calculate the data in getDashboardData()
 * 
 * 6. How to add a chart?
 *    We'll add Recharts in the next iteration
 *    For now, we have clean lists and cards
 * 
 * 7. Is this real-time?
 *    Fresh on every page load
 *    For true real-time, you'd need WebSockets
 */