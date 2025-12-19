import { prisma } from '@/lib/prisma'
import CustomersPageClient from './customers-client'

async function getCustomersData() {
  const customers = await prisma.customer.findMany({
    orderBy: { totalSpent: 'desc' },
    include: {
      _count: {
        select: { orders: true }
      }
    }
  })

  const totalCustomers = customers.length
  const activeCustomers = customers.filter(c => c.visitCount > 0).length
  const vipCustomers = customers.filter(c => c.totalSpent > 50).length
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

export default async function CustomersPage() {
  const data = await getCustomersData()
  
  return <CustomersPageClient initialCustomers={data.customers} stats={data.stats} />
}