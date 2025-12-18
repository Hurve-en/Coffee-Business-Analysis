/**
 * SALES ANALYTICS PAGE
 * 
 * Shows detailed sales performance and trends
 * 
 * FEATURES:
 * 1. Sales summary cards
 * 2. Revenue trend chart (coming soon)
 * 3. Sales by category
 * 4. Top performing products
 * 5. Sales by payment method
 * 
 * DATA:
 * - Fetches from database using Prisma
 * - Calculates metrics and aggregations
 * - Groups data for analysis
 */

import { prisma } from '@/lib/prisma'
import { formatCurrency, formatNumber, calculatePercentageChange } from '@/lib/utils'
import { 
  DollarSign, 
  TrendingUp, 
  ShoppingBag,
  CreditCard,
  Banknote,
  Smartphone
} from 'lucide-react'

/**
 * GET SALES DATA
 * 
 * Fetches all sales-related data
 */
async function getSalesData() {
  // Date ranges
  const now = new Date()
  const thirtyDaysAgo = new Date(now)
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const sixtyDaysAgo = new Date(now)
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60)

  // Fetch data
  const [
    currentPeriodOrders,
    previousPeriodOrders,
    salesByCategory,
    salesByPaymentMethod,
    topProducts
  ] = await Promise.all([
    // Current period (last 30 days)
    prisma.order.aggregate({
      _sum: { total: true },
      _count: true,
      where: {
        orderDate: { gte: thirtyDaysAgo }
      }
    }),

    // Previous period (30-60 days ago)
    prisma.order.aggregate({
      _sum: { total: true },
      _count: true,
      where: {
        orderDate: {
          gte: sixtyDaysAgo,
          lt: thirtyDaysAgo
        }
      }
    }),

    // Sales by category
    prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true,
        price: true
      }
    }),

    // Sales by payment method
    prisma.order.groupBy({
      by: ['paymentMethod'],
      _sum: { total: true },
      _count: true
    }),

    // Top products
    prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { 
        quantity: true,
        price: true 
      },
      orderBy: {
        _sum: {
          quantity: 'desc'
        }
      },
      take: 10
    })
  ])

  // Get product details
  const productIds = topProducts.map(item => item.productId)
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } }
  })

  // Combine products with sales data
  const topProductsWithDetails = topProducts.map(item => {
    const product = products.find(p => p.id === item.productId)
    return {
      ...product,
      totalSold: item._sum.quantity || 0,
      totalRevenue: (item._sum.price || 0) * (item._sum.quantity || 0)
    }
  })

  // Calculate growth
  const currentRevenue = currentPeriodOrders._sum.total || 0
  const previousRevenue = previousPeriodOrders._sum.total || 0
  const revenueGrowth = calculatePercentageChange(currentRevenue, previousRevenue)

  const currentOrderCount = currentPeriodOrders._count
  const previousOrderCount = previousPeriodOrders._count
  const orderGrowth = calculatePercentageChange(currentOrderCount, previousOrderCount)

  return {
    currentRevenue,
    revenueGrowth,
    currentOrderCount,
    orderGrowth,
    averageOrderValue: currentOrderCount > 0 ? currentRevenue / currentOrderCount : 0,
    salesByPaymentMethod,
    topProducts: topProductsWithDetails
  }
}

/**
 * SALES PAGE COMPONENT
 */
export default async function SalesPage() {
  const data = await getSalesData()

  return (
    <div className="space-y-8">
      
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Sales Analytics</h1>
        <p className="mt-2 text-gray-600">
          Track your sales performance and identify trends.
        </p>
      </div>

      {/* METRICS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Revenue */}
        <MetricCard
          title="Total Revenue"
          value={formatCurrency(data.currentRevenue)}
          change={data.revenueGrowth}
          icon={<DollarSign className="w-6 h-6" />}
          iconColor="bg-green-500"
        />

        {/* Total Orders */}
        <MetricCard
          title="Total Orders"
          value={data.currentOrderCount.toString()}
          change={data.orderGrowth}
          icon={<ShoppingBag className="w-6 h-6" />}
          iconColor="bg-blue-500"
        />

        {/* Average Order Value */}
        <MetricCard
          title="Average Order Value"
          value={formatCurrency(data.averageOrderValue)}
          change={0}
          icon={<TrendingUp className="w-6 h-6" />}
          iconColor="bg-purple-500"
        />

      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* PAYMENT METHODS */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Sales by Payment Method</h2>
          
          <div className="space-y-4">
            {data.salesByPaymentMethod.map((method) => {
              const total = method._sum.total || 0
              const count = method._count
              const percentage = (total / data.currentRevenue) * 100

              // Icon based on payment method
              const Icon = method.paymentMethod === 'card' ? CreditCard :
                          method.paymentMethod === 'cash' ? Banknote :
                          Smartphone

              return (
                <div key={method.paymentMethod} className="flex items-center gap-4">
                  {/* Icon */}
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-slate-100">
                    <Icon className="w-6 h-6 text-slate-700" />
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900 capitalize">
                        {method.paymentMethod}
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {formatCurrency(total)}
                      </span>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-slate-600 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 w-12 text-right">
                        {percentage.toFixed(0)}%
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 mt-1">
                      {count} orders
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* TOP PRODUCTS */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Top Selling Products</h2>
          
          <div className="space-y-4">
            {data.topProducts.slice(0, 5).map((product, index) => (
              <div 
                key={product.id}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {/* Rank */}
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-sm font-semibold text-slate-700">
                    {index + 1}
                  </div>
                  
                  {/* Product info */}
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">
                      {product.totalSold} sold • {formatCurrency(product.totalRevenue)}
                    </p>
                  </div>
                </div>

                {/* Category badge */}
                <span className="px-3 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded-full">
                  {product.category}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* INSIGHTS SECTION */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-900 rounded-2xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-2">Sales Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          
          {/* Insight 1 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-slate-300 text-sm mb-1">Best Seller</p>
            <p className="text-2xl font-bold">
              {data.topProducts[0]?.name || 'N/A'}
            </p>
            <p className="text-slate-300 text-sm mt-1">
              {data.topProducts[0]?.totalSold || 0} units sold
            </p>
          </div>

          {/* Insight 2 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-slate-300 text-sm mb-1">Most Popular Payment</p>
            <p className="text-2xl font-bold capitalize">
              {data.salesByPaymentMethod[0]?.paymentMethod || 'N/A'}
            </p>
            <p className="text-slate-300 text-sm mt-1">
              {data.salesByPaymentMethod[0]?._count || 0} transactions
            </p>
          </div>

          {/* Insight 3 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-slate-300 text-sm mb-1">Growth Trend</p>
            <p className="text-2xl font-bold">
              {data.revenueGrowth > 0 ? '📈' : '📉'} {Math.abs(data.revenueGrowth)}%
            </p>
            <p className="text-slate-300 text-sm mt-1">
              vs previous period
            </p>
          </div>

        </div>
      </div>

    </div>
  )
}

/**
 * METRIC CARD COMPONENT
 */
function MetricCard({ 
  title, 
  value, 
  change, 
  icon,
  iconColor 
}: { 
  title: string
  value: string
  change: number
  icon: React.ReactNode
  iconColor: string
}) {
  const isPositive = change >= 0

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300">
      
      {/* Icon */}
      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${iconColor} text-white mb-4`}>
        {icon}
      </div>

      {/* Title */}
      <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>

      {/* Value */}
      <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>

      {/* Growth */}
      {change !== 0 && (
        <div className="flex items-center gap-1">
          <TrendingUp className={`w-4 h-4 ${isPositive ? 'text-green-600' : 'text-red-600 rotate-180'}`} />
          <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '+' : ''}{change}%
          </span>
          <span className="text-sm text-gray-500">vs last period</span>
        </div>
      )}

    </div>
  )
}

/**
 * LEARNING NOTES:
 * 
 * 1. What's groupBy()?
 *    Groups database rows by a field and calculates aggregates
 *    Like SQL's GROUP BY
 * 
 * 2. How do progress bars work?
 *    Calculate percentage, set width style dynamically
 *    CSS transition makes it animated
 * 
 * 3. Why slice(0, 5)?
 *    Limits array to first 5 items
 *    Shows top 5 products only
 * 
 * 4. Can I add charts?
 *    Yes! Install Recharts and add line/bar charts
 *    We'll do that in the next iteration
 * 
 * 5. How to add date filters?
 *    Add dropdown to select date range
 *    Pass dates to getSalesData()
 *    Filter queries by date range
 */