# APEX Platform — MASTER BUILD PLAN

## 🎯 Vision
**The actual working platform** — not a landing page. A full-stack sales intelligence system for property developers.

---

# PHASE 1: CORE INFRASTRUCTURE

## 1.1 Tech Stack Decision

| Layer | Technology | Why |
|-------|------------|-----|
| **Frontend** | Next.js 14 + React | SSR, fast, Vercel-native |
| **Styling** | Tailwind CSS | Rapid UI, Strategy Theme ready |
| **State** | Zustand | Lightweight, no boilerplate |
| **Backend** | Next.js API Routes | Serverless, same codebase |
| **Database** | Supabase (Postgres) | Free tier, real-time, auth built-in |
| **Auth** | Supabase Auth | Email + OAuth |
| **Real-time** | Supabase Realtime | WebSocket sync for unit locking |
| **File Storage** | Supabase Storage | PDFs, images, documents |
| **AI** | Claude API | Offer generation, lead scoring |
| **3D** | Three.js + React Three Fiber | Building visualization |
| **PDF Gen** | @react-pdf/renderer | Offer documents |
| **Charts** | Recharts | Analytics dashboards |
| **Deployment** | Vercel | Auto-deploy, edge functions |

---

## 1.2 Database Schema

### Core Tables

```sql
-- Organizations (Property Developers)
CREATE TABLE organizations (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#D86DCB',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects (Buildings/Developments)
CREATE TABLE projects (
  id UUID PRIMARY KEY,
  org_id UUID REFERENCES organizations(id),
  name TEXT NOT NULL,
  location TEXT,
  total_units INTEGER,
  launch_date DATE,
  completion_date DATE,
  description TEXT,
  hero_image_url TEXT,
  model_3d_url TEXT,
  status TEXT DEFAULT 'active', -- active, sold_out, upcoming
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Units (Individual Properties)
CREATE TABLE units (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES projects(id),
  unit_number TEXT NOT NULL,
  floor INTEGER,
  bedrooms INTEGER,
  bathrooms NUMERIC(3,1),
  area_sqft NUMERIC(10,2),
  area_sqm NUMERIC(10,2),
  base_price NUMERIC(15,2),
  current_price NUMERIC(15,2),
  price_per_sqft NUMERIC(10,2),
  view_type TEXT, -- sea, garden, pool, city, park
  unit_type TEXT, -- studio, 1br, 2br, 3br, penthouse, townhouse
  aspect TEXT, -- N, S, E, W, NE, NW, SE, SW
  floor_plan_url TEXT,
  status TEXT DEFAULT 'available', -- available, reserved, booked, spa_signed, spa_executed, registered, sold
  reserved_by UUID REFERENCES users(id),
  reserved_at TIMESTAMPTZ,
  reservation_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users (Agents, Admins, Managers)
CREATE TABLE users (
  id UUID PRIMARY KEY,
  org_id UUID REFERENCES organizations(id),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'agent', -- admin, manager, agent, viewer
  phone TEXT,
  avatar_url TEXT,
  commission_rate NUMERIC(5,2) DEFAULT 2.00,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customers (Buyers)
CREATE TABLE customers (
  id UUID PRIMARY KEY,
  org_id UUID REFERENCES organizations(id),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  nationality TEXT,
  passport_number TEXT,
  emirates_id TEXT,
  address TEXT,
  source TEXT, -- walk_in, website, referral, broker, social_media
  assigned_agent_id UUID REFERENCES users(id),
  lead_score INTEGER DEFAULT 50, -- 0-100 AI-generated
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reservations (Deal Tracking)
CREATE TABLE reservations (
  id UUID PRIMARY KEY,
  unit_id UUID REFERENCES units(id),
  customer_id UUID REFERENCES customers(id),
  agent_id UUID REFERENCES users(id),
  status TEXT DEFAULT 'reserved', -- reserved, booked, spa_pending, spa_signed, spa_executed, registered, cancelled
  reservation_date TIMESTAMPTZ DEFAULT NOW(),
  booking_date TIMESTAMPTZ,
  spa_date TIMESTAMPTZ,
  registration_date TIMESTAMPTZ,
  handover_date TIMESTAMPTZ,
  sale_price NUMERIC(15,2),
  discount_amount NUMERIC(15,2) DEFAULT 0,
  discount_reason TEXT,
  payment_plan_id UUID REFERENCES payment_plans(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment Plans
CREATE TABLE payment_plans (
  id UUID PRIMARY KEY,
  org_id UUID REFERENCES organizations(id),
  name TEXT NOT NULL,
  description TEXT,
  milestones JSONB, -- [{name: "Booking", percent: 10, due_days: 0}, ...]
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments (Individual Payments)
CREATE TABLE payments (
  id UUID PRIMARY KEY,
  reservation_id UUID REFERENCES reservations(id),
  milestone_name TEXT,
  amount NUMERIC(15,2),
  due_date DATE,
  paid_date DATE,
  status TEXT DEFAULT 'pending', -- pending, paid, overdue
  payment_method TEXT, -- bank_transfer, cheque, card
  reference_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Offers (Generated PDFs)
CREATE TABLE offers (
  id UUID PRIMARY KEY,
  unit_id UUID REFERENCES units(id),
  customer_id UUID REFERENCES customers(id),
  agent_id UUID REFERENCES users(id),
  offer_number TEXT UNIQUE,
  pdf_url TEXT,
  price_quoted NUMERIC(15,2),
  valid_until DATE,
  status TEXT DEFAULT 'sent', -- draft, sent, viewed, accepted, expired
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity Log (Audit Trail)
CREATE TABLE activity_log (
  id UUID PRIMARY KEY,
  org_id UUID REFERENCES organizations(id),
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL, -- unit_reserved, offer_generated, customer_created, etc.
  entity_type TEXT, -- unit, customer, reservation, offer
  entity_id UUID,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Price History (For Analytics)
CREATE TABLE price_history (
  id UUID PRIMARY KEY,
  unit_id UUID REFERENCES units(id),
  old_price NUMERIC(15,2),
  new_price NUMERIC(15,2),
  changed_by UUID REFERENCES users(id),
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Indexes for Performance
```sql
CREATE INDEX idx_units_project ON units(project_id);
CREATE INDEX idx_units_status ON units(status);
CREATE INDEX idx_reservations_status ON reservations(status);
CREATE INDEX idx_customers_agent ON customers(assigned_agent_id);
CREATE INDEX idx_activity_org ON activity_log(org_id, created_at DESC);
```

---

# PHASE 2: CORE MODULES

## 2.1 🏗️ INVENTORY COMMAND

### Features
| Feature | Description | Priority |
|---------|-------------|----------|
| **Project Selector** | Switch between projects (Laguna, DO Dubai, etc.) | P0 |
| **Unit Grid View** | Card-based view of all units with status colors | P0 |
| **Unit Table View** | Sortable, filterable data table | P0 |
| **Floor Plate View** | Visual representation of each floor | P1 |
| **3D Building View** | Interactive Three.js model | P2 |
| **Quick Filters** | Status, beds, price range, floor, view type | P0 |
| **Bulk Actions** | Select multiple → change status, adjust price | P1 |
| **Unit Detail Modal** | Full unit info, history, customer interest | P0 |
| **Heat Map** | Color-code by price/sqft or sales velocity | P2 |

### UI Components
```
/inventory
├── ProjectSelector.tsx
├── ViewToggle.tsx (grid | table | floor | 3d)
├── FilterBar.tsx
├── UnitGrid.tsx
├── UnitTable.tsx
├── FloorPlateView.tsx
├── Building3D.tsx
├── UnitCard.tsx
├── UnitDetailModal.tsx
├── BulkActionsBar.tsx
└── InventoryStats.tsx
```

### API Endpoints
```
GET    /api/projects                    - List all projects
GET    /api/projects/:id                - Get project details
GET    /api/projects/:id/units          - Get units for project
GET    /api/units/:id                   - Get unit details
PATCH  /api/units/:id                   - Update unit (price, status)
POST   /api/units/bulk-update           - Bulk update units
GET    /api/units/:id/history           - Get unit activity history
```

---

## 2.2 📝 OFFER GENERATION

### Features
| Feature | Description | Priority |
|---------|-------------|----------|
| **One-Click Offer** | Select unit → Generate branded PDF | P0 |
| **Customer Selection** | Pick existing or create new customer | P0 |
| **Price Override** | Adjust price with discount reason | P0 |
| **Payment Plan Select** | Choose from configured plans | P0 |
| **AI Enhancement** | Claude generates personalized cover letter | P1 |
| **Multi-Unit Offer** | Include multiple units in one offer | P1 |
| **Offer Templates** | Different templates for different purposes | P1 |
| **Validity Period** | Auto-expire offers | P0 |
| **Send via WhatsApp** | Direct share button | P1 |
| **Send via Email** | Auto-send with tracking | P1 |
| **Offer Tracking** | Know when customer views PDF | P2 |

### PDF Template Sections
```
1. Cover Letter (AI-generated personalized intro)
2. Developer Profile (One Development branding)
3. Project Overview (Laguna Residence highlights)
4. Unit Details (Floor plan, specs, views)
5. Pricing Table (Base price, discounts, total)
6. Payment Plan (Milestone breakdown)
7. Terms & Conditions
8. Agent Contact Info
9. Call to Action (Book now, limited availability)
```

### API Endpoints
```
POST   /api/offers/generate             - Generate offer PDF
GET    /api/offers                      - List all offers
GET    /api/offers/:id                  - Get offer details
GET    /api/offers/:id/pdf              - Download PDF
POST   /api/offers/:id/send             - Send via email/WhatsApp
PATCH  /api/offers/:id/status           - Update status (viewed, accepted)
```

---

## 2.3 🔒 REAL-TIME RESERVATION

### Features
| Feature | Description | Priority |
|---------|-------------|----------|
| **Instant Lock** | Reserve unit with one click | P0 |
| **WebSocket Sync** | All users see lock instantly | P0 |
| **Expiry Timer** | Auto-release after 24/48/72 hours | P0 |
| **Extend Reservation** | Extend with manager approval | P1 |
| **Conflict Prevention** | Prevent double-booking | P0 |
| **Reservation Form** | Capture customer details | P0 |
| **Status Workflow** | Reserved → Booked → SPA → Registered | P0 |
| **Notification** | Alert when reservation expires soon | P1 |

### Real-Time Implementation
```typescript
// Supabase Realtime subscription
const channel = supabase
  .channel('unit-changes')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'units',
    filter: `project_id=eq.${projectId}`
  }, (payload) => {
    // Update local state immediately
    updateUnit(payload.new);
    // Show toast if someone else reserved
    if (payload.new.status === 'reserved' && payload.new.reserved_by !== currentUserId) {
      toast.warning(`Unit ${payload.new.unit_number} was just reserved`);
    }
  })
  .subscribe();
```

### API Endpoints
```
POST   /api/units/:id/reserve           - Reserve unit (with lock)
POST   /api/units/:id/release           - Release reservation
POST   /api/units/:id/extend            - Extend reservation
POST   /api/units/:id/book              - Convert to booking
PATCH  /api/reservations/:id/status     - Update reservation status
```

---

## 2.4 👥 CUSTOMER MANAGEMENT

### Features
| Feature | Description | Priority |
|---------|-------------|----------|
| **Customer List** | Searchable, filterable list | P0 |
| **Customer Profile** | Full details, documents, history | P0 |
| **Quick Add** | Add customer during reservation | P0 |
| **Lead Scoring** | AI-generated score (0-100) | P1 |
| **Interest Tracking** | Which units they've viewed/requested | P1 |
| **Communication Log** | Calls, emails, meetings | P1 |
| **Document Vault** | Passport, EID, contracts | P1 |
| **Duplicate Detection** | Prevent duplicate customers | P1 |
| **Import from Excel** | Bulk import leads | P2 |
| **Export to CRM** | Salesforce, HubSpot sync | P2 |

### Lead Scoring Algorithm
```typescript
function calculateLeadScore(customer: Customer, interactions: Interaction[]): number {
  let score = 50; // Base score
  
  // Source quality
  if (customer.source === 'referral') score += 15;
  if (customer.source === 'website') score += 10;
  if (customer.source === 'walk_in') score += 20;
  
  // Engagement
  const viewings = interactions.filter(i => i.type === 'viewing').length;
  score += Math.min(viewings * 10, 30);
  
  // Recency
  const lastInteraction = interactions[0]?.created_at;
  if (lastInteraction && daysSince(lastInteraction) < 7) score += 10;
  if (lastInteraction && daysSince(lastInteraction) > 30) score -= 20;
  
  // Budget match
  if (customer.budget && customer.budget > 1000000) score += 10;
  
  return Math.max(0, Math.min(100, score));
}
```

### API Endpoints
```
GET    /api/customers                   - List customers
POST   /api/customers                   - Create customer
GET    /api/customers/:id               - Get customer details
PATCH  /api/customers/:id               - Update customer
GET    /api/customers/:id/interactions  - Get interaction history
POST   /api/customers/:id/interactions  - Log interaction
GET    /api/customers/:id/interests     - Get unit interests
POST   /api/customers/import            - Bulk import
POST   /api/customers/:id/export        - Export to CRM
```

---

## 2.5 📊 ANALYTICS DASHBOARD

### Features
| Feature | Description | Priority |
|---------|-------------|----------|
| **Sales Overview** | Total sold, revenue, pipeline value | P0 |
| **Unit Status Chart** | Pie chart of inventory status | P0 |
| **Sales Velocity** | Units sold per week/month trend | P0 |
| **Revenue Forecast** | Projected closings this month | P1 |
| **Top Performers** | Agent leaderboard | P0 |
| **Conversion Funnel** | Lead → Viewing → Reservation → Sale | P1 |
| **Price Analysis** | Avg price/sqft by floor, view, type | P1 |
| **Absorption Rate** | % inventory sold over time | P2 |
| **Heat Maps** | Which units/floors sell fastest | P2 |
| **Custom Reports** | Build your own with filters | P2 |

### Dashboard Cards
```
┌─────────────────────────────────────────────────────────────┐
│  SALES OVERVIEW (This Month)                                │
├─────────────┬─────────────┬─────────────┬─────────────────── │
│ Units Sold  │ Revenue     │ Pipeline    │ Avg Days to Close │
│ 12          │ AED 45.2M   │ AED 120M    │ 14 days           │
│ ↑ 20%       │ ↑ 15%       │ 28 units    │ ↓ 3 days          │
└─────────────┴─────────────┴─────────────┴───────────────────┘

┌──────────────────────────┬──────────────────────────────────┐
│ INVENTORY STATUS         │ SALES VELOCITY                   │
│ [PIE CHART]              │ [LINE CHART - 12 weeks]          │
│ Available: 45%           │ Trend: ↑ Accelerating            │
│ Reserved: 15%            │                                  │
│ Sold: 40%                │                                  │
└──────────────────────────┴──────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ TOP PERFORMERS                                               │
│ 1. Ahmed Al-Rashid    │ 8 units  │ AED 28.5M  │ ████████░░ │
│ 2. Sarah Johnson      │ 6 units  │ AED 22.1M  │ ██████░░░░ │
│ 3. Mohammed Hassan    │ 5 units  │ AED 18.7M  │ █████░░░░░ │
└──────────────────────────────────────────────────────────────┘
```

### API Endpoints
```
GET    /api/analytics/overview          - Sales overview stats
GET    /api/analytics/inventory         - Inventory breakdown
GET    /api/analytics/velocity          - Sales velocity over time
GET    /api/analytics/leaderboard       - Agent performance
GET    /api/analytics/funnel            - Conversion funnel
GET    /api/analytics/pricing           - Price analysis
GET    /api/analytics/forecast          - Revenue forecast
```

---

## 2.6 👤 AGENT PERFORMANCE

### Features
| Feature | Description | Priority |
|---------|-------------|----------|
| **Personal Dashboard** | Agent's own stats | P0 |
| **Leaderboard** | Ranking vs team | P0 |
| **Activity Feed** | Recent actions | P0 |
| **Commission Tracker** | Earnings to date | P1 |
| **Goal Setting** | Monthly targets | P1 |
| **AI Coaching** | Suggestions based on behavior | P2 |
| **Pipeline View** | Agent's active deals | P0 |

### AI Coaching Alerts
```typescript
const coachingRules = [
  {
    condition: (agent) => agent.followUps.overdue > 3,
    message: "You have {count} overdue follow-ups. Hot leads cool fast!",
    priority: "high"
  },
  {
    condition: (agent) => agent.viewings.thisWeek < 2,
    message: "Only {count} viewings this week. Time to get customers through the door.",
    priority: "medium"
  },
  {
    condition: (agent) => agent.offers.noResponse > 5,
    message: "{count} offers with no response. Consider a follow-up campaign.",
    priority: "medium"
  },
  {
    condition: (agent) => agent.conversionRate < 0.1,
    message: "Conversion rate is {rate}%. Let's review your pitch together.",
    priority: "high"
  }
];
```

---

## 2.7 💰 AI PRICING ENGINE

### Features
| Feature | Description | Priority |
|---------|-------------|----------|
| **Dynamic Pricing** | Auto-adjust based on rules | P1 |
| **Floor Rise Premium** | Higher floors = higher price | P0 |
| **View Premium** | Sea view > Garden > City | P0 |
| **Demand Pricing** | Increase price as inventory shrinks | P2 |
| **Competitor Tracking** | Compare to market | P2 |
| **What-If Scenarios** | Simulate price changes | P1 |
| **Bulk Price Update** | Apply % increase to all | P1 |
| **Price History** | Track all changes | P0 |

### Pricing Rules Engine
```typescript
interface PricingRule {
  name: string;
  condition: (unit: Unit) => boolean;
  adjustment: number | ((unit: Unit) => number);
  type: 'fixed' | 'percentage';
}

const defaultRules: PricingRule[] = [
  {
    name: 'Floor Rise Premium',
    condition: (unit) => unit.floor > 5,
    adjustment: (unit) => (unit.floor - 5) * 0.5, // 0.5% per floor above 5
    type: 'percentage'
  },
  {
    name: 'Sea View Premium',
    condition: (unit) => unit.view_type === 'sea',
    adjustment: 5, // 5% premium
    type: 'percentage'
  },
  {
    name: 'Penthouse Premium',
    condition: (unit) => unit.unit_type === 'penthouse',
    adjustment: 15,
    type: 'percentage'
  },
  {
    name: 'Corner Unit Premium',
    condition: (unit) => unit.is_corner,
    adjustment: 3,
    type: 'percentage'
  }
];

function calculatePrice(unit: Unit, basePrice: number, rules: PricingRule[]): number {
  let price = basePrice;
  
  for (const rule of rules) {
    if (rule.condition(unit)) {
      const adj = typeof rule.adjustment === 'function' 
        ? rule.adjustment(unit) 
        : rule.adjustment;
      
      if (rule.type === 'percentage') {
        price *= (1 + adj / 100);
      } else {
        price += adj;
      }
    }
  }
  
  return Math.round(price);
}
```

---

## 2.8 📱 NOTIFICATIONS & ALERTS

### Notification Types
| Type | Trigger | Channel |
|------|---------|---------|
| Unit Reserved | Someone reserves a unit | In-app, Telegram |
| Reservation Expiring | 4 hours before expiry | In-app, Email, Telegram |
| New Lead | Website inquiry | In-app, Telegram |
| Payment Due | 3 days before milestone | Email, SMS |
| Payment Overdue | Milestone passed | Email, SMS, Telegram |
| Deal Closed | SPA signed | In-app, Telegram |
| Price Changed | Admin updates price | In-app |
| Goal Achieved | Agent hits target | In-app, Telegram |

### Telegram Bot Commands
```
/status - My pipeline summary
/units [project] - Available units
/reserve [unit_id] - Quick reserve
/offer [unit_id] [customer_id] - Generate offer
/leads - My active leads
/today - Today's tasks
```

---

# PHASE 3: ADVANCED FEATURES

## 3.1 🌐 CUSTOMER PORTAL

### Features
- Public project showcase
- Unit browsing with filters
- Virtual 360° tours
- Favorites list
- Request offer (creates lead)
- Document download
- Payment schedule view
- Construction progress updates

## 3.2 🔗 INTEGRATIONS

### Salesforce Sync
```typescript
// Webhook on reservation create
async function syncToSalesforce(reservation: Reservation) {
  const lead = {
    FirstName: reservation.customer.name.split(' ')[0],
    LastName: reservation.customer.name.split(' ').slice(1).join(' '),
    Email: reservation.customer.email,
    Phone: reservation.customer.phone,
    Company: 'Individual',
    LeadSource: 'APEX Platform',
    Status: 'Qualified',
    Description: `Unit: ${reservation.unit.unit_number}\nProject: ${reservation.unit.project.name}\nPrice: AED ${reservation.sale_price}`,
    Custom_Unit_ID__c: reservation.unit.id,
    Custom_Project__c: reservation.unit.project.name
  };
  
  await salesforce.sobject('Lead').create(lead);
}
```

### WhatsApp Integration (Twilio)
```typescript
async function sendOfferViaWhatsApp(offer: Offer) {
  const message = `
🏠 *New Offer from One Development*

Unit: ${offer.unit.unit_number}
Project: ${offer.unit.project.name}
Price: AED ${offer.price_quoted.toLocaleString()}

📄 View your offer: ${offer.pdf_url}

Valid until: ${offer.valid_until}

Questions? Reply to this message or call ${offer.agent.phone}
  `;
  
  await twilio.messages.create({
    from: 'whatsapp:+971xxxxxxxxx',
    to: `whatsapp:${offer.customer.phone}`,
    body: message
  });
}
```

## 3.3 📈 MARKET INTELLIGENCE

### Data Sources
- PropertyFinder scraping (competitor prices)
- Bayut listings
- DLD transaction data (if available)
- News API for market updates

### Features
- Competitor project tracker
- Price per sqft comparisons
- Absorption rate benchmarks
- Market trend alerts

---

# PHASE 4: BUILD SEQUENCE

## Tonight's Overnight Build (Priority)

### Build 1: Database & Auth (23:00)
```
1. Create Supabase project
2. Run schema migrations
3. Set up auth (email + magic link)
4. Create seed data (Laguna Residence units)
5. Test real-time subscriptions
```

### Build 2: Inventory Core (02:00)
```
1. Next.js project setup
2. Tailwind + Strategy Theme
3. Project selector component
4. Unit grid view with status colors
5. Filter bar (status, beds, price)
6. Unit detail modal
7. Connect to Supabase
```

### Build 3: Offer Generation (Tomorrow)
```
1. PDF template design
2. @react-pdf/renderer setup
3. One-click generate flow
4. Customer selection
5. Offer storage in Supabase
```

### Build 4: Real-Time Reservation (Tomorrow)
```
1. Reserve button with confirmation
2. Supabase real-time subscription
3. Optimistic UI updates
4. Expiry countdown timer
5. Status workflow
```

### Build 5: Dashboard & Analytics (Day 3)
```
1. Overview cards
2. Inventory pie chart
3. Sales velocity line chart
4. Agent leaderboard
5. API endpoints for aggregations
```

---

# FILE STRUCTURE

```
apex-platform/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx (Overview)
│   │   ├── inventory/
│   │   │   ├── page.tsx
│   │   │   └── [unitId]/page.tsx
│   │   ├── customers/
│   │   │   ├── page.tsx
│   │   │   └── [customerId]/page.tsx
│   │   ├── offers/
│   │   │   ├── page.tsx
│   │   │   └── new/page.tsx
│   │   ├── reservations/
│   │   │   └── page.tsx
│   │   ├── analytics/
│   │   │   └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   ├── api/
│   │   ├── projects/route.ts
│   │   ├── units/route.ts
│   │   ├── customers/route.ts
│   │   ├── offers/route.ts
│   │   ├── reservations/route.ts
│   │   └── analytics/route.ts
│   └── portal/ (Public customer portal)
│       ├── page.tsx
│       └── [projectId]/page.tsx
├── components/
│   ├── ui/ (shadcn components)
│   ├── inventory/
│   ├── customers/
│   ├── offers/
│   ├── analytics/
│   └── layout/
├── lib/
│   ├── supabase.ts
│   ├── pricing.ts
│   ├── pdf.ts
│   └── utils.ts
├── hooks/
│   ├── useUnits.ts
│   ├── useCustomers.ts
│   ├── useRealtime.ts
│   └── useAnalytics.ts
├── types/
│   └── index.ts
└── styles/
    └── globals.css
```

---

# SEED DATA (One Development)

## Projects
1. **Laguna Residence** - Al Reem Island, Abu Dhabi
2. **DO Dubai Island** - Dubai
3. **DO New Cairo** - Egypt
4. **Infinity One** - Al Reem Island

## Sample Units (Laguna)
```json
[
  {"unit_number": "LR-0101", "floor": 1, "bedrooms": 1, "area_sqft": 750, "base_price": 950000, "view_type": "garden", "status": "available"},
  {"unit_number": "LR-0102", "floor": 1, "bedrooms": 2, "area_sqft": 1200, "base_price": 1500000, "view_type": "pool", "status": "available"},
  {"unit_number": "LR-0501", "floor": 5, "bedrooms": 2, "area_sqft": 1250, "base_price": 1650000, "view_type": "sea", "status": "reserved"},
  {"unit_number": "LR-1001", "floor": 10, "bedrooms": 3, "area_sqft": 1800, "base_price": 2800000, "view_type": "sea", "status": "sold"},
  {"unit_number": "LR-PH01", "floor": 15, "bedrooms": 4, "area_sqft": 3500, "base_price": 8500000, "view_type": "sea", "unit_type": "penthouse", "status": "available"}
]
```

---

# SUCCESS METRICS

| Metric | Target |
|--------|--------|
| Unit Load Time | <500ms |
| Offer Generation | <2s |
| Real-time Sync | <100ms |
| Uptime | 99.9% |
| Mobile Responsive | 100% |

---

# TIMELINE

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| Phase 1 | Tonight | DB + Auth + Basic Inventory |
| Phase 2 | Day 2-3 | Offers + Reservations + Customers |
| Phase 3 | Day 4-5 | Analytics + Agent Dashboard |
| Phase 4 | Week 2 | Customer Portal + Integrations |
| Phase 5 | Week 3 | Market Intel + AI Features |

---

*This is the ACTUAL PLATFORM build plan. Not marketing. PRODUCT.*

**Ready for overnight build deployment.** 🚀
