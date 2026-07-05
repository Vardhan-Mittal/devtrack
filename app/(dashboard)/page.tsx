"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { 
  Trophy, 
  Flame, 
  CheckCircle2, 
  ArrowUpRight, 
  Calendar, 
  Sparkles, 
  ExternalLink,
  Star,
  Check,
  FolderGit2,
  Loader2,
  RefreshCw
} from "lucide-react"
import ContestCard, { ContestProps } from "@/components/ContestCard"

export default function DashboardHomePage() {
  const { data: session } = useSession()
  const [contests, setContests] = useState<ContestProps[]>([])
  const [grouped, setGrouped] = useState<{
    registered: ContestProps[]
    interested: ContestProps[]
    upcoming: ContestProps[]
  }>({ registered: [], interested: [], upcoming: [] })
  const [recentTodos, setRecentTodos] = useState<any[]>([])
  const [recentProjects, setRecentProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)

  const fetchContests = async () => {
    try {
      const res = await fetch("/api/contests")
      if (res.ok) {
        const data = await res.json()
        if (data.success) {
          setContests(data.contests || [])
          setGrouped(data.grouped || { registered: [], interested: [], upcoming: [] })
        }
      }
    } catch (err) {
      console.error("Failed to load contests from API")
    } finally {
      setLoading(false)
    }
  }

  const fetchProductivityData = async () => {
    try {
      const [todosRes, projectsRes] = await Promise.all([
        fetch("/api/todos"),
        fetch("/api/projects")
      ])
      if (todosRes.ok) {
        const tData = await todosRes.json()
        if (tData.success) setRecentTodos((tData.tasks || []).slice(0, 3))
      }
      if (projectsRes.ok) {
        const pData = await projectsRes.json()
        if (pData.success) setRecentProjects((pData.projects || []).slice(0, 2))
      }
    } catch (err) {
      console.error("Failed to load productivity data")
    }
  }

  useEffect(() => {
    fetchContests()
    fetchProductivityData()
  }, [session])

  const handleManualSync = async () => {
    setSyncing(true)
    try {
      await fetch("/api/contests", { method: "POST" })
      await fetchContests()
    } catch (err) {
      console.error("Manual sync failed")
    } finally {
      setSyncing(false)
    }
  }

  const handleIntentChanged = (id: string, newIntent: string) => {
    // Re-fetch to apply priority sorting algorithm cleanly
    setTimeout(() => fetchContests(), 500)
  }

  const firstUpcoming = contests.length > 0 ? contests[0] : null

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
              <span className="text-xs font-mono text-zinc-500">v0.2.0-beta</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Hey {session?.user?.name ? session.user.name.split(" ")[0] : "Developer"} 👋
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
                <span>{recentTodos.length}</span>
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
      {loading ? (
        <div className="rounded-2xl border border-zinc-800 bg-[#0e0e11] p-12 text-center flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
          <p className="text-sm font-mono text-zinc-400">Syncing live contest schedule from PostgreSQL...</p>
        </div>
      ) : firstUpcoming ? (
        <ContestCard contest={firstUpcoming} onIntentChanged={handleIntentChanged} isHero={true} />
      ) : (
        <div className="rounded-2xl border border-zinc-800 bg-[#0e0e11] p-8 text-center space-y-3">
          <p className="text-sm text-zinc-300 font-medium">No active contests found in local database cache.</p>
          <button
            onClick={handleManualSync}
            disabled={syncing}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs inline-flex items-center gap-2 font-mono uppercase transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
            <span>{syncing ? "Fetching API Data..." : "Run Global Contest Sync"}</span>
          </button>
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
          <div className="flex items-center gap-3">
            <button
              onClick={handleManualSync}
              disabled={syncing}
              title="Force sync from CF & LC APIs"
              className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-colors flex items-center gap-1 text-xs font-mono"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${syncing ? "animate-spin text-emerald-400" : ""}`} />
              <span className="hidden sm:inline">Sync Now</span>
            </button>
            <Link href="/contests" className="text-xs font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
              <span>View Explorer</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {!loading && contests.length > 0 && (
          <>
            {/* Group 1: Registered Contests */}
            {grouped.registered.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                  <span>1. Registered Contests ({grouped.registered.length})</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {grouped.registered.map((c) => (
                    <ContestCard key={c.id} contest={c} onIntentChanged={handleIntentChanged} />
                  ))}
                </div>
              </div>
            )}

            {/* Group 2: Interested Contests */}
            {grouped.interested.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span>2. Interested Contests ({grouped.interested.length})</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {grouped.interested.map((c) => (
                    <ContestCard key={c.id} contest={c} onIntentChanged={handleIntentChanged} />
                  ))}
                </div>
              </div>
            )}

            {/* Group 3: Not Registered (Upcoming) */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-zinc-500" />
                <span>3. Upcoming Public Contests ({grouped.upcoming.length})</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {grouped.upcoming.map((c) => (
                  <ContestCard key={c.id} contest={c} onIntentChanged={handleIntentChanged} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* 🚀 QUICK PRODUCTIVITY FOOTER (DYNAMIC USER TO-DOS & PROJECTS) */}
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
            {recentTodos.length > 0 ? (
              recentTodos.map((todo) => (
                <div key={todo.id} className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/80 border border-zinc-800/80">
                  <span className={`text-zinc-300 truncate max-w-[200px] sm:max-w-[260px] ${todo.completed ? "line-through text-zinc-500" : ""}`}>
                    {todo.title}
                  </span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                    todo.priority === "HIGH" ? "bg-red-500/20 text-red-300" :
                    todo.priority === "MEDIUM" ? "bg-amber-500/20 text-amber-300" :
                    "bg-emerald-500/20 text-emerald-300"
                  }`}>
                    {todo.priority}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-4 rounded-lg bg-zinc-900/40 border border-zinc-800/50 text-center text-zinc-500">
                No active sprint tasks. Add one in <Link href="/todo" className="text-emerald-400 underline">To-Do List</Link>.
              </div>
            )}
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
            {recentProjects.length > 0 ? (
              recentProjects.map((proj) => (
                <div key={proj.id} className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/80 border border-zinc-800/80 text-xs">
                  <div className="truncate max-w-[200px] sm:max-w-[250px]">
                    <p className="font-semibold text-white truncate">{proj.title}</p>
                    <p className="text-[10px] font-mono text-zinc-500 truncate">
                      {(proj.techStack || []).slice(0, 3).join(" • ")}
                    </p>
                  </div>
                  <span className="px-2 py-1 rounded bg-cyan-500/20 text-cyan-400 font-mono text-[10px] whitespace-nowrap">
                    {proj.status || "ACTIVE"}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-4 rounded-lg bg-zinc-900/40 border border-zinc-800/50 text-center text-zinc-500 text-xs font-mono">
                No active projects tracked. Showcase your work in <Link href="/projects" className="text-cyan-400 underline font-sans">Projects</Link>.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
