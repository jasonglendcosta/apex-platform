import { Header } from '@/components/layout/Header'
import { TrendingUp, DollarSign, Building, Target } from 'lucide-react'

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen">
      <Header 
        title="Analytics" 
        description="Sales performance and market insights"
      />
      
      <div className="p-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <KPICard
            title="Revenue This Month"
            value="AED 12.5M"
            change="+18%"
            icon={<DollarSign className="w-5 h-5" />}
            positive
          />
          <KPICard
            title="Units Sold"
            value="8"
            change="+3 vs last month"
            icon={<Building className="w-5 h-5" />}
            positive
          />
          <KPICard
            title="Avg. Days to Close"
            value="14"
            change="-2 days"
            icon={<Target className="w-5 h-5" />}
            positive
          />
          <KPICard
            title="Conversion Rate"
            value="24%"
            change="+5%"
            icon={<TrendingUp className="w-5 h-5" />}
            positive
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Sales Velocity Chart Placeholder */}
          <div className="card">
            <h3 className="text-lg font-semibold text-white mb-6">Sales Velocity</h3>
            <div className="h-64 flex items-center justify-center border border-dashed border-apex-border rounded-lg">
              <p className="text-gray-500">Chart will be rendered here</p>
            </div>
          </div>

          {/* Revenue Breakdown */}
          <div className="card">
            <h3 className="text-lg font-semibold text-white mb-6">Revenue by Unit Type</h3>
            <div className="space-y-4">
              <RevenueBar label="1 Bedroom" value={2800000} total={12500000} />
              <RevenueBar label="2 Bedroom" value={5200000} total={12500000} />
              <RevenueBar label="3 Bedroom" value={3100000} total={12500000} />
              <RevenueBar label="Penthouse" value={1400000} total={12500000} />
            </div>
          </div>
        </div>

        {/* Agent Leaderboard */}
        <div className="mt-8 card">
          <h3 className="text-lg font-semibold text-white mb-6">Agent Leaderboard</h3>
          <div className="overflow-hidden">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-header pb-4">Rank</th>
                  <th className="table-header pb-4">Agent</th>
                  <th className="table-header pb-4">Units Sold</th>
                  <th className="table-header pb-4">Revenue</th>
                  <th className="table-header pb-4">Commission</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-apex-border">
                <LeaderboardRow rank={1} name="Ahmed Al-Rashid" units={8} revenue={28500000} />
                <LeaderboardRow rank={2} name="Sarah Johnson" units={6} revenue={22100000} />
                <LeaderboardRow rank={3} name="Mohammed Hassan" units={5} revenue={18700000} />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

function KPICard({ 
  title, 
  value, 
  change, 
  icon,
  positive 
}: { 
  title: string
  value: string
  change: string
  icon: React.ReactNode
  positive: boolean
}) {
  return (
    <div className="card">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 bg-apex-pink/10 rounded-lg text-apex-pink">
          {icon}
        </div>
        <span className={`text-sm ${positive ? 'text-green-400' : 'text-red-400'}`}>
          {change}
        </span>
      </div>
      <h3 className="text-gray-400 text-sm mb-1">{title}</h3>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  )
}

function RevenueBar({ label, value, total }: { label: string; value: number; total: number }) {
  const percent = (value / total) * 100
  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span className="text-gray-400">{label}</span>
        <span className="text-white">AED {(value / 1000000).toFixed(1)}M</span>
      </div>
      <div className="h-2 bg-apex-darker rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-apex-pink to-apex-purple rounded-full"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}

function LeaderboardRow({ 
  rank, 
  name, 
  units, 
  revenue 
}: { 
  rank: number
  name: string
  units: number
  revenue: number
}) {
  const commission = revenue * 0.025 // 2.5% commission
  return (
    <tr>
      <td className="table-cell">
        <span className={`
          w-8 h-8 rounded-full flex items-center justify-center font-bold
          ${rank === 1 ? 'bg-yellow-500/20 text-yellow-400' : 
            rank === 2 ? 'bg-gray-400/20 text-gray-300' : 
            'bg-orange-500/20 text-orange-400'}
        `}>
          {rank}
        </span>
      </td>
      <td className="table-cell font-medium text-white">{name}</td>
      <td className="table-cell">{units} units</td>
      <td className="table-cell text-white">AED {(revenue / 1000000).toFixed(1)}M</td>
      <td className="table-cell text-green-400">AED {(commission / 1000).toFixed(0)}K</td>
    </tr>
  )
}
