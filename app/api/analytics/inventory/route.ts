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

    // Get unit status breakdown
    let query = supabase
      .from('units')
      .select('status')

    if (projectId) {
      query = query.eq('project_id', projectId)
    }

    const { data: units, error } = await query

    if (error) throw error

    // Group by status
    const breakdown = {
      available: 0,
      reserved: 0,
      booked: 0,
      spa_signed: 0,
      spa_executed: 0,
      registered: 0,
      sold: 0,
    }

    units?.forEach(unit => {
      if (unit.status === 'available') breakdown.available++
      else if (unit.status === 'reserved') breakdown.reserved++
      else if (unit.status === 'booked') breakdown.booked++
      else if (unit.status === 'spa_signed') breakdown.spa_signed++
      else if (unit.status === 'spa_executed') breakdown.spa_executed++
      else if (unit.status === 'registered') breakdown.registered++
      else if (unit.status === 'sold') breakdown.sold++
    })

    // Format for pie chart
    const data = [
      { name: 'Available', value: breakdown.available, color: '#10b981' },
      { name: 'Reserved', value: breakdown.reserved, color: '#f59e0b' },
      { name: 'Booked', value: breakdown.booked, color: '#3b82f6' },
      { name: 'SPA Signed', value: breakdown.spa_signed, color: '#8b5cf6' },
      { name: 'SPA Executed', value: breakdown.spa_executed, color: '#d946ef' },
      { name: 'Registered', value: breakdown.registered, color: '#06b6d4' },
      { name: 'Sold', value: breakdown.sold, color: '#14b8a6' },
    ].filter(item => item.value > 0)

    return NextResponse.json({ breakdown, data })
  } catch (error) {
    console.error('Analytics inventory error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch inventory breakdown' },
      { status: 500 }
    )
  }
}
