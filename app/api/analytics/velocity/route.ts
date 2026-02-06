import { NextResponse } from 'next/server'

// Mock sales velocity data
const mockVelocity = {
  weekly: [
    { week: 'W1', units: 2, revenue: 7.0, date: '2024-01-01' },
    { week: 'W2', units: 3, revenue: 10.5, date: '2024-01-08' },
    { week: 'W3', units: 1, revenue: 3.5, date: '2024-01-15' },
    { week: 'W4', units: 2, revenue: 6.5, date: '2024-01-22' },
    { week: 'W5', units: 4, revenue: 14.0, date: '2024-01-29' },
    { week: 'W6', units: 3, revenue: 10.5, date: '2024-02-05' },
    { week: 'W7', units: 5, revenue: 18.0, date: '2024-02-12' },
    { week: 'W8', units: 6, revenue: 21.0, date: '2024-02-19' },
    { week: 'W9', units: 8, revenue: 28.5, date: '2024-02-26' },
    { week: 'W10', units: 6, revenue: 22.0, date: '2024-03-04' },
    { week: 'W11', units: 7, revenue: 25.0, date: '2024-03-11' },
    { week: 'W12', units: 8, revenue: 28.5, date: '2024-03-18' },
  ],
  
  monthly: [
    { month: 'Oct', units: 8, revenue: 28.5 },
    { month: 'Nov', units: 11, revenue: 38.5 },
    { month: 'Dec', units: 9, revenue: 31.5 },
    { month: 'Jan', units: 8, revenue: 27.5 },
    { month: 'Feb', units: 22, revenue: 77.0 },
    { month: 'Mar', units: 21, revenue: 75.5 },
  ],
  
  trend: {
    direction: 'up',
    percentChange: 15.4,
    avgWeeklyUnits: 4.6,
    avgWeeklyRevenue: 16.3,
    projectedMonthly: 18,
    projectedRevenue: 65.2,
  },
  
  byProject: {
    'laguna': { units: 8, revenue: 28.5, trend: 'up' },
    'do-dubai': { units: 3, revenue: 10.5, trend: 'stable' },
    'infinity': { units: 1, revenue: 3.5, trend: 'up' },
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const projectId = searchParams.get('project') || 'all'
  const period = searchParams.get('period') || 'weekly'

  await new Promise(resolve => setTimeout(resolve, 100))

  return NextResponse.json({
    success: true,
    data: mockVelocity,
    meta: {
      projectId,
      period,
      generatedAt: new Date().toISOString(),
    }
  })
}
