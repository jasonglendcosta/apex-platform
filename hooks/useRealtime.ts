'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { RealtimeChannel } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { Unit } from '@/types'

interface ConflictEvent {
  unitId: string
  unitNumber: string
  reservedBy: string
  timestamp: string
}

interface UseRealtimeUnitsReturn {
  units: Unit[]
  loading: boolean
  error: string | null
  conflicts: ConflictEvent[]
  clearConflicts: () => void
  refresh: () => Promise<void>
}

export function useRealtimeUnits(
  projectId: string,
  currentUserId?: string
): UseRealtimeUnitsReturn {
  const [units, setUnits] = useState<Unit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [conflicts, setConflicts] = useState<ConflictEvent[]>([])
  const channelRef = useRef<RealtimeChannel | null>(null)

  const fetchUnits = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error: fetchError } = await supabase
        .from('units')
        .select('*')
        .eq('project_id', projectId)
        .order('unit_number')

      if (fetchError) throw new Error(fetchError.message)
      setUnits((data || []) as Unit[])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch units')
    } finally {
      setLoading(false)
    }
  }, [projectId])

  useEffect(() => {
    if (!projectId) return

    fetchUnits()

    // Subscribe to real-time changes
    channelRef.current = supabase
      .channel(`units-${projectId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'units',
          filter: `project_id=eq.${projectId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setUnits(prev => [...prev, payload.new as Unit])
          } else if (payload.eventType === 'UPDATE') {
            const updatedUnit = payload.new as Unit
            setUnits(prev => prev.map(u => (u.id === updatedUnit.id ? updatedUnit : u)))

            // Detect conflicts: someone else reserved a unit
            if (
              updatedUnit.status === 'reserved' &&
              currentUserId &&
              updatedUnit.reserved_by !== currentUserId
            ) {
              setConflicts(prev => [
                ...prev,
                {
                  unitId: updatedUnit.id,
                  unitNumber: updatedUnit.unit_number,
                  reservedBy: updatedUnit.reserved_by || 'Unknown',
                  timestamp: new Date().toISOString(),
                },
              ])
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
  }, [projectId, currentUserId, fetchUnits])

  const clearConflicts = useCallback(() => {
    setConflicts([])
  }, [])

  return {
    units,
    loading,
    error,
    conflicts,
    clearConflicts,
    refresh: fetchUnits,
  }
}

export function useRealtimeReservations(customerId: string) {
  const [reservations, setReservations] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)
  const channelRef = useRef<RealtimeChannel | null>(null)

  useEffect(() => {
    if (!customerId) return

    const fetchReservations = async () => {
      try {
        const { data } = await supabase
          .from('reservations')
          .select('*')
          .eq('customer_id', customerId)
          .order('created_at', { ascending: false })

        setReservations(data || [])
      } catch (err) {
        console.error('Failed to fetch reservations:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchReservations()

    channelRef.current = supabase
      .channel(`customer-reservations-${customerId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reservations',
          filter: `customer_id=eq.${customerId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setReservations(prev => [payload.new as Record<string, unknown>, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            setReservations(prev =>
              prev.map(r =>
                (r as { id: string }).id === (payload.new as { id: string }).id
                  ? (payload.new as Record<string, unknown>)
                  : r
              )
            )
          }
        }
      )
      .subscribe()

    return () => {
      channelRef.current?.unsubscribe()
    }
  }, [customerId])

  return { reservations, loading }
}
