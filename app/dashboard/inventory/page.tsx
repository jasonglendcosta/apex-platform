'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { 
  Grid3X3, 
  List, 
  Building, 
  Filter,
  Search,
  ChevronDown,
} from 'lucide-react'
import { cn, formatCurrency, getStatusLabel } from '@/lib/utils'
import type { UnitStatus, ViewType } from '@/types'

// Mock data - will be replaced with Supabase query
const mockUnits = [
  { id: '1', unit_number: 'LR-0101', floor: 1, bedrooms: 1, area_sqft: 750, current_price: 950000, view_type: 'garden' as ViewType, status: 'available' as UnitStatus },
  { id: '2', unit_number: 'LR-0102', floor: 1, bedrooms: 1, area_sqft: 780, current_price: 980000, view_type: 'pool' as ViewType, status: 'available' as UnitStatus },
  { id: '3', unit_number: 'LR-0103', floor: 1, bedrooms: 2, area_sqft: 1150, current_price: 1450000, view_type: 'garden' as ViewType, status: 'reserved' as UnitStatus },
  { id: '4', unit_number: 'LR-0501', floor: 5, bedrooms: 2, area_sqft: 1200, current_price: 1650000, view_type: 'sea' as ViewType, status: 'available' as UnitStatus },
  { id: '5', unit_number: 'LR-0502', floor: 5, bedrooms: 2, area_sqft: 1220, current_price: 1680000, view_type: 'sea' as ViewType, status: 'booked' as UnitStatus },
  { id: '6', unit_number: 'LR-0802', floor: 8, bedrooms: 2, area_sqft: 1250, current_price: 1850000, view_type: 'sea' as ViewType, status: 'spa_signed' as UnitStatus },
  { id: '7', unit_number: 'LR-1001', floor: 10, bedrooms: 3, area_sqft: 1780, current_price: 2850000, view_type: 'sea' as ViewType, status: 'available' as UnitStatus },
  { id: '8', unit_number: 'LR-PH01', floor: 15, bedrooms: 4, area_sqft: 3500, current_price: 8500000, view_type: 'sea' as ViewType, status: 'available' as UnitStatus },
  { id: '9', unit_number: 'LR-0302', floor: 3, bedrooms: 2, area_sqft: 1180, current_price: 1520000, view_type: 'pool' as ViewType, status: 'sold' as UnitStatus },
  { id: '10', unit_number: 'LR-0702', floor: 7, bedrooms: 2, area_sqft: 1250, current_price: 1800000, view_type: 'sea' as ViewType, status: 'reserved' as UnitStatus },
]

export default function InventoryPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [statusFilter, setStatusFilter] = useState<UnitStatus | 'all'>('all')
  const [bedroomFilter, setBedroomFilter] = useState<number | 'all'>('all')
  
  const filteredUnits = mockUnits.filter(unit => {
    if (statusFilter !== 'all' && unit.status !== statusFilter) return false
    if (bedroomFilter !== 'all' && unit.bedrooms !== bedroomFilter) return false
    return true
  })

  return (
    <div className="min-h-screen">
      <Header 
        title="Inventory" 
        description="Manage units across Laguna Residence"
        action={{ label: 'Add Unit', href: '/dashboard/inventory/new' }}
      />
      
      <div className="p-8">
        {/* Filters Bar */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search units..."
              className="w-full input pl-10"
            />
          </div>
          
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as UnitStatus | 'all')}
            className="input w-40"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="reserved">Reserved</option>
            <option value="booked">Booked</option>
            <option value="spa_signed">SPA Signed</option>
            <option value="sold">Sold</option>
          </select>
          
          {/* Bedroom Filter */}
          <select
            value={bedroomFilter}
            onChange={(e) => setBedroomFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="input w-40"
          >
            <option value="all">All Beds</option>
            <option value="1">1 Bedroom</option>
            <option value="2">2 Bedrooms</option>
            <option value="3">3 Bedrooms</option>
            <option value="4">4+ Bedrooms</option>
          </select>
          
          {/* View Toggle */}
          <div className="flex bg-apex-card rounded-lg border border-apex-border p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-2 rounded transition-colors',
                viewMode === 'grid' 
                  ? 'bg-apex-pink text-white' 
                  : 'text-gray-400 hover:text-white'
              )}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={cn(
                'p-2 rounded transition-colors',
                viewMode === 'table' 
                  ? 'bg-apex-pink text-white' 
                  : 'text-gray-400 hover:text-white'
              )}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Results count */}
        <p className="text-gray-400 text-sm mb-4">
          Showing {filteredUnits.length} of {mockUnits.length} units
        </p>

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredUnits.map((unit) => (
              <UnitCard key={unit.id} unit={unit} />
            ))}
          </div>
        )}

        {/* Table View */}
        {viewMode === 'table' && (
          <div className="card p-0 overflow-hidden">
            <table className="w-full">
              <thead className="bg-apex-darker">
                <tr>
                  <th className="table-header px-4 py-3">Unit</th>
                  <th className="table-header px-4 py-3">Floor</th>
                  <th className="table-header px-4 py-3">Beds</th>
                  <th className="table-header px-4 py-3">Area</th>
                  <th className="table-header px-4 py-3">View</th>
                  <th className="table-header px-4 py-3">Price</th>
                  <th className="table-header px-4 py-3">Status</th>
                  <th className="table-header px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-apex-border">
                {filteredUnits.map((unit) => (
                  <tr key={unit.id} className="hover:bg-apex-card/50 transition-colors">
                    <td className="table-cell font-medium text-white">{unit.unit_number}</td>
                    <td className="table-cell">{unit.floor}</td>
                    <td className="table-cell">{unit.bedrooms} BR</td>
                    <td className="table-cell">{unit.area_sqft.toLocaleString()} sqft</td>
                    <td className="table-cell capitalize">{unit.view_type}</td>
                    <td className="table-cell text-white">{formatCurrency(unit.current_price)}</td>
                    <td className="table-cell">
                      <StatusBadge status={unit.status} />
                    </td>
                    <td className="table-cell">
                      <button className="btn-ghost text-xs">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function UnitCard({ unit }: { unit: typeof mockUnits[0] }) {
  return (
    <div className="card-hover group">
      {/* Status indicator */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Building className="w-4 h-4 text-apex-pink" />
          <span className="font-bold text-white">{unit.unit_number}</span>
        </div>
        <StatusBadge status={unit.status} />
      </div>
      
      {/* Details */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Floor</span>
          <span className="text-gray-300">{unit.floor}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Bedrooms</span>
          <span className="text-gray-300">{unit.bedrooms} BR</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Area</span>
          <span className="text-gray-300">{unit.area_sqft.toLocaleString()} sqft</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">View</span>
          <span className="text-gray-300 capitalize">{unit.view_type}</span>
        </div>
      </div>
      
      {/* Price */}
      <div className="mt-4 pt-4 border-t border-apex-border">
        <div className="flex items-center justify-between">
          <span className="text-gray-500 text-sm">Price</span>
          <span className="text-lg font-bold text-white">{formatCurrency(unit.current_price)}</span>
        </div>
        <div className="text-right text-xs text-gray-500">
          {formatCurrency(Math.round(unit.current_price / unit.area_sqft))}/sqft
        </div>
      </div>
      
      {/* Actions */}
      {unit.status === 'available' && (
        <button className="btn-primary w-full mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
          Reserve Unit
        </button>
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: UnitStatus }) {
  const styles: Record<UnitStatus, string> = {
    available: 'badge-available',
    reserved: 'badge-reserved',
    booked: 'badge-booked',
    spa_signed: 'badge-spa-signed',
    spa_executed: 'badge-spa-signed',
    registered: 'badge-sold',
    sold: 'badge-sold',
    blocked: 'badge-blocked',
  }
  
  return (
    <span className={styles[status]}>
      <span className={cn(
        'w-1.5 h-1.5 rounded-full',
        status === 'available' && 'bg-green-400',
        status === 'reserved' && 'bg-amber-400',
        status === 'booked' && 'bg-blue-400',
        (status === 'spa_signed' || status === 'spa_executed') && 'bg-purple-400',
        (status === 'sold' || status === 'registered') && 'bg-gray-400',
        status === 'blocked' && 'bg-red-400',
      )} />
      {getStatusLabel(status)}
    </span>
  )
}
