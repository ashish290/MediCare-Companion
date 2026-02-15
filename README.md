# MediBuddy

A medication reminder app that helps patients track daily medications and notifies caretakers when doses are missed.

## Tech Stack

- **Frontend**: React 19 + TypeScript (strict mode) + Vite
- **Styling**: Tailwind CSS v4 with custom ShadCN-style components
- **State**: React Query (TanStack Query) with optimistic updates
- **Forms**: React Hook Form + Zod validation
- **Backend**: Supabase (Auth + Postgres + RLS)
- **Notifications**: Supabase Edge Functions + Resend

## Getting Started

### 1. Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run both migration files:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_missed_medications_rpc.sql`
3. Copy your **Project URL** and **anon key** from Settings → API

### 2. Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI primitives (Button, Card, Dialog, etc.)
│   ├── auth/            # Login and signup forms
│   ├── medications/     # MedicationCard, AddMedicationDialog
│   ├── dashboard/       # EmptyState, StreakCounter, loading skeletons
│   └── layout/          # ProtectedRoute
├── hooks/               # React Query hooks + Auth context
├── services/            # API abstraction (medication, log, auth services)
├── schemas/             # Zod validation schemas
├── types/               # TypeScript interfaces
├── lib/                 # Supabase client, utils, constants
├── pages/               # AuthPage, DashboardPage
└── main.tsx
```

## Database Schema

- **profiles** — extends Supabase auth.users with caretaker email and timezone
- **medications** — name, dosage, scheduled time per user
- **medication_logs** — daily tracking with unique constraint per medication per day

All tables have Row Level Security (RLS) enforcing `auth.uid() = user_id`.

## Missed Medication Detection

A Supabase Edge Function (`supabase/functions/check-missed-medications/`) runs on a cron schedule to:

1. Query medications without a log entry for today
2. Group missed medications by caretaker
3. Send email notifications via Resend API

### Deploy the Edge Function

```bash
supabase functions deploy check-missed-medications
```

Set the cron schedule in Supabase Dashboard → Edge Functions → Schedules:

```
1 21 * * *    # runs at 9:01 PM UTC daily
```

Set secrets:

```bash
supabase secrets set RESEND_API_KEY=your_resend_key
```

## Cron Job Setup (Daily Missed Medication Check)

To enable the automatic check for missed medications, you need to set up a Cron Job in your Supabase database.

1.  **Get your Project URL and Anon Key**:
    - Go to Supabase Dashboard -> **Settings** -> **API**.
    - Cop your `Project URL` (e.g., `https://xyz.supabase.co`) and `anon` key.

2.  **Enable Extensions**:
    - Go to **Database** -> **Extensions**.
    - Search for `pg_cron` and enable it.
    - Search for `pg_net` and enable it.

3.  **Run the Schedule SQL**:
    - Go to **SQL Editor** -> **New Query**.
    - Copy the content of `supabase/migrations/003_cron_schedule.sql`.
    - **IMPORTANT**: Replace `YOUR_ANON_KEY` in the SQL with your actual `anon` key.
    - Click **Run**.

    ```sql
    select cron.schedule(
      'missed-med-check',
      '0 * * * *',  -- runs every hour. Change to '0 21 * * *' for daily at 9pm
      $$
      select
        net.http_post(
            url:='https://YOUR_PROJECT_REF.supabase.co/functions/v1/check-missed-medications',
            headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb
        ) as request_id;
      $$
    );
    ```

4.  **Verify it's running**:
    - Go to **Table Editor** -> `cron.job` (in the `cron` schema) to see your scheduled job.
    - Go to **Database** -> **Postgres Logs** to see execution logs.

## Deployment (Vercel)

```bash
npm run build
```

1. Push to GitHub
2. Import in [Vercel](https://vercel.com)
3. Add environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
4. Deploy
