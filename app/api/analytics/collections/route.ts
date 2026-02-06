import { NextResponse } from 'next/server'

// Mock collections/payments data
const mockCollections = {
  summary: {
    totalDue: 8500000,
    totalOverdue: 9700000,
    collectionRate: 78.5,
    dueThisWeek: 2400000,
    avgDaysOverdue: 42,
  },
  
  agingBuckets: [
    { label: 'Current', count: 24, amount: 8500000, color: '#10B981', severity: 'good' },
    { label: '1-30 Days', count: 12, amount: 4200000, color: '#F59E0B', severity: 'warning' },
    { label: '31-60 Days', count: 8, amount: 2800000, color: '#F97316', severity: 'warning' },
    { label: '61-90 Days', count: 5, amount: 1750000, color: '#EF4444', severity: 'danger' },
    { label: '90+ Days', count: 3, amount: 950000, color: '#DC2626', severity: 'critical' },
  ],
  
  criticalOverdue: [
    { 
      id: '1',
      customer: 'Ahmed Al-Mansoor', 
      unit: 'LR-0501', 
      amount: 350000, 
      daysOverdue: 45, 
      project: 'Laguna Residence',
      milestone: '2nd Installment',
      phone: '+971501234567',
    },
    { 
      id: '2',
      customer: 'Sarah Mitchell', 
      unit: 'DO-1203', 
      amount: 520000, 
      daysOverdue: 32, 
      project: 'DO Dubai',
      milestone: 'SPA Payment',
      phone: '+971509876543',
    },
    { 
      id: '3',
      customer: 'Mohammed Al-Qasimi', 
      unit: 'LR-0802', 
      amount: 280000, 
      daysOverdue: 67, 
      project: 'Laguna Residence',
      milestone: '3rd Installment',
      phone: '+971505555555',
    },
    { 
      id: '4',
      customer: 'James Wilson', 
      unit: 'DO-0405', 
      amount: 175000, 
      daysOverdue: 95, 
      project: 'DO Dubai',
      milestone: 'Construction 30%',
      phone: '+971507777777',
    },
    { 
      id: '5',
      customer: 'Fatima Hassan', 
      unit: 'LR-PH01', 
      amount: 850000, 
      daysOverdue: 15, 
      project: 'Laguna Residence',
      milestone: 'Booking',
      phone: '+971508888888',
    },
  ],
  
  upcomingMilestones: [
    { customer: 'John Smith', unit: 'LR-0301', amount: 150000, dueDate: '2024-03-25', milestone: 'Booking' },
    { customer: 'Maria Garcia', unit: 'DO-0801', amount: 280000, dueDate: '2024-03-26', milestone: '2nd Installment' },
    { customer: 'Robert Chen', unit: 'LR-0602', amount: 450000, dueDate: '2024-03-28', milestone: 'SPA Signing' },
  ],
  
  trends: {
    collectionRateTrend: [
      { month: 'Oct', rate: 82 },
      { month: 'Nov', rate: 85 },
      { month: 'Dec', rate: 79 },
      { month: 'Jan', rate: 76 },
      { month: 'Feb', rate: 78 },
      { month: 'Mar', rate: 78.5 },
    ],
    overdueAmountTrend: [
      { month: 'Oct', amount: 6.2 },
      { month: 'Nov', amount: 5.8 },
      { month: 'Dec', amount: 7.1 },
      { month: 'Jan', amount: 8.5 },
      { month: 'Feb', amount: 9.2 },
      { month: 'Mar', amount: 9.7 },
    ]
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const projectId = searchParams.get('project') || 'all'

  await new Promise(resolve => setTimeout(resolve, 100))

  return NextResponse.json({
    success: true,
    data: mockCollections,
    meta: {
      projectId,
      generatedAt: new Date().toISOString(),
    }
  })
}
