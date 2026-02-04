import { Header } from '@/components/layout/Header'
import { CalendarCheck, Clock, AlertTriangle } from 'lucide-react'
import { formatCurrency, formatDateTime } from '@/lib/utils'

// Mock data
const mockReservations = [
  { id: '1', number: 'RS25-00008', unit: 'LR-0702', customer: 'Ahmed Client', agent: 'Ahmed Al-Rashid', price: 1800000, status: 'reserved', date: '2025-01-29T10:30:00', expires: '2025-01-31T10:30:00' },
  { id: '2', number: 'RS25-00007', unit: 'LR-0103', customer: 'Sarah Client', agent: 'Sarah Johnson', price: 1450000, status: 'reserved', date: '2025-01-28T14:00:00', expires: '2025-01-30T14:00:00' },
  { id: '3', number: 'RS25-00006', unit: 'LR-0502', customer: 'James Richardson', agent: 'Ahmed Al-Rashid', price: 1680000, status: 'booked', date: '2025-01-27T09:00:00', expires: null },
  { id: '4', number: 'RS25-00005', unit: 'LR-0802', customer: 'Khalid Al Maktoum', agent: 'Sarah Johnson', price: 1850000, status: 'spa_signed', date: '2025-01-25T11:00:00', expires: null },
  { id: '5', number: 'RS25-00004', unit: 'LR-1002', customer: 'Chen Wei Lin', agent: 'Mohammed Hassan', price: 2900000, status: 'booked', date: '2025-01-24T16:00:00', expires: null },
]

export default function ReservationsPage() {
  return (
    <div className="min-h-screen">
      <Header 
        title="Reservations" 
        description="Active reservations and bookings"
      />
      
      <div className="p-8">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <StatCard title="Active Reservations" value="8" subtitle="Expiring soon: 2" icon={<CalendarCheck className="w-5 h-5" />} />
          <StatCard title="Booked" value="4" subtitle="Pending SPA" icon={<Clock className="w-5 h-5" />} />
          <StatCard title="SPA Signed" value="3" subtitle="Pending execution" icon={<CalendarCheck className="w-5 h-5" />} />
          <StatCard title="Pipeline Value" value="AED 28.5M" subtitle="All active deals" icon={<CalendarCheck className="w-5 h-5" />} />
        </div>

        {/* Expiring Soon Alert */}
        <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center gap-4">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          <div>
            <p className="text-amber-400 font-medium">2 reservations expiring soon</p>
            <p className="text-gray-400 text-sm">LR-0702 and LR-0103 expire within 48 hours</p>
          </div>
          <button className="btn-secondary ml-auto">View All</button>
        </div>

        {/* Reservations Table */}
        <div className="card p-0 overflow-hidden">
          <table className="w-full">
            <thead className="bg-apex-darker">
              <tr>
                <th className="table-header px-4 py-3">Reservation #</th>
                <th className="table-header px-4 py-3">Unit</th>
                <th className="table-header px-4 py-3">Customer</th>
                <th className="table-header px-4 py-3">Agent</th>
                <th className="table-header px-4 py-3">Price</th>
                <th className="table-header px-4 py-3">Status</th>
                <th className="table-header px-4 py-3">Date</th>
                <th className="table-header px-4 py-3">Expires</th>
                <th className="table-header px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-apex-border">
              {mockReservations.map((res) => (
                <tr key={res.id} className="hover:bg-apex-card/50 transition-colors">
                  <td className="table-cell font-mono text-apex-pink">{res.number}</td>
                  <td className="table-cell font-medium text-white">{res.unit}</td>
                  <td className="table-cell">{res.customer}</td>
                  <td className="table-cell">{res.agent}</td>
                  <td className="table-cell text-white">{formatCurrency(res.price)}</td>
                  <td className="table-cell">
                    <ReservationStatusBadge status={res.status} />
                  </td>
                  <td className="table-cell text-sm">{formatDateTime(res.date)}</td>
                  <td className="table-cell">
                    {res.expires ? (
                      <ExpiryBadge expires={res.expires} />
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </td>
                  <td className="table-cell">
                    <button className="btn-ghost text-xs">Manage</button>
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

function StatCard({ 
  title, 
  value, 
  subtitle,
  icon 
}: { 
  title: string
  value: string
  subtitle: string
  icon: React.ReactNode
}) {
  return (
    <div className="card">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 bg-apex-pink/10 rounded-lg text-apex-pink">
          {icon}
        </div>
      </div>
      <h3 className="text-gray-400 text-sm mb-1">{title}</h3>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
    </div>
  )
}

function ReservationStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    reserved: 'bg-amber-500/10 text-amber-400',
    booked: 'bg-blue-500/10 text-blue-400',
    spa_pending: 'bg-purple-500/10 text-purple-400',
    spa_signed: 'bg-purple-500/10 text-purple-400',
    spa_executed: 'bg-indigo-500/10 text-indigo-400',
    registered: 'bg-green-500/10 text-green-400',
    cancelled: 'bg-red-500/10 text-red-400',
  }
  
  const labels: Record<string, string> = {
    reserved: 'Reserved',
    booked: 'Booked',
    spa_pending: 'SPA Pending',
    spa_signed: 'SPA Signed',
    spa_executed: 'SPA Executed',
    registered: 'Registered',
    cancelled: 'Cancelled',
  }
  
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {labels[status] || status}
    </span>
  )
}

function ExpiryBadge({ expires }: { expires: string }) {
  const expiryDate = new Date(expires)
  const now = new Date()
  const hoursLeft = Math.floor((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60))
  
  const isUrgent = hoursLeft < 24
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
      isUrgent ? 'bg-red-500/10 text-red-400' : 'bg-gray-500/10 text-gray-400'
    }`}>
      <Clock className="w-3 h-3" />
      {hoursLeft > 0 ? `${hoursLeft}h left` : 'Expired'}
    </span>
  )
}
