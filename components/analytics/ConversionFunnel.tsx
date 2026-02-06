'use client'

import { useMemo } from 'react'
import { Users, Eye, Clock, FileText, CheckCircle, Home, ArrowRight, TrendingUp, TrendingDown } from 'lucide-react'

interface FunnelStage {
  name: string
  count: number
  value: number
  icon: React.ReactNode
  color: string
  conversionFromPrev?: number
}

interface ConversionFunnelProps {
  data?: FunnelStage[]
}

const defaultData: FunnelStage[] = [
  { 
    name: 'Leads', 
    count: 1250, 
    value: 0, 
    icon: <Users className="w-4 h-4" />, 
    color: '#D86DCB',
  },
  { 
    name: 'Viewings', 
    count: 485, 
    value: 0, 
    icon: <Eye className="w-4 h-4" />, 
    color: '#8B5CF6',
  },
  { 
    name: 'Reservations', 
    count: 156, 
    value: 85000000, 
    icon: <Clock className="w-4 h-4" />, 
    color: '#22D3EE',
  },
  { 
    name: 'Bookings', 
    count: 98, 
    value: 54000000, 
    icon: <FileText className="w-4 h-4" />, 
    color: '#10B981',
  },
  { 
    name: 'SPA Signed', 
    count: 72, 
    value: 42000000, 
    icon: <CheckCircle className="w-4 h-4" />, 
    color: '#F59E0B',
  },
  { 
    name: 'Closed', 
    count: 45, 
    value: 28500000, 
    icon: <Home className="w-4 h-4" />, 
    color: '#6366F1',
  },
]

export function ConversionFunnel({ data = defaultData }: ConversionFunnelProps) {
  const funnelData = useMemo(() => {
    return data.map((stage, index) => ({
      ...stage,
      conversionFromPrev: index === 0 ? 100 : Math.round((stage.count / data[index - 1].count) * 100),
      percentOfTotal: Math.round((stage.count / data[0].count) * 100),
    }))
  }, [data])

  const overallConversion = ((funnelData[funnelData.length - 1].count / funnelData[0].count) * 100).toFixed(1)

  return (
    <div className="glass-card rounded-2xl p-6 border border-apex-border/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-apex-pink/20 to-apex-purple/20 rounded-xl">
            <TrendingUp className="w-5 h-5 text-apex-pink" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Conversion Funnel</h3>
            <p className="text-sm text-gray-400">Lead to sale pipeline analysis</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">Overall Conversion</p>
          <p className="text-2xl font-bold text-apex-pink">{overallConversion}%</p>
        </div>
      </div>

      {/* Funnel Visualization */}
      <div className="space-y-3">
        {funnelData.map((stage, index) => (
          <div key={stage.name} className="relative">
            {/* Stage Row */}
            <div className="flex items-center gap-4">
              {/* Icon & Name */}
              <div className="flex items-center gap-3 w-36 flex-shrink-0">
                <div 
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${stage.color}20` }}
                >
                  <div style={{ color: stage.color }}>{stage.icon}</div>
                </div>
                <span className="text-sm font-medium text-white">{stage.name}</span>
              </div>

              {/* Funnel Bar */}
              <div className="flex-1 relative">
                <div className="h-12 bg-apex-darker rounded-lg overflow-hidden relative">
                  <div
                    className="h-full rounded-lg transition-all duration-500 ease-out relative overflow-hidden"
                    style={{
                      width: `${stage.percentOfTotal}%`,
                      backgroundColor: stage.color,
                      minWidth: '60px',
                    }}
                  >
                    {/* Shimmer effect */}
                    <div 
                      className="absolute inset-0 opacity-30"
                      style={{
                        background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)`,
                        animation: 'shimmer 2s infinite',
                      }}
                    />
                    {/* Count inside bar */}
                    <div className="absolute inset-0 flex items-center justify-between px-4">
                      <span className="text-sm font-bold text-white drop-shadow-lg">
                        {stage.count.toLocaleString()}
                      </span>
                      {stage.value > 0 && (
                        <span className="text-xs font-medium text-white/80 drop-shadow-lg">
                          AED {(stage.value / 1000000).toFixed(0)}M
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Conversion Rate */}
              <div className="w-24 flex-shrink-0 text-right">
                {index > 0 && (
                  <div className="flex items-center justify-end gap-1">
                    {stage.conversionFromPrev && stage.conversionFromPrev >= 50 ? (
                      <TrendingUp className="w-3 h-3 text-green-400" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-amber-400" />
                    )}
                    <span className={`text-sm font-bold ${
                      stage.conversionFromPrev && stage.conversionFromPrev >= 50 
                        ? 'text-green-400' 
                        : 'text-amber-400'
                    }`}>
                      {stage.conversionFromPrev}%
                    </span>
                  </div>
                )}
                {index === 0 && (
                  <span className="text-xs text-gray-500">Source</span>
                )}
              </div>
            </div>

            {/* Arrow between stages */}
            {index < funnelData.length - 1 && (
              <div className="flex items-center justify-center py-1">
                <div className="flex items-center gap-2 text-gray-600">
                  <div className="w-px h-2 bg-apex-border" />
                  <ArrowRight className="w-3 h-3" />
                  <div className="w-px h-2 bg-apex-border" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Stage Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-apex-border/50">
        <div className="bg-apex-darker/30 rounded-xl p-4">
          <p className="text-xs text-gray-400 mb-1">Lead → Viewing</p>
          <p className="text-lg font-bold text-white">38.8%</p>
          <p className="text-xs text-green-400 mt-1">↑ 4.2% vs last month</p>
        </div>
        <div className="bg-apex-darker/30 rounded-xl p-4">
          <p className="text-xs text-gray-400 mb-1">Viewing → Reserve</p>
          <p className="text-lg font-bold text-white">32.2%</p>
          <p className="text-xs text-amber-400 mt-1">↓ 1.8% vs last month</p>
        </div>
        <div className="bg-apex-darker/30 rounded-xl p-4">
          <p className="text-xs text-gray-400 mb-1">Reserve → Close</p>
          <p className="text-lg font-bold text-white">28.8%</p>
          <p className="text-xs text-green-400 mt-1">↑ 2.5% vs last month</p>
        </div>
        <div className="bg-apex-darker/30 rounded-xl p-4">
          <p className="text-xs text-gray-400 mb-1">Avg. Time to Reserve</p>
          <p className="text-lg font-bold text-white">4.2 days</p>
          <p className="text-xs text-green-400 mt-1">-0.5 days improved</p>
        </div>
        <div className="bg-apex-darker/30 rounded-xl p-4">
          <p className="text-xs text-gray-400 mb-1">Avg. Time to Close</p>
          <p className="text-lg font-bold text-white">32 days</p>
          <p className="text-xs text-amber-400 mt-1">+2 days slower</p>
        </div>
        <div className="bg-apex-darker/30 rounded-xl p-4">
          <p className="text-xs text-gray-400 mb-1">Pipeline Value</p>
          <p className="text-lg font-bold text-apex-pink">AED 181M</p>
          <p className="text-xs text-gray-400 mt-1">All active stages</p>
        </div>
      </div>
    </div>
  )
}
