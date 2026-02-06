import { NextResponse } from 'next/server'

// Mock inventory data matching One Development structure
const mockInventory = {
  total: 250,
  byStatus: [
    { name: 'Available', value: 112, percent: 44.8, color: '#10B981' },
    { name: 'Blocked', value: 15, percent: 6.0, color: '#EF4444' },
    { name: 'Reserved', value: 28, percent: 11.2, color: '#F59E0B' },
    { name: 'Booked', value: 18, percent: 7.2, color: '#3B82F6' },
    { name: 'SPA Signed', value: 22, percent: 8.8, color: '#8B5CF6' },
    { name: 'SPA Executed', value: 12, percent: 4.8, color: '#6366F1' },
    { name: 'Registered', value: 43, percent: 17.2, color: '#0EA5E9' },
  ],
  
  byProject: {
    'laguna': {
      name: 'Laguna Residence',
      total: 120,
      available: 52,
      reserved: 15,
      booked: 8,
      sold: 45,
    },
    'do-dubai': {
      name: 'DO Dubai Island',
      total: 80,
      available: 38,
      reserved: 8,
      booked: 6,
      sold: 28,
    },
    'infinity': {
      name: 'Infinity One',
      total: 50,
      available: 22,
      reserved: 5,
      booked: 4,
      sold: 19,
    },
  },
  
  byUnitType: [
    { type: 'Studio', available: 18, total: 45 },
    { type: '1 Bedroom', available: 32, total: 85 },
    { type: '2 Bedroom', available: 38, total: 75 },
    { type: '3 Bedroom', available: 18, total: 35 },
    { type: 'Penthouse', available: 6, total: 10 },
  ],
  
  absorptionRate: {
    current: 4.2, // units per week
    lastMonth: 3.8,
    change: 10.5,
  },
  
  priceMetrics: {
    avgPricePerSqft: 1850,
    avgPricePerSqftChange: 3.2,
    medianPrice: 1650000,
    highestPrice: 8500000,
    lowestPrice: 750000,
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const projectId = searchParams.get('project') || 'all'

  await new Promise(resolve => setTimeout(resolve, 100))

  return NextResponse.json({
    success: true,
    data: mockInventory,
    meta: {
      projectId,
      generatedAt: new Date().toISOString(),
    }
  })
}
