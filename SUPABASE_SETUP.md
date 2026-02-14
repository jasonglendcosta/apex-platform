# APEX Platform — Supabase Setup Guide

## Quick Start

### 1. Create Supabase Project
- Go to https://supabase.com
- Click "New project"
- Name: `apex-platform-prod`
- Database password: (save securely)
- Region: `uae-north (Dubai)` or closest
- Await project creation (5-10 min)

### 2. Get Connection Details
From Supabase dashboard:
- Project URL → `NEXT_PUBLIC_SUPABASE_URL`
- Service Role Key (Settings → API) → `SUPABASE_SERVICE_ROLE_KEY`
- Public Anon Key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Set Environment Variables
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
```

### 4. Run Schema Migration
```bash
# Option A: Via Supabase CLI
supabase db pull  # (if starting fresh)

# Option B: Copy schema.sql to Supabase SQL Editor
# Go to Supabase Dashboard → SQL Editor → New Query
# Paste contents of ./supabase/schema.sql
# Run
```

### 5. Seed Data (One Development)
```sql
-- In Supabase SQL Editor
INSERT INTO organizations (name, primary_color) 
VALUES ('One Development', '#D86DCB')
RETURNING id;

-- Copy the returned org_id and use in next commands

INSERT INTO projects (org_id, name, location, total_units, description, status)
VALUES (
  'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  'Laguna Residence',
  'Al Reem Island, Abu Dhabi',
  350,
  'Premium waterfront development with 1-4 bedroom units',
  'active'
)
RETURNING id;

-- Insert sample units (copy /docs/seed-units.sql)
```

### 6. Enable Row Level Security (RLS)
For each table in Supabase Dashboard → Authentication → Policies:
```sql
-- Example: Allow users to read org data
CREATE POLICY "Users can read own org"
  ON organizations
  FOR SELECT
  USING (auth.uid() IN (SELECT id FROM users WHERE org_id = organizations.id));
```

### 7. Test API Endpoints
```bash
# Test analytics overview
curl "http://localhost:3000/api/analytics/overview?orgId=YOUR_ORG_ID"

# Test inventory breakdown
curl "http://localhost:3000/api/analytics/inventory?orgId=YOUR_ORG_ID&projectId=YOUR_PROJECT_ID"

# Test leaderboard
curl "http://localhost:3000/api/analytics/leaderboard?orgId=YOUR_ORG_ID"

# Test velocity
curl "http://localhost:3000/api/analytics/velocity?orgId=YOUR_ORG_ID&weeks=12"
```

### 8. Deploy to Vercel
```bash
# Add environment variables to Vercel project
# Settings → Environment Variables

vercel env pull  # Pull latest env vars
vercel deploy
```

## API Endpoints

| Endpoint | Method | Params | Description |
|----------|--------|--------|-------------|
| `/api/analytics/overview` | GET | `orgId`, `projectId` | Sales stats (units sold, revenue, pipeline) |
| `/api/analytics/inventory` | GET | `orgId`, `projectId` | Unit status breakdown (pie chart data) |
| `/api/analytics/leaderboard` | GET | `orgId`, `limit=10` | Top agents by revenue |
| `/api/analytics/velocity` | GET | `orgId`, `projectId`, `weeks=12` | Weekly sales trend |

## Security Checklist

- [ ] Row Level Security (RLS) enabled on all tables
- [ ] Service Role Key in environment variables (never expose in client)
- [ ] Anon key policies restrict to org_id matching
- [ ] Database backups enabled (Supabase does this automatically)
- [ ] API rate limiting configured (Supabase free tier: 50k/hour)

## Troubleshooting

### `auth.users` table doesn't exist
- Supabase creates this automatically
- Use Supabase Auth UI or API to create users

### Connection refused
- Check `NEXT_PUBLIC_SUPABASE_URL` is correct (https://xxxxx.supabase.co)
- Wait 5+ minutes after project creation
- Check API keys are correct

### No data showing in dashboard
- Verify org_id and project_id match seed data
- Check RLS policies allow SELECT
- Test API endpoint directly with curl

### Performance issues
- Add indexes (schema.sql already includes them)
- Use `EXPLAIN ANALYZE` in Supabase SQL Editor
- Consider pagination for large tables

## Next Steps

1. Seed real Laguna Residence unit data
2. Create admin user for One Development
3. Add sample customers and reservations
4. Test real-time features (Supabase Realtime)
5. Deploy to Vercel for Jason to test
