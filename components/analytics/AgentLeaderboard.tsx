'use client'

import { Medal } from 'lucide-react'

interface Agent {
  rank: number
  name: string
  units: number
  revenue: number
}

interface AgentLeaderboardProps {
  agents?: Agent[]
}

export function AgentLeaderboard({ agents = [] }: AgentLeaderboardProps) {
  const defaultAgents: Agent[] = [
    { rank: 1, name: 'Ahmed Al-Rashid', units: 8, revenue: 28500000 },
    { rank: 2, name: 'Sarah Johnson', units: 6, revenue: 22100000 },
    { rank: 3, name: 'Mohammed Hassan', units: 5, revenue: 18700000 },
    { rank: 4, name: 'Lisa Chen', units: 4, revenue: 15200000 },
    { rank: 5, name: 'James Williams', units: 3, revenue: 11800000 },
  ]

  const leaderboardData = agents.length > 0 ? agents : defaultAgents

  const getMedalColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-500/20 text-yellow-400'
      case 2:
        return 'bg-gray-400/20 text-gray-300'
      case 3:
        return 'bg-orange-500/20 text-orange-400'
      default:
        return 'bg-blue-500/20 text-blue-400'
    }
  }

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-6">
        <Medal className="w-5 h-5 text-apex-pink" />
        <h3 className="text-lg font-semibold text-white">Agent Leaderboard</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-apex-border">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Rank</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Agent</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Units Sold</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Revenue</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Commission</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map((agent) => {
              const commission = agent.revenue * 0.025
              return (
                <tr key={agent.rank} className="border-b border-apex-border hover:bg-apex-darker/50 transition-colors">
                  <td className="py-4 px-4">
                    <span className={`
                      w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                      ${getMedalColor(agent.rank)}
                    `}>
                      {agent.rank}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-medium text-white">{agent.name}</td>
                  <td className="py-4 px-4 text-right text-gray-300">{agent.units} units</td>
                  <td className="py-4 px-4 text-right text-white">AED {(agent.revenue / 1000000).toFixed(1)}M</td>
                  <td className="py-4 px-4 text-right text-green-400 font-semibold">
                    AED {(commission / 1000).toFixed(0)}K
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
