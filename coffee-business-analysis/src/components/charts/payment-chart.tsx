/**
 * PAYMENT METHOD CHART
 * 
 * Pie chart showing sales distribution by payment method
 * Used in Sales page
 * 
 * FEATURES:
 * - Donut-style pie chart
 * - Percentage labels
 * - Hover interactions
 * - Slate gray theme
 */

'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { formatCurrency } from '@/lib/utils'

interface PaymentChartProps {
  data: Array<{
    name: string
    value: number
    count: number
  }>
}

// Colors for each payment method
const COLORS = {
  card: '#475569',    // Slate-600
  cash: '#64748b',    // Slate-500
  mobile: '#94a3b8'   // Slate-400
}

export function PaymentChart({ data }: PaymentChartProps) {
  // Calculate total for percentages
  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Sales by Payment Method</h2>
      
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          {/* The pie itself */}
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
            animationDuration={1000}
            label={(entry) => {
              const percent = ((entry.value / total) * 100).toFixed(0)
              return `${percent}%`
            }}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[entry.name as keyof typeof COLORS] || '#94a3b8'}
                className="hover:opacity-80 transition-opacity cursor-pointer"
              />
            ))}
          </Pie>
          
          {/* Hover tooltip */}
          <Tooltip 
            contentStyle={{
              backgroundColor: '#1e293b',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '14px',
              padding: '8px 12px'
            }}
            formatter={(value: number, name: string, props: any) => [
              `${formatCurrency(value)} (${props.payload.count} orders)`,
              name.charAt(0).toUpperCase() + name.slice(1)
            ]}
          />
          
          {/* Legend */}
          <Legend 
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            formatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Summary below chart */}
      <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-3 gap-4">
        {data.map((item) => (
          <div key={item.name} className="text-center">
            <div 
              className="w-3 h-3 rounded-full mx-auto mb-2"
              style={{ backgroundColor: COLORS[item.name as keyof typeof COLORS] }}
            />
            <p className="text-xs text-gray-500 capitalize">{item.name}</p>
            <p className="text-sm font-semibold text-gray-900">{formatCurrency(item.value)}</p>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {data.length === 0 && (
        <div className="flex items-center justify-center h-[300px] text-gray-500">
          <p>No payment data available</p>
        </div>
      )}
    </div>
  )
}
