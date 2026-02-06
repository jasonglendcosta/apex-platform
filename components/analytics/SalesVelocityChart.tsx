'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart, ComposedChart, Bar } from 'recharts'
import { TrendingUp, Calendar, ArrowUpRight } from 'lucide-react'

const data = [
  { week: 'W1', units: 2, revenue: 7, target: 3 },
  { week: 'W2', units: 3, revenue: 10.5, target: 3 },
  { week: 'W3', units: 1, revenue: 3.5, target: 3 },
  { week: 'W4', units: 2, revenue: 6.5, target: 3 },
  { week: 'W5', units: 4, revenue: 14, target: 4 },
  { week: 'W6', units: 3, revenue: 10.5, target: 4 },
  { week: 'W7', units: 5, revenue: 18, target: 4 },
  { week: 'W8', units: 6, revenue: 21, target: 5 },
  { week: 'W9', units: 8, revenue: 28.5, target: 5 },
  { week: 'W10', units: 6, revenue: 22, target: 5 },
  { week: 'W11', units: 7, revenue: 25, target: 6 },
  { week: 'W12', units: 8, revenue: 28.5, target: 6 },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-apex-card border border-apex-border rounded-xl p-4 shadow-xl">
        <p className="text-white font-semibold mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-400">{entry.name}:</span>
            <span className="text-white font-medium">
              {entry.name === 'Revenue' ? `AED ${entry.value}M` : `${entry.value} units`}
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export function SalesVelocityChart() {
  const totalUnits = data.reduce((acc, curr) => acc + curr.units, 0)
  const totalRevenue = data.reduce((acc, curr) => acc + curr.revenue, 0)
  const avgUnits = (totalUnits / data.length).toFixed(1)

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-apex-purple/20 to-apex-pink/20 rounded-xl">
            <TrendingUp className="w-5 h-5 text-apex-purple" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Sales Velocity</h3>
            <p className="text-sm text-gray-400">Units sold and revenue per week (last 12 weeks)</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-gray-400">Avg Weekly</p>
            <p className="text-lg font-bold text-apex-pink">{avgUnits} units</p>
          </div>
          <div className="flex items-center gap-1 px-3 py-1.5 bg-green-500/10 rounded-full">
            <ArrowUpRight className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium text-green-400">+15%</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={320}>
        <ComposedChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#D86DCB" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#D86DCB" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorUnits" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.4}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2a" vertical={false} />
          <XAxis 
            dataKey="week" 
            stroke="#6B7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            yAxisId="left"
            stroke="#6B7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${v}`}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            stroke="#6B7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${v}M`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            formatter={(value) => <span className="text-gray-400 text-sm">{value}</span>}
          />
          <Area
            yAxisId="right"
            type="monotone"
            dataKey="revenue"
            name="Revenue"
            stroke="#D86DCB"
            strokeWidth={2}
            fill="url(#colorRevenue)"
          />
          <Bar
            yAxisId="left"
            dataKey="units"
            name="Units Sold"
            fill="url(#colorUnits)"
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="target"
            name="Target"
            stroke="#374151"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Mini Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-apex-border/30">
        <div className="text-center">
          <p className="text-xs text-gray-400 mb-1">Total Units</p>
          <p className="text-lg font-bold text-white">{totalUnits}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-400 mb-1">Total Revenue</p>
          <p className="text-lg font-bold text-apex-pink">AED {totalRevenue.toFixed(1)}M</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-400 mb-1">Best Week</p>
          <p className="text-lg font-bold text-green-400">W9 (8 units)</p>
        </div>
      </div>
    </div>
  )
}
