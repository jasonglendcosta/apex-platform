import { NextResponse } from 'next/server'

// Mock funnel/conversion data
const mockFunnel = {
  stages: [
    { 
      name: 'Leads', 
      count: 1250, 
      value: 0, 
      color: '#D86DCB',
      sources: {
        website: 420,
        walkIn: 280,
        referral: 215,
        broker: 185,
        socialMedia: 150,
      }
    },
    { 
      name: 'Viewings', 
      count: 485, 
      value: 0, 
      color: '#8B5CF6',
      avgTimeFromPrev: 2.4, // days
    },
    { 
      name: 'Reservations', 
      count: 156, 
      value: 85000000, 
      color: '#22D3EE',
      avgTimeFromPrev: 4.2,
    },
    { 
      name: 'Bookings', 
      count: 98, 
      value: 54000000, 
      color: '#10B981',
      avgTimeFromPrev: 3.8,
    },
    { 
      name: 'SPA Signed', 
      count: 72, 
      value: 42000000, 
      color: '#F59E0B',
      avgTimeFromPrev: 12.5,
    },
    { 
      name: 'Closed', 
      count: 45, 
      value: 28500000, 
      color: '#6366F1',
      avgTimeFromPrev: 18.2,
    },
  ],
  
  metrics: {
    overallConversion: 3.6, // Lead to Close %
    avgCycleTime: 41.1, // days from lead to close
    bestAgent: {
      name: 'Ahmed Al-Rashid',
      conversionRate: 8.2,
    },
    
    stageConversions: [
      { from: 'Lead', to: 'Viewing', rate: 38.8, change: 4.2 },
      { from: 'Viewing', to: 'Reservation', rate: 32.2, change: -1.8 },
      { from: 'Reservation', to: 'Booking', rate: 62.8, change: 3.5 },
      { from: 'Booking', to: 'SPA Signed', rate: 73.5, change: 1.2 },
      { from: 'SPA Signed', to: 'Closed', rate: 62.5, change: 0.8 },
    ],
    
    dropoffReasons: [
      { reason: 'Price concerns', percent: 35 },
      { reason: 'Financing issues', percent: 25 },
      { reason: 'Competitor won', percent: 18 },
      { reason: 'Timeline mismatch', percent: 12 },
      { reason: 'Other', percent: 10 },
    ]
  },
  
  byProject: {
    'laguna': {
      leads: 520,
      closed: 22,
      conversionRate: 4.2,
      pipelineValue: 78000000,
    },
    'do-dubai': {
      leads: 480,
      closed: 15,
      conversionRate: 3.1,
      pipelineValue: 65000000,
    },
    'infinity': {
      leads: 250,
      closed: 8,
      conversionRate: 3.2,
      pipelineValue: 38000000,
    },
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const projectId = searchParams.get('project') || 'all'

  await new Promise(resolve => setTimeout(resolve, 100))

  return NextResponse.json({
    success: true,
    data: mockFunnel,
    meta: {
      projectId,
      generatedAt: new Date().toISOString(),
    }
  })
}
