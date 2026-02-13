'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Save, AlertCircle, User, Mail, Phone, Globe, DollarSign } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { LeadSource, Customer } from '@/types'
import { useToast } from '@/components/ui/Toast'

interface CustomerFormProps {
  onClose?: () => void
  onSuccess?: (customer: Customer) => void
  editCustomer?: Customer
}

interface FormData {
  name: string
  email: string
  phone: string
  nationality: string
  source: LeadSource
  assigned_agent_id: string
  budget_min: string
  budget_max: string
  notes: string
}

interface FormErrors {
  name?: string
  email?: string
  phone?: string
}

const SOURCE_OPTIONS: { value: LeadSource; label: string }[] = [
  { value: 'walk_in', label: 'Walk-in' },
  { value: 'website', label: 'Website' },
  { value: 'referral', label: 'Referral' },
  { value: 'broker', label: 'Broker' },
  { value: 'social_media', label: 'Social Media' },
  { value: 'exhibition', label: 'Exhibition' },
  { value: 'cold_call', label: 'Cold Call' },
  { value: 'other', label: 'Other' },
]

function validateEmail(email: string): boolean {
  if (!email) return true // Optional field
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function validatePhone(phone: string): boolean {
  if (!phone) return false // Required
  return /^[\+]?[\d\s\-\(\)]{7,20}$/.test(phone)
}

export function CustomerForm({ onClose, onSuccess, editCustomer }: CustomerFormProps) {
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [agents, setAgents] = useState<{ id: string; name: string }[]>([])
  const { showToast } = useToast()

  const [form, setForm] = useState<FormData>({
    name: editCustomer?.name || '',
    email: editCustomer?.email || '',
    phone: editCustomer?.phone || '',
    nationality: editCustomer?.nationality || '',
    source: (editCustomer?.source as LeadSource) || 'walk_in',
    assigned_agent_id: editCustomer?.assigned_agent_id || '',
    budget_min: editCustomer?.budget_min?.toString() || '',
    budget_max: editCustomer?.budget_max?.toString() || '',
    notes: editCustomer?.notes || '',
  })

  // Fetch agents for dropdown
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const { data } = await supabase
          .from('users')
          .select('id, name')
          .in('role', ['agent', 'manager', 'admin'])
          .eq('is_active', true)
          .order('name')

        setAgents(data || [])
      } catch {
        // Silently fail - agents dropdown just won't populate
      }
    }
    fetchAgents()
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    // Clear error on change
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const validate = (): boolean => {
    const newErrors: FormErrors = {}

    if (!form.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!form.phone.trim()) {
      newErrors.phone = 'Phone is required'
    } else if (!validatePhone(form.phone)) {
      newErrors.phone = 'Invalid phone format'
    }

    if (form.email && !validateEmail(form.email)) {
      newErrors.email = 'Invalid email format'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)

    try {
      // Calculate lead score
      let leadScore = 50
      const sourceScores: Record<string, number> = {
        walk_in: 20, referral: 18, broker: 15, exhibition: 14,
        website: 12, social_media: 10, cold_call: 5, other: 5,
      }
      leadScore += (sourceScores[form.source] || 5) - 10
      if (form.email) leadScore += 5
      if (form.budget_max) leadScore += 10
      if (form.nationality) leadScore += 3
      leadScore = Math.min(100, Math.max(0, leadScore))

      const customerData = {
        name: form.name.trim(),
        email: form.email.trim() || null,
        phone: form.phone.trim(),
        nationality: form.nationality.trim() || null,
        source: form.source,
        assigned_agent_id: form.assigned_agent_id || null,
        budget_min: form.budget_min ? Number(form.budget_min) : null,
        budget_max: form.budget_max ? Number(form.budget_max) : null,
        notes: form.notes.trim() || null,
        lead_score: leadScore,
        ...(editCustomer ? {} : { lead_status: 'new', tags: [] }),
      }

      if (editCustomer) {
        const { data, error: updateError } = await supabase
          .from('customers')
          .update(customerData)
          .eq('id', editCustomer.id)
          .select()
          .single()

        if (updateError) throw new Error(updateError.message)
        showToast({ type: 'success', title: 'Customer Updated', description: `${form.name} has been updated` })
        onSuccess?.(data as Customer)
      } else {
        const { data, error: insertError } = await supabase
          .from('customers')
          .insert(customerData)
          .select()
          .single()

        if (insertError) throw new Error(insertError.message)
        showToast({ type: 'success', title: 'Customer Added', description: `${form.name} has been added` })
        onSuccess?.(data as Customer)
      }

      onClose?.()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save customer'
      showToast({ type: 'error', title: 'Error', description: message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-[#0a0a0f] border border-white/10 rounded-2xl max-w-lg w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-[#0a0a0f] z-10">
          <div>
            <h3 className="text-lg font-bold text-white">
              {editCustomer ? 'Edit Customer' : 'Add New Customer'}
            </h3>
            <p className="text-sm text-gray-400 mt-0.5">
              {editCustomer ? 'Update customer details' : 'Enter customer details below'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-400 mb-1.5">
              <User className="w-3.5 h-3.5" /> Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full name"
              className={`w-full px-3 py-2.5 bg-white/5 border rounded-xl text-white placeholder-gray-600
                         focus:outline-none transition-colors text-sm ${
                           errors.name ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-[#D86DCB]/50'
                         }`}
            />
            {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-400 mb-1.5">
              <Mail className="w-3.5 h-3.5" /> Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="name@example.com"
              className={`w-full px-3 py-2.5 bg-white/5 border rounded-xl text-white placeholder-gray-600
                         focus:outline-none transition-colors text-sm ${
                           errors.email ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-[#D86DCB]/50'
                         }`}
            />
            {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-400 mb-1.5">
              <Phone className="w-3.5 h-3.5" /> Phone <span className="text-red-400">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+971 50 123 4567"
              className={`w-full px-3 py-2.5 bg-white/5 border rounded-xl text-white placeholder-gray-600
                         focus:outline-none transition-colors text-sm ${
                           errors.phone ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-[#D86DCB]/50'
                         }`}
            />
            {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone}</p>}
          </div>

          {/* Two columns: Nationality + Source */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-gray-400 mb-1.5">
                <Globe className="w-3.5 h-3.5" /> Nationality
              </label>
              <input
                type="text"
                name="nationality"
                value={form.nationality}
                onChange={handleChange}
                placeholder="e.g. Indian"
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white
                           placeholder-gray-600 focus:outline-none focus:border-[#D86DCB]/50 transition-colors text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-400 mb-1.5 block">Source</label>
              <select
                name="source"
                value={form.source}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white
                           focus:outline-none focus:border-[#D86DCB]/50 transition-colors text-sm"
              >
                {SOURCE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value} className="bg-[#1a1a24]">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Assigned Agent */}
          {agents.length > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-400 mb-1.5 block">
                Assigned Agent
              </label>
              <select
                name="assigned_agent_id"
                value={form.assigned_agent_id}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white
                           focus:outline-none focus:border-[#D86DCB]/50 transition-colors text-sm"
              >
                <option value="" className="bg-[#1a1a24]">Unassigned</option>
                {agents.map(agent => (
                  <option key={agent.id} value={agent.id} className="bg-[#1a1a24]">
                    {agent.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Budget Range */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-400 mb-1.5">
              <DollarSign className="w-3.5 h-3.5" /> Budget Range (AED)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                name="budget_min"
                value={form.budget_min}
                onChange={handleChange}
                placeholder="Min"
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white
                           placeholder-gray-600 focus:outline-none focus:border-[#D86DCB]/50 transition-colors text-sm"
              />
              <input
                type="number"
                name="budget_max"
                value={form.budget_max}
                onChange={handleChange}
                placeholder="Max"
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white
                           placeholder-gray-600 focus:outline-none focus:border-[#D86DCB]/50 transition-colors text-sm"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm font-medium text-gray-400 mb-1.5 block">Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Any additional notes..."
              className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white
                         placeholder-gray-600 focus:outline-none focus:border-[#D86DCB]/50 transition-colors
                         text-sm resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-white/5 border border-white/10 text-gray-300 rounded-xl
                         hover:bg-white/10 hover:text-white transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-[#D86DCB] text-white rounded-xl
                         hover:bg-[#D86DCB]/90 transition-colors disabled:opacity-50
                         flex items-center justify-center gap-2 font-semibold
                         shadow-lg shadow-[#D86DCB]/25"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {editCustomer ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {editCustomer ? 'Update Customer' : 'Add Customer'}
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
