'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { RealtimeChannel } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { Customer, LeadSource } from '@/types'

interface CustomerFilters {
  search?: string
  source?: LeadSource
  minScore?: number
  maxScore?: number
  assignedAgent?: string
}

interface LeadScoreBreakdown {
  source: number
  engagement: number
  recency: number
  budget: number
  completeness: number
  total: number
  label: string
}

interface UseCustomerReturn {
  customers: Customer[]
  loading: boolean
  error: string | null
  searchCustomers: (filters: CustomerFilters) => void
  createCustomer: (data: CreateCustomerData) => Promise<Customer | null>
  updateCustomer: (id: string, data: Partial<CreateCustomerData>) => Promise<boolean>
  deleteCustomer: (id: string) => Promise<boolean>
  calculateLeadScore: (customer: Partial<Customer>) => LeadScoreBreakdown
  filters: CustomerFilters
  totalCount: number
}

interface CreateCustomerData {
  name: string
  email?: string
  phone?: string
  nationality?: string
  source?: LeadSource
  assigned_agent_id?: string
  budget_min?: number
  budget_max?: number
  notes?: string
}

export function useCustomer(): UseCustomerReturn {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<CustomerFilters>({})
  const [totalCount, setTotalCount] = useState(0)
  const channelRef = useRef<RealtimeChannel | null>(null)

  // Calculate lead score breakdown
  const calculateLeadScore = useCallback((customer: Partial<Customer>): LeadScoreBreakdown => {
    let source = 0
    let engagement = 0
    let recency = 0
    let budget = 0
    let completeness = 0

    // Source scoring
    const sourceScores: Record<string, number> = {
      walk_in: 20,
      referral: 18,
      website: 12,
      broker: 15,
      social_media: 10,
      exhibition: 14,
      cold_call: 5,
      other: 5,
    }
    source = sourceScores[customer.source || 'other'] || 5

    // Profile completeness scoring (max 20)
    if (customer.email) completeness += 4
    if (customer.phone) completeness += 4
    if (customer.nationality) completeness += 3
    if (customer.budget_min || customer.budget_max) completeness += 5
    if (customer.preferred_bedrooms?.length) completeness += 2
    if (customer.preferred_views?.length) completeness += 2

    // Recency scoring (max 20) - based on created_at
    if (customer.created_at) {
      const daysSinceCreation = Math.floor(
        (Date.now() - new Date(customer.created_at).getTime()) / (1000 * 60 * 60 * 24)
      )
      if (daysSinceCreation <= 1) recency = 20
      else if (daysSinceCreation <= 7) recency = 15
      else if (daysSinceCreation <= 30) recency = 10
      else if (daysSinceCreation <= 90) recency = 5
      else recency = 2
    }

    // Budget scoring (max 20) - higher budget = higher score
    if (customer.budget_max) {
      if (customer.budget_max >= 5000000) budget = 20
      else if (customer.budget_max >= 2000000) budget = 15
      else if (customer.budget_max >= 1000000) budget = 10
      else budget = 5
    }

    // Engagement scoring (max 20) - placeholder, would come from activity logs
    engagement = 10 // Default medium engagement

    const total = Math.min(100, source + engagement + recency + budget + completeness)

    let label = 'Cold Lead'
    if (total >= 75) label = 'Hot Lead'
    else if (total >= 50) label = 'Warm Lead'

    return { source, engagement, recency, budget, completeness, total, label }
  }, [])

  // Fetch customers
  const fetchCustomers = useCallback(async (currentFilters: CustomerFilters) => {
    setLoading(true)
    setError(null)

    try {
      let query = supabase
        .from('customers')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })

      if (currentFilters.search) {
        query = query.or(
          `name.ilike.%${currentFilters.search}%,email.ilike.%${currentFilters.search}%,phone.ilike.%${currentFilters.search}%`
        )
      }

      if (currentFilters.source) {
        query = query.eq('source', currentFilters.source)
      }

      if (currentFilters.minScore !== undefined) {
        query = query.gte('lead_score', currentFilters.minScore)
      }

      if (currentFilters.maxScore !== undefined) {
        query = query.lte('lead_score', currentFilters.maxScore)
      }

      if (currentFilters.assignedAgent) {
        query = query.eq('assigned_agent_id', currentFilters.assignedAgent)
      }

      const { data, error: fetchError, count } = await query

      if (fetchError) throw new Error(fetchError.message)

      setCustomers((data as Customer[]) || [])
      setTotalCount(count || 0)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch customers')
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial fetch + real-time subscription
  useEffect(() => {
    fetchCustomers(filters)

    // Real-time subscription
    channelRef.current = supabase
      .channel('customers-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'customers' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setCustomers(prev => [payload.new as Customer, ...prev])
            setTotalCount(prev => prev + 1)
          } else if (payload.eventType === 'UPDATE') {
            setCustomers(prev =>
              prev.map(c => (c.id === (payload.new as Customer).id ? (payload.new as Customer) : c))
            )
          } else if (payload.eventType === 'DELETE') {
            setCustomers(prev => prev.filter(c => c.id !== (payload.old as { id: string }).id))
            setTotalCount(prev => prev - 1)
          }
        }
      )
      .subscribe()

    return () => {
      channelRef.current?.unsubscribe()
    }
  }, []) // Only run once on mount

  // Search with debounce
  const searchCustomers = useCallback((newFilters: CustomerFilters) => {
    setFilters(newFilters)
    fetchCustomers(newFilters)
  }, [fetchCustomers])

  // Create customer
  const createCustomer = useCallback(async (data: CreateCustomerData): Promise<Customer | null> => {
    try {
      // Calculate initial lead score
      const scoreBreakdown = calculateLeadScore({
        source: data.source,
        email: data.email,
        phone: data.phone,
        nationality: data.nationality,
        budget_max: data.budget_max,
        budget_min: data.budget_min,
        created_at: new Date().toISOString(),
      })

      const { data: newCustomer, error: insertError } = await supabase
        .from('customers')
        .insert({
          name: data.name,
          email: data.email || null,
          phone: data.phone || null,
          nationality: data.nationality || null,
          source: data.source || 'other',
          assigned_agent_id: data.assigned_agent_id || null,
          budget_min: data.budget_min || null,
          budget_max: data.budget_max || null,
          notes: data.notes || null,
          lead_score: scoreBreakdown.total,
          lead_status: 'new',
          tags: [],
        })
        .select()
        .single()

      if (insertError) throw new Error(insertError.message)

      return newCustomer as Customer
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create customer')
      return null
    }
  }, [calculateLeadScore])

  // Update customer
  const updateCustomer = useCallback(async (id: string, data: Partial<CreateCustomerData>): Promise<boolean> => {
    try {
      const { error: updateError } = await supabase
        .from('customers')
        .update(data)
        .eq('id', id)

      if (updateError) throw new Error(updateError.message)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update customer')
      return false
    }
  }, [])

  // Delete customer
  const deleteCustomer = useCallback(async (id: string): Promise<boolean> => {
    try {
      const { error: deleteError } = await supabase
        .from('customers')
        .delete()
        .eq('id', id)

      if (deleteError) throw new Error(deleteError.message)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete customer')
      return false
    }
  }, [])

  return {
    customers,
    loading,
    error,
    searchCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    calculateLeadScore,
    filters,
    totalCount,
  }
}
