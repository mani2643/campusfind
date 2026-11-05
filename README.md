# CampusFind — Hostel Lost & Found Web App
> **"Lost on Campus. Found with CampusFind."**

A modern, student-centric lost and found web platform designed for college students living in hostels. Built as a **Design Thinking College Project** to solve the chaotic, unorganized, and privacy-compromising methods currently used on campus (such as 500-member WhatsApp spam groups and unindexed notice boards).

---

## 🌟 Key Features & Innovations

### 1. Smart Privacy Shield
- Finders of high-value or sensitive items (wallets, student ID cards, room keys, electronics) can **mask private identifying details** from the public feed.
- For example: The exact room number stamped on a key, stickers on a calculator, or currency inside a wallet are hidden and preserved as an **Ownership Clue**.

### 2. Private Ownership Clue Verification
- Students who believe an item belongs to them submit a private claim request detailing specific characteristics only the real owner would know.
- The person holding the item reviews the clue and either approves or rejects the claim before any in-person handover is scheduled.
- Prevents impostor and opportunistic claims without broadcasting sensitive student data.

### 3. Dual Handover Confirmation & Official Digital Receipts
- **The primary differentiator of CampusFind**: Closing the recovery loop.
- When the item is returned, both parties complete a digital handover form logging the giver name, receiver name, handover location, security PIN, and inspection notes.
- Generates a printable, verifiable **CampusFind Official Handover Receipt** with a unique reference number (`CP-REC-XXXXXX`) and timestamp.
- Updates item status to **Returned** with celebratory confetti, removing it from active searches by default.

### 4. Dual Storage Engine (Instant Demo Mode + Supabase Cloud Ready)
- **Zero-Setup Local Mode**: Starts immediately in `localStorage` mode with pre-seeded realistic hostel data (keys, college IDs, bottles, headphones, calculators).
- **Honest Mode Indicators**: Top navigation bar and status banners explicitly state whether data is stored locally or synchronized in the cloud.
- **Supabase Ready**: Includes `supabase_schema.sql`, Row Level Security (RLS) policies, and client integration. Adding `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to `.env` activates real-time cloud sync with zero code changes.

### 5. Multi-Persona Switcher (For Evaluation & Demos)
- Evaluating a two-party workflow (Finder ↔ Claimant) typically requires two browsers or devices.
- CampusFind features an integrated **Demo Persona Switcher** in the navigation bar to switch between:
  - **bharath** (Hostel Block B, Room B-204)
  - **abhishek** (Hostel Block A, Room A-112)
  - **sai** (Hostel Block C, Room C-305)
  - **bhanu prakash** (Hostel Block B, Room B-118)
  - **pravallika** (Hostel Block A, Room A-207)
  - **vennela** (Hostel Block C, Room C-214)

---

## 🛠️ Technology Stack

- **Frontend Framework**: React 19 with Vite 8
- **Language**: JavaScript (ES Modules)
- **Routing**: React Router DOM (v7)
- **Styling**: Modern, responsive custom CSS with CSS variables, accessible color contrasts, and full Dark/Light theme support
- **Icons**: Lucide React
- **Celebration Effects**: Canvas Confetti
- **Database / Backend**:
  - Default: `localStorage` with initial mock data
  - Cloud Backend: Supabase (PostgreSQL + RLS + Storage)

---

## 🚀 Quick Start & Installation

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### 1. Clone & Navigate
```bash
cd campusfind
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Launch Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## 🧪 Testing the End-to-End User Journey

You can demonstrate the entire student lifecycle within 2 minutes:

1. **Browse & Search**:
   - Visit the **Home Dashboard** or click **Browse Items**.
   - Filter by **Keys** or **Hostel Block B** to see active listings.
   - Use the search bar to query *"ID card"* or *"library"*.

2. **Report a Found Item**:
   - Click **Report Found Item** and use the redesigned full-width photo upload area if you want to attach a picture.
   - Active Persona: **abhishek (Hostel Block A)**.
   - Fill in:
     - Name: *"Casio Scientific Calculator"*
     - Location: *"Central Library 1st Floor"*
     - Check **"Hide sensitive details from public view"** and enter Secret Clue: *"Has green dinosaur sticker on back"*.
   - Click **Publish Found Item Listing**.

3. **Submit an Ownership Claim**:
   - In the navbar persona dropdown, switch active persona to **Rohan Verma (Hostel Block C)**.
   - Open the newly posted calculator listing.
   - Click **Claim This Item**.
   - Input ownership clue: *"It has a green dinosaur sticker on the reverse slip case"*.
   - Accept the honesty agreement and submit.

4. **Approve Claim as Finder**:
   - In the navbar persona dropdown, switch back to **Priya Patel**.
   - Navigate to **My Activity** > **Claims Awaiting My Decision**.
   - Review Rohan's clue: *"It has a green dinosaur sticker on the reverse slip case"*.
   - Click **Approve Claim & Start Handover**.

5. **Execute Handover & Generate Receipt**:
   - Click **Proceed to Handover**.
   - Fill in the Handover location (e.g. *Hostel Block A Caretaker Desk*).
   - Enter/verify the 4-digit Handover PIN.
   - Check the **Dual Confirmation Agreement** and click **Confirm Return & Generate Receipt**.
   - Enjoy the confetti celebration!
   - Review or print the **CampusFind Official Handover Receipt** (`CP-REC-XXXXXX`).

---

## 🗄️ Supabase Cloud Configuration (Optional)

If you would like to connect a shared online database:

1. Create a project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard and run the entire script in [supabase_schema.sql](./supabase_schema.sql).
3. Create a public Storage bucket named `item-photos` (optional, for image hosting).
4. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
5. Fill in your credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-actual-anon-key
   ```
6. Restart your dev server (`npm run dev`). The top banner will immediately show **"Supabase Cloud Storage (Connected)"**!

---

## 📁 Project Structure

```
campusfind/
├── public/                 # Static assets & icons
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Navbar.jsx      # Navigation, persona switcher, theme toggle
│   │   ├── Footer.jsx      # Hostel tips, project credits
│   │   ├── ItemCard.jsx    # Card component with badges & image fallback
│   │   ├── StatusBadge.jsx # Reusable status & lifecycle badges
│   │   └── Toast.jsx       # Floating notifications
│   ├── context/
│   │   └── AppContext.jsx  # Global state (persona, theme, stats, toasts)
│   ├── pages/
│   │   ├── HomePage.jsx        # Landing hero, search, stats, 4-step workflow
│   │   ├── BrowsePage.jsx      # Search, multi-filtering, sorting
│   │   ├── ReportLostPage.jsx  # Lost item form with photo preview
│   │   ├── ReportFoundPage.jsx # Found item form with Smart Privacy Shield
│   │   ├── ItemDetailsPage.jsx # Details view & claim modal
│   │   ├── HandoverPage.jsx    # Dual-confirmation handover & printable receipt
│   │   ├── MyActivityPage.jsx  # Tabbed personal dashboard & claim review
│   │   └── AboutPage.jsx       # Design thinking methodology & roadmap
│   ├── services/
│   │   ├── mockData.js         # Realistic initial hostel sample records
│   │   ├── storageService.js   # Dual-mode storage engine (local + supabase)
│   │   └── supabaseClient.js   # Supabase client initializer
│   ├── App.jsx             # Route definitions & layout shell
│   ├── index.css           # Complete responsive design system & dark mode
│   └── main.jsx            # Application entrypoint
├── index.html              # HTML shell with fonts & metadata
├── supabase_schema.sql     # PostgreSQL database schema & RLS policies
├── vercel.json             # Vercel SPA routing rewrite rules
├── VERCEL_DEPLOYMENT.md    # Deployment guide for Vercel
├── .env.example            # Sample environment variables
└── package.json            # Dependencies & scripts
```

---

## 🎯 Design Thinking College Project Rationale

| Phase | Student Need | CampusFind Implementation |
|---|---|---|
| **1. Empathize** | Students lose keys and IDs daily; WhatsApp groups are noisy and expose identity photos. | Built clean, structured, categorized hostel records. |
| **2. Define** | Informal channels lack verification, lead to false claims, and provide no receipt of return. | Formulated the **Private Clue Verification** model. |
| **3. Ideate** | How can a finder post an item without giving away identifying marks? | Created the **Smart Privacy Shield** toggle. |
| **4. Prototype** | A responsive, dual-storage web app that works on both student phones and laptops. | Built with React, Vite, CSS design system, and multi-persona testing. |
| **5. Test** | How do we confirm the item actually reached the owner? | Built the **Dual Handover Confirmation & Printable Receipt**. |

---

## 🔒 Security & Real-World Deployment Limitations

For this college prototype, data integrity and persona switching are managed directly in the client application. A full university-wide deployment would include:
1. **Campus SSO**: Authentication via official `@university.edu` email using Google/Microsoft OAuth.
2. **Student ID Barcode Scan**: Integrating physical barcode/RFID scanners at caretaker desks during the handover step.
3. **Automated Alerts**: WhatsApp Business API / Webhook integration to push alerts directly to hostel floor representatives.
4. **Server-Side Authorization**: Enforcing database-level Row Level Security to ensure only the item holder can sign off on handovers.

---

## 📜 License
Developed for educational and academic project presentation.
