# Waitlist Attribution MVP

A portfolio-grade full-stack application demonstrating secure public data ingestion, database-first access control, and clean architecture.

## Problem Statement

Founders launching on Twitter (or any social platform) want to know which posts, links, or sources are actually driving signups. Most early-stage founders don't need analytics dashboards or Google Analytics complexity, they just want clean attribution tied to emails.

This MVP solves **signup attribution**, not growth or conversion optimization.

## Live Demo

1. Visit `/p/{project-slug}?src=twitter` to submit a signup
2. Login at `/login` to view your dashboard
3. See attribution data at `/dashboard/{projectId}`

## Tech Stack

- **Next.js 16** (App Router)
- **Supabase** (Auth, Postgres, RLS)
- **TypeScript**

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Public User    │────▶│  /p/[slug]       │────▶│  submit_signup  │
│  (anonymous)    │     │  (public page)   │     │  (RPC function) │
└─────────────────┘     └──────────────────┘     └────────┬────────┘
                                                          │
                        ┌──────────────────┐              ▼
┌─────────────────┐     │  /dashboard      │     ┌─────────────────┐
│  Project Owner  │────▶│  (protected)     │────▶│  Postgres + RLS │
│  (authenticated)│     └──────────────────┘     └─────────────────┘
└─────────────────┘
```

## Security Design (The Differentiator)

This project demonstrates **database-first security**. The app layer is intentionally "dumb"—all critical validation happens in Postgres.

### Row Level Security

| Table             | SELECT     | INSERT            |
| ----------------- | ---------- | ----------------- |
| `projects`        | Owner only | Authenticated     |
| `signups`         | Owner only | Via function only |
| `signup_attempts` | None       | Via function only |

### SECURITY DEFINER Function

All signup insertions go through `submit_signup()`:

```sql
CREATE FUNCTION submit_signup(
  p_project_id UUID,
  p_email TEXT,
  p_source TEXT,
  p_ip_address TEXT
) RETURNS JSON
SECURITY DEFINER
```

This function enforces:

- **Email normalization** (lowercase, trim)
- **Email format validation**
- **Duplicate handling** (silent success)
- **Rate limiting** (10/hour per IP)
- **Generic error responses** (no leaking details)

### Why This Matters

> "If someone reviews this repo, they should immediately see you understand RLS deeply, don't trust the client, and design DB-first security."

Most CRUD apps trust the client and validate in the app layer. This MVP demonstrates the opposite—even if an attacker bypasses the UI and calls Supabase directly, they cannot:

- Read any signups
- Bypass rate limiting
- Enumerate existing emails
- Flood the database

## Data Model

```sql
projects (
  id UUID PRIMARY KEY,
  name TEXT,
  slug TEXT UNIQUE,
  owner_id UUID REFERENCES auth.users,
  created_at TIMESTAMPTZ
)

signups (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES projects,
  email TEXT,
  source TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ
)

signup_attempts (
  ip_address TEXT,
  project_id UUID,
  attempt_count INTEGER,
  last_attempt_at TIMESTAMPTZ,
  PRIMARY KEY (ip_address, project_id)
)
```

## Routes

| Route                    | Access    | Purpose                          |
| ------------------------ | --------- | -------------------------------- |
| `/login`                 | Public    | Magic link authentication        |
| `/dashboard`             | Protected | List projects with signup counts |
| `/dashboard/[projectId]` | Protected | Project detail with attribution  |
| `/dashboard/new`         | Protected | Create new project               |
| `/p/[slug]`              | Public    | Public signup page               |

## Tradeoffs & Constraints

### Intentionally Excluded

- Charts/graphs (text is sufficient for founders)
- Export functionality (read-only MVP)
- Team accounts (single-owner model)
- Email confirmations (out of scope)
- OAuth providers (magic link only)

### Known Limitations

- IP-based rate limiting requires production environment
- No pagination on signup lists
- Slug cannot be changed once created

## Local Development

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Add your Supabase URL and anon key

# Run development server
npm run dev
```

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your-anon-key
```

## License

MIT
