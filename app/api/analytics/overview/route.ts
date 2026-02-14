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

    if (!orgId) {
      return NextResponse.json(
        { error: 'orgId required' },
        { status: 400 }
      )
    }

    // Get all reservations for org (filter by project if provided)
    let query = supabase
      .from('reservations')
      .select('*, units(project_id, current_price)')

    if (projectId) {
      query = query.eq('units.project_id', projectId)
    }

    const { data: reservations, error } = await query

    if (error) throw error

    const stats = {
      totalUnits: 0,
      unitsSold: reservations?.filter(r => r.status === 'registered').length || 0,
      unitsReserved: reservations?.filter(r => 
        ['reserved', 'booked', 'spa_pending', 'spa_signed', 'spa_executed'].includes(r.status)
      ).length || 0,
      totalRevenue: 0,
      pipelineValue: 0,
      avgDaysToClose: 0,
    }

    // Calculate revenue from sold units
    if (reservations) {
      stats.totalRevenue = reservations
        .filter(r => r.status === 'registered')
        .reduce((sum, r) => sum + (r.sale_price || 0), 0)

      // Pipeline is reserved + booked units
      stats.pipelineValue = reservations
        .filter(r => ['reserved', 'booked', 'spa_pending', 'spa_signed', 'spa_executed'].includes(r.status))
        .reduce((sum, r) => sum + (r.sale_price || r.units?.current_price || 0), 0)

      // Avg days to close for sold units
      const closedWithDates = reservations.filter(
        r => r.status === 'registered' && r.registration_date && r.reservation_date
      )
      if (closedWithDates.length > 0) {
        const totalDays = closedWithDates.reduce((sum, r) => {
          const days = Math.floor(
            (new Date(r.registration_date).getTime() - new Date(r.reservation_date).getTime()) /
            (1000 * 60 * 60 * 24)
          )
          return sum + days
        }, 0)
        stats.avgDaysToClose = Math.round(totalDays / closedWithDates.length)
      }
    }

    // Get total units for project
    let unitsQuery = supabase
      .from('units')
      .select('id')

    if (projectId) {
      unitsQuery = unitsQuery.eq('project_id', projectId)
    }

    const { data: unitsData } = await unitsQuery
    stats.totalUnits = unitsData?.length || 0

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Analytics overview error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics overview' },
      { status: 500 }
    )
  }
}
