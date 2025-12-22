/**
 * FINANCIAL REPORTS PAGE
 * 
 * Track financial performance and generate P&L statements
 * 
 * FEATURES:
 * 1. Financial summary cards
 * 2. Monthly revenue/expense breakdown
 * 3. Profit trends
 * 4. Period comparisons
 */

import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { formatCurrency } from '@/lib/utils'
import { DollarSign, TrendingUp, TrendingDown, Package } from 'lucide-react'

async function getReportsData(userId: string) {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

  const [
    totalRevenue,
    totalCost,
    thisMonthRevenue,
    lastMonthRevenue,
    topProducts
  ] = await Promise.all([
    // Total Revenue
    prisma.order.aggregate({
      where: { 
        userId,
        status: 'completed'
      },
      _sum: { total: true }
    }),

    // Total Cost (calculate from order items)
    prisma.orderItem.aggregate({
      where: {
        order: {
          userId,
          status: 'completed'
        }
      },
      _sum: {
        quantity: true
      }
    }).then(async (items) => {
      // Get all products cost
      const products = await prisma.product.findMany({
        where: { userId },
        select: { id: true, cost: true }
      })
      
      const orderItems = await prisma.orderItem.findMany({
        where: {
          order: {
            userId,
            status: 'completed'
          }
        },
        include: {
          product: {
            select: { cost: true }
          }
        }
      })

      return orderItems.reduce((sum, item) => {
        return sum + (item.product.cost * item.quantity)
      }, 0)
    }),

    // This Month Revenue
    prisma.order.aggregate({
      where: { 
        userId,
        status: 'completed',
        orderDate: { gte: startOfMonth }
      },
      _sum: { total: true }
    }),

    // Last Month Revenue
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

    // Top Products
    prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        order: {
          userId,
          status: 'completed'
        }
      },
      _sum: {
        quantity: true
      },
      orderBy: {
        _sum: {
          quantity: 'desc'
        }
      },
      take: 5
    }).then(async (items) => {
      const productIds = items.map(item => item.productId)
      const products = await prisma.product.findMany({
        where: {
          id: { in: productIds },
          userId
        }
      })

      return items.map(item => {
        const product = products.find(p => p.id === item.productId)
        return {
          name: product?.name || 'Unknown',
          sold: item._sum.quantity || 0
        }
      })
    })
  ])

  const revenue = totalRevenue._sum.total || 0
  const cost = totalCost || 0
  const profit = revenue - cost
  const profitMargin = revenue > 0 ? ((profit / revenue) * 100) : 0

  const thisMonth = thisMonthRevenue._sum.total || 0
  const lastMonth = lastMonthRevenue._sum.total || 0
  const monthGrowth = lastMonth > 0 ? (((thisMonth - lastMonth) / lastMonth) * 100) : 0

  return {
    revenue,
    cost,
    profit,
    profitMargin,
    monthGrowth,
    topProducts
  }
}

export default async function ReportsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    redirect('/auth/login')
  }

  const data = await getReportsData(session.user.id)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Financial Reports</h1>
        <p className="mt-2 text-gray-600">
          Comprehensive financial analysis and insights for {session.user.name}'s business.
        </p>
      </div>

      {/* Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(data.revenue)}
          icon={<DollarSign className="w-6 h-6" />}
          iconColor="bg-blue-500"
        />
        <StatCard
          title="Total Cost"
          value={formatCurrency(data.cost)}
          icon={<Package className="w-6 h-6" />}
          iconColor="bg-orange-500"
        />
        <StatCard
          title="Net Profit"
          value={formatCurrency(data.profit)}
          icon={<TrendingUp className="w-6 h-6" />}
          iconColor="bg-green-500"
        />
        <StatCard
          title="Profit Margin"
          value={`${data.profitMargin.toFixed(1)}%`}
          icon={<TrendingUp className="w-6 h-6" />}
          iconColor="bg-purple-500"
        />
      </div>

      {/* Profit & Loss Statement */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Profit & Loss Statement</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between py-4 border-b border-gray-200">
            <span className="text-lg font-medium text-gray-700">Revenue</span>
            <span className="text-lg font-bold text-green-600">{formatCurrency(data.revenue)}</span>
          </div>

          <div className="flex items-center justify-between py-4 border-b border-gray-200">
            <span className="text-lg font-medium text-gray-700">Cost of Goods Sold</span>
            <span className="text-lg font-bold text-red-600">({formatCurrency(data.cost)})</span>
          </div>

          <div className="flex items-center justify-between py-6 bg-gradient-to-r from-slate-50 to-gray-50 px-6 rounded-xl">
            <span className="text-xl font-bold text-gray-900">Net Profit</span>
            <span className={`text-2xl font-bold ${data.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(data.profit)}
            </span>
          </div>

          <div className="pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Profit Margin</span>
              <span className={`text-sm font-semibold ${data.profitMargin >= 30 ? 'text-green-600' : data.profitMargin >= 15 ? 'text-yellow-600' : 'text-red-600'}`}>
                {data.profitMargin.toFixed(2)}%
              </span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-gray-600">Month-over-Month Growth</span>
              <span className={`flex items-center gap-1 text-sm font-semibold ${data.monthGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {data.monthGrowth >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {Math.abs(data.monthGrowth).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Top Selling Products</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Units Sold</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.topProducts.map((product, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className="text-2xl font-bold text-gray-400">#{index + 1}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900">{product.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-gray-900">{product.sold} units</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon, iconColor }: any) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all">
      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${iconColor} text-white mb-4`}>
        {icon}
      </div>
      <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  )
}