'use client'

import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer, Sector } from 'recharts'
import { useState } from 'react'
import { Building2, TrendingUp } from 'lucide-react'

const data = [
  { name: 'Available', value: 112, color: '#10B981' },
  { name: 'Reserved', value: 28, color: '#F59E0B' },
  { name: 'Booked', value: 18, color: '#3B82F6' },
  { name: 'SPA Signed', value: 22, color: '#8B5CF6' },
  { name: 'Registered', value: 43, color: '#0EA5E9' },
  { name: 'Blocked', value: 15, color: '#EF4444' },
  { name: 'Sold', value: 12, color: '#6B7280' },
]

const total = data.reduce((acc, item) => acc + item.value, 0)

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        style={{ filter: 'drop-shadow(0 0 8px rgba(216, 109, 203, 0.4))' }}
      />
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 4}
        outerRadius={innerRadius - 2}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  )
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0]
    return (
      <div className="bg-apex-card border border-apex-border rounded-xl p-4 shadow-xl">
        <div className="flex items-center gap-2 mb-2">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: data.payload.color }}
          />
          <span className="text-white font-semibold">{data.name}</span>
        </div>
        <div className="space-y-1 text-sm">
          <p className="text-gray-400">
            Units: <span className="text-white font-medium">{data.value}</span>
          </p>
          <p className="text-gray-400">
            Share: <span className="text-white font-medium">{((data.value / total) * 100).toFixed(1)}%</span>
          </p>
        </div>
      </div>
    )
  }
  return null
}

export function InventoryStatusChart() {
  const [activeIndex, setActiveIndex] = useState(0)

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index)
  }

  const availablePercent = ((data[0].value / total) * 100).toFixed(1)
  const soldPercent = (((total - data[0].value - data.find(d => d.name === 'Blocked')!.value) / total) * 100).toFixed(1)

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl">
            <Building2 className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Inventory Status</h3>
            <p className="text-sm text-gray-400">{total} total units across all projects</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-apex-darker/50 rounded-full border border-apex-border">
          <TrendingUp className="w-4 h-4 text-green-400" />
          <span className="text-sm text-gray-300">{availablePercent}% available</span>
        </div>
      </div>

      {/* Chart */}
      <div className="flex flex-col lg:flex-row items-center gap-6">
        <div className="w-full lg:w-1/2">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                onMouseEnter={onPieEnter}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    className="cursor-pointer transition-all duration-200"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center Label */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ marginTop: '-280px' }}>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">{total}</p>
              <p className="text-xs text-gray-400">Total Units</p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="w-full lg:w-1/2 space-y-2">
          {data.map((item, index) => (
            <button
              key={item.name}
              onClick={() => setActiveIndex(index)}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${
                activeIndex === index 
                  ? 'bg-apex-darker border-apex-pink/30' 
                  : 'bg-apex-darker/30 hover:bg-apex-darker/50 border-transparent'
              } border`}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-white">{item.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-white">{item.value}</span>
                <span className="text-xs text-gray-400">
                  ({((item.value / total) * 100).toFixed(0)}%)
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Mini Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-apex-border/30">
        <div className="text-center">
          <p className="text-xs text-gray-400 mb-1">In Pipeline</p>
          <p className="text-lg font-bold text-apex-pink">{28 + 18 + 22} units</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-400 mb-1">Sold/Closed</p>
          <p className="text-lg font-bold text-green-400">{43 + 12} units</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-400 mb-1">Sellout %</p>
          <p className="text-lg font-bold text-white">{soldPercent}%</p>
        </div>
      </div>
    </div>
  )
}
