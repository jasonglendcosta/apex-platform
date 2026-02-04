'use client'

import { Bell, Search, Plus } from 'lucide-react'
import Link from 'next/link'

interface HeaderProps {
  title: string
  description?: string
  action?: {
    label: string
    href: string
  }
}

export function Header({ title, description, action }: HeaderProps) {
  return (
    <header className="bg-apex-darker border-b border-apex-border px-8 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          {description && (
            <p className="text-gray-400 mt-1">{description}</p>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              className="w-64 bg-apex-card border border-apex-border rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder:text-gray-500 focus:border-apex-pink focus:ring-1 focus:ring-apex-pink outline-none"
            />
          </div>
          
          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-white hover:bg-apex-card rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-apex-pink rounded-full" />
          </button>
          
          {/* Action button */}
          {action && (
            <Link href={action.href} className="btn-primary">
              <Plus className="w-4 h-4" />
              {action.label}
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
