'use client'

import { useEffect, useState, useCallback } from 'react'
import { RealtimeChannel } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

export function useRealtimeUnits(projectId: string) {
  const [units, setUnits] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const channel = useRef<RealtimeChannel | null>(null)

  useEffect(() => {
    // Initial fetch
    const fetchUnits = async () => {
      try {
        const { data, error } = await supabase
          .from('units')
          .select('*')
          .eq('project_id', projectId)

        if (error) throw error
        setUnits(data || [])
        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch units')
        setLoading(false)
      }
    }

    fetchUnits()

    // Subscribe to real-time changes
    channel.current = supabase
      .channel(`units-${projectId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'units',
          filter: `project_id=eq.${projectId}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setUnits((prev) => [...prev, payload.new])
          } else if (payload.eventType === 'UPDATE') {
            setUnits((prev) =>
              prev.map((u) => (u.id === payload.new.id ? payload.new : u))
            )
          } else if (payload.eventType === 'DELETE') {
            setUnits((prev) => prev.filter((u) => u.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      channel.current?.unsubscribe()
    }
  }, [projectId])

  return { units, loading, error }
}

export function useRealtimeReservations(customerId: string) {
  const [reservations, setReservations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const channel = useRef<RealtimeChannel | null>(null)

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const { data } = await supabase
          .from('reservations')
          .select('*')
          .eq('customer_id', customerId)

        setReservations(data || [])
        setLoading(false)
      } catch (err) {
        console.error('Failed to fetch reservations:', err)
        setLoading(false)
      }
    }

    fetchReservations()

    channel.current = supabase
      .channel(`customer-reservations-${customerId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reservations',
          filter: `customer_id=eq.${customerId}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setReservations((prev) => [...prev, payload.new])
          } else if (payload.eventType === 'UPDATE') {
            setReservations((prev) =>
              prev.map((r) => (r.id === payload.new.id ? payload.new : r))
            )
          }
        }
      )
      .subscribe()

    return () => {
      channel.current?.unsubscribe()
    }
  }, [customerId])

  return { reservations, loading }
}

import { useRef }
