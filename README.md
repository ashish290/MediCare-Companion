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

````
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
### 2. Database Setup (Supabase)

1.  Create a new Supabase project.
2.  Go to the **SQL Editor** in your Supabase Dashboard.
3.  Copy and run the contents of `supabase/migrations/001_initial_schema.sql` to set up tables and security policies.
4.  Copy and run `supabase/migrations/002_missed_medications_rpc.sql` to enable the missed medication detection logic.

### 3. Edge Function & Email Notifications

To enable the automated caretaker emails:

1.  **Install Supabase CLI**: `npm install -g supabase`
2.  **Login**: `npx supabase login`
3.  **Link Project**:
    ```bash
    npx supabase link --project-ref your_project_ref
    ```
4.  **Set Secrets**:
    ```bash
    npx supabase secrets set RESEND_API_KEY=re_123456...
    ```
5.  **Deploy Function**:
    ```bash
    npx supabase functions deploy check-missed-medications
    ```

### 4. Cron Job Automation

To schedule the system to check for missed medications every hour:

1.  Enable `pg_cron` and `pg_net` extensions in Supabase (Database -> Extensions).
2.  Run the following SQL in your content editor (replace `YOUR_ANON_KEY` with your actual key from `.env.local`):

    ```sql
    select cron.schedule(
      'missed-med-check',
      '0 * * * *', -- Runs every hour
      $$
      select
        net.http_post(
            url:='https://YOUR_PROJECT_REF.supabase.co/functions/v1/check-missed-medications',
            headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb
        ) as request_id;
      $$
    );
    ```

---

## 📦 Deployment

The frontend is optimized for deployment on Vercel or Netlify.

**Build for production:**

```bash
npm run build
````

This generates a `dist` folder ready for static hosting.

---

## 🛡️ Security

- **Row Level Security (RLS)**: Enabled on all tables. Users can only access and modify their own data.
- **Secure API Calls**: Edge Functions typically require a valid Service Role or JWT token for execution.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
ITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` 4. Deploy
