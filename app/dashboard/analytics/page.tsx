'use client'

import { Header } from '@/components/layout/Header'
import { OverviewCards } from '@/components/analytics/OverviewCards'
import { SalesVelocityChart } from '@/components/analytics/SalesVelocityChart'
import { InventoryStatusChart } from '@/components/analytics/InventoryStatusChart'
import { AgentLeaderboard } from '@/components/analytics/AgentLeaderboard'

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen">
      <Header 
        title="Analytics" 
        description="Sales performance and market insights"
      />
      
      <div className="p-8">
        {/* Overview Cards */}
        <OverviewCards />

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <SalesVelocityChart />
          <InventoryStatusChart />
        </div>

        {/* Agent Leaderboard */}
        <AgentLeaderboard />
      </div>
    </div>
  )
}
