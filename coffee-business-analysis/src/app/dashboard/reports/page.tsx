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
import { formatCurrency, formatDate } from '@/lib/utils'
import { DollarSign, TrendingUp, TrendingDown, PieChart, Calendar } from 'lucide-react'

async function getFinancialData() {
  // Get all orders for revenue calculation
  const orders = await prisma.order.findMany({
    include: {
      items: {
        include: {
          product: true
        }
      }
    }
  })

  // Calculate total revenue
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)

  // Calculate total costs (cost of goods sold)
  const totalCosts = orders.reduce((sum, order) => {
    const orderCost = order.items.reduce((itemSum, item) => {
      return itemSum + (item.product.cost * item.quantity)
    }, 0)
    return sum + orderCost
  }, 0)

  // Calculate profit
  const totalProfit = totalRevenue - totalCosts

  // Group orders by month
  const monthlyData: { [key: string]: { revenue: number, costs: number, profit: number, orders: number } } = {}

  orders.forEach(order => {
    const monthKey = new Date(order.orderDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
    
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { revenue: 0, costs: 0, profit: 0, orders: 0 }
    }

    const orderCost = order.items.reduce((sum, item) => sum + (item.product.cost * item.quantity), 0)
    
    monthlyData[monthKey].revenue += order.total
    monthlyData[monthKey].costs += orderCost
    monthlyData[monthKey].profit += (order.total - orderCost)
    monthlyData[monthKey].orders += 1
  })

  // Convert to array and sort by date
  const monthlyReports = Object.entries(monthlyData).map(([month, data]) => ({
    month,
    ...data
  })).reverse().slice(0, 6) // Last 6 months

  // Get financial metrics from database
  const financialMetrics = await prisma.financialMetric.findMany({
    orderBy: { date: 'desc' },
    take: 6
  })

  return {
    totalRevenue,
    totalCosts,
    totalProfit,
    profitMargin: totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100) : 0,
    monthlyReports,
    financialMetrics
  }
}

export default async function ReportsPage() {
  const data = await getFinancialData()

  return (
    <div className="space-y-8">
      
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Financial Reports</h1>
        <p className="mt-2 text-gray-600">
          Track your business financial performance and profitability.
        </p>
      </div>

      {/* FINANCIAL SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        <StatCard
          title="Total Revenue"
          value={formatCurrency(data.totalRevenue)}
          icon={<DollarSign className="w-6 h-6" />}
          iconColor="bg-green-500"
        />

        <StatCard
          title="Total Costs"
          value={formatCurrency(data.totalCosts)}
          icon={<TrendingDown className="w-6 h-6" />}
          iconColor="bg-red-500"
        />

        <StatCard
          title="Total Profit"
          value={formatCurrency(data.totalProfit)}
          icon={<TrendingUp className="w-6 h-6" />}
          iconColor="bg-blue-500"
        />

        <StatCard
          title="Profit Margin"
          value={`${data.profitMargin.toFixed(1)}%`}
          icon={<PieChart className="w-6 h-6" />}
          iconColor="bg-purple-500"
        />

      </div>

      {/* MONTHLY BREAKDOWN TABLE */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Monthly Breakdown</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orders</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Costs</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Profit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Margin</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.monthlyReports.map((report, index) => {
                const margin = report.revenue > 0 ? ((report.profit / report.revenue) * 100) : 0
                const isProfit = report.profit > 0

                return (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{report.month}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">{report.orders}</span>
                      <span className="text-sm text-gray-500"> orders</span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-green-600">
                        {formatCurrency(report.revenue)}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-red-600">
                        {formatCurrency(report.costs)}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className={`text-sm font-bold ${isProfit ? 'text-blue-600' : 'text-red-600'}`}>
                        {formatCurrency(report.profit)}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className={`text-sm font-semibold ${margin >= 50 ? 'text-green-600' : margin >= 30 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {margin.toFixed(1)}%
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {isProfit ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <TrendingUp className="w-3 h-3" />
                          Profitable
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <TrendingDown className="w-3 h-3" />
                          Loss
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {data.monthlyReports.length === 0 && (
          <div className="px-6 py-12 text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No financial data yet</p>
            <p className="text-sm text-gray-500 mt-1">
              Data will appear as you record transactions.
            </p>
          </div>
        )}

      </div>

      {/* FINANCIAL INSIGHTS */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-900 rounded-2xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-2">Financial Health</h2>
        <p className="text-slate-300 mb-6">
          Key insights about your business profitability
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Average Order Value */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-slate-300 text-sm mb-1">Average Order Value</p>
            <p className="text-2xl font-bold">
              {data.monthlyReports.length > 0 
                ? formatCurrency(data.totalRevenue / data.monthlyReports.reduce((sum, r) => sum + r.orders, 0))
                : formatCurrency(0)
              }
            </p>
            <p className="text-slate-300 text-sm mt-1">per transaction</p>
          </div>

          {/* Best Month */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-slate-300 text-sm mb-1">Best Month</p>
            <p className="text-2xl font-bold">
              {data.monthlyReports.length > 0
                ? [...data.monthlyReports].sort((a, b) => b.profit - a.profit)[0]?.month || 'N/A'
                : 'N/A'
              }
            </p>
            <p className="text-slate-300 text-sm mt-1">
              {data.monthlyReports.length > 0
                ? formatCurrency([...data.monthlyReports].sort((a, b) => b.profit - a.profit)[0]?.profit || 0)
                : formatCurrency(0)
              } profit
            </p>
          </div>

          {/* Profit Trend */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-slate-300 text-sm mb-1">Overall Trend</p>
            <p className="text-2xl font-bold">
              {data.totalProfit > 0 ? '📈 Growing' : '📉 Declining'}
            </p>
            <p className="text-slate-300 text-sm mt-1">
              {formatCurrency(Math.abs(data.totalProfit))} total
            </p>
          </div>

        </div>
      </div>

      {/* PROFITABILITY TIPS */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Profitability Tips</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
            <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
            <div>
              <p className="font-medium text-gray-900">Monitor Your Margins</p>
              <p className="text-sm text-gray-600">Aim for at least 50% profit margin on each product. Review costs regularly.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
            <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
            <div>
              <p className="font-medium text-gray-900">Focus on Best Sellers</p>
              <p className="text-sm text-gray-600">Promote products with high margins and strong sales. Consider discontinuing slow movers.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
            <div className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
            <div>
              <p className="font-medium text-gray-900">Control Costs</p>
              <p className="text-sm text-gray-600">Negotiate with suppliers, reduce waste, and optimize inventory to lower your cost of goods sold.</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

function StatCard({ title, value, icon, iconColor }: { title: string, value: string, icon: React.ReactNode, iconColor: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all">
      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${iconColor} text-white mb-4`}>{icon}</div>
      <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  )
}