import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { formatCurrency, formatDate } from '@/lib/utils'
import { TrendingUp, Users, ShoppingCart, DollarSign, Calendar, ArrowUpRight, Package } from 'lucide-react'
import { RevenueChart } from '@/components/charts/revenue-chart'

async function getOverviewData(userId: string) {
  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

  const [
    totalRevenue,
    totalOrders,
    totalCustomers,
    todayRevenue,
    monthRevenue,
    lastMonthRevenue,
    recentOrders,
    dailyRevenue,
    totalProducts,
    lowStockProducts
  ] = await Promise.all([
    prisma.order.aggregate({
      where: { userId, status: 'completed' },
      _sum: { total: true }
    }),
    prisma.order.count({
      where: { userId }
    }),
    prisma.customer.count({
      where: { userId }
    }),
    prisma.order.aggregate({
      where: { 
        userId, 
        status: 'completed',
        orderDate: { gte: startOfToday }
      },
      _sum: { total: true }
    }),
    prisma.order.aggregate({
      where: { 
        userId,
        status: 'completed',
        orderDate: { gte: startOfMonth }
      },
      _sum: { total: true }
    }),
    prisma.order.aggregate({
      where: { 
        userId,
        status: 'completed',
        orderDate: { 
          gte: startOfLastMonth,
          lte: endOfLastMonth
        }
      },
      _sum: { total: true }
    }),
    prisma.order.findMany({
      where: { userId },
      take: 5,
      orderBy: { orderDate: 'desc' },
      include: {
        customer: true,
        items: {
          include: {
            product: true
          }
        }
      }
    }),
    prisma.$queryRaw`
      SELECT 
        DATE("orderDate") as date,
        SUM(total)::float as revenue
      FROM "Order"
      WHERE "userId" = ${userId}
        AND "status" = 'completed'
        AND "orderDate" >= NOW() - INTERVAL '30 days'
      GROUP BY DATE("orderDate")
      ORDER BY date DESC
      LIMIT 30
    `,
    prisma.product.count({
      where: { userId }
    }),
    prisma.product.count({
      where: { 
        userId,
        stock: { lt: 100 }
      }
    })
  ])

  const thisMonth = monthRevenue._sum.total || 0
  const lastMonth = lastMonthRevenue._sum.total || 0
  const monthGrowth = lastMonth > 0 ? (((thisMonth - lastMonth) / lastMonth) * 100) : 0

  return {
    totalRevenue: totalRevenue._sum.total || 0,
    totalOrders,
    totalCustomers,
    totalProducts,
    lowStockProducts,
    todayRevenue: todayRevenue._sum.total || 0,
    monthRevenue: thisMonth,
    monthGrowth,
    recentOrders,
    dailyRevenue: (dailyRevenue as any[]).reverse()
  }
}

export default async function OverviewPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    redirect('/auth/login')
  }

  const data = await getOverviewData(session.user.id)

  return (
    <div className="space-y-8">
      
      {/* WELCOME HEADER */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-900 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {session.user.name}! 👋</h1>
            <p className="text-slate-300">Here's what's happening with your business today.</p>
          </div>
          <div className="hidden md:flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl">
            <Calendar className="w-5 h-5" />
            <span className="font-medium">{formatDate(new Date(), 'long')}</span>
          </div>
        </div>
      </div>

      {/* MAIN STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(data.totalRevenue)}
          change={`${formatCurrency(data.monthRevenue)} this month`}
          changeType={data.monthGrowth >= 0 ? 'positive' : 'negative'}
          icon={<DollarSign className="w-6 h-6" />}
          gradient="from-green-500 to-emerald-600"
        />
        <StatCard
          title="Total Orders"
          value={data.totalOrders.toString()}
          change={`${data.recentOrders.length} recent`}
          changeType="neutral"
          icon={<ShoppingCart className="w-6 h-6" />}
          gradient="from-blue-500 to-cyan-600"
        />
        <StatCard
          title="Customers"
          value={data.totalCustomers.toString()}
          change="Active customers"
          changeType="neutral"
          icon={<Users className="w-6 h-6" />}
          gradient="from-purple-500 to-pink-600"
        />
        <StatCard
          title="Products"
          value={data.totalProducts.toString()}
          change={`${data.lowStockProducts} low stock`}
          changeType={data.lowStockProducts > 0 ? 'warning' : 'neutral'}
          icon={<Package className="w-6 h-6" />}
          gradient="from-orange-500 to-red-600"
        />
      </div>

      {/* TODAY'S PERFORMANCE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Today's Sales</h3>
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-4xl font-bold text-gray-900 mb-2">{formatCurrency(data.todayRevenue)}</p>
          <p className="text-sm text-gray-600">Total sales today</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Monthly Growth</h3>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              data.monthGrowth >= 0 ? 'bg-green-100' : 'bg-red-100'
            }`}>
              <ArrowUpRight className={`w-5 h-5 ${
                data.monthGrowth >= 0 ? 'text-green-600' : 'text-red-600 rotate-90'
              }`} />
            </div>
          </div>
          <p className={`text-4xl font-bold mb-2 ${
            data.monthGrowth >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {data.monthGrowth >= 0 ? '+' : ''}{data.monthGrowth.toFixed(1)}%
          </p>
          <p className="text-sm text-gray-600">vs last month</p>
        </div>
      </div>

      {/* REVENUE CHART */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Revenue Trend</h2>
            <p className="text-sm text-gray-600 mt-1">Last 30 days performance</p>
          </div>
          <div className="px-4 py-2 bg-slate-100 rounded-xl">
            <span className="text-sm font-semibold text-slate-700">30 Days</span>
          </div>
        </div>
        <RevenueChart data={data.dailyRevenue} />
      </div>

      {/* RECENT ORDERS TABLE */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-mono text-gray-600">#{order.id.slice(0, 8)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-white text-sm font-semibold">
                        {order.customer.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{order.customer.name}</p>
                        <p className="text-xs text-gray-500">{order.customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {order.items.slice(0, 2).map((item, idx) => (
                        <div key={idx}>
                          {item.quantity}x {item.product.name}
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <span className="text-xs text-gray-500">+{order.items.length - 2} more</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-gray-900">{formatCurrency(order.total)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : order.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{formatDate(order.orderDate, 'short')}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data.recentOrders.length === 0 && (
          <div className="px-6 py-12 text-center">
            <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No orders yet</p>
            <p className="text-sm text-gray-500 mt-1">Your recent orders will appear here</p>
          </div>
        )}
      </div>

    </div>
  )
}

function StatCard({ title, value, change, changeType, icon, gradient }: {
  title: string
  value: string
  change: string
  changeType: 'positive' | 'negative' | 'warning' | 'neutral'
  icon: React.ReactNode
  gradient: string
}) {
  const changeColors = {
    positive: 'text-green-600 bg-green-50',
    negative: 'text-red-600 bg-red-50',
    warning: 'text-yellow-600 bg-yellow-50',
    neutral: 'text-gray-600 bg-gray-50'
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
      </div>
      <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
      <p className="text-3xl font-bold text-gray-900 mb-3">{value}</p>
      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${changeColors[changeType]}`}>
        {change}
      </div>
    </div>
  )
}