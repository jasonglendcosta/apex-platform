'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { RealtimeChannel } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { Unit, Project, UnitFilters } from '@/types'
import {
  ProjectSelector,
  ViewToggle,
  FilterBar,
  UnitGrid,
  UnitDetailModal,
  InventoryStats,
  ReserveButton,
  ReservationExpiryTimer,
  ReservationStatusWorkflow,
} from '@/components/inventory'
import { UnitGridSkeleton, StatCardSkeleton } from '@/components/ui/SkeletonLoader'
import { ToastProvider, useToast } from '@/components/ui/Toast'
import { AlertTriangle, RefreshCw } from 'lucide-react'

function InventoryPageContent() {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProjectId, setSelectedProjectId] = useState<string>('')
  const [units, setUnits] = useState<Unit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'table' | 'floor' | '3d'>('grid')
  const [filters, setFilters] = useState<UnitFilters>({})
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [conflictUnit, setConflictUnit] = useState<string | null>(null)
  const channelRef = useRef<RealtimeChannel | null>(null)
  const { showToast } = useToast()

  // Fetch projects on mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('projects')
          .select('*')
          .order('name')

        if (fetchError) throw new Error(fetchError.message)

        const projectList = (data || []) as Project[]
        setProjects(projectList)

        if (projectList.length > 0 && !selectedProjectId) {
          setSelectedProjectId(projectList[0].id)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load projects')
      }
    }

    fetchProjects()
  }, [])

  // Fetch units when project changes + real-time subscription
  useEffect(() => {
    if (!selectedProjectId) return

    const fetchUnits = async () => {
      setLoading(true)
      setError(null)

      try {
        const { data, error: fetchError } = await supabase
          .from('units')
          .select('*')
          .eq('project_id', selectedProjectId)
          .order('unit_number')

        if (fetchError) throw new Error(fetchError.message)
        setUnits((data || []) as Unit[])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load units')
      } finally {
        setLoading(false)
      }
    }

    fetchUnits()

    // Subscribe to real-time changes
    channelRef.current?.unsubscribe()
    channelRef.current = supabase
      .channel(`inventory-${selectedProjectId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'units',
          filter: `project_id=eq.${selectedProjectId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setUnits(prev => [...prev, payload.new as Unit])
          } else if (payload.eventType === 'UPDATE') {
            const updatedUnit = payload.new as Unit
            setUnits(prev => prev.map(u => (u.id === updatedUnit.id ? updatedUnit : u)))

            // Conflict detection: if someone else just reserved a unit you're viewing
            if (
              updatedUnit.status === 'reserved' &&
              selectedUnit?.id === updatedUnit.id
            ) {
              setConflictUnit(updatedUnit.id)
              showToast({
                type: 'warning',
                title: 'Unit Status Changed',
                description: `${updatedUnit.unit_number} was just reserved by another agent`,
              })
              // Update selected unit with fresh data
              setSelectedUnit(updatedUnit)
            }
          } else if (payload.eventType === 'DELETE') {
            setUnits(prev => prev.filter(u => u.id !== (payload.old as { id: string }).id))
          }
        }
      )
      .subscribe()

    return () => {
      channelRef.current?.unsubscribe()
    }
  }, [selectedProjectId, showToast])

  // Apply filters
  const filteredUnits = useMemo(() => {
    return units.filter(unit => {
      if (filters.search) {
        const search = filters.search.toLowerCase()
        if (
          !unit.unit_number.toLowerCase().includes(search) &&
          !unit.view_type?.toLowerCase().includes(search) &&
          !unit.unit_type?.toLowerCase().includes(search)
        ) {
          return false
        }
      }

      if (filters.status?.length && !filters.status.includes(unit.status)) return false
      if (filters.bedrooms?.length && !filters.bedrooms.includes(unit.bedrooms)) return false
      if (filters.view_type?.length && unit.view_type && !filters.view_type.includes(unit.view_type)) return false
      if (filters.price_min && unit.current_price < filters.price_min) return false
      if (filters.price_max && unit.current_price > filters.price_max) return false

      return true
    })
  }, [units, filters])

  // Calculate stats
  const stats = useMemo(() => {
    const total = units.length
    const available = units.filter(u => u.status === 'available').length
    const reserved = units.filter(u => u.status === 'reserved').length
    const booked = units.filter(u => u.status === 'booked').length
    const sold = units.filter(u => ['sold', 'spa_signed', 'spa_executed', 'registered'].includes(u.status)).length
    const totalValue = units.reduce((sum, u) => sum + u.current_price, 0)
    const availableValue = units.filter(u => u.status === 'available').reduce((sum, u) => sum + u.current_price, 0)
    const soldValue = units.filter(u => ['sold', 'spa_signed', 'spa_executed', 'registered'].includes(u.status)).reduce((sum, u) => sum + u.current_price, 0)

    return { total, available, reserved, booked, sold, totalValue, availableValue, soldValue }
  }, [units])

  const handleUnitClick = useCallback((unit: Unit) => {
    setSelectedUnit(unit)
    setShowDetailModal(true)
    setConflictUnit(null)
  }, [])

  const handleReserveFromModal = useCallback((unit: Unit) => {
    // The UnitDetailModal calls this — we already show the reserve button inside the modal
    setSelectedUnit(unit)
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="max-w-[1600px] mx-auto p-6 space-y-6">
        {/* Top Bar: Project Selector + View Toggle */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <ProjectSelector
            projects={projects}
            selectedProjectId={selectedProjectId}
            onSelect={setSelectedProjectId}
          />
          <ViewToggle currentView={viewMode} onViewChange={setViewMode} />
        </div>

        {/* Filter Bar */}
        <FilterBar
          filters={filters}
          onFiltersChange={setFilters}
          onClear={() => setFilters({})}
        />

        {/* Stats */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <StatCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <InventoryStats stats={stats} loading={false} />
        )}

        {/* Conflict Warning */}
        {conflictUnit && (
          <div className="flex items-center gap-3 px-4 py-3 bg-amber-500/10 border border-amber-500/30 rounded-xl">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <p className="text-sm text-amber-300">
              A unit status just changed. The grid has been updated in real-time.
            </p>
            <button
              onClick={() => setConflictUnit(null)}
              className="ml-auto text-xs text-amber-400 hover:text-amber-300 transition-colors"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="flex items-center gap-3 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-sm text-red-300">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="ml-auto flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retry
            </button>
          </div>
        )}

        {/* Unit Grid */}
        {loading ? (
          <UnitGridSkeleton count={8} />
        ) : (
          <>
            {/* Results count */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400">
                Showing <span className="text-white font-medium">{filteredUnits.length}</span> of{' '}
                <span className="text-white font-medium">{units.length}</span> units
              </p>
              {filteredUnits.length !== units.length && (
                <button
                  onClick={() => setFilters({})}
                  className="text-xs text-[#D86DCB] hover:text-[#D86DCB]/80 transition-colors"
                >
                  Clear filters
                </button>
              )}
            </div>

            <UnitGrid
              units={filteredUnits}
              loading={false}
              onUnitClick={handleUnitClick}
              selectedUnitId={selectedUnit?.id}
            />
          </>
        )}

        {/* Unit Detail Modal */}
        <UnitDetailModal
          unit={selectedUnit || undefined}
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false)
            setSelectedUnit(null)
            setConflictUnit(null)
          }}
          onReserve={handleReserveFromModal}
        />
      </div>
    </div>
  )
}

export default function InventoryPage() {
  return (
    <ToastProvider>
      <InventoryPageContent />
    </ToastProvider>
  )
}
