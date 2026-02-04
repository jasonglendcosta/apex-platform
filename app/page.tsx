import Link from 'next/link'
import { Building2, Zap, Shield, LineChart } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-apex-dark">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-apex-pink/10 via-transparent to-apex-purple/10" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-apex-pink/5 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-6 py-24 sm:py-32">
          <div className="text-center">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-apex-gradient rounded-xl flex items-center justify-center">
                  <Building2 className="w-7 h-7 text-white" />
                </div>
                <span className="text-3xl font-bold gradient-text">APEX</span>
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6">
              Property Sales
              <span className="block gradient-text">Intelligence Platform</span>
            </h1>
            
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
              Real-time inventory management, instant offer generation, and powerful analytics for modern property developers.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/login" className="btn-primary text-lg px-8 py-4">
                Sign In
              </Link>
              <Link href="/auth/login" className="btn-secondary text-lg px-8 py-4">
                Request Demo
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Zap className="w-6 h-6" />}
            title="Real-Time Inventory"
            description="See unit availability instantly. Reserve with one click. Real-time sync across all agents."
          />
          <FeatureCard
            icon={<Shield className="w-6 h-6" />}
            title="Smart Reservations"
            description="Lock units instantly with automatic expiry. No more double bookings or conflicts."
          />
          <FeatureCard
            icon={<LineChart className="w-6 h-6" />}
            title="Sales Analytics"
            description="Track velocity, forecast revenue, and identify top performers with live dashboards."
          />
        </div>
      </div>
      
      {/* Footer */}
      <footer className="border-t border-apex-border py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-500">
          <p>© 2024 APEX Platform. Built for One Development.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode
  title: string
  description: string 
}) {
  return (
    <div className="card group hover:border-apex-pink/30 transition-colors">
      <div className="w-12 h-12 bg-apex-pink/10 rounded-lg flex items-center justify-center text-apex-pink mb-4 group-hover:bg-apex-pink/20 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  )
}
