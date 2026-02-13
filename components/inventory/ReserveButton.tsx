'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, CheckCircle2, Clock, AlertCircle, X, Unlock, Timer, Users } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { ReservationExpiryTimer } from './ReservationExpiryTimer'
import { useToast } from '@/components/ui/Toast'

interface ReserveButtonProps {
  unitId: string
  unitNumber: string
  currentPrice: number
  customerId: string | null
  customerName?: string
  status: string
  reservedBy?: string
  reservedByName?: string
  reservationExpiresAt?: string
  onReserveSuccess?: () => void
  onConflict?: () => void
}

export function ReserveButton({
  unitId,
  unitNumber,
  currentPrice,
  customerId,
  customerName,
  status,
  reservedBy,
  reservedByName,
  reservationExpiresAt,
  onReserveSuccess,
  onConflict,
}: ReserveButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hours, setHours] = useState(48)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [optimisticReserved, setOptimisticReserved] = useState(false)
  const { showToast } = useToast()

  const isAvailable = status === 'available' && !optimisticReserved
  const isReservedByMe = reservedBy === customerId || optimisticReserved
  const isReservedByOther = status === 'reserved' && !isReservedByMe && !optimisticReserved

  const handleReserve = useCallback(async () => {
    if (!customerId || !isAvailable) return

    // Optimistic update — immediately show reserved state
    setOptimisticReserved(true)
    setIsLoading(true)
    setError(null)

    try {
      // Race condition check: only update if still available
      const { data: freshUnit, error: checkError } = await supabase
        .from('units')
        .select('status')
        .eq('id', unitId)
        .single()

      if (checkError) throw new Error('Failed to verify unit availability')

      if (freshUnit.status !== 'available') {
        // Revert optimistic update
        setOptimisticReserved(false)
        setError('This unit was just reserved by someone else')
        onConflict?.()
        showToast({
          type: 'warning',
          title: 'Reservation Conflict',
          description: `Unit ${unitNumber} was just reserved by another agent`,
        })
        return
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
        .eq('status', 'available') // Optimistic lock

      if (updateError) {
        setOptimisticReserved(false)
        throw new Error(updateError.message)
      }

      setSuccess(true)
      showToast({
        type: 'success',
        title: 'Unit Reserved!',
        description: `${unitNumber} reserved for ${hours}h`,
      })

      setTimeout(() => {
        setIsOpen(false)
        setSuccess(false)
        onReserveSuccess?.()
      }, 1500)
    } catch (err) {
      setOptimisticReserved(false)
      const message = err instanceof Error ? err.message : 'Failed to reserve unit'
      setError(message)
      showToast({ type: 'error', title: 'Reservation Failed', description: message })
    } finally {
      setIsLoading(false)
    }
  }, [customerId, isAvailable, unitId, hours, unitNumber, onReserveSuccess, onConflict, showToast])

  const handleRelease = useCallback(async () => {
    if (!isReservedByMe) return

    setIsLoading(true)

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

      setOptimisticReserved(false)
      showToast({
        type: 'info',
        title: 'Reservation Released',
        description: `Unit ${unitNumber} is now available`,
      })
      onReserveSuccess?.()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to release unit'
      setError(message)
      showToast({ type: 'error', title: 'Release Failed', description: message })
    } finally {
      setIsLoading(false)
    }
  }, [isReservedByMe, unitId, unitNumber, onReserveSuccess, showToast])

  return (
    <>
      {/* Reserved by me — show release + timer */}
      {isReservedByMe && (
        <div className="space-y-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 px-3 py-2 bg-[#D86DCB]/10 border border-[#D86DCB]/30 rounded-lg"
          >
            <CheckCircle2 className="w-4 h-4 text-[#D86DCB]" />
            <span className="text-sm font-medium text-[#D86DCB]">Reserved by You</span>
          </motion.div>

          {reservationExpiresAt && (
            <ReservationExpiryTimer
              expiresAt={reservationExpiresAt}
              onExpired={() => {
                setOptimisticReserved(false)
                showToast({
                  type: 'warning',
                  title: 'Reservation Expired',
                  description: `Your reservation on ${unitNumber} has expired`,
                })
              }}
            />
          )}

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={handleRelease}
            disabled={isLoading}
            className="w-full px-4 py-2 bg-amber-500/10 border border-amber-500/30 text-amber-400
                       rounded-lg text-sm font-medium hover:bg-amber-500/20 transition-colors
                       disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Unlock className="w-4 h-4" />
            Release Reservation
          </motion.button>
        </div>
      )}

      {/* Reserved by someone else */}
      {isReservedByOther && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-3 py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <Users className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-amber-400">
              Reserved{reservedByName ? ` by ${reservedByName}` : ''}
            </span>
          </div>
          {reservationExpiresAt && (
            <ReservationExpiryTimer expiresAt={reservationExpiresAt} compact />
          )}
        </div>
      )}

      {/* Available — show reserve button */}
      {isAvailable && !isReservedByMe && !isReservedByOther && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setIsOpen(true)}
          disabled={!customerId}
          className="w-full px-4 py-3 bg-[#D86DCB] text-white rounded-lg text-sm font-semibold
                     hover:bg-[#D86DCB]/90 transition-colors disabled:opacity-50
                     flex items-center justify-center gap-2 shadow-lg shadow-[#D86DCB]/25"
        >
          <Lock className="w-4 h-4" />
          Reserve Unit
        </motion.button>
      )}

      {/* Confirmation Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl"
            >
              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-6"
                >
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Unit Reserved!</h3>
                  <p className="text-sm text-gray-400">
                    {unitNumber} is now reserved for {hours} hours
                  </p>
                </motion.div>
              ) : (
                <>
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-white">Reserve Unit</h3>
                      <p className="text-sm text-gray-400 mt-0.5">Confirm reservation details</p>
                    </div>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>

                  {/* Unit Info Summary */}
                  <div className="bg-white/5 rounded-xl p-4 mb-5 border border-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Unit</span>
                      <span className="text-sm font-semibold text-white">{unitNumber}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Price</span>
                      <span className="text-sm font-semibold text-[#D86DCB]">
                        AED {currentPrice.toLocaleString()}
                      </span>
                    </div>
                    {customerName && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Customer</span>
                        <span className="text-sm font-semibold text-white">{customerName}</span>
                      </div>
                    )}
                  </div>

                  {/* Duration Selection */}
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-400 mb-3">
                      <Timer className="w-4 h-4 inline mr-1.5" />
                      Reservation Duration
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[24, 48, 72].map((h) => (
                        <button
                          key={h}
                          onClick={() => setHours(h)}
                          className={`py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                            hours === h
                              ? 'bg-[#D86DCB] text-white shadow-lg shadow-[#D86DCB]/25'
                              : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                          }`}
                        >
                          {h} hours
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Info notice */}
                  <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-start gap-2 mb-5">
                    <Clock className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-blue-300">
                      Unit will be automatically released after {hours} hours if not converted to a booking.
                    </p>
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2 mb-5">
                      <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-red-400">{error}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsOpen(false)}
                      className="flex-1 px-4 py-3 bg-white/5 border border-white/10 text-gray-300 rounded-xl
                                 hover:bg-white/10 hover:text-white transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleReserve}
                      disabled={isLoading}
                      className="flex-1 px-4 py-3 bg-[#D86DCB] text-white rounded-xl
                                 hover:bg-[#D86DCB]/90 transition-colors disabled:opacity-50
                                 flex items-center justify-center gap-2 font-semibold
                                 shadow-lg shadow-[#D86DCB]/25"
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
