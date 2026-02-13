'use client'

import { useState, useEffect, useCallback } from 'react'
import { Clock, AlertTriangle, XCircle } from 'lucide-react'

interface ReservationExpiryTimerProps {
  expiresAt: string
  onExpired?: () => void
  compact?: boolean
}

interface TimeRemaining {
  days: number
  hours: number
  minutes: number
  seconds: number
  totalMs: number
  isExpired: boolean
}

function calculateTimeRemaining(expiresAt: string): TimeRemaining {
  const now = Date.now()
  const expires = new Date(expiresAt).getTime()
  const diff = expires - now

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0, isExpired: true }
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
    totalMs: diff,
    isExpired: false,
  }
}

export function ReservationExpiryTimer({
  expiresAt,
  onExpired,
  compact = false,
}: ReservationExpiryTimerProps) {
  const [time, setTime] = useState<TimeRemaining>(() => calculateTimeRemaining(expiresAt))
  const [hasNotifiedExpiry, setHasNotifiedExpiry] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = calculateTimeRemaining(expiresAt)
      setTime(remaining)

      if (remaining.isExpired && !hasNotifiedExpiry) {
        setHasNotifiedExpiry(true)
        onExpired?.()
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [expiresAt, onExpired, hasNotifiedExpiry])

  // Urgency levels
  const isUrgent = time.totalMs > 0 && time.totalMs < 60 * 60 * 1000 // < 1 hour
  const isWarning = time.totalMs > 0 && time.totalMs < 4 * 60 * 60 * 1000 // < 4 hours

  if (time.isExpired) {
    if (compact) {
      return (
        <span className="flex items-center gap-1.5 text-xs text-red-400">
          <XCircle className="w-3 h-3" />
          Expired
        </span>
      )
    }

    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-lg">
        <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
        <span className="text-sm font-medium text-red-400">Reservation expired</span>
      </div>
    )
  }

  // Format the display
  const parts: string[] = []
  if (time.days > 0) parts.push(`${time.days}d`)
  if (time.hours > 0 || time.days > 0) parts.push(`${time.hours}h`)
  parts.push(`${time.minutes}m`)
  if (time.days === 0 && time.hours === 0) parts.push(`${time.seconds}s`)

  const displayText = parts.join(' ')

  if (compact) {
    return (
      <span
        className={`flex items-center gap-1.5 text-xs font-medium ${
          isUrgent
            ? 'text-red-400'
            : isWarning
            ? 'text-amber-400'
            : 'text-emerald-400'
        }`}
      >
        <Clock className={`w-3 h-3 ${isUrgent ? 'animate-pulse' : ''}`} />
        {displayText}
      </span>
    )
  }

  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
        isUrgent
          ? 'bg-red-500/10 border-red-500/30'
          : isWarning
          ? 'bg-amber-500/10 border-amber-500/30'
          : 'bg-emerald-500/10 border-emerald-500/30'
      }`}
    >
      {isUrgent ? (
        <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 animate-pulse" />
      ) : (
        <Clock
          className={`w-4 h-4 flex-shrink-0 ${
            isWarning ? 'text-amber-400' : 'text-emerald-400'
          }`}
        />
      )}
      <div className="flex-1 min-w-0">
        <span
          className={`text-sm font-medium ${
            isUrgent
              ? 'text-red-400'
              : isWarning
              ? 'text-amber-400'
              : 'text-emerald-400'
          }`}
        >
          Expires in {displayText}
        </span>
      </div>

      {/* Visual progress bar */}
      <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${
            isUrgent
              ? 'bg-red-400'
              : isWarning
              ? 'bg-amber-400'
              : 'bg-emerald-400'
          }`}
          style={{
            // Assuming 72h max reservation
            width: `${Math.max(5, Math.min(100, (time.totalMs / (72 * 60 * 60 * 1000)) * 100))}%`,
          }}
        />
      </div>
    </div>
  )
}
