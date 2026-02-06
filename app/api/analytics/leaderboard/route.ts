import { NextResponse } from 'next/server'

// Mock agent leaderboard data
const mockLeaderboard = {
  period: 'month',
  agents: [
    { 
      rank: 1, 
      id: 'agent-1',
      name: 'Ahmed Al-Rashid', 
      avatar: '/avatars/ahmed.jpg',
      units: 8, 
      revenue: 28500000,
      commission: 712500,
      conversionRate: 8.2,
      avgDaysToClose: 12,
      activeDeals: 5,
      trend: 'up',
    },
    { 
      rank: 2, 
      id: 'agent-2',
      name: 'Sarah Johnson', 
      avatar: '/avatars/sarah.jpg',
      units: 6, 
      revenue: 22100000,
      commission: 552500,
      conversionRate: 6.8,
      avgDaysToClose: 14,
      activeDeals: 4,
      trend: 'up',
    },
    { 
      rank: 3, 
      id: 'agent-3',
      name: 'Mohammed Hassan', 
      avatar: '/avatars/mohammed.jpg',
      units: 5, 
      revenue: 18700000,
      commission: 467500,
      conversionRate: 5.9,
      avgDaysToClose: 16,
      activeDeals: 6,
      trend: 'stable',
    },
    { 
      rank: 4, 
      id: 'agent-4',
      name: 'Lisa Chen', 
      avatar: '/avatars/lisa.jpg',
      units: 4, 
      revenue: 15200000,
      commission: 380000,
      conversionRate: 5.2,
      avgDaysToClose: 15,
      activeDeals: 3,
      trend: 'up',
    },
    { 
      rank: 5, 
      id: 'agent-5',
      name: 'James Williams', 
      avatar: '/avatars/james.jpg',
      units: 3, 
      revenue: 11800000,
      commission: 295000,
      conversionRate: 4.5,
      avgDaysToClose: 18,
      activeDeals: 4,
      trend: 'down',
    },
    { 
      rank: 6, 
      id: 'agent-6',
      name: 'Aisha Mahmoud', 
      avatar: '/avatars/aisha.jpg',
      units: 2, 
      revenue: 8400000,
      commission: 210000,
      conversionRate: 4.1,
      avgDaysToClose: 20,
      activeDeals: 2,
      trend: 'stable',
    },
  ],
  
  teamStats: {
    totalUnits: 28,
    totalRevenue: 104700000,
    avgConversionRate: 5.8,
    avgDaysToClose: 15.8,
    totalActiveDeals: 24,
  },
  
  monthlyTargets: {
    units: 35,
    revenue: 120000000,
    unitsProgress: 80,
    revenueProgress: 87.25,
  },
  
  topByMetric: {
    mostUnits: { name: 'Ahmed Al-Rashid', value: 8 },
    highestRevenue: { name: 'Ahmed Al-Rashid', value: 28500000 },
    bestConversion: { name: 'Ahmed Al-Rashid', value: 8.2 },
    fastestClose: { name: 'Ahmed Al-Rashid', value: 12 },
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const projectId = searchParams.get('project') || 'all'
  const period = searchParams.get('period') || 'month'

  await new Promise(resolve => setTimeout(resolve, 100))

  return NextResponse.json({
    success: true,
    data: mockLeaderboard,
    meta: {
      projectId,
      period,
      generatedAt: new Date().toISOString(),
    }
  })
}
