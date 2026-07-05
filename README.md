# 🚀 DevTrack — Your Coding Life, Organized

[![Vercel Live Demo](https://img.shields.io/badge/Vercel-Live%20Demo-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://devtrack-plum.vercel.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg?style=for-the-badge)](./LICENSE)

**🌐 Live Production URL:** [https://devtrack-plum.vercel.app/](https://devtrack-plum.vercel.app/)

A **developer-only productivity dashboard** that auto-tracks coding contests (Codeforces, LeetCode) and hackathons (Unstop), manages user-intent tracking with custom priority sorting algorithms, automates email reminders, and provides dedicated tools for software project portfolios and engineering todos.

---

## 🌟 Core Features & Blueprint

### 🏆 1. Automated Contest System (Codeforces & LeetCode)
- **Zero Manual Entry**: Contests are automatically fetched from public platform APIs and stored in a shared PostgreSQL database.
- **User-Intent Tracking**: Mark your status for any contest:
  - ✅ **Registered** (High Priority)
  - ⭐ **Interested** (Medium Priority)
  - ❌ **Not Registered** (Default)
- **Priority Dashboard Sorting**: The dashboard automatically groups contests by intent (`Registered` → `Interested` → `Not Registered`), ordering each group by the nearest upcoming countdown timer!

### 🔥 2. Automated Hackathon Tracker (Unstop)
- Auto-fetches live and upcoming hackathons from Unstop.
- Calendar and list views highlighting registration deadlines and prize pools.

### ⏰ 3. Automated Reminder Engine
- Cron workers evaluate upcoming contest schedules against your custom preferences (e.g., reminding you 30 minutes before a Registered contest starts).
- Powered by secure email notification integrations.

### 🛠️ 4. Engineering Productivity Suite
- **To-Do List**: Developer task management with priorities (`HIGH`, `MEDIUM`, `LOW`), due dates, and instant completion toggles.
- **SDE Projects Tracker**: Organize personal and team repositories across `Planned`, `Ongoing`, and `Shipped` states with tech stack tags and GitHub links.

---

## 💻 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router, Turbopack, Server Components)
- **Database & ORM**: [PostgreSQL (Neon Serverless)](https://neon.tech) + [Prisma ORM v5](https://prisma.io)
- **Authentication**: [NextAuth.js](https://next-auth.js.org) (Google & GitHub OAuth with JWT session persistence)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) + Lucide Icons + Dark Mode developer aesthetic
- **Deployment**: [Vercel Edge & Serverless Cloud](https://vercel.com)

---

## 🛠️ Getting Started Locally

### 1. Clone the repository
```bash
git clone https://github.com/Vardhan-Mittal/devtrack.git
cd devtrack
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables (`.env`)
Create a `.env` file in the root directory with your database connection and OAuth credentials:
```env
DATABASE_URL="postgresql://user:password@ep-[id]-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&pgbouncer=true"
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"
NEXTAUTH_SECRET="your-random-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Sync Database Schema
```bash
npx prisma db push
```

### 5. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the live SDE Command Center!

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

