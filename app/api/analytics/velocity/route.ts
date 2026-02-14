import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const orgId = searchParams.get('orgId')
    const weeks = parseInt(searchParams.get('weeks') || '12')

    if (!orgId) {
      return NextResponse.json(
        { error: 'orgId required' },
        { status: 400 }
      )
    }

    // Get registrations over time
    let query = supabase
      .from('reservations')
      .select('registration_date, sale_price')
      .eq('status', 'registered')

    if (projectId) {
      query = query.eq('units.project_id', projectId)
    }

    const { data: reservations, error } = await query

    if (error) throw error

    // Group by week
    const weeklyData: { [key: string]: { count: number; revenue: number } } = {}

    // Initialize weeks
    const now = new Date()
    for (let i = weeks - 1; i >= 0; i--) {
      const weekStart = new Date(now)
      weekStart.setDate(weekStart.getDate() - weekStart.getDay() - (i * 7))
      weekStart.setHours(0, 0, 0, 0)
      const weekKey = weekStart.toISOString().split('T')[0]
      weeklyData[weekKey] = { count: 0, revenue: 0 }
    }

    // Aggregate reservations
    reservations?.forEach(res => {
      if (!res.registration_date) return

      const regDate = new Date(res.registration_date)
      const weekStart = new Date(regDate)
      weekStart.setDate(weekStart.getDate() - weekStart.getDay())
      weekStart.setHours(0, 0, 0, 0)
      const weekKey = weekStart.toISOString().split('T')[0]

      if (weeklyData[weekKey]) {
        weeklyData[weekKey].count++
        weeklyData[weekKey].revenue += res.sale_price || 0
      }
    })

    // Format for chart
    const data = Object.entries(weeklyData).map(([week, stats]) => ({
      week,
      units: stats.count,
      revenue: Math.round(stats.revenue / 1_000_000), // In millions
      trend: 'stable', // Will be calculated client-side
    }))

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Analytics velocity error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sales velocity' },
      { status: 500 }
    )
  }
}
