import { Header } from '@/components/layout/Header'
import { 
  Building, 
  DollarSign, 
  TrendingUp, 
  Users,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="min-h-screen">
      <Header 
        title="Dashboard" 
        description="Overview of Laguna Residence performance"
      />
      
      <div className="p-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Units"
            value="50"
            subValue="15 floors"
            icon={<Building className="w-5 h-5" />}
            trend={{ value: 0, label: 'Total inventory' }}
          />
          <StatCard
            title="Available"
            value="32"
            subValue="64%"
            icon={<Building className="w-5 h-5" />}
            trend={{ value: -4, label: 'vs last month' }}
            trendDown
          />
          <StatCard
            title="Total Value"
            value="AED 142M"
            subValue="Current pricing"
            icon={<DollarSign className="w-5 h-5" />}
            trend={{ value: 8, label: 'vs launch' }}
          />
          <StatCard
            title="Active Leads"
            value="24"
            subValue="5 hot leads"
            icon={<Users className="w-5 h-5" />}
            trend={{ value: 12, label: 'this week' }}
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Inventory Status */}
          <div className="lg:col-span-2 card">
            <h3 className="text-lg font-semibold text-white mb-6">Inventory Status</h3>
            <div className="grid grid-cols-4 gap-4 mb-6">
              <StatusBlock label="Available" count={32} color="bg-green-500" />
              <StatusBlock label="Reserved" count={8} color="bg-amber-500" />
              <StatusBlock label="Booked" count={4} color="bg-blue-500" />
              <StatusBlock label="Sold" count={6} color="bg-gray-500" />
            </div>
            
            {/* Progress bar */}
            <div className="h-4 bg-apex-darker rounded-full overflow-hidden flex">
              <div className="bg-green-500 h-full" style={{ width: '64%' }} />
              <div className="bg-amber-500 h-full" style={{ width: '16%' }} />
              <div className="bg-blue-500 h-full" style={{ width: '8%' }} />
              <div className="bg-gray-500 h-full" style={{ width: '12%' }} />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h3 className="text-lg font-semibold text-white mb-6">Quick Actions</h3>
            <div className="space-y-3">
              <QuickAction 
                label="View Inventory" 
                href="/dashboard/inventory"
              />
              <QuickAction 
                label="Add Customer" 
                href="/dashboard/customers/new"
              />
              <QuickAction 
                label="Generate Offer" 
                href="/dashboard/offers/new"
              />
              <QuickAction 
                label="View Analytics" 
                href="/dashboard/analytics"
              />
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 card">
          <h3 className="text-lg font-semibold text-white mb-6">Recent Activity</h3>
          <div className="space-y-4">
            <ActivityItem
              action="Unit Reserved"
              details="LR-0702 reserved by Ahmed Al-Rashid"
              time="2 hours ago"
              type="reserved"
            />
            <ActivityItem
              action="Offer Sent"
              details="Offer #OF25-00012 sent to James Richardson"
              time="4 hours ago"
              type="offer"
            />
            <ActivityItem
              action="SPA Signed"
              details="LR-0802 SPA signed by Khalid Al Maktoum"
              time="Yesterday"
              type="spa"
            />
            <ActivityItem
              action="New Lead"
              details="Maria Santos added via website inquiry"
              time="Yesterday"
              type="lead"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ 
  title, 
  value, 
  subValue, 
  icon, 
  trend,
  trendDown = false
}: {
  title: string
  value: string
  subValue: string
  icon: React.ReactNode
  trend: { value: number; label: string }
  trendDown?: boolean
}) {
  return (
    <div className="card">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 bg-apex-pink/10 rounded-lg text-apex-pink">
          {icon}
        </div>
        {trend.value !== 0 && (
          <div className={`flex items-center gap-1 text-sm ${trendDown ? 'text-red-400' : 'text-green-400'}`}>
            {trendDown ? (
              <ArrowDownRight className="w-4 h-4" />
            ) : (
              <ArrowUpRight className="w-4 h-4" />
            )}
            {Math.abs(trend.value)}%
          </div>
        )}
      </div>
      <h3 className="text-gray-400 text-sm mb-1">{title}</h3>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{subValue}</p>
    </div>
  )
}

function StatusBlock({ 
  label, 
  count, 
  color 
}: { 
  label: string
  count: number
  color: string 
}) {
  return (
    <div className="text-center">
      <div className={`w-3 h-3 ${color} rounded-full mx-auto mb-2`} />
      <p className="text-2xl font-bold text-white">{count}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  )
}

function QuickAction({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      className="flex items-center justify-between p-3 bg-apex-darker rounded-lg hover:bg-apex-card border border-transparent hover:border-apex-pink/30 transition-all group"
    >
      <span className="text-gray-300 group-hover:text-white">{label}</span>
      <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-apex-pink" />
    </a>
  )
}

function ActivityItem({ 
  action, 
  details, 
  time, 
  type 
}: { 
  action: string
  details: string
  time: string
  type: 'reserved' | 'offer' | 'spa' | 'lead'
}) {
  const colors = {
    reserved: 'bg-amber-500',
    offer: 'bg-blue-500',
    spa: 'bg-purple-500',
    lead: 'bg-green-500',
  }
  
  return (
    <div className="flex items-start gap-4 p-4 bg-apex-darker rounded-lg">
      <div className={`w-2 h-2 ${colors[type]} rounded-full mt-2`} />
      <div className="flex-1 min-w-0">
        <p className="text-white font-medium">{action}</p>
        <p className="text-gray-400 text-sm truncate">{details}</p>
      </div>
      <span className="text-gray-500 text-xs whitespace-nowrap">{time}</span>
    </div>
  )
}
