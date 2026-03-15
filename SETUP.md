# 🌿 IELTS Master — Setup Guide (Google OAuth)

## Overview
- **Frontend**: React + Vite + Tailwind CSS
- **Auth**: Supabase + Google OAuth (one-click sign-in, no passwords)
- **Database**: Supabase PostgreSQL
- **Hosting**: Cloudflare Pages

---

## STEP 1 — Set Up Supabase

### 1.1 Create a Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and sign in
2. Click **"New Project"**, name it `ielts-master`, set a password, pick a region
3. Wait ~2 minutes for it to initialise

### 1.2 Run the Database Schema
1. Go to **SQL Editor → New Query**
2. Open `supabase_schema.sql` from this project, paste it all in, click **Run**
3. You should see "Success. No rows returned" ✅

### 1.3 Enable Google Auth in Supabase
1. Go to **Authentication → Providers**
2. Find **Google** and click to expand it
3. Toggle it **ON**
4. You'll need a **Client ID** and **Client Secret** from Google — see Step 2 below
5. Copy the **Callback URL** shown on this page (looks like `https://xxxx.supabase.co/auth/v1/callback`) — you'll need it in Step 2

### 1.4 Get Your Supabase API Keys
1. Go to **Settings → API**
2. Copy your **Project URL** and **anon/public key**

---

## STEP 2 — Set Up Google OAuth

### 2.1 Create a Google Cloud Project
1. Go to [https://console.cloud.google.com](https://console.cloud.google.com)
2. Click the project dropdown at the top → **New Project**
3. Name it `ielts-master` → **Create**

### 2.2 Enable the Google OAuth API
1. In your new project, go to **APIs & Services → Library**
2. Search for **"Google+ API"** or **"Google Identity"** → Enable it
3. Also enable **"Google People API"**

### 2.3 Configure the OAuth Consent Screen
1. Go to **APIs & Services → OAuth consent screen**
2. Choose **External** → **Create**
3. Fill in:
   - App name: `IELTS Master`
   - User support email: your email
   - Developer contact: your email
4. Click **Save and Continue** through all steps
5. On the **Scopes** page, add: `email`, `profile`, `openid`
6. On the **Test users** page, add your own Google email (while testing)
7. Click **Back to Dashboard**

### 2.4 Create OAuth Credentials
1. Go to **APIs & Services → Credentials**
2. Click **Create Credentials → OAuth 2.0 Client IDs**
3. Application type: **Web application**
4. Name: `IELTS Master Web`
5. Under **Authorised redirect URIs**, add the Callback URL from Supabase Step 1.3:
   ```
   https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback
   ```
6. Click **Create**
7. Copy the **Client ID** and **Client Secret**

### 2.5 Add Credentials to Supabase
1. Back in Supabase → **Authentication → Providers → Google**
2. Paste your **Client ID** and **Client Secret**
3. Click **Save**

---

## STEP 3 — Configure the App

### 3.1 Create your `.env` file
In the project root, create `.env`:
```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJyour-anon-key-here
```

### 3.2 Install & Run Locally
```bash
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) — click "Continue with Google" 🎉

> **Note for local testing**: Add `http://localhost:5173` to your Google OAuth Client's
> **Authorised JavaScript origins**, and add `https://YOUR_PROJECT.supabase.co/auth/v1/callback`
> as the redirect URI (already done above). The Supabase callback handles localhost too.

---

## STEP 4 — Deploy to Cloudflare Pages

### 4.1 Push to GitHub
```bash
git init
git add .
git commit -m "IELTS Master"
git remote add origin https://github.com/YOUR_USERNAME/ielts-master.git
git push -u origin main
```

### 4.2 Connect to Cloudflare Pages
1. [https://dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages → Pages → Create**
2. **Connect to Git** → select your repo
3. Build settings:
   - Framework preset: **Vite**
   - Build command: `npm run build`
   - Output directory: `dist`
4. **Environment variables** — add both:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Click **Save and Deploy**

Your live URL will be: `https://ielts-master.pages.dev`

### 4.3 Add Your Live Domain to Supabase & Google

**In Supabase → Authentication → URL Configuration:**
- Site URL: `https://ielts-master.pages.dev`
- Redirect URLs: `https://ielts-master.pages.dev`, `https://ielts-master.pages.dev/**`

**In Google Cloud Console → OAuth 2.0 Client:**
- Add to Authorised redirect URIs: `https://ielts-master.pages.dev` (Supabase handles the actual callback, but adding the domain is good practice)

---

## Updating Your App
```bash
git add . && git commit -m "update" && git push
```
Cloudflare auto-deploys in ~2 minutes.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Google button does nothing | Check Supabase Client ID/Secret under Authentication → Providers |
| Redirect loop after sign-in | Check Site URL in Supabase → Authentication → URL Configuration |
| "Redirect URI mismatch" | Make sure the Supabase callback URL is in Google Console → Authorised redirect URIs |
| Profile not saving | Run the SQL schema again; check RLS policies in Supabase → Table Editor |
| Blank screen on Cloudflare | Check env variables are set in Cloudflare Pages → Settings → Environment variables |
