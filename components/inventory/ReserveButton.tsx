'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, CheckCircle2, Clock, AlertCircle, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface ReserveButtonProps {
  unitId: string
  unitNumber: string
  customerId: string | null
  status: string
  reservedBy?: string
  onReserveSuccess?: () => void
}

export function ReserveButton({
  unitId,
  unitNumber,
  customerId,
  status,
  reservedBy,
  onReserveSuccess
}: ReserveButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hours, setHours] = useState(48)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const isAvailable = status === 'available'
  const isReservedByMe = reservedBy === customerId

  const handleReserve = async () => {
    if (!customerId || !isAvailable) return

    setIsLoading(true)
    setError(null)

    try {
      const expiryDate = new Date()
      expiryDate.setHours(expiryDate.getHours() + hours)

      const { error: updateError } = await supabase
        .from('units')
        .update({
          status: 'reserved',
          reserved_by: customerId,
          reserved_at: new Date().toISOString(),
          reservation_expires_at: expiryDate.toISOString()
        })
        .eq('id', unitId)

      if (updateError) throw updateError

      setSuccess(true)
      setTimeout(() => {
        setIsOpen(false)
        setSuccess(false)
        onReserveSuccess?.()
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reserve unit')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRelease = async () => {
    if (!isReservedByMe) return

    setIsLoading(true)

    try {
      const { error: updateError } = await supabase
        .from('units')
        .update({
          status: 'available',
          reserved_by: null,
          reserved_at: null,
          reservation_expires_at: null
        })
        .eq('id', unitId)

      if (updateError) throw updateError
      onReserveSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to release unit')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {isReservedByMe && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={handleRelease}
          disabled={isLoading}
          className="px-4 py-2 bg-cmd-amber/20 border border-cmd-amber/30 text-cmd-amber rounded-lg text-sm font-medium hover:bg-cmd-amber/30 transition-colors disabled:opacity-50"
        >
          Release Reservation
        </motion.button>
      )}

      {isAvailable && !isReservedByMe && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setIsOpen(true)}
          disabled={!customerId}
          className="px-4 py-2 bg-cmd-pink/20 border border-cmd-pink/30 text-cmd-pink rounded-lg text-sm font-medium hover:bg-cmd-pink/30 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <Lock className="w-4 h-4" />
          Reserve
        </motion.button>
      )}

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-cmd-darker border border-cmd-border rounded-xl p-6 max-w-md w-full mx-4"
            >
              {success ? (
                <div className="text-center py-4">
                  <CheckCircle2 className="w-12 h-12 text-cmd-green mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-white mb-2">
                    Unit Reserved!
                  </h3>
                  <p className="text-sm text-gray-400">
                    {unitNumber} is now reserved for {hours} hours
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">
                      Reserve Unit {unitNumber}
                    </h3>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="text-gray-500 hover:text-white transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        Reservation Duration
                      </label>
                      <div className="flex gap-2">
                        {[24, 48, 72].map((h) => (
                          <button
                            key={h}
                            onClick={() => setHours(h)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              hours === h
                                ? 'bg-cmd-pink text-white'
                                : 'bg-cmd-card text-gray-400 hover:text-white'
                            }`}
                          >
                            {h}h
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-3 bg-cmd-card rounded-lg flex items-start gap-2">
                      <Clock className="w-4 h-4 text-cmd-amber mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-300">
                        Unit will be automatically released if not converted to booking
                      </p>
                    </div>

                    {error && (
                      <div className="p-3 bg-cmd-red/10 border border-cmd-red/30 rounded-lg flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-cmd-red mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-cmd-red">{error}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsOpen(false)}
                      className="flex-1 px-4 py-2 bg-cmd-card text-gray-300 rounded-lg hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleReserve}
                      disabled={isLoading}
                      className="flex-1 px-4 py-2 bg-cmd-pink text-white rounded-lg hover:bg-cmd-pink/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Reserving...
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          Confirm Reserve
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
