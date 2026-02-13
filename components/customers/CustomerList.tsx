'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Search, Plus, Trash2, Edit, Star, TrendingUp, ChevronDown,
  Users, Phone, Mail, Calendar, ArrowUpDown, Filter
} from 'lucide-react'
import { Customer, LeadSource } from '@/types'
import { CustomerListSkeleton } from '@/components/ui/SkeletonLoader'
import { EmptyState } from '@/components/ui/EmptyState'
import { FilterChip, FilterChipGroup } from '@/components/ui/FilterChip'

interface CustomerListProps {
  customers: Customer[]
  loading: boolean
  onSelect?: (customer: Customer) => void
  onAdd?: () => void
  onEdit?: (customer: Customer) => void
  onDelete?: (customerId: string) => void
  searchValue: string
  onSearchChange: (value: string) => void
}

type SortField = 'name' | 'lead_score' | 'created_at' | 'source'
type SortDir = 'asc' | 'desc'

const SOURCE_LABELS: Record<string, string> = {
  walk_in: 'Walk-in',
  website: 'Website',
  referral: 'Referral',
  broker: 'Broker',
  social_media: 'Social Media',
  exhibition: 'Exhibition',
  cold_call: 'Cold Call',
  other: 'Other',
}

const SCORE_FILTERS = [
  { label: 'Hot (75+)', min: 75, max: 100 },
  { label: 'Warm (50-74)', min: 50, max: 74 },
  { label: 'Cold (<50)', min: 0, max: 49 },
]

function getScoreBadge(score: number) {
  if (score >= 75) return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', label: 'Hot' }
  if (score >= 50) return { bg: 'bg-amber-500/10', text: 'text-amber-400', label: 'Warm' }
  return { bg: 'bg-gray-500/10', text: 'text-gray-400', label: 'Cold' }
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function CustomerList({
  customers,
  loading,
  onSelect,
  onAdd,
  onEdit,
  onDelete,
  searchValue,
  onSearchChange,
}: CustomerListProps) {
  const [sortField, setSortField] = useState<SortField>('created_at')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [sourceFilter, setSourceFilter] = useState<LeadSource | null>(null)
  const [scoreFilter, setScoreFilter] = useState<{ min: number; max: number } | null>(null)

  // Sort + filter
  const displayed = useMemo(() => {
    let result = [...customers]

    // Source filter
    if (sourceFilter) {
      result = result.filter(c => c.source === sourceFilter)
    }

    // Score filter
    if (scoreFilter) {
      result = result.filter(c => c.lead_score >= scoreFilter.min && c.lead_score <= scoreFilter.max)
    }

    // Sort
    result.sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1
      switch (sortField) {
        case 'name':
          return dir * a.name.localeCompare(b.name)
        case 'lead_score':
          return dir * (a.lead_score - b.lead_score)
        case 'source':
          return dir * (a.source || '').localeCompare(b.source || '')
        case 'created_at':
        default:
          return dir * (new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      }
    })

    return result
  }, [customers, sortField, sortDir, sourceFilter, scoreFilter])

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDir('desc')
    }
  }

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Delete ${name}? This action cannot be undone.`)) return
    onDelete?.(id)
  }

  const activeFilterCount =
    (sourceFilter ? 1 : 0) + (scoreFilter ? 1 : 0)

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white">Customers</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            {customers.length} total • {displayed.length} showing
          </p>
        </div>
        <button
          onClick={onAdd}
          className="px-4 py-2.5 bg-[#D86DCB] text-white rounded-xl hover:bg-[#D86DCB]/90
                     transition-colors flex items-center gap-2 text-sm font-semibold
                     shadow-lg shadow-[#D86DCB]/25"
        >
          <Plus className="w-4 h-4" />
          Add Customer
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name, email, or phone..."
          className="w-full pl-10 pr-4 py-2.5 bg-[#1a1a24] border border-white/10 rounded-xl
                     text-sm text-white placeholder-gray-500
                     focus:outline-none focus:border-[#D86DCB]/50 transition-colors"
        />
      </div>

      {/* Filter chips */}
      <FilterChipGroup>
        <span className="text-xs text-gray-500 mr-1">
          <Filter className="w-3 h-3 inline" /> Filters:
        </span>

        {/* Source filters */}
        {(['walk_in', 'website', 'referral', 'broker', 'social_media'] as LeadSource[]).map(src => (
          <FilterChip
            key={src}
            label={SOURCE_LABELS[src]}
            active={sourceFilter === src}
            onClick={() => setSourceFilter(sourceFilter === src ? null : src)}
            onRemove={() => setSourceFilter(null)}
          />
        ))}

        <span className="w-px h-5 bg-white/10" />

        {/* Score filters */}
        {SCORE_FILTERS.map(sf => (
          <FilterChip
            key={sf.label}
            label={sf.label}
            active={scoreFilter?.min === sf.min && scoreFilter?.max === sf.max}
            onClick={() =>
              setScoreFilter(
                scoreFilter?.min === sf.min && scoreFilter?.max === sf.max
                  ? null
                  : { min: sf.min, max: sf.max }
              )
            }
            onRemove={() => setScoreFilter(null)}
          />
        ))}

        {activeFilterCount > 0 && (
          <button
            onClick={() => { setSourceFilter(null); setScoreFilter(null) }}
            className="text-xs text-gray-400 hover:text-white transition-colors ml-1"
          >
            Clear all
          </button>
        )}
      </FilterChipGroup>

      {/* Table / List */}
      {loading ? (
        <CustomerListSkeleton count={6} />
      ) : displayed.length === 0 ? (
        <EmptyState
          type={searchValue || activeFilterCount > 0 ? 'search' : 'customers'}
          actionLabel={!searchValue && activeFilterCount === 0 ? 'Add Customer' : undefined}
          onAction={!searchValue && activeFilterCount === 0 ? onAdd : undefined}
        />
      ) : (
        <div className="bg-[#1a1a24] rounded-xl border border-white/10 overflow-hidden">
          {/* Table header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 border-b border-white/10 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            <button
              onClick={() => toggleSort('name')}
              className="col-span-3 flex items-center gap-1 hover:text-white transition-colors text-left"
            >
              Name
              <ArrowUpDown className="w-3 h-3" />
            </button>
            <div className="col-span-2">Contact</div>
            <button
              onClick={() => toggleSort('lead_score')}
              className="col-span-2 flex items-center gap-1 hover:text-white transition-colors text-left"
            >
              Lead Score
              <ArrowUpDown className="w-3 h-3" />
            </button>
            <button
              onClick={() => toggleSort('source')}
              className="col-span-2 flex items-center gap-1 hover:text-white transition-colors text-left"
            >
              Source
              <ArrowUpDown className="w-3 h-3" />
            </button>
            <button
              onClick={() => toggleSort('created_at')}
              className="col-span-2 flex items-center gap-1 hover:text-white transition-colors text-left"
            >
              Added
              <ArrowUpDown className="w-3 h-3" />
            </button>
            <div className="col-span-1"></div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-white/5">
            {displayed.map((customer, idx) => {
              const badge = getScoreBadge(customer.lead_score)
              return (
                <motion.div
                  key={customer.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: Math.min(idx * 0.03, 0.3) }}
                  onClick={() => onSelect?.(customer)}
                  className="px-5 py-3 cursor-pointer hover:bg-white/[0.02] transition-colors
                             grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center"
                >
                  {/* Name */}
                  <div className="col-span-3 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#D86DCB]/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold text-[#D86DCB]">
                        {customer.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">{customer.name}</p>
                      {customer.nationality && (
                        <p className="text-xs text-gray-500 truncate">{customer.nationality}</p>
                      )}
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="col-span-2 space-y-0.5">
                    {customer.email && (
                      <p className="text-xs text-gray-400 truncate flex items-center gap-1">
                        <Mail className="w-3 h-3 flex-shrink-0" />
                        {customer.email}
                      </p>
                    )}
                    {customer.phone && (
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <Phone className="w-3 h-3 flex-shrink-0" />
                        {customer.phone}
                      </p>
                    )}
                  </div>

                  {/* Score */}
                  <div className="col-span-2">
                    <div className="flex items-center gap-2">
                      <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${badge.bg}`}>
                        <Star className={`w-3 h-3 ${badge.text}`} />
                        <span className={`text-xs font-semibold ${badge.text}`}>
                          {customer.lead_score}
                        </span>
                      </div>
                      <span className={`text-xs ${badge.text}`}>{badge.label}</span>
                    </div>
                  </div>

                  {/* Source */}
                  <div className="col-span-2">
                    <span className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded">
                      {SOURCE_LABELS[customer.source || 'other'] || customer.source}
                    </span>
                  </div>

                  {/* Date */}
                  <div className="col-span-2">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(customer.created_at)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 flex items-center justify-end gap-1">
                    {onEdit && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onEdit(customer) }}
                        className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(customer.id, customer.name) }}
                        className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors text-gray-400 hover:text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
