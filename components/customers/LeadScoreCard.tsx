'use client'

import { TrendingUp, Users, Clock, DollarSign, FileCheck, Zap } from 'lucide-react'

interface LeadScoreBreakdown {
  source: number
  engagement: number
  recency: number
  budget: number
  completeness: number
  total: number
  label: string
}

interface LeadScoreCardProps {
  score: number
  breakdown?: LeadScoreBreakdown
  compact?: boolean
}

interface BreakdownItem {
  label: string
  value: number
  maxValue: number
  icon: React.ReactNode
  color: string
  bgColor: string
}

function getScoreColor(score: number): { text: string; bg: string; ring: string; gradient: string } {
  if (score >= 75) {
    return {
      text: 'text-emerald-400',
      bg: 'bg-emerald-500/20',
      ring: 'ring-emerald-500/30',
      gradient: 'from-emerald-500 to-emerald-400',
    }
  }
  if (score >= 50) {
    return {
      text: 'text-amber-400',
      bg: 'bg-amber-500/20',
      ring: 'ring-amber-500/30',
      gradient: 'from-amber-500 to-amber-400',
    }
  }
  return {
    text: 'text-red-400',
    bg: 'bg-red-500/20',
    ring: 'ring-red-500/30',
    gradient: 'from-red-500 to-red-400',
  }
}

function getScoreLabel(score: number): string {
  if (score >= 85) return 'Hot Lead 🔥'
  if (score >= 75) return 'Very Warm'
  if (score >= 60) return 'Warm Lead'
  if (score >= 40) return 'Cool Lead'
  return 'Cold Lead'
}

export function LeadScoreCard({ score, breakdown, compact = false }: LeadScoreCardProps) {
  const colors = getScoreColor(score)
  const label = breakdown?.label || getScoreLabel(score)

  // Build breakdown items
  const breakdownItems: BreakdownItem[] = breakdown
    ? [
        {
          label: 'Source Quality',
          value: breakdown.source,
          maxValue: 20,
          icon: <Users className="w-3.5 h-3.5" />,
          color: 'text-blue-400',
          bgColor: 'bg-blue-500',
        },
        {
          label: 'Engagement',
          value: breakdown.engagement,
          maxValue: 20,
          icon: <Zap className="w-3.5 h-3.5" />,
          color: 'text-purple-400',
          bgColor: 'bg-purple-500',
        },
        {
          label: 'Recency',
          value: breakdown.recency,
          maxValue: 20,
          icon: <Clock className="w-3.5 h-3.5" />,
          color: 'text-cyan-400',
          bgColor: 'bg-cyan-500',
        },
        {
          label: 'Budget Match',
          value: breakdown.budget,
          maxValue: 20,
          icon: <DollarSign className="w-3.5 h-3.5" />,
          color: 'text-emerald-400',
          bgColor: 'bg-emerald-500',
        },
        {
          label: 'Profile Complete',
          value: breakdown.completeness,
          maxValue: 20,
          icon: <FileCheck className="w-3.5 h-3.5" />,
          color: 'text-amber-400',
          bgColor: 'bg-amber-500',
        },
      ]
    : []

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div
          className={`relative w-10 h-10 rounded-full ${colors.bg} flex items-center justify-center ring-2 ${colors.ring}`}
        >
          <span className={`text-sm font-bold ${colors.text}`}>{score}</span>
        </div>
        <div>
          <span className={`text-xs font-medium ${colors.text}`}>{label}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#1a1a24] rounded-xl border border-white/10 p-5">
      {/* Header with score gauge */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-white">Lead Score</h3>
          <p className={`text-xs mt-0.5 ${colors.text}`}>{label}</p>
        </div>

        {/* Circular score gauge */}
        <div className="relative w-16 h-16">
          <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
            {/* Background circle */}
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="4"
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="url(#scoreGradient)"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${(score / 100) * 175.93} 175.93`}
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop
                  offset="0%"
                  stopColor={score >= 75 ? '#10B981' : score >= 50 ? '#F59E0B' : '#EF4444'}
                />
                <stop
                  offset="100%"
                  stopColor={score >= 75 ? '#34D399' : score >= 50 ? '#FBBF24' : '#F87171'}
                />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-lg font-bold ${colors.text}`}>{score}</span>
          </div>
        </div>
      </div>

      {/* Score bar */}
      <div className="mb-5">
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${colors.gradient} transition-all duration-1000 ease-out`}
            style={{ width: `${score}%` }}
          />
        </div>
        <div className="flex justify-between mt-1.5 text-[10px] text-gray-500">
          <span>0</span>
          <span>25</span>
          <span>50</span>
          <span>75</span>
          <span>100</span>
        </div>
      </div>

      {/* Breakdown */}
      {breakdownItems.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            Score Breakdown
          </h4>
          {breakdownItems.map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <div className={`flex-shrink-0 ${item.color}`}>{item.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-400">{item.label}</span>
                  <span className={`text-xs font-medium ${item.color}`}>
                    +{item.value}
                  </span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.bgColor} transition-all duration-500`}
                    style={{ width: `${(item.value / item.maxValue) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
