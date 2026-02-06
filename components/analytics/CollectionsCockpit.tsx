'use client'

import { useState } from 'react'
import { AlertTriangle, Clock, CheckCircle, TrendingDown, DollarSign, Calendar, ChevronRight } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface CollectionBucket {
  label: string
  count: number
  amount: number
  color: string
  severity: 'good' | 'warning' | 'danger' | 'critical'
}

interface CollectionsCockpitProps {
  data?: {
    buckets: CollectionBucket[]
    totalDue: number
    totalOverdue: number
    collectionRate: number
  }
}

const defaultData = {
  buckets: [
    { label: 'Current', count: 24, amount: 8500000, color: '#10B981', severity: 'good' as const },
    { label: '1-30 Days', count: 12, amount: 4200000, color: '#F59E0B', severity: 'warning' as const },
    { label: '31-60 Days', count: 8, amount: 2800000, color: '#F97316', severity: 'warning' as const },
    { label: '61-90 Days', count: 5, amount: 1750000, color: '#EF4444', severity: 'danger' as const },
    { label: '90+ Days', count: 3, amount: 950000, color: '#DC2626', severity: 'critical' as const },
  ],
  totalDue: 8500000,
  totalOverdue: 9700000,
  collectionRate: 78.5,
}

const overduePayments = [
  { customer: 'Ahmed Al-Mansoor', unit: 'LR-0501', amount: 350000, daysOverdue: 45, project: 'Laguna Residence' },
  { customer: 'Sarah Mitchell', unit: 'DO-1203', amount: 520000, daysOverdue: 32, project: 'DO Dubai' },
  { customer: 'Mohammed Al-Qasimi', unit: 'LR-0802', amount: 280000, daysOverdue: 67, project: 'Laguna Residence' },
  { customer: 'James Wilson', unit: 'DO-0405', amount: 175000, daysOverdue: 95, project: 'DO Dubai' },
  { customer: 'Fatima Hassan', unit: 'LR-PH01', amount: 850000, daysOverdue: 15, project: 'Laguna Residence' },
]

export function CollectionsCockpit({ data = defaultData }: CollectionsCockpitProps) {
  const [selectedBucket, setSelectedBucket] = useState<string | null>(null)

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'good':
        return <CheckCircle className="w-4 h-4" />
      case 'warning':
        return <Clock className="w-4 h-4" />
      case 'danger':
        return <AlertTriangle className="w-4 h-4" />
      case 'critical':
        return <TrendingDown className="w-4 h-4" />
      default:
        return null
    }
  }

  const chartData = data.buckets.map(bucket => ({
    name: bucket.label,
    amount: bucket.amount / 1000000,
    count: bucket.count,
    color: bucket.color,
  }))

  return (
    <div className="glass-card rounded-2xl p-6 border border-apex-border/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-apex-warning/20 to-apex-error/20 rounded-xl">
            <DollarSign className="w-5 h-5 text-apex-warning" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Collections Cockpit</h3>
            <p className="text-sm text-gray-400">Payment aging analysis</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-apex-card border border-apex-border">
          <div className={`w-2 h-2 rounded-full ${data.collectionRate >= 80 ? 'bg-green-400' : data.collectionRate >= 60 ? 'bg-amber-400' : 'bg-red-400'} animate-pulse`} />
          <span className="text-sm font-medium text-white">{data.collectionRate}% Collection Rate</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-apex-darker/50 rounded-xl p-4 border border-apex-border/30">
          <p className="text-xs text-gray-400 mb-1">Total Due</p>
          <p className="text-xl font-bold text-white">AED {(data.totalDue / 1000000).toFixed(1)}M</p>
          <p className="text-xs text-green-400 flex items-center gap-1 mt-1">
            <CheckCircle className="w-3 h-3" /> On Schedule
          </p>
        </div>
        <div className="bg-apex-darker/50 rounded-xl p-4 border border-red-500/30">
          <p className="text-xs text-gray-400 mb-1">Total Overdue</p>
          <p className="text-xl font-bold text-red-400">AED {(data.totalOverdue / 1000000).toFixed(1)}M</p>
          <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
            <AlertTriangle className="w-3 h-3" /> 52 payments
          </p>
        </div>
        <div className="bg-apex-darker/50 rounded-xl p-4 border border-apex-border/30">
          <p className="text-xs text-gray-400 mb-1">Due This Week</p>
          <p className="text-xl font-bold text-apex-pink">AED 2.4M</p>
          <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
            <Calendar className="w-3 h-3" /> 8 milestones
          </p>
        </div>
        <div className="bg-apex-darker/50 rounded-xl p-4 border border-apex-border/30">
          <p className="text-xs text-gray-400 mb-1">Avg Days Overdue</p>
          <p className="text-xl font-bold text-amber-400">42</p>
          <p className="text-xs text-amber-400 flex items-center gap-1 mt-1">
            <Clock className="w-3 h-3" /> ↑ 5 vs last month
          </p>
        </div>
      </div>

      {/* Aging Buckets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="bg-apex-darker/30 rounded-xl p-4">
          <p className="text-sm font-medium text-gray-400 mb-4">Aging Distribution</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2a" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#6B7280" 
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#6B7280" 
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${v}M`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#12121a',
                  border: '1px solid #1e1e2a',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                }}
                formatter={(value: number) => [`AED ${value.toFixed(1)}M`, 'Amount']}
                labelStyle={{ color: '#fff', fontWeight: 'bold', marginBottom: 4 }}
              />
              <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Bucket List */}
        <div className="space-y-2">
          {data.buckets.map((bucket, index) => (
            <button
              key={index}
              onClick={() => setSelectedBucket(selectedBucket === bucket.label ? null : bucket.label)}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${
                selectedBucket === bucket.label 
                  ? 'bg-apex-card border-apex-pink/50' 
                  : 'bg-apex-darker/30 hover:bg-apex-darker/50 border-transparent'
              } border`}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: bucket.color }}
                />
                <span className="text-sm font-medium text-white">{bucket.label}</span>
                <span 
                  className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
                    bucket.severity === 'good' ? 'bg-green-500/20 text-green-400' :
                    bucket.severity === 'warning' ? 'bg-amber-500/20 text-amber-400' :
                    bucket.severity === 'danger' ? 'bg-red-500/20 text-red-400' :
                    'bg-red-600/20 text-red-500'
                  }`}
                >
                  {getSeverityIcon(bucket.severity)}
                  {bucket.count}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-white">
                  AED {(bucket.amount / 1000000).toFixed(1)}M
                </span>
                <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${
                  selectedBucket === bucket.label ? 'rotate-90' : ''
                }`} />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Critical Overdue List */}
      <div className="mt-6 pt-6 border-t border-apex-border/50">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            Critical Overdue Payments
          </h4>
          <button className="text-xs text-apex-pink hover:text-apex-pink-light transition-colors">
            View All →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-apex-border/30">
                <th className="pb-2 text-xs font-medium text-gray-400">Customer</th>
                <th className="pb-2 text-xs font-medium text-gray-400">Unit</th>
                <th className="pb-2 text-xs font-medium text-gray-400">Project</th>
                <th className="pb-2 text-xs font-medium text-gray-400 text-right">Amount</th>
                <th className="pb-2 text-xs font-medium text-gray-400 text-right">Days Overdue</th>
              </tr>
            </thead>
            <tbody>
              {overduePayments.slice(0, 5).map((payment, index) => (
                <tr key={index} className="border-b border-apex-border/20 hover:bg-apex-darker/30 transition-colors">
                  <td className="py-3 text-sm text-white font-medium">{payment.customer}</td>
                  <td className="py-3 text-sm text-gray-400">{payment.unit}</td>
                  <td className="py-3 text-sm text-gray-400">{payment.project}</td>
                  <td className="py-3 text-sm text-white font-medium text-right">
                    AED {(payment.amount / 1000).toFixed(0)}K
                  </td>
                  <td className="py-3 text-right">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      payment.daysOverdue > 60 ? 'bg-red-500/20 text-red-400' :
                      payment.daysOverdue > 30 ? 'bg-amber-500/20 text-amber-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {payment.daysOverdue} days
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
