'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User, Mail, Phone, MapPin, Zap, Calendar, TrendingUp, ArrowLeft, X,
  FileText, Eye, Building2, Clock, MessageSquare, Globe, CreditCard
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Customer } from '@/types'
import { LeadScoreCard } from './LeadScoreCard'
import { ReservationStatusWorkflow } from '@/components/inventory/ReservationStatusWorkflow'

interface CustomerProfileProps {
  customerId: string
  onClose?: () => void
  onBack?: () => void
}

type ProfileTab = 'details' | 'history' | 'documents' | 'interests'

interface Interaction {
  id: string
  type: 'call' | 'email' | 'viewing' | 'meeting' | 'note'
  description: string
  created_at: string
  user_name?: string
}

interface InterestedUnit {
  id: string
  unit_number: string
  project_name: string
  bedrooms: number
  area_sqft: number
  price: number
  status: string
}

export function CustomerProfile({ customerId, onClose, onBack }: CustomerProfileProps) {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [reservations, setReservations] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<ProfileTab>('details')

  // Mock interaction history (would come from activity_logs in production)
  const mockInteractions: Interaction[] = [
    { id: '1', type: 'viewing', description: 'Viewed Unit A-1204 at Laguna Residence', created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), user_name: 'Sarah Johnson' },
    { id: '2', type: 'call', description: 'Follow-up call regarding 2BR units', created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), user_name: 'Sarah Johnson' },
    { id: '3', type: 'email', description: 'Sent project brochure and payment plans', created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), user_name: 'Admin' },
    { id: '4', type: 'meeting', description: 'Initial meeting at sales gallery', created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), user_name: 'Sarah Johnson' },
  ]

  useEffect(() => {
    fetchData()
  }, [customerId])

  const fetchData = async () => {
    try {
      const [customerResult, reservationsResult] = await Promise.all([
        supabase.from('customers').select('*').eq('id', customerId).single(),
        supabase
          .from('reservations')
          .select('*')
          .eq('customer_id', customerId)
          .order('created_at', { ascending: false }),
      ])

      if (customerResult.data) setCustomer(customerResult.data as Customer)
      if (reservationsResult.data) setReservations(reservationsResult.data)
    } catch (err) {
      console.error('Failed to fetch customer data:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-[#D86DCB] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="text-center py-20">
        <User className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400">Customer not found</p>
      </div>
    )
  }

  // Calculate lead score breakdown
  const sourceScores: Record<string, number> = {
    walk_in: 20, referral: 18, broker: 15, exhibition: 14,
    website: 12, social_media: 10, cold_call: 5, other: 5,
  }
  const breakdown = {
    source: sourceScores[customer.source || 'other'] || 5,
    engagement: 10,
    recency: 15,
    budget: customer.budget_max ? (customer.budget_max >= 2000000 ? 15 : 10) : 5,
    completeness: (customer.email ? 4 : 0) + (customer.phone ? 4 : 0) + (customer.nationality ? 3 : 0) + (customer.budget_max ? 5 : 0),
    total: customer.lead_score,
    label: customer.lead_score >= 75 ? 'Hot Lead' : customer.lead_score >= 50 ? 'Warm Lead' : 'Cold Lead',
  }

  const tabs: { key: ProfileTab; label: string; icon: React.ReactNode }[] = [
    { key: 'details', label: 'Details', icon: <User className="w-4 h-4" /> },
    { key: 'history', label: 'History', icon: <Clock className="w-4 h-4" /> },
    { key: 'documents', label: 'Documents', icon: <FileText className="w-4 h-4" /> },
    { key: 'interests', label: 'Interests', icon: <Building2 className="w-4 h-4" /> },
  ]

  const interactionIcons: Record<string, React.ReactNode> = {
    call: <Phone className="w-4 h-4 text-blue-400" />,
    email: <Mail className="w-4 h-4 text-purple-400" />,
    viewing: <Eye className="w-4 h-4 text-emerald-400" />,
    meeting: <MessageSquare className="w-4 h-4 text-amber-400" />,
    note: <FileText className="w-4 h-4 text-gray-400" />,
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="bg-[#0a0a0f] border border-white/10 rounded-2xl max-w-3xl w-full mx-4 shadow-2xl"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-[#D86DCB]/20 flex items-center justify-center">
                <span className="text-xl font-bold text-[#D86DCB]">
                  {customer.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{customer.name}</h2>
                <p className="text-sm text-gray-400 mt-0.5">
                  {customer.source ? `${customer.source.replace('_', ' ')}` : 'Unknown source'}
                  {' • '}
                  Added {new Date(customer.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <LeadScoreCard score={customer.lead_score} compact />
              <button
                onClick={onClose || onBack}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Quick contact info */}
          <div className="flex flex-wrap items-center gap-4 mt-4">
            {customer.email && (
              <span className="flex items-center gap-1.5 text-sm text-gray-400">
                <Mail className="w-3.5 h-3.5" /> {customer.email}
              </span>
            )}
            {customer.phone && (
              <span className="flex items-center gap-1.5 text-sm text-gray-400">
                <Phone className="w-3.5 h-3.5" /> {customer.phone}
              </span>
            )}
            {customer.nationality && (
              <span className="flex items-center gap-1.5 text-sm text-gray-400">
                <Globe className="w-3.5 h-3.5" /> {customer.nationality}
              </span>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 pt-4 border-b border-white/10">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === tab.key
                  ? 'bg-white/5 text-[#D86DCB] border-b-2 border-[#D86DCB]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Lead Score Card */}
              <LeadScoreCard score={customer.lead_score} breakdown={breakdown} />

              {/* Contact & Personal Info */}
              <div className="space-y-4">
                <div className="bg-[#1a1a24] rounded-xl border border-white/10 p-5">
                  <h4 className="text-sm font-semibold text-white mb-4">Personal Details</h4>
                  <div className="space-y-3">
                    {customer.emirates_id && (
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-500">Emirates ID</span>
                        <span className="text-sm text-white font-mono">{customer.emirates_id}</span>
                      </div>
                    )}
                    {customer.passport_number && (
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-500">Passport</span>
                        <span className="text-sm text-white font-mono">{customer.passport_number}</span>
                      </div>
                    )}
                    {customer.occupation && (
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-500">Occupation</span>
                        <span className="text-sm text-white">{customer.occupation}</span>
                      </div>
                    )}
                    {customer.company && (
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-500">Company</span>
                        <span className="text-sm text-white">{customer.company}</span>
                      </div>
                    )}
                    {(customer.budget_min || customer.budget_max) && (
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-500">Budget</span>
                        <span className="text-sm text-[#D86DCB] font-medium">
                          AED {customer.budget_min?.toLocaleString() || '0'} - {customer.budget_max?.toLocaleString() || '∞'}
                        </span>
                      </div>
                    )}
                    {customer.address && (
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-500">Address</span>
                        <span className="text-sm text-white">{customer.address}</span>
                      </div>
                    )}
                    {!customer.emirates_id && !customer.passport_number && !customer.occupation && !customer.budget_max && (
                      <p className="text-sm text-gray-500 text-center py-4">
                        No additional details available
                      </p>
                    )}
                  </div>
                </div>

                {/* Preferences */}
                {(customer.preferred_bedrooms?.length || customer.preferred_views?.length) && (
                  <div className="bg-[#1a1a24] rounded-xl border border-white/10 p-5">
                    <h4 className="text-sm font-semibold text-white mb-4">Preferences</h4>
                    <div className="space-y-3">
                      {customer.preferred_bedrooms?.length ? (
                        <div>
                          <span className="text-xs text-gray-500 block mb-1">Bedrooms</span>
                          <div className="flex gap-2">
                            {customer.preferred_bedrooms.map(br => (
                              <span key={br} className="px-2 py-1 bg-white/5 rounded text-xs text-white">
                                {br === 0 ? 'Studio' : `${br} BR`}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : null}
                      {customer.preferred_views?.length ? (
                        <div>
                          <span className="text-xs text-gray-500 block mb-1">Views</span>
                          <div className="flex gap-2">
                            {customer.preferred_views.map(v => (
                              <span key={v} className="px-2 py-1 bg-white/5 rounded text-xs text-white capitalize">
                                {v}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                )}

                {customer.notes && (
                  <div className="bg-[#1a1a24] rounded-xl border border-white/10 p-5">
                    <h4 className="text-sm font-semibold text-white mb-2">Notes</h4>
                    <p className="text-sm text-gray-400 whitespace-pre-wrap">{customer.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              {/* Active Reservations */}
              {reservations.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#D86DCB]" />
                    Reservations ({reservations.length})
                  </h4>
                  <div className="space-y-2">
                    {reservations.map((res, idx) => (
                      <div key={idx} className="bg-[#1a1a24] rounded-xl border border-white/10 p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-white">
                            {(res as Record<string, unknown>).reservation_number as string || `Reservation #${idx + 1}`}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            (res as Record<string, unknown>).status === 'reserved' ? 'bg-amber-500/10 text-amber-400' :
                            (res as Record<string, unknown>).status === 'booked' ? 'bg-blue-500/10 text-blue-400' :
                            'bg-emerald-500/10 text-emerald-400'
                          }`}>
                            {((res as Record<string, unknown>).status as string || '').replace('_', ' ')}
                          </span>
                        </div>
                        <ReservationStatusWorkflow
                          currentStatus={(res as Record<string, unknown>).status as string}
                          compact
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Interaction Timeline */}
              <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#D86DCB]" />
                Interaction History
              </h4>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-white/10" />
                <div className="space-y-4">
                  {mockInteractions.map(interaction => (
                    <div key={interaction.id} className="flex items-start gap-4 relative">
                      <div className="relative z-10 w-8 h-8 rounded-full bg-[#1a1a24] border border-white/10 flex items-center justify-center">
                        {interactionIcons[interaction.type]}
                      </div>
                      <div className="flex-1 bg-[#1a1a24] rounded-xl border border-white/10 p-3">
                        <p className="text-sm text-white">{interaction.description}</p>
                        <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-500">
                          {interaction.user_name && <span>{interaction.user_name}</span>}
                          <span>•</span>
                          <span>
                            {new Date(interaction.created_at).toLocaleDateString('en-US', {
                              month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No Documents</h3>
              <p className="text-sm text-gray-400">Upload passport, Emirates ID, or other documents here.</p>
              <button className="mt-4 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
                Upload Document
              </button>
            </div>
          )}

          {/* Interests Tab */}
          {activeTab === 'interests' && (
            <div className="text-center py-12">
              <Building2 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No Interests Tracked</h3>
              <p className="text-sm text-gray-400 max-w-md mx-auto">
                Units this customer has viewed, requested, or shown interest in will appear here.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
