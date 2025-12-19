import { prisma } from '@/lib/prisma'
import { formatCurrency } from '@/lib/utils'
import { Package, AlertTriangle, DollarSign, Coffee, ShoppingBag } from 'lucide-react'

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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <p className="mt-2 text-gray-600">Manage your product inventory.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Products" value={data.stats.totalProducts.toString()} icon={<Package className="w-6 h-6" />} iconColor="bg-blue-500" />
        <StatCard title="In Stock" value={data.stats.inStockProducts.toString()} icon={<ShoppingBag className="w-6 h-6" />} iconColor="bg-green-500" />
        <StatCard title="Low Stock" value={data.stats.lowStockProducts.toString()} icon={<AlertTriangle className="w-6 h-6" />} iconColor="bg-yellow-500" />
        <StatCard title="Inventory Value" value={formatCurrency(data.stats.totalInventoryValue)} icon={<DollarSign className="w-6 h-6" />} iconColor="bg-purple-500" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All Products</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Margin</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sold</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.products.map((product) => {
                const isLowStock = product.stock < 100 && product.stock > 0
                const isOutOfStock = product.stock === 0
                const profitColor = product.profitMargin >= 60 ? 'text-green-600' : product.profitMargin >= 40 ? 'text-yellow-600' : 'text-red-600'

                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                          <Coffee className="w-5 h-5 text-slate-700" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">{product.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-gray-900">{formatCurrency(product.price)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{formatCurrency(product.cost)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-semibold ${profitColor}`}>{product.profitMargin.toFixed(1)}%</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">{product.stock}</span>
                        {isLowStock && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                        {isOutOfStock && <AlertTriangle className="w-4 h-4 text-red-500" />}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">{product.totalSold}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-gray-900">{formatCurrency(product.totalRevenue)}</span>
                    </td>
                    <td className="px-6 py-4">
                      {isOutOfStock ? (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Out of Stock</span>
                      ) : isLowStock ? (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Low Stock</span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">In Stock</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
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