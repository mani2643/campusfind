# Deploying CampusFind to Vercel

CampusFind is built with React and Vite and is fully optimized for continuous deployment on **Vercel**.

---

## Method 1: Deploy via Vercel Web Dashboard (Recommended)

### Step 1: Push Code to GitHub / GitLab / Bitbucket
Ensure your `campusfind` project is pushed to a repository on your Git provider.

### Step 2: Import into Vercel
1. Log into your [Vercel Dashboard](https://vercel.com).
2. Click **Add New...** > **Project**.
3. Select your repository from the list.
4. If `campusfind` is in a subfolder, set the **Root Directory** to `campusfind`.
5. Select **Vite** as the Framework Preset (Vercel will usually auto-detect this).

### Step 3: Configure Build & Output Settings
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Step 4: Configure Environment Variables (Optional for Supabase)
If you wish to connect Supabase:
- Add `VITE_SUPABASE_URL` = `https://your-project.supabase.co`
- Add `VITE_SUPABASE_ANON_KEY` = `your-anon-key`

> *Note: If these environment variables are omitted, CampusFind will automatically run in zero-configuration **Demo Mode (localStorage)** with sample data pre-seeded.*

### Step 5: Deploy
Click **Deploy**. Your app will build and go live at `https://campusfind-xyz.vercel.app`.

---

## Method 2: Deploy via Vercel CLI

1. Install the Vercel CLI globally (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. Open your terminal in the `campusfind` directory:
   ```bash
   cd campusfind
   ```

3. Run the deploy command:
   ```bash
   vercel
   ```
   Follow the prompts to link to your account and select default settings.

4. For production deployment:
   ```bash
   vercel --prod
   ```

---

## SPA Routing Configuration (`vercel.json`)

To ensure that direct URLs like `/browse`, `/report-lost`, `/items/item-101`, and `/handover/item-105` do not return `404 Not Found` when directly refreshed in the browser, `campusfind/vercel.json` has already been configured with:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```
This routes all page requests to Vite's `index.html`, where React Router takes over client-side navigation.
