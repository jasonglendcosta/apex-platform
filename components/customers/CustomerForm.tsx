'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Save, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface CustomerFormProps {
  onClose?: () => void
  onSuccess?: () => void
}

export function CustomerForm({ onClose, onSuccess }: CustomerFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    nationality: '',
    source: 'walk_in',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (!form.name || !form.phone) {
        throw new Error('Name and phone are required')
      }

      // Calculate initial lead score
      let lead_score = 50
      if (form.source === 'referral') lead_score += 15
      if (form.source === 'website') lead_score += 10
      if (form.source === 'walk_in') lead_score += 20
      if (form.email) lead_score += 5

      const { error: insertError } = await supabase.from('customers').insert([
        {
          name: form.name,
          email: form.email || null,
          phone: form.phone,
          nationality: form.nationality || null,
          source: form.source,
          lead_score: Math.min(100, lead_score)
        }
      ])

      if (insertError) throw insertError

      // Reset form
      setForm({
        name: '',
        email: '',
        phone: '',
        nationality: '',
        source: 'walk_in',
      })

      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add customer')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="glass-card p-6 max-w-md"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">Add New Customer</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Name *</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full name"
            className="w-full px-3 py-2 bg-cmd-darker border border-cmd-border rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-cmd-pink"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="name@example.com"
            className="w-full px-3 py-2 bg-cmd-darker border border-cmd-border rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-cmd-pink"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Phone *</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="+971..."
            className="w-full px-3 py-2 bg-cmd-darker border border-cmd-border rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-cmd-pink"
          />
        </div>

        {/* Nationality */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Nationality</label>
          <input
            type="text"
            name="nationality"
            value={form.nationality}
            onChange={handleChange}
            placeholder="Country"
            className="w-full px-3 py-2 bg-cmd-darker border border-cmd-border rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-cmd-pink"
          />
        </div>

        {/* Source */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Source</label>
          <select
            name="source"
            value={form.source}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-cmd-darker border border-cmd-border rounded-lg text-white focus:outline-none focus:border-cmd-pink"
          >
            <option value="walk_in">Walk-in</option>
            <option value="website">Website</option>
            <option value="referral">Referral</option>
            <option value="broker">Broker</option>
            <option value="social_media">Social Media</option>
          </select>
        </div>

        {/* Error */}
        {error && (
          <div className="p-3 bg-cmd-red/10 border border-cmd-red/30 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-cmd-red mt-0.5 flex-shrink-0" />
            <p className="text-sm text-cmd-red">{error}</p>
          </div>
        )}

        {/* Submit */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-cmd-card text-gray-300 rounded-lg hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2 bg-cmd-pink text-white rounded-lg hover:bg-cmd-pink/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Add Customer
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  )
}
