'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Plus, Trash2, Edit, Star, TrendingUp } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  source: string
  lead_score: number
  created_at: string
}

interface CustomerListProps {
  onSelect?: (customer: Customer) => void
  onAdd?: () => void
}

export function CustomerList({ onSelect, onAdd }: CustomerListProps) {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [filtered, setFiltered] = useState<Customer[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'name' | 'score' | 'date'>('date')

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      const { data } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false })

      setCustomers(data || [])
      setLoading(false)
    } catch (err) {
      console.error('Failed to fetch customers:', err)
      setLoading(false)
    }
  }

  useEffect(() => {
    let result = customers.filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.includes(search)
    )

    if (sortBy === 'score') {
      result.sort((a, b) => b.lead_score - a.lead_score)
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name))
    }

    setFiltered(result)
  }, [search, customers, sortBy])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this customer?')) return

    try {
      await supabase.from('customers').delete().eq('id', id)
      setCustomers((prev) => prev.filter((c) => c.id !== id))
    } catch (err) {
      console.error('Failed to delete customer:', err)
    }
  }

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { bg: 'bg-cmd-green/10', text: 'text-cmd-green', label: 'Hot' }
    if (score >= 60) return { bg: 'bg-cmd-amber/10', text: 'text-cmd-amber', label: 'Warm' }
    return { bg: 'bg-gray-500/10', text: 'text-gray-400', label: 'Cold' }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Customers</h2>
        <button
          onClick={onAdd}
          className="px-4 py-2 bg-cmd-pink text-white rounded-lg hover:bg-cmd-pink/90 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Customer
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customers..."
            className="w-full pl-10 pr-4 py-2 bg-cmd-card border border-cmd-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cmd-pink"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'name' | 'score' | 'date')}
          className="px-4 py-2 bg-cmd-card border border-cmd-border rounded-lg text-white focus:outline-none focus:border-cmd-pink"
        >
          <option value="date">Recently Added</option>
          <option value="score">Lead Score</option>
          <option value="name">Name</option>
        </select>
      </div>

      {/* Customer List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-cmd-pink border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No customers found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((customer, index) => {
            const badge = getScoreBadge(customer.lead_score)
            return (
              <motion.div
                key={customer.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onSelect?.(customer)}
                className="glass-card p-4 cursor-pointer hover:border-cmd-pink/30 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white">{customer.name}</h3>
                      <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${badge.bg}`}>
                        <Star className={`w-3 h-3 ${badge.text}`} />
                        <span className={`text-xs font-medium ${badge.text}`}>
                          {customer.lead_score}%
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">{customer.email}</p>
                    <p className="text-sm text-gray-500">{customer.phone}</p>
                    <span className="text-xs text-gray-600 mt-1 inline-block">
                      Source: {customer.source || 'Unknown'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        // Edit handler would go here
                      }}
                      className="p-2 hover:bg-cmd-card rounded-lg transition-colors text-gray-400 hover:text-white"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(customer.id)
                      }}
                      className="p-2 hover:bg-cmd-red/10 rounded-lg transition-colors text-gray-400 hover:text-cmd-red"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
