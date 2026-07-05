"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { 
  Trophy, 
  Flame, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  Calendar, 
  Sparkles, 
  Terminal,
  ExternalLink,
  Star,
  Check,
  XCircle,
  TrendingUp,
  FolderGit2
} from "lucide-react"

// Mock initial data before Phase 2 auto-fetch engine completes
const mockContests = [
  {
    id: "cf-1980",
    platform: "CODEFORCES",
    title: "Codeforces Round 962 (Div. 3)",
    startTime: new Date(Date.now() + 3600000 * 4).toISOString(), // 4 hours from now
    durationSec: 7200,
    url: "https://codeforces.com/contests/1980",
    intent: "REGISTERED",
  },
  {
    id: "lc-biweekly-135",
    platform: "LEETCODE",
    title: "LeetCode Biweekly Contest 135",
    startTime: new Date(Date.now() + 3600000 * 28).toISOString(), // Tomorrow
    durationSec: 5400,
    url: "https://leetcode.com/contest/biweekly-contest-135/",
    intent: "INTERESTED",
  },
  {
    id: "cf-1981",
    platform: "CODEFORCES",
    title: "Educational Codeforces Round 168 (Rated for Div. 2)",
    startTime: new Date(Date.now() + 3600000 * 72).toISOString(), // 3 days from now
    durationSec: 7200,
    url: "https://codeforces.com/contests/1981",
    intent: "NOT_REGISTERED",
  },
]

export default function DashboardHomePage() {
  const { data: session } = useSession()
  const [contests, setContests] = useState(mockContests)
  const [timeLeft, setTimeLeft] = useState("03h 48m 12s")

  // Simple countdown ticker simulation for UI feel
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime()
      const target = new Date(contests[0].startTime).getTime()
      const diff = target - now
      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)
        setTimeLeft(`${hours < 10 ? "0" + hours : hours}h ${minutes < 10 ? "0" + minutes : minutes}m ${seconds < 10 ? "0" + seconds : seconds}s`)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [contests])

  const handleStatusChange = (id: string, newIntent: string) => {
    setContests((prev) =>
      prev.map((c) => (c.id === id ? { ...c, intent: newIntent } : c))
    )
  }

  const registeredContests = contests.filter((c) => c.intent === "REGISTERED")
  const interestedContests = contests.filter((c) => c.intent === "INTERESTED")
  const upcomingContests = contests.filter((c) => c.intent === "NOT_REGISTERED")

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* Top Banner / Greeting */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-gradient-to-br from-[#121216] via-[#0d0d10] to-[#0a0a0c] p-6 sm:p-8 shadow-2xl">
        <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute right-20 -bottom-10 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-mono text-emerald-400">
                <Sparkles className="h-3.5 w-3.5" />
                <span>SDE Command Center</span>
              </span>
              <span className="text-xs font-mono text-zinc-500">v0.1.0-alpha</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Hey {session?.user?.name ? session.user.name.split(" ")[0] : "Vardhan"} 👋
            </h1>
            <p className="text-sm text-zinc-400 max-w-xl leading-relaxed">
              Welcome back. Your coding contests are auto-synced from Codeforces & LeetCode. 
              Stay accountable and crush your sprint goals today.
            </p>
          </div>

          {/* Quick Focus Stats Widget */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:min-w-[340px]">
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-3.5 text-center">
              <p className="text-[11px] font-mono uppercase text-zinc-500">Active Sprint</p>
              <p className="text-xl font-bold text-white mt-0.5 flex items-center justify-center gap-1">
                <span>4</span>
                <span className="text-xs text-emerald-400 font-mono">Tasks</span>
              </p>
            </div>
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-3.5 text-center">
              <p className="text-[11px] font-mono uppercase text-zinc-500">CF Rating</p>
              <p className="text-xl font-bold text-cyan-400 mt-0.5 font-mono">1420</p>
            </div>
            <div className="col-span-2 sm:col-span-1 rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-3.5 text-center">
              <p className="text-[11px] font-mono uppercase text-zinc-500">Hackathons</p>
              <p className="text-xl font-bold text-amber-400 mt-0.5 font-mono">2 Live</p>
            </div>
          </div>
        </div>
      </div>

      {/* 🔥 NEXT CONTEST HERO CARD */}
      {contests.length > 0 && (
        <div className="relative overflow-hidden rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/30 via-zinc-900/90 to-zinc-950 p-6 sm:p-7 shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="flex h-6 items-center gap-1.5 rounded-md bg-emerald-500 px-2 text-[11px] font-bold uppercase text-black font-mono">
                  <Flame className="h-3.5 w-3.5 fill-black" />
                  Next Contest
                </span>
                <span className="text-xs font-mono text-zinc-400 border border-zinc-800 bg-zinc-900 px-2 py-0.5 rounded">
                  {contests[0].platform}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white hover:text-emerald-300 transition-colors">
                <a href={contests[0].url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <span>{contests[0].title}</span>
                  <ExternalLink className="h-4 w-4 text-zinc-500" />
                </a>
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-zinc-500" />
                  {new Date(contests[0].startTime).toLocaleDateString([], { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-zinc-500" />
                  Duration: {contests[0].durationSec / 3600} hours
                </span>
              </div>
            </div>

            {/* Countdown Ticker Box */}
            <div className="flex flex-col sm:flex-row items-center gap-4 border border-zinc-800 bg-[#0e0e11] p-4 rounded-xl">
              <div className="text-center sm:text-left">
                <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Starts in</p>
                <p className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-emerald-400 animate-pulse">
                  {timeLeft}
                </p>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-zinc-800 pt-3 sm:pt-0 sm:pl-4">
                <a
                  href={contests[0].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-emerald-500/20"
                >
                  <span>Enter Contest</span>
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🏁 PRIORITY CONTEST GROUPS (THE BLUEPRINT ORDER) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Trophy className="h-5 w-5 text-emerald-400" />
              <span>Contest Priority Board</span>
            </h3>
            <p className="text-xs text-zinc-500">Ordered by your intent: ✅ Registered → ⭐ Interested → ❌ Upcoming</p>
          </div>
          <Link href="/contests" className="text-xs font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
            <span>View Calendar</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Group 1: Registered Contests */}
        {registeredContests.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>1. Registered Contests ({registeredContests.length})</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {registeredContests.map((c) => (
                <ContestCard key={c.id} contest={c} onStatusChange={handleStatusChange} />
              ))}
            </div>
          </div>
        )}

        {/* Group 2: Interested Contests */}
        {interestedContests.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span>2. Interested Contests ({interestedContests.length})</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {interestedContests.map((c) => (
                <ContestCard key={c.id} contest={c} onStatusChange={handleStatusChange} />
              ))}
            </div>
          </div>
        )}

        {/* Group 3: Not Registered (Upcoming) */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-zinc-500" />
            <span>3. Upcoming Public Contests ({upcomingContests.length})</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingContests.map((c) => (
              <ContestCard key={c.id} contest={c} onStatusChange={handleStatusChange} />
            ))}
          </div>
        </div>
      </div>

      {/* 🚀 QUICK PRODUCTIVITY FOOTER (TO-DO & PROJECTS PREVIEW) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-zinc-800">
        {/* To-Do Quick Card */}
        <div className="rounded-2xl border border-zinc-800 bg-[#0d0d10] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Engineering To-Do List</span>
            </h4>
            <Link href="/todo" className="text-xs font-mono text-zinc-400 hover:text-white">View All →</Link>
          </div>
          <div className="space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/80 border border-zinc-800/80">
              <span className="text-zinc-300">⚡ Build Codeforces cron fetcher</span>
              <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px]">HIGH</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/80 border border-zinc-800/80">
              <span className="text-zinc-300">🔐 Implement Resend email reminder cron</span>
              <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px]">MEDIUM</span>
            </div>
          </div>
        </div>

        {/* Projects Quick Card */}
        <div className="rounded-2xl border border-zinc-800 bg-[#0d0d10] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <FolderGit2 className="h-4 w-4 text-cyan-400" />
              <span>Active SDE Projects</span>
            </h4>
            <Link href="/projects" className="text-xs font-mono text-zinc-400 hover:text-white">View All →</Link>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/80 border border-zinc-800/80 text-xs">
              <div>
                <p className="font-semibold text-white">SnapScribe AI Image Caption</p>
                <p className="text-[10px] font-mono text-zinc-500">React 19 • Vite • Hugging Face API</p>
              </div>
              <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px]">SHIPPED</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/80 border border-zinc-800/80 text-xs">
              <div>
                <p className="font-semibold text-white">DevTrack SDE Dashboard</p>
                <p className="text-[10px] font-mono text-zinc-500">Next.js 16 • Prisma • Neon PostgreSQL</p>
              </div>
              <span className="px-2 py-1 rounded bg-amber-500/20 text-amber-400 font-mono text-[10px]">ONGOING</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Reusable Contest Card Component adhering to User Intent Specs
function ContestCard({ contest, onStatusChange }: { contest: any; onStatusChange: (id: string, s: string) => void }) {
  const isCF = contest.platform === "CODEFORCES"
  const isRegistered = contest.intent === "REGISTERED"
  const isInterested = contest.intent === "INTERESTED"

  return (
    <div className={`group relative flex flex-col justify-between rounded-xl border p-5 transition-all duration-200 ${
      isRegistered 
        ? "border-emerald-500/40 bg-gradient-to-b from-emerald-950/20 to-[#0e0e11] shadow-lg shadow-emerald-500/5" 
        : isInterested 
        ? "border-amber-500/40 bg-gradient-to-b from-amber-950/20 to-[#0e0e11]" 
        : "border-zinc-800/80 bg-[#0e0e11] hover:border-zinc-700"
    }`}>
      <div>
        {/* Header: Platform badge & Intent Status */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border ${
            isCF ? "bg-red-500/10 text-red-400 border-red-500/30" : "bg-amber-500/10 text-amber-400 border-amber-500/30"
          }`}>
            {isCF ? "Codeforces" : "LeetCode"}
          </span>

          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono ${
            isRegistered ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold" :
            isInterested ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" :
            "bg-zinc-800 text-zinc-400"
          }`}>
            {isRegistered && <Check className="h-3 w-3" />}
            {isInterested && <Star className="h-3 w-3 fill-amber-300" />}
            <span>{isRegistered ? "✅ Registered" : isInterested ? "⭐ Interested" : "❌ Not Registered"}</span>
          </span>
        </div>

        {/* Contest Title */}
        <h4 className="text-sm font-bold text-zinc-100 group-hover:text-emerald-300 transition-colors line-clamp-2 min-h-[40px]">
          <a href={contest.url} target="_blank" rel="noopener noreferrer">
            {contest.title}
          </a>
        </h4>

        {/* Timing Details */}
        <div className="mt-3 space-y-1 text-xs font-mono text-zinc-400">
          <p className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-zinc-500" />
            <span>{new Date(contest.startTime).toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
          </p>
          <p className="flex items-center gap-1.5 text-zinc-500">
            <Clock className="h-3.5 w-3.5" />
            <span>Duration: {contest.durationSec / 3600}h</span>
          </p>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-5 pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2">
        <a
          href={contest.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
        >
          <span>Go to Contest</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </a>

        {/* Quick Status Toggles */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onStatusChange(contest.id, isRegistered ? "NOT_REGISTERED" : "REGISTERED")}
            title={isRegistered ? "Remove Registration" : "Mark as Registered"}
            className={`p-1.5 rounded-md transition-colors ${
              isRegistered ? "bg-emerald-500 text-black font-bold" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
            }`}
          >
            <Check className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onStatusChange(contest.id, isInterested ? "NOT_REGISTERED" : "INTERESTED")}
            title={isInterested ? "Remove Interest" : "Mark as Interested"}
            className={`p-1.5 rounded-md transition-colors ${
              isInterested ? "bg-amber-500 text-black font-bold" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
            }`}
          >
            <Star className={`h-3.5 w-3.5 ${isInterested ? "fill-black" : ""}`} />
          </button>
        </div>
      </div>
    </div>
  )
}
