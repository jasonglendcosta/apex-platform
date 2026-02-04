'use client'

import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'Available', value: 32 },
  { name: 'Reserved', value: 8 },
  { name: 'Booked', value: 4 },
  { name: 'Sold', value: 6 },
]

const COLORS = ['#10B981', '#F59E0B', '#3B82F6', '#6B7280']

export function InventoryStatusChart() {
  return (
    <div className="card">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white">Inventory Status</h3>
        <p className="text-sm text-gray-400">50 total units</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => [`${value} units`, 'Count']}
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #4B5563',
              borderRadius: '8px'
            }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            wrapperStyle={{ paddingTop: '20px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
