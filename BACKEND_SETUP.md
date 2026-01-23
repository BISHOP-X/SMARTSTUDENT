# ============================================
# Backend Setup Guide
# SmartStudent - Minimal Backend Configuration
# ============================================

This guide explains how to set up the minimal backend for SmartStudent.

## Overview

SmartStudent uses a **hybrid approach**:
- **Real backend** for: Authentication, AI grading, personal goals
- **Sample data** for: Courses, submissions, analytics (pre-populated for demos)

This gives you the best of both worlds - proving real functionality while showcasing a fully-populated system.

---

## Prerequisites

1. **Supabase Account** (free tier works fine)
   - Sign up at: https://supabase.com

2. **OpenAI API Key** (for AI grading)
   - Get one at: https://platform.openai.com/api-keys
   - Cost: ~$0.01 per grading request with GPT-4o-mini

---

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **"New Project"**
3. Fill in:
   - **Name**: SmartStudent
   - **Database Password**: (save this somewhere safe!)
   - **Region**: Choose closest to you
4. Click **"Create new project"**
5. Wait 2-3 minutes for setup to complete

---

## Step 2: Get Your API Keys

1. In your Supabase dashboard, go to **Settings → API**
2. Copy these values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon/public key** (the long string under "Project API keys")

---

## Step 3: Set Up the Database

1. In Supabase dashboard, go to **SQL Editor**
2. Click **"New Query"**
3. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
4. Paste it into the SQL editor
5. Click **"Run"**

You should see "Success" - this creates all the necessary tables.

---

## Step 4: Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and fill in your values:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

---

## Step 5: Deploy Edge Functions (for AI Grading)

### Option A: Using Supabase Dashboard

1. Go to **Edge Functions** in your Supabase dashboard
2. Click **"Create a new function"**
3. Name it `grade-submission`
4. Copy the code from `supabase/functions/grade-submission/index.ts`
5. Set the secret `OPENAI_API_KEY` in function settings

### Option B: Using Supabase CLI

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Login to Supabase:
   ```bash
   supabase login
   ```

3. Link your project:
   ```bash
   supabase link --project-ref your-project-ref
   ```

4. Deploy functions:
   ```bash
   supabase functions deploy grade-submission
   supabase functions deploy study-tools
   ```

5. Set secrets:
   ```bash
   supabase secrets set OPENAI_API_KEY=your-openai-key
   ```

---

## Step 6: Test the Setup

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:8080

3. Try signing up with a new account - it should create a real user!

4. If you see any errors in the console, check:
   - Are your environment variables correct?
   - Did the SQL migration run successfully?
   - Is your Supabase project fully initialized?

---

## What's Connected to Real Backend

| Feature | Backend | Description |
|---------|---------|-------------|
| Sign Up | ✅ Supabase Auth | Creates real user account |
| Login | ✅ Supabase Auth | Validates credentials |
| Profile | ✅ Supabase DB | Stores user profile |
| Goals | ✅ Supabase DB | Full CRUD operations |
| AI Grading | ✅ Edge Function | Real OpenAI API calls |
| AI Study Tools | ✅ Edge Function | Real content generation |

---

## What Uses Sample Data

| Feature | Why Sample Data? |
|---------|-----------------|
| Courses | Would need lecturers to create |
| Enrollments | Would need admin to assign |
| Past Submissions | Would need weeks of student use |
| Analytics | Needs historical data |
| Notifications | Time-based, hard to demo |

---

## Troubleshooting

### "Invalid API key"
- Double-check your `.env` file has the correct Supabase URL and key
- Make sure there are no extra spaces or quotes

### "Function not found"
- Make sure you deployed the Edge Functions
- Check the function name matches exactly

### "CORS error"
- Add your local URL to Supabase Auth settings
- Go to Authentication → URL Configuration → Add `http://localhost:8080`

### "Database error"
- Run the migration SQL again
- Check the SQL Editor for any error messages

---

## Cost Estimates

| Service | Free Tier | Estimated Demo Cost |
|---------|-----------|-------------------|
| Supabase | 500MB DB, 1GB storage | $0 |
| OpenAI | $5 free credit | ~$0.50 for 50 gradings |

**Total for demo/presentation: $0 - $1**

---

## Need Help?

- Supabase Docs: https://supabase.com/docs
- OpenAI Docs: https://platform.openai.com/docs
