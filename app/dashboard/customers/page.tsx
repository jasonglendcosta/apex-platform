import { Header } from '@/components/layout/Header'
import { Users, Mail, Phone, Star } from 'lucide-react'

// Mock data
const mockCustomers = [
  { id: '1', name: 'Khalid Al Maktoum', email: 'khalid@email.com', phone: '+971 50 888 8888', nationality: 'UAE', lead_score: 85, status: 'negotiating' },
  { id: '2', name: 'James Richardson', email: 'j.richardson@investcorp.com', phone: '+44 20 7123 4567', nationality: 'UK', lead_score: 72, status: 'qualified' },
  { id: '3', name: 'Chen Wei Lin', email: 'weilin.chen@chinamail.com', phone: '+86 138 0013 8000', nationality: 'China', lead_score: 68, status: 'viewing_scheduled' },
  { id: '4', name: 'Maria Santos', email: 'maria.santos@outlook.com', phone: '+971 55 777 7777', nationality: 'Philippines', lead_score: 55, status: 'contacted' },
  { id: '5', name: 'Dmitri Volkov', email: 'dmitri.volkov@yandex.ru', phone: '+7 495 123 4567', nationality: 'Russia', lead_score: 78, status: 'won' },
]

export default function CustomersPage() {
  return (
    <div className="min-h-screen">
      <Header 
        title="Customers" 
        description="Manage leads and customer relationships"
        action={{ label: 'Add Customer', href: '/dashboard/customers/new' }}
      />
      
      <div className="p-8">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Leads" value="24" change="+3 this week" />
          <StatCard title="Hot Leads" value="5" change="Score > 75" />
          <StatCard title="In Negotiation" value="8" change="Active deals" />
          <StatCard title="Converted" value="12" change="This quarter" />
        </div>

        {/* Customer List */}
        <div className="card p-0 overflow-hidden">
          <table className="w-full">
            <thead className="bg-apex-darker">
              <tr>
                <th className="table-header px-4 py-3">Customer</th>
                <th className="table-header px-4 py-3">Contact</th>
                <th className="table-header px-4 py-3">Nationality</th>
                <th className="table-header px-4 py-3">Lead Score</th>
                <th className="table-header px-4 py-3">Status</th>
                <th className="table-header px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-apex-border">
              {mockCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-apex-card/50 transition-colors">
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-apex-pink/20 rounded-full flex items-center justify-center">
                        <span className="text-apex-pink font-medium">
                          {customer.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </span>
                      </div>
                      <span className="font-medium text-white">{customer.name}</span>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-3 h-3 text-gray-500" />
                        <span>{customer.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-3 h-3 text-gray-500" />
                        <span>{customer.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">{customer.nationality}</td>
                  <td className="table-cell">
                    <LeadScoreBadge score={customer.lead_score} />
                  </td>
                  <td className="table-cell">
                    <StatusBadge status={customer.status} />
                  </td>
                  <td className="table-cell">
                    <button className="btn-ghost text-xs">View</button>
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

function StatCard({ title, value, change }: { title: string; value: string; change: string }) {
  return (
    <div className="card">
      <h3 className="text-gray-400 text-sm mb-1">{title}</h3>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{change}</p>
    </div>
  )
}

function LeadScoreBadge({ score }: { score: number }) {
  const color = score >= 75 ? 'text-green-400 bg-green-500/10' : 
                score >= 50 ? 'text-amber-400 bg-amber-500/10' : 
                'text-gray-400 bg-gray-500/10'
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${color}`}>
      <Star className="w-3 h-3" />
      {score}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    new: 'bg-blue-500/10 text-blue-400',
    contacted: 'bg-gray-500/10 text-gray-400',
    qualified: 'bg-purple-500/10 text-purple-400',
    viewing_scheduled: 'bg-amber-500/10 text-amber-400',
    negotiating: 'bg-orange-500/10 text-orange-400',
    won: 'bg-green-500/10 text-green-400',
    lost: 'bg-red-500/10 text-red-400',
  }
  
  const labels: Record<string, string> = {
    new: 'New',
    contacted: 'Contacted',
    qualified: 'Qualified',
    viewing_scheduled: 'Viewing',
    negotiating: 'Negotiating',
    won: 'Won',
    lost: 'Lost',
  }
  
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${styles[status] || styles.new}`}>
      {labels[status] || status}
    </span>
  )
}
