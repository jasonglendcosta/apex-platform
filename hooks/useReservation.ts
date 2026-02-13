'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { RealtimeChannel } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { Unit } from '@/types'

interface ReservationState {
  reservingUnitId: string | null
  optimisticUpdates: Map<string, Partial<Unit>>
  error: string | null
}

interface UseReservationReturn {
  reserveUnit: (unitId: string, customerId: string, hours: number) => Promise<boolean>
  releaseReservation: (unitId: string) => Promise<boolean>
  extendReservation: (unitId: string, additionalHours: number) => Promise<boolean>
  isReserving: boolean
  error: string | null
  clearError: () => void
}

export function useReservation(projectId: string): UseReservationReturn {
  const [state, setState] = useState<ReservationState>({
    reservingUnitId: null,
    optimisticUpdates: new Map(),
    error: null,
  })

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }))
  }, [])

  const reserveUnit = useCallback(async (
    unitId: string,
    customerId: string,
    hours: number
  ): Promise<boolean> => {
    setState(prev => ({ ...prev, reservingUnitId: unitId, error: null }))

    try {
      // First check if unit is still available (optimistic check)
      const { data: currentUnit, error: checkError } = await supabase
        .from('units')
        .select('status, reserved_by')
        .eq('id', unitId)
        .single()

      if (checkError) throw new Error('Failed to check unit status')

      if (currentUnit.status !== 'available') {
        throw new Error(
          currentUnit.reserved_by
            ? 'This unit was just reserved by someone else'
            : 'This unit is no longer available'
        )
      }

      const expiryDate = new Date()
      expiryDate.setHours(expiryDate.getHours() + hours)

      const { error: updateError } = await supabase
        .from('units')
        .update({
          status: 'reserved',
          reserved_by: customerId,
          reserved_at: new Date().toISOString(),
          reservation_expires_at: expiryDate.toISOString(),
        })
        .eq('id', unitId)
        .eq('status', 'available') // Optimistic lock: only update if still available

      if (updateError) throw new Error(updateError.message)

      setState(prev => ({ ...prev, reservingUnitId: null }))
      return true
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to reserve unit'
      setState(prev => ({ ...prev, reservingUnitId: null, error: message }))
      return false
    }
  }, [])

  const releaseReservation = useCallback(async (unitId: string): Promise<boolean> => {
    setState(prev => ({ ...prev, reservingUnitId: unitId, error: null }))

    try {
      const { error: updateError } = await supabase
        .from('units')
        .update({
          status: 'available',
          reserved_by: null,
          reserved_at: null,
          reservation_expires_at: null,
        })
        .eq('id', unitId)

      if (updateError) throw new Error(updateError.message)

      setState(prev => ({ ...prev, reservingUnitId: null }))
      return true
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to release reservation'
      setState(prev => ({ ...prev, reservingUnitId: null, error: message }))
      return false
    }
  }, [])

  const extendReservation = useCallback(async (
    unitId: string,
    additionalHours: number
  ): Promise<boolean> => {
    setState(prev => ({ ...prev, reservingUnitId: unitId, error: null }))

    try {
      const { data: unit, error: fetchError } = await supabase
        .from('units')
        .select('reservation_expires_at')
        .eq('id', unitId)
        .single()

      if (fetchError) throw new Error('Failed to fetch reservation details')

      const currentExpiry = unit.reservation_expires_at
        ? new Date(unit.reservation_expires_at)
        : new Date()

      const newExpiry = new Date(
        Math.max(currentExpiry.getTime(), Date.now()) + additionalHours * 60 * 60 * 1000
      )

      const { error: updateError } = await supabase
        .from('units')
        .update({ reservation_expires_at: newExpiry.toISOString() })
        .eq('id', unitId)

      if (updateError) throw new Error(updateError.message)

      setState(prev => ({ ...prev, reservingUnitId: null }))
      return true
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to extend reservation'
      setState(prev => ({ ...prev, reservingUnitId: null, error: message }))
      return false
    }
  }, [])

  return {
    reserveUnit,
    releaseReservation,
    extendReservation,
    isReserving: state.reservingUnitId !== null,
    error: state.error,
    clearError,
  }
}
