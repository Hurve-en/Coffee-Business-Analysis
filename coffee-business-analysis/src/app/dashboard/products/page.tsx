import { prisma } from '@/lib/prisma'
import ProductsPageClient from './products-client'

async function getProductsData() {
  const products = await prisma.product.findMany({ orderBy: { name: 'asc' } })
  
  const salesData = await prisma.orderItem.groupBy({
    by: ['productId'],
    _sum: { quantity: true, price: true }
  })

  const productsWithSales = products.map(product => {
    const sales = salesData.find(s => s.productId === product.id)
    const totalSold = sales?._sum.quantity || 0
    const totalRevenue = (sales?._sum.price || 0) * totalSold
    const profitMargin = product.price > 0 ? (((product.price - product.cost) / product.price) * 100) : 0
    return { ...product, totalSold, totalRevenue, profitMargin }
  })

  return {
    products: productsWithSales,
    stats: {
      totalProducts: products.length,
      inStockProducts: products.filter(p => p.stock > 0).length,
      lowStockProducts: products.filter(p => p.stock < 100 && p.stock > 0).length,
      totalInventoryValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0)
    }
  }
}

export default async function ProductsPage() {
  const data = await getProductsData()
  return <ProductsPageClient initialProducts={data.products} stats={data.stats} />
}