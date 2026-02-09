'use client'

import { DollarSign, Building, Target, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react'

interface OverviewCardsProps {
  stats?: {
    revenue: number
    unitsSold: number
    daysToClose: number
    conversionRate: number
  }
}

const DEFAULT_STATS = {
  revenue: 12.5,
  unitsSold: 8,
  daysToClose: 14,
  conversionRate: 24,
}

export function OverviewCards({ stats = DEFAULT_STATS }: OverviewCardsProps) {
  const defaultStats = {
    ...DEFAULT_STATS,
    ...stats
  }

  const cards = [
    {
      title: 'Revenue This Month',
      value: `AED ${defaultStats.revenue}M`,
      change: '+18%',
      icon: <DollarSign className="w-5 h-5" />,
      positive: true
    },
    {
      title: 'Units Sold',
      value: defaultStats.unitsSold.toString(),
      change: '+3 vs last month',
      icon: <Building className="w-5 h-5" />,
      positive: true
    },
    {
      title: 'Avg. Days to Close',
      value: defaultStats.daysToClose.toString(),
      change: '-2 days',
      icon: <Target className="w-5 h-5" />,
      positive: true
    },
    {
      title: 'Conversion Rate',
      value: `${defaultStats.conversionRate}%`,
      change: '+5%',
      icon: <TrendingUp className="w-5 h-5" />,
      positive: true
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <div key={index} className="card">
          <div className="flex items-start justify-between mb-4">
            <div className="p-2 bg-apex-pink/10 rounded-lg text-apex-pink">
              {card.icon}
            </div>
            <div className={`flex items-center gap-1 text-sm ${card.positive ? 'text-green-400' : 'text-red-400'}`}>
              {card.positive ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownRight className="w-4 h-4" />
              )}
              {card.change}
            </div>
          </div>
          <h3 className="text-gray-400 text-sm mb-2">{card.title}</h3>
          <p className="text-2xl font-bold text-white">{card.value}</p>
        </div>
      ))}
    </div>
  )
}
