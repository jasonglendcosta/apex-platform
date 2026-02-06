'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  RefreshCw, 
  Download,
  Sparkles,
  TrendingUp,
  Calendar,
  Filter,
  ChevronDown,
  Building2,
  DollarSign,
  Target,
  Users,
  Clock,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'

// Import analytics components
import { 
  OverviewCards, 
  InventoryStatusChart, 
  SalesVelocityChart, 
  AgentLeaderboard,
  CollectionsCockpit,
  ConversionFunnel,
  ProjectSelector,
} from '@/components/analytics'

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
}

// Quick Stats Component
function QuickStats() {
  const stats = [
    { 
      label: 'Pipeline Value', 
      value: 'AED 181M', 
      change: '+12%', 
      positive: true,
      icon: <DollarSign className="w-4 h-4" />,
      color: 'from-green-500/20 to-emerald-500/20',
      iconColor: 'text-green-400',
    },
    { 
      label: 'Active Deals', 
      value: '52', 
      change: '+8', 
      positive: true,
      icon: <Target className="w-4 h-4" />,
      color: 'from-blue-500/20 to-cyan-500/20',
      iconColor: 'text-blue-400',
    },
    { 
      label: 'Conversion Rate', 
      value: '24.5%', 
      change: '+5.2%', 
      positive: true,
      icon: <TrendingUp className="w-4 h-4" />,
      color: 'from-apex-pink/20 to-purple-500/20',
      iconColor: 'text-apex-pink',
    },
    { 
      label: 'Avg. Close Time', 
      value: '14 days', 
      change: '-2 days', 
      positive: true,
      icon: <Clock className="w-4 h-4" />,
      color: 'from-amber-500/20 to-orange-500/20',
      iconColor: 'text-amber-400',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          className="relative overflow-hidden"
        >
          <div className={`
            glass-card rounded-2xl p-5 border border-apex-border/50
            hover:border-apex-pink/30 transition-all duration-300
            group cursor-pointer
          `}>
            {/* Background gradient */}
            <div className={`
              absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 
              group-hover:opacity-100 transition-opacity duration-300 rounded-2xl
            `} />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-xl bg-apex-darker/50 ${stat.iconColor}`}>
                  {stat.icon}
                </div>
                <div className={`
                  flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full
                  ${stat.positive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}
                `}>
                  {stat.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.change}
                </div>
              </div>
              <p className="text-xs text-gray-400 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// Time Period Selector
function TimePeriodSelector({ selected, onChange }: { selected: string; onChange: (period: string) => void }) {
  const periods = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'quarter', label: 'This Quarter' },
    { id: 'year', label: 'This Year' },
  ]

  return (
    <div className="flex items-center gap-1 p-1 bg-apex-card rounded-xl border border-apex-border">
      {periods.map((period) => (
        <button
          key={period.id}
          onClick={() => onChange(period.id)}
          className={`
            px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
            ${selected === period.id 
              ? 'bg-apex-pink text-white shadow-glow' 
              : 'text-gray-400 hover:text-white hover:bg-apex-darker/50'
            }
          `}
        >
          {period.label}
        </button>
      ))}
    </div>
  )
}

export default function AnalyticsDashboard() {
  const [selectedProject, setSelectedProject] = useState('all')
  const [timePeriod, setTimePeriod] = useState('month')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API refresh
    await new Promise(resolve => setTimeout(resolve, 1500))
    setLastUpdated(new Date())
    setIsRefreshing(false)
  }

  useEffect(() => {
    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
      setLastUpdated(new Date())
    }, 300000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-apex-dark">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-apex-pink/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-apex-purple/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-apex-cyan/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-apex-dark/80 border-b border-apex-border/50">
          <div className="px-6 py-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Title & Status */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gradient-to-br from-apex-pink to-apex-purple rounded-xl shadow-glow">
                    <LayoutDashboard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl font-bold text-white">Analytics Command</h1>
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-apex-pink/20 text-apex-pink rounded-full uppercase tracking-wider">
                        Live
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 flex items-center gap-2">
                      <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    </p>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex flex-wrap items-center gap-3">
                <ProjectSelector 
                  selected={selectedProject}
                  onSelect={setSelectedProject}
                />
                
                <TimePeriodSelector 
                  selected={timePeriod}
                  onChange={setTimePeriod}
                />

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="p-2.5 bg-apex-card border border-apex-border rounded-xl hover:border-apex-pink/50 transition-all duration-200 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-5 h-5 text-gray-400 ${isRefreshing ? 'animate-spin' : ''}`} />
                  </button>
                  <button className="p-2.5 bg-apex-card border border-apex-border rounded-xl hover:border-apex-pink/50 transition-all duration-200">
                    <Download className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-[1800px] mx-auto space-y-6"
          >
            {/* AI Insight Banner */}
            <motion.div 
              variants={itemVariants}
              className="relative overflow-hidden rounded-2xl border border-apex-pink/30 bg-gradient-to-r from-apex-pink/10 via-apex-purple/10 to-apex-cyan/10"
            >
              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
              <div className="relative p-5 flex items-center gap-4">
                <div className="p-3 bg-apex-pink/20 rounded-xl">
                  <Sparkles className="w-6 h-6 text-apex-pink" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-white mb-1">AI Insight</h3>
                  <p className="text-sm text-gray-300">
                    <span className="text-apex-pink font-medium">Sales velocity is up 15%</span> this week. 
                    Laguna Residence sea-view units are converting 2.3x faster than average. 
                    Consider prioritizing inventory showcase for similar units.
                  </p>
                </div>
                <button className="px-4 py-2 bg-apex-pink/20 hover:bg-apex-pink/30 text-apex-pink text-sm font-medium rounded-lg transition-colors flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  View Details
                </button>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div variants={itemVariants}>
              <QuickStats />
            </motion.div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Sales Velocity Chart */}
              <motion.div variants={itemVariants}>
                <div className="glass-card rounded-2xl border border-apex-border/50 overflow-hidden">
                  <SalesVelocityChart />
                </div>
              </motion.div>

              {/* Inventory Status */}
              <motion.div variants={itemVariants}>
                <div className="glass-card rounded-2xl border border-apex-border/50 overflow-hidden">
                  <InventoryStatusChart />
                </div>
              </motion.div>
            </div>

            {/* Conversion Funnel - Full Width */}
            <motion.div variants={itemVariants}>
              <ConversionFunnel />
            </motion.div>

            {/* Collections Cockpit - Full Width */}
            <motion.div variants={itemVariants}>
              <CollectionsCockpit />
            </motion.div>

            {/* Agent Leaderboard */}
            <motion.div variants={itemVariants}>
              <div className="glass-card rounded-2xl border border-apex-border/50 overflow-hidden">
                <AgentLeaderboard />
              </div>
            </motion.div>

            {/* Footer Stats */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              <div className="glass-card rounded-xl p-4 border border-apex-border/50 text-center">
                <p className="text-xs text-gray-400 mb-1">Total Inventory</p>
                <p className="text-xl font-bold text-white">250 units</p>
              </div>
              <div className="glass-card rounded-xl p-4 border border-apex-border/50 text-center">
                <p className="text-xs text-gray-400 mb-1">YTD Revenue</p>
                <p className="text-xl font-bold text-apex-pink">AED 285M</p>
              </div>
              <div className="glass-card rounded-xl p-4 border border-apex-border/50 text-center">
                <p className="text-xs text-gray-400 mb-1">Absorption Rate</p>
                <p className="text-xl font-bold text-green-400">4.2 units/week</p>
              </div>
              <div className="glass-card rounded-xl p-4 border border-apex-border/50 text-center">
                <p className="text-xs text-gray-400 mb-1">Avg. Price/sqft</p>
                <p className="text-xl font-bold text-white">AED 1,850</p>
              </div>
            </motion.div>
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="px-6 py-4 border-t border-apex-border/50">
          <div className="max-w-[1800px] mx-auto flex items-center justify-between text-sm text-gray-500">
            <p>© 2024 APEX Platform • One Development</p>
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              All systems operational
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
