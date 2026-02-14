'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BarChart3, Building2, FileText, Users, Lock, Settings,
  ChevronLeft, ChevronRight, Menu, X, TrendingUp
} from 'lucide-react'

interface NavItem {
  href: string
  icon: React.ReactNode
  label: string
}

const NAV_ITEMS: NavItem[] = [
  { href: '/analytics', icon: <BarChart3 className="w-5 h-5" />, label: 'Dashboard' },
  { href: '/inventory', icon: <Building2 className="w-5 h-5" />, label: 'Inventory' },
  { href: '/offers', icon: <FileText className="w-5 h-5" />, label: 'Offers' },
  { href: '/customers', icon: <Users className="w-5 h-5" />, label: 'Customers' },
]

function SidebarLink({ href, icon, label, collapsed }: NavItem & { collapsed: boolean }) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      className={`
        flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium
        transition-all duration-200
        ${isActive
          ? 'bg-[#D86DCB]/10 text-[#D86DCB] border border-[#D86DCB]/20'
          : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
        }
        ${collapsed ? 'justify-center px-3' : ''}
      `}
      title={collapsed ? label : undefined}
    >
      {icon}
      {!collapsed && <span>{label}</span>}
    </Link>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 bottom-0 z-50
          bg-[#0a0a0f] border-r border-white/10
          transition-all duration-300 flex flex-col
          ${collapsed ? 'w-16' : 'w-64'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="p-4 border-b border-white/10">
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-[#D86DCB] to-[#8B5CF6] rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0">
              A
            </div>
            {!collapsed && (
              <div>
                <h1 className="font-bold text-lg text-white">APEX</h1>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">One Development</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {NAV_ITEMS.map(item => (
            <SidebarLink key={item.href} {...item} collapsed={collapsed} />
          ))}
        </nav>

        {/* Collapse Toggle */}
        <div className="p-3 border-t border-white/10">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg
                       text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-sm"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>

        {/* User */}
        {!collapsed && (
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#D86DCB]/20 rounded-full flex items-center justify-center text-sm font-bold text-[#D86DCB]">
                JC
              </div>
              <div>
                <p className="text-sm font-medium text-white">Jason D Costa</p>
                <p className="text-xs text-gray-500">Sales Consultant</p>
              </div>
            </div>
          </div>
        )}

        {/* Mobile close */}
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-[#0a0a0f]/95 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-400" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#D86DCB] to-[#8B5CF6] rounded-lg flex items-center justify-center font-bold text-xs">
              A
            </div>
            <span className="font-bold text-white">APEX</span>
          </div>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </div>

      {/* Main Content */}
      <main
        className={`
          transition-all duration-300
          ${collapsed ? 'lg:ml-16' : 'lg:ml-64'}
          pt-14 lg:pt-0
        `}
      >
        {children}
      </main>
    </div>
  )
}
