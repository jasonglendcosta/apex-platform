# Supabase Setup Guide

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in:
   - **Name:** apex-platform
   - **Database Password:** (save this!)
   - **Region:** Choose nearest (e.g., Singapore for UAE)
4. Wait for project to provision (~2 minutes)

## Step 2: Get API Keys

1. Go to Project Settings → API
2. Copy these values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (optional, for admin operations)

## Step 3: Run Database Schema

1. Go to SQL Editor in Supabase Dashboard
2. Click "New Query"
3. Copy the entire contents of `supabase/schema.sql`
4. Paste and click "Run"
5. Verify: Check Table Editor - you should see all tables

## Step 4: Seed Initial Data

1. In SQL Editor, create another new query
2. Copy contents of `supabase/seed.sql`
3. Paste and click "Run"
4. Verify: Check Table Editor → units table should have 50 rows

## Step 5: Configure Auth

1. Go to Authentication → Providers
2. Ensure "Email" is enabled
3. Go to Authentication → URL Configuration
4. Set **Site URL** to: `http://localhost:3000` (dev) or your production URL
5. Add **Redirect URLs**:
   - `http://localhost:3000/auth/callback`
   - `https://your-domain.vercel.app/auth/callback`

## Step 6: Enable Real-Time

1. Go to Database → Replication
2. Enable real-time for these tables:
   - `units`
   - `reservations`
   - `offers`

## Step 7: Configure Environment

Create `.env.local` in project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Step 8: Test Connection

```bash
npm run dev
```

Visit `http://localhost:3000/dashboard` - you should see the dashboard!

## Troubleshooting

### "No rows returned"
- Make sure you ran `seed.sql` after `schema.sql`

### Auth callback errors
- Check redirect URLs in Supabase Auth settings
- Ensure `NEXT_PUBLIC_SITE_URL` matches your actual URL

### Real-time not working
- Check that tables are added to replication
- Verify RLS policies allow read access

## Quick SQL Queries

Check data is loaded:
```sql
SELECT count(*) FROM units;  -- Should be 50
SELECT count(*) FROM users;  -- Should be 4
SELECT count(*) FROM customers;  -- Should be 5
```

Reset all data:
```sql
TRUNCATE units, reservations, customers, offers, payments, activity_log, price_history, interactions, unit_interests CASCADE;
-- Then re-run seed.sql
```
