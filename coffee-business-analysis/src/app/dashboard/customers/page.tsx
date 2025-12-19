/**
 * CUSTOMERS PAGE
 * 
 * Manage and track customer information
 * 
 * FEATURES:
 * 1. Customer stats cards
 * 2. Customer list table
 * 3. Customer details (spending, visits, loyalty)
 * 4. Sorting and filtering
 * 
 * DATA:
 * - Fetches all customers from database
 * - Calculates customer metrics
 * - Shows purchase history summaries
 */

import { prisma } from '@/lib/prisma'
import { formatCurrency, formatDate, getInitials } from '@/lib/utils'
import { 
  Users, 
  Star, 
  TrendingUp,
  Mail,
  Phone,
  ShoppingBag
} from 'lucide-react'

/**
 * GET CUSTOMERS DATA
 * 
 * Fetches all customer information and stats
 */
async function getCustomersData() {
  // Fetch all customers with order count
  const customers = await prisma.customer.findMany({
    orderBy: { totalSpent: 'desc' },
    include: {
      _count: {
        select: { orders: true }
      }
    }
  })

  // Calculate stats
  const totalCustomers = customers.length
  const activeCustomers = customers.filter(c => c.visitCount > 0).length
  const vipCustomers = customers.filter(c => c.totalSpent > 50).length // VIP = spent over $50
  
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0)
  const averageSpending = totalCustomers > 0 ? totalRevenue / totalCustomers : 0

  return {
    customers,
    stats: {
      totalCustomers,
      activeCustomers,
      vipCustomers,
      averageSpending
    }
  }
}

/**
 * CUSTOMERS PAGE COMPONENT
 */
export default async function CustomersPage() {
  const data = await getCustomersData()

  return (
    <div className="space-y-8">
      
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
        <p className="mt-2 text-gray-600">
          Manage your customer relationships and track loyalty.
        </p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Total Customers */}
        <StatCard
          title="Total Customers"
          value={data.stats.totalCustomers.toString()}
          icon={<Users className="w-6 h-6" />}
          iconColor="bg-blue-500"
        />

        {/* Active Customers */}
        <StatCard
          title="Active Customers"
          value={data.stats.activeCustomers.toString()}
          icon={<TrendingUp className="w-6 h-6" />}
          iconColor="bg-green-500"
        />

        {/* VIP Customers */}
        <StatCard
          title="VIP Customers"
          value={data.stats.vipCustomers.toString()}
          icon={<Star className="w-6 h-6" />}
          iconColor="bg-yellow-500"
        />

        {/* Average Spending */}
        <StatCard
          title="Avg. Spending"
          value={formatCurrency(data.stats.averageSpending)}
          icon={<ShoppingBag className="w-6 h-6" />}
          iconColor="bg-purple-500"
        />

      </div>

      {/* CUSTOMERS TABLE */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All Customers</h2>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loyalty Points
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Visit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.customers.map((customer) => {
                // Determine customer status
                const isVIP = customer.totalSpent > 50
                const isActive = customer.visitCount > 0

                return (
                  <tr 
                    key={customer.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Customer Name with Avatar */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {/* Avatar with initials */}
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 text-white font-semibold text-sm">
                          {getInitials(customer.name)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {customer.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            ID: {customer.id.slice(0, 8)}...
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Contact Info */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="w-4 h-4 text-gray-400" />
                          {customer.email}
                        </div>
                        {customer.phone && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4 text-gray-400" />
                            {customer.phone}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Orders Count */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        {customer._count.orders}
                      </span>
                      <span className="text-sm text-gray-500"> orders</span>
                    </td>

                    {/* Total Spent */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-gray-900">
                        {formatCurrency(customer.totalSpent)}
                      </span>
                    </td>

                    {/* Loyalty Points */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-medium text-gray-900">
                          {customer.loyaltyPoints}
                        </span>
                      </div>
                    </td>

                    {/* Last Visit */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {customer.lastVisit 
                        ? formatDate(customer.lastVisit, 'relative')
                        : 'Never'
                      }
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isVIP ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <Star className="w-3 h-3" />
                          VIP
                        </span>
                      ) : isActive ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          New
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {data.customers.length === 0 && (
          <div className="px-6 py-12 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No customers yet</p>
            <p className="text-sm text-gray-500 mt-1">
              Customers will appear here when they make their first purchase.
            </p>
          </div>
        )}

      </div>

      {/* CUSTOMER INSIGHTS */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-900 rounded-2xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-2">Customer Insights</h2>
        <p className="text-slate-300 mb-6">
          Key metrics about your customer base
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Top Spender */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-slate-300 text-sm mb-1">Top Spender</p>
            <p className="text-2xl font-bold">
              {data.customers[0]?.name || 'N/A'}
            </p>
            <p className="text-slate-300 text-sm mt-1">
              {formatCurrency(data.customers[0]?.totalSpent || 0)} total
            </p>
          </div>

          {/* Most Loyal */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-slate-300 text-sm mb-1">Most Loyal</p>
            <p className="text-2xl font-bold">
              {[...data.customers].sort((a, b) => b.visitCount - a.visitCount)[0]?.name || 'N/A'}
            </p>
            <p className="text-slate-300 text-sm mt-1">
              {[...data.customers].sort((a, b) => b.visitCount - a.visitCount)[0]?.visitCount || 0} visits
            </p>
          </div>

          {/* Top Points */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-slate-300 text-sm mb-1">Most Points</p>
            <p className="text-2xl font-bold">
              {[...data.customers].sort((a, b) => b.loyaltyPoints - a.loyaltyPoints)[0]?.name || 'N/A'}
            </p>
            <p className="text-slate-300 text-sm mt-1">
              {[...data.customers].sort((a, b) => b.loyaltyPoints - a.loyaltyPoints)[0]?.loyaltyPoints || 0} points
            </p>
          </div>

        </div>
      </div>

    </div>
  )
}

/**
 * STAT CARD COMPONENT
 */
function StatCard({ 
  title, 
  value, 
  icon,
  iconColor 
}: { 
  title: string
  value: string
  icon: React.ReactNode
  iconColor: string
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300">
      
      {/* Icon */}
      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${iconColor} text-white mb-4`}>
        {icon}
      </div>

      {/* Title */}
      <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>

      {/* Value */}
      <p className="text-3xl font-bold text-gray-900">{value}</p>

    </div>
  )
}

/**
 * LEARNING NOTES:
 * 
 * 1. What's _count in Prisma?
 *    Counts related records (how many orders per customer)
 *    More efficient than loading all orders
 * 
 * 2. Why use getInitials()?
 *    Creates avatar placeholders with customer initials
 *    Professional look without images
 * 
 * 3. How does VIP status work?
 *    Simple logic: totalSpent > $50 = VIP
 *    You can change threshold as needed
 * 
 * 4. Why slice ID?
 *    Full IDs are long (clx123abc...)
 *    Show first 8 chars for readability
 * 
 * 5. Can I add search?
 *    Yes! Add input field, filter customers array
 *    Make it a Client Component with useState
 * 
 * 6. How to add customer edit?
 *    Add "Edit" button in each row
 *    Create modal or separate page
 *    Update via API route
 * 
 * 7. What's the [...data.customers].sort()?
 *    Spread creates copy (don't mutate original)
 *    Sort to find most loyal/top points
 *    Used in insights section
 */