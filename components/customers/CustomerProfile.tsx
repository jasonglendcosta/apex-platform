'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Phone, MapPin, Zap, Calendar, TrendingUp, ArrowLeft } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Customer {
  id: string
  name: string
  email: string | null
  phone: string
  nationality: string | null
  emirates_id: string | null
  passport_number: string | null
  address: string | null
  source: string
  lead_score: number
  created_at: string
}

interface CustomerProfileProps {
  customerId: string
  onBack?: () => void
}

export function CustomerProfile({ customerId, onBack }: CustomerProfileProps) {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [reservations, setReservations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [customerId])

  const fetchData = async () => {
    try {
      const [customerData, reservationsData] = await Promise.all([
        supabase.from('customers').select('*').eq('id', customerId).single(),
        supabase
          .from('reservations')
          .select('*, unit_id(*), unit_id.project_id(*)')
          .eq('customer_id', customerId)
      ])

      if (customerData.data) setCustomer(customerData.data)
      if (reservationsData.data) setReservations(reservationsData.data)
    } catch (err) {
      console.error('Failed to fetch customer data:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-cmd-pink border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!customer) {
    return <div className="text-center py-12 text-gray-500">Customer not found</div>
  }

  const scoreColor = 
    customer.lead_score >= 80 ? 'text-cmd-green' :
    customer.lead_score >= 60 ? 'text-cmd-amber' :
    'text-gray-400'

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      {/* Back Button */}
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to List
        </button>
      )}

      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">{customer.name}</h1>
            <span className="text-sm text-gray-500">
              {customer.source} • Added {new Date(customer.created_at).toLocaleDateString()}
            </span>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold ${scoreColor}`}>
              {customer.lead_score}%
            </div>
            <p className="text-xs text-gray-500 mt-1">Lead Score</p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-2 gap-4">
          {customer.email && (
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm text-white break-all">{customer.email}</p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-xs text-gray-500">Phone</p>
              <p className="text-sm text-white">{customer.phone}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="grid md:grid-cols-2 gap-4">
        {customer.nationality && (
          <div className="glass-card p-4">
            <p className="text-xs text-gray-500 mb-1">Nationality</p>
            <p className="text-sm text-white">{customer.nationality}</p>
          </div>
        )}
        {customer.emirates_id && (
          <div className="glass-card p-4">
            <p className="text-xs text-gray-500 mb-1">Emirates ID</p>
            <p className="text-sm text-white font-mono">{customer.emirates_id}</p>
          </div>
        )}
        {customer.passport_number && (
          <div className="glass-card p-4">
            <p className="text-xs text-gray-500 mb-1">Passport Number</p>
            <p className="text-sm text-white font-mono">{customer.passport_number}</p>
          </div>
        )}
        {customer.address && (
          <div className="glass-card p-4">
            <p className="text-xs text-gray-500 mb-1 flex items-center gap-2">
              <MapPin className="w-3 h-3" />
              Address
            </p>
            <p className="text-sm text-white">{customer.address}</p>
          </div>
        )}
      </div>

      {/* Reservations */}
      {reservations.length > 0 && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cmd-pink" />
            Active Reservations
          </h3>
          <div className="space-y-2">
            {reservations.map((res, idx) => (
              <div
                key={idx}
                className="p-3 bg-cmd-darker rounded-lg border border-cmd-border"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">Unit {res.unit_number}</p>
                    <p className="text-xs text-gray-500">
                      {res.status} since {new Date(res.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    res.status === 'reserved' ? 'bg-cmd-amber/20 text-cmd-amber' :
                    res.status === 'booked' ? 'bg-cmd-green/20 text-cmd-green' :
                    'bg-cmd-pink/20 text-cmd-pink'
                  }`}>
                    {res.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {reservations.length === 0 && (
        <div className="glass-card p-12 text-center">
          <Zap className="w-12 h-12 text-gray-700 mx-auto mb-4" />
          <p className="text-gray-500">No active reservations</p>
          <p className="text-xs text-gray-600 mt-1">
            This customer hasn't reserved any units yet
          </p>
        </div>
      )}
    </motion.div>
  )
}
