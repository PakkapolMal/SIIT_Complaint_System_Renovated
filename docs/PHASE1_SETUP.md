# Phase 1: Supabase Auth Setup

## 1. Apply database migrations

From the repo root:

```bash
npx supabase link --project-ref <your-project-ref>
npx supabase db push
```

For local development:

```bash
npx supabase start
npx supabase db reset
```

## 2. Configure Google OAuth

1. **Google Cloud Console**: Create an OAuth 2.0 Web client.
   - Authorized redirect URI: `https://<project-ref>.supabase.co/auth/v1/callback`
2. **Supabase Dashboard** → Authentication → Providers → Google: enable and paste Client ID/Secret.
3. **Supabase Dashboard** → Authentication → URL Configuration:
   - Site URL: `http://localhost:3000` (dev) and your Vercel production URL
   - Redirect URLs: `http://localhost:3000/**`, `https://<vercel-domain>/**`

## 3. Deploy auth domain gate (optional but recommended)

```bash
npx supabase functions deploy auth-domain-gate
```

Then in Supabase Dashboard → Authentication → Hooks → **Before user created**, point to the `auth-domain-gate` function.

This rejects sign-ups outside `@siit.tu.ac.th` and `@g.siit.tu.ac.th`.

## 4. Frontend environment

Copy `frontend/.env.example` to `frontend/.env.local` and fill in your Supabase URL and anon key.

```bash
cd frontend
cp .env.example .env.local
npm install
npm start
```

## 6. Apply write-policy migration (required for complaint CRUD)

After the initial schema migration, also push:

```bash
npx supabase db push
```

This applies `20250601000003_write_policies_and_storage.sql`, which adds insert/update/delete RLS and Supabase Storage buckets for attachments.


## 7. Testing staff accounts

Staff and students use **different Google email domains**:

| Role | Email domain | Example |
|------|--------------|---------|
| Student | `@g.siit.tu.ac.th` | `6622781027@g.siit.tu.ac.th` |
| Staff | `@siit.tu.ac.th` (no `g.`) | `your.name@siit.tu.ac.th` |

You **cannot** test staff flows with a `@g.siit.tu.ac.th` student account. Use a real SIIT staff Google account, or register one for testing.

### Option A: Register your staff email in the database (recommended)

In Supabase Dashboard → SQL Editor, add the Google address you can actually sign in with:

```sql
INSERT INTO public.staff ("StaffID", "Division", "StaffName", "Email")
VALUES ('901', 'Academic Affairs', 'Your Name', 'your.name@siit.tu.ac.th')
ON CONFLICT ("StaffID") DO UPDATE
SET "Division" = EXCLUDED."Division",
    "StaffName" = EXCLUDED."StaffName",
    "Email" = EXCLUDED."Email";
```

Then sign in with Google using `your.name@siit.tu.ac.th`. On first login the app links `staff.UUID` to your auth user automatically.

To also test the admin dashboard, add an admin row **after** the first staff login (copy your user UUID from Authentication → Users):

```sql
INSERT INTO public.admin ("UUID", "Role", "StaffID")
SELECT s."UUID", 'Admin', s."StaffID"
FROM public.staff s
WHERE s."Email" = 'your.name@siit.tu.ac.th'
ON CONFLICT ("UUID") DO NOTHING;
```

Sign out and sign back in to pick up the admin role.

### Option B: Use seeded placeholder emails

`supabase/seed.sql` includes placeholder staff rows such as `academic.affairs@siit.tu.ac.th`. These only work if that exact mailbox exists in Google Workspace and you can OAuth as it. For most dev setups, prefer Option A with your own `@siit.tu.ac.th` address.

### Division access for sensitive topics

| Topic | Required `staff.Division` |
|-------|---------------------------|
| 1 — Academics | `Academic Affairs` |
| 2 — Abuse | `Student Affairs` |

Other staff divisions can manage public topics (3–5) but not Topics 1 or 2 unless their division matches.

## 8. Apply latest migrations (required for complaint submit)

If student complaint submit fails with `42501` on `submission`, push all migrations:

```bash
npx supabase db push
```

The latest migration (`20250601000005_submission_rpc.sql`) adds secure RPC functions `create_submission` and `create_user_answer` that resolve the student/staff profile server-side and bypass brittle INSERT RLS checks.
