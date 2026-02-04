import { Header } from '@/components/layout/Header'
import { FileText, Clock, CheckCircle, XCircle, Eye } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

// Mock data
const mockOffers = [
  { id: '1', offer_number: 'OF25-00012', unit: 'LR-0501', customer: 'James Richardson', price: 1650000, status: 'sent', created_at: '2025-01-28', valid_until: '2025-02-04' },
  { id: '2', offer_number: 'OF25-00011', unit: 'LR-PH01', customer: 'Khalid Al Maktoum', price: 8500000, status: 'viewed', created_at: '2025-01-27', valid_until: '2025-02-03' },
  { id: '3', offer_number: 'OF25-00010', unit: 'LR-0802', customer: 'Chen Wei Lin', price: 1850000, status: 'accepted', created_at: '2025-01-25', valid_until: '2025-02-01' },
  { id: '4', offer_number: 'OF25-00009', unit: 'LR-0703', customer: 'Maria Santos', price: 2480000, status: 'expired', created_at: '2025-01-20', valid_until: '2025-01-27' },
  { id: '5', offer_number: 'OF25-00008', unit: 'LR-1001', customer: 'Dmitri Volkov', price: 2850000, status: 'rejected', created_at: '2025-01-18', valid_until: '2025-01-25' },
]

export default function OffersPage() {
  return (
    <div className="min-h-screen">
      <Header 
        title="Offers" 
        description="Generated offers and proposals"
        action={{ label: 'New Offer', href: '/dashboard/offers/new' }}
      />
      
      <div className="p-8">
        {/* Stats */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          <StatCard title="Total Offers" value="47" icon={<FileText className="w-4 h-4" />} />
          <StatCard title="Pending" value="12" icon={<Clock className="w-4 h-4" />} color="text-amber-400" />
          <StatCard title="Viewed" value="8" icon={<Eye className="w-4 h-4" />} color="text-blue-400" />
          <StatCard title="Accepted" value="18" icon={<CheckCircle className="w-4 h-4" />} color="text-green-400" />
          <StatCard title="Expired" value="9" icon={<XCircle className="w-4 h-4" />} color="text-gray-400" />
        </div>

        {/* Offers Table */}
        <div className="card p-0 overflow-hidden">
          <table className="w-full">
            <thead className="bg-apex-darker">
              <tr>
                <th className="table-header px-4 py-3">Offer #</th>
                <th className="table-header px-4 py-3">Unit</th>
                <th className="table-header px-4 py-3">Customer</th>
                <th className="table-header px-4 py-3">Price</th>
                <th className="table-header px-4 py-3">Status</th>
                <th className="table-header px-4 py-3">Created</th>
                <th className="table-header px-4 py-3">Valid Until</th>
                <th className="table-header px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-apex-border">
              {mockOffers.map((offer) => (
                <tr key={offer.id} className="hover:bg-apex-card/50 transition-colors">
                  <td className="table-cell font-mono text-apex-pink">{offer.offer_number}</td>
                  <td className="table-cell font-medium text-white">{offer.unit}</td>
                  <td className="table-cell">{offer.customer}</td>
                  <td className="table-cell text-white">{formatCurrency(offer.price)}</td>
                  <td className="table-cell">
                    <OfferStatusBadge status={offer.status} />
                  </td>
                  <td className="table-cell">{formatDate(offer.created_at)}</td>
                  <td className="table-cell">{formatDate(offer.valid_until)}</td>
                  <td className="table-cell">
                    <div className="flex gap-2">
                      <button className="btn-ghost text-xs">View</button>
                      <button className="btn-ghost text-xs">PDF</button>
                    </div>
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
  icon, 
  color = 'text-apex-pink' 
}: { 
  title: string
  value: string
  icon: React.ReactNode
  color?: string
}) {
  return (
    <div className="card flex items-center gap-4">
      <div className={`p-2 bg-apex-darker rounded-lg ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-gray-400 text-xs">{title}</p>
        <p className="text-xl font-bold text-white">{value}</p>
      </div>
    </div>
  )
}

function OfferStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    draft: 'bg-gray-500/10 text-gray-400',
    sent: 'bg-amber-500/10 text-amber-400',
    viewed: 'bg-blue-500/10 text-blue-400',
    accepted: 'bg-green-500/10 text-green-400',
    rejected: 'bg-red-500/10 text-red-400',
    expired: 'bg-gray-500/10 text-gray-500',
  }
  
  const icons: Record<string, React.ReactNode> = {
    sent: <Clock className="w-3 h-3" />,
    viewed: <Eye className="w-3 h-3" />,
    accepted: <CheckCircle className="w-3 h-3" />,
    rejected: <XCircle className="w-3 h-3" />,
  }
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize ${styles[status]}`}>
      {icons[status]}
      {status}
    </span>
  )
}
