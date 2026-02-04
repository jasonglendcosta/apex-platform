'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Building2,
  LayoutDashboard,
  Building,
  Users,
  FileText,
  CalendarCheck,
  BarChart3,
  Settings,
  LogOut,
  ChevronDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Inventory', href: '/dashboard/inventory', icon: Building },
  { name: 'Customers', href: '/dashboard/customers', icon: Users },
  { name: 'Offers', href: '/dashboard/offers', icon: FileText },
  { name: 'Reservations', href: '/dashboard/reservations', icon: CalendarCheck },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return (
    <div className="flex flex-col h-full w-64 bg-apex-darker border-r border-apex-border">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-apex-border">
        <div className="w-10 h-10 bg-apex-gradient rounded-lg flex items-center justify-center">
          <Building2 className="w-6 h-6 text-white" />
        </div>
        <div>
          <span className="text-xl font-bold gradient-text">APEX</span>
          <p className="text-xs text-gray-500">Property Intelligence</p>
        </div>
      </div>

      {/* Project Selector */}
      <div className="px-4 py-4 border-b border-apex-border">
        <button className="w-full flex items-center justify-between px-4 py-3 bg-apex-card rounded-lg border border-apex-border hover:border-apex-pink/50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-apex-pink/10 rounded flex items-center justify-center">
              <Building className="w-4 h-4 text-apex-pink" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-white">Laguna Residence</p>
              <p className="text-xs text-gray-500">Al Reem Island</p>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/dashboard' && pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                isActive ? 'sidebar-link-active' : 'sidebar-link'
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-apex-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-apex-pink/20 rounded-full flex items-center justify-center">
            <span className="text-apex-pink font-medium">JD</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Jason D Costa</p>
            <p className="text-xs text-gray-500 truncate">Admin</p>
          </div>
        </div>
        
        <button 
          onClick={handleSignOut}
          className="w-full flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Sign out</span>
        </button>
      </div>
    </div>
  )
}
