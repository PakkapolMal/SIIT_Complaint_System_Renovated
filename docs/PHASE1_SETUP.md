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

You **cannot** test staff flows with a `@g.siit.tu.ac.th` student account. Use a real SIIT staff Google account.

### Staff self-signup (default)

1. Sign in with Google using your `@siit.tu.ac.th` address.
2. You are redirected to `/signup` to **select your division** (SIIT office/division, not student academic departments like BA/CE).
3. After saving, you can access `/admin` and only see complaints for topics your division manages.

Apply migration `20250604000000_staff_signup_and_division_access.sql` before testing:

```bash
npx supabase db push
```

### Division → complaint topic access (manage complaints)

| `staff.Division` | Topic ID | Topic name (seed) |
|------------------|----------|---------------------|
| Academic Services and Registration Division | 1 | Academics |
| Student Affairs and Alumni Relations Division (SA&AR) | 2 | Physical or Mental Abusements |
| Building and Ground Division (BG) | 3 | Area, Facilities, Amenities, and Welfare |
| ALL | 4 | Faculty Systems and Staff Contact |
| Other | 4 only | Faculty Systems and Staff Contact |
| Admission and Public Relations Division (AD&PR) | 5 | Follow ups, Updates, and News |

Anonymous users on `/overall-view` can still **read** topics 3, 4, and 5; staff management is scoped by division via `topic_staff_access` and RLS.

### Optional: grant full admin role

After staff signup, promote a user to full admin (all topics) in SQL Editor:

```sql
INSERT INTO public.admin ("UUID", "Role", "StaffID")
SELECT s."UUID", 'Admin', s."StaffID"
FROM public.staff s
WHERE s."Email" = 'your.name@siit.tu.ac.th'
ON CONFLICT ("UUID") DO NOTHING;
```

Sign out and sign back in to pick up the admin role.

### Dev seed staff (optional)

`supabase/seed.sql` includes placeholder staff rows with pre-set divisions. These only work if you can OAuth as those exact mailboxes. For most dev setups, use self-signup with your own `@siit.tu.ac.th` account.

## 8. Apply latest migrations (required for complaint submit)

If student complaint submit fails with `42501` on `submission`, push all migrations:

```bash
npx supabase db push
```

The latest migrations add secure RPC functions (`create_submission`, `create_user_answer`, `complete_staff_profile`) and division-based staff access to complaints.
