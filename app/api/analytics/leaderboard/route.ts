import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orgId = searchParams.get('orgId')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!orgId) {
      return NextResponse.json(
        { error: 'orgId required' },
        { status: 400 }
      )
    }

    // Get all agents
    const { data: agents, error: agentsError } = await supabase
      .from('users')
      .select('id, name, avatar_url, email')
      .eq('org_id', orgId)
      .eq('role', 'agent')

    if (agentsError) throw agentsError

    if (!agents || agents.length === 0) {
      return NextResponse.json({ agents: [] })
    }

    // For each agent, count closed deals and revenue
    const agentStats = await Promise.all(
      agents.map(async (agent) => {
        const { data: reservations } = await supabase
          .from('reservations')
          .select('sale_price, status')
          .eq('agent_id', agent.id)
          .eq('status', 'registered')

        const unitsSold = reservations?.length || 0
        const revenue = reservations?.reduce((sum, r) => sum + (r.sale_price || 0), 0) || 0

        return {
          id: agent.id,
          name: agent.name,
          email: agent.email,
          avatar_url: agent.avatar_url,
          unitsSold,
          revenue,
        }
      })
    )

    // Sort by revenue descending
    agentStats.sort((a, b) => b.revenue - a.revenue)

    // Return top N
    const leaderboard = agentStats.slice(0, limit).map((agent, index) => ({
      ...agent,
      rank: index + 1,
      percentage: 100, // Will be calculated client-side based on top performer
    }))

    return NextResponse.json({ agents: leaderboard })
  } catch (error) {
    console.error('Analytics leaderboard error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    )
  }
}
