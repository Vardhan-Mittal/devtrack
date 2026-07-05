# 🚀 DevTrack — Your Coding Life, Organized

[![Vercel Live Demo](https://img.shields.io/badge/Vercel-Live%20Demo-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://devtrack-plum.vercel.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg?style=for-the-badge)](./LICENSE)

**🌐 Live Production URL:** [https://devtrack-plum.vercel.app/](https://devtrack-plum.vercel.app/)

A **developer-only command center & productivity dashboard** that auto-tracks coding contests (Codeforces, LeetCode) and hackathons (Unstop), syncs real-time algorithmic problem solving stats, generates instant AI project architectures, and organizes your software engineering sprint workflows.

---

## 🌟 Core Features & Blueprint

### 🏆 1. Real-Time LeetCode & Codeforces Problem Solver Tracker
- **Direct Algorithmic Sync**: Connects directly to official LeetCode GraphQL and Codeforces REST APIs to sync your unique problem-solving counts, active streaks, acceptance rates (%), and rating ranks (e.g. *Legendary Grandmaster*).
- **Inline Profile Extraction**: Zero hardcoded demo fallbacks! Connect or update your LeetCode username and Codeforces handle directly inside the homepage tracker widget to extract live data instantly.

### 📈 2. Monthly SDE Velocity & Progress Heatmap
- Automatically calculates a comprehensive monthly engineering progress score (0–100%) by combining:
  - **Sprint Task Velocity**: Completed vs. total tickets on your Kanban sprint board.
  - **Contest Readiness**: Active registrations for upcoming coding contests.
  - **Algorithmic Growth**: Real-time solved problems and active coding streaks.
  - **Project Execution**: Shipped applications and ongoing portfolio roadmaps.

### 🤖 3. AI SDE Algorithmic Pattern Engine
- **Instant < 100ms Architecture Planner**: Built-in zero-config SDE engine (`/api/ai/plan-project`) that analyzes natural language project ideas and instantly generates production-ready tech stacks, database schemas, and folder structures.
- **Interactive Project Roadmaps**: Inspect AI-generated milestones, file trees, and implementation phases directly from sleek modal drawers on every Project Card.

### ⚔️ 4. Automated Contest System (Codeforces & LeetCode)
- **Zero Manual Entry**: Contests are automatically fetched from public platform APIs and stored in PostgreSQL.
- **User-Intent Tracking**: Mark your status for any contest:
  - ✅ **Registered** (High Priority)
  - ⭐ **Interested** (Medium Priority)
  - ❌ **Not Registered** (Default)
- **Priority Dashboard Sorting**: Automatically groups contests by intent (`Registered` → `Interested` → `Not Registered`), ordering each group by nearest countdown timer!

### 🔥 5. Automated Hackathon Tracker (Unstop)
- Auto-fetches live and upcoming hackathons from Unstop.
- Calendar and list views highlighting registration deadlines and prize pools.

### 🛠️ 6. Engineering Productivity Suite
- **To-Do Kanban Board**: Developer task management with priorities (`HIGH`, `MEDIUM`, `LOW`), due dates, and instant completion toggles.
- **SDE Projects Tracker**: Organize personal and team repositories across `Planned`, `Ongoing`, and `Shipped` states with tech stack tags and GitHub links.

---

## 💻 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router, Turbopack, Server Components)
- **Database & ORM**: [PostgreSQL (Neon Serverless)](https://neon.tech) + [Prisma ORM v5](https://prisma.io)
- **Authentication**: [NextAuth.js](https://next-auth.js.org) (Google OAuth with PostgreSQL session & profile persistence)
- **Algorithmic Sync**: Official LeetCode GraphQL + Codeforces REST API
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
