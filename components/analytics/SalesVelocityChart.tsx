'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const data = [
  { week: 'W1', units: 2, revenue: 7 },
  { week: 'W2', units: 3, revenue: 10.5 },
  { week: 'W3', units: 1, revenue: 3.5 },
  { week: 'W4', units: 2, revenue: 6.5 },
  { week: 'W5', units: 4, revenue: 14 },
  { week: 'W6', units: 3, revenue: 10.5 },
  { week: 'W7', units: 5, revenue: 18 },
  { week: 'W8', units: 6, revenue: 21 },
  { week: 'W9', units: 8, revenue: 28.5 },
  { week: 'W10', units: 6, revenue: 22 },
  { week: 'W11', units: 7, revenue: 25 },
  { week: 'W12', units: 8, revenue: 28.5 },
]

export function SalesVelocityChart() {
  return (
    <div className="card">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white">Sales Velocity</h3>
        <p className="text-sm text-gray-400">Units sold and revenue per week (last 12 weeks)</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="week" 
            stroke="#9CA3AF"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#9CA3AF"
            style={{ fontSize: '12px' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #4B5563',
              borderRadius: '8px'
            }}
            labelStyle={{ color: '#fff' }}
            formatter={(value) => {
              if (typeof value === 'number' && value > 100) {
                return `AED ${value.toFixed(1)}M`
              }
              return value
            }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            formatter={(value) => {
              if (value === 'revenue') return 'Revenue (AED M)'
              if (value === 'units') return 'Units Sold'
              return value
            }}
          />
          <Line 
            type="monotone" 
            dataKey="units" 
            stroke="#8B5CF6" 
            strokeWidth={2}
            dot={{ fill: '#8B5CF6', r: 4 }}
            activeDot={{ r: 6 }}
            yAxisId="left"
          />
          <Line 
            type="monotone" 
            dataKey="revenue" 
            stroke="#D86DCB" 
            strokeWidth={2}
            dot={{ fill: '#D86DCB', r: 4 }}
            activeDot={{ r: 6 }}
            yAxisId="right"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
