import { NextResponse } from 'next/server'

// Mock data matching One Development structure
const mockOverview = {
  // Current month stats
  revenue: 45200000,
  revenueChange: 18.5,
  unitsSold: 12,
  unitsSoldChange: 3,
  avgDaysToClose: 14,
  daysToCloseChange: -2,
  conversionRate: 24.5,
  conversionRateChange: 5.2,
  
  // Pipeline
  pipelineValue: 181000000,
  pipelineUnits: 52,
  
  // Comparison
  previousMonth: {
    revenue: 38100000,
    unitsSold: 9,
    avgDaysToClose: 16,
    conversionRate: 19.3,
  },
  
  // Year to date
  ytd: {
    revenue: 285000000,
    unitsSold: 78,
    avgDealSize: 3653846,
  },
  
  // By project
  byProject: {
    'laguna': { revenue: 28500000, units: 8, name: 'Laguna Residence' },
    'do-dubai': { revenue: 12400000, units: 3, name: 'DO Dubai Island' },
    'infinity': { revenue: 4300000, units: 1, name: 'Infinity One' },
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const projectId = searchParams.get('project') || 'all'
  const period = searchParams.get('period') || 'month'

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100))

  return NextResponse.json({
    success: true,
    data: mockOverview,
    meta: {
      projectId,
      period,
      generatedAt: new Date().toISOString(),
    }
  })
}
