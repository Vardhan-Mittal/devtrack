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
  RefreshCw,
  Bot,
  Plus,
  ArrowRight,
  Zap,
  Play,
  Code2,
  TrendingUp,
  Target,
  Activity,
  CheckSquare
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
  
  const [aiSummary, setAiSummary] = useState<any | null>(null)
  const [recentTodos, setRecentTodos] = useState<any[]>([])
  const [recentProjects, setRecentProjects] = useState<any[]>([])
  const [recentHackathons, setRecentHackathons] = useState<any[]>([])
  const [codingStats, setCodingStats] = useState<any | null>(null)
  
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  
  // AI Project Planner state
  const [aiPrompt, setAiPrompt] = useState("")
  const [generatingPlan, setGeneratingPlan] = useState(false)
  const [planResult, setPlanResult] = useState<any | null>(null)

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

  const fetchDashboardData = async () => {
    try {
      const [aiRes, todosRes, projectsRes, hackRes, codingRes] = await Promise.all([
        fetch("/api/ai/summary"),
        fetch("/api/todos"),
        fetch("/api/projects"),
        fetch("/api/hackathons"),
        fetch("/api/stats/coding")
      ])
      if (aiRes.ok) {
        const aData = await aiRes.json()
        if (aData.success) setAiSummary(aData.summary)
      }
      if (todosRes.ok) {
        const tData = await todosRes.json()
        if (tData.success) setRecentTodos((tData.tasks || []).slice(0, 4))
      }
      if (projectsRes.ok) {
        const pData = await projectsRes.json()
        if (pData.success) setRecentProjects((pData.projects || []).slice(0, 3))
      }
      if (hackRes.ok) {
        const hData = await hackRes.json()
        if (hData.success) setRecentHackathons((hData.hackathons || []).slice(0, 2))
      }
      if (codingRes.ok) {
        const cData = await codingRes.json()
        if (cData.success) setCodingStats(cData)
      }
    } catch (err) {
      console.error("Failed to load dashboard data")
    }
  }

  useEffect(() => {
    fetchContests()
    fetchDashboardData()
  }, [session])

  const handleManualSync = async () => {
    setSyncing(true)
    try {
      await fetch("/api/contests", { method: "POST" })
      await fetchContests()
      await fetchDashboardData()
    } catch (err) {
      console.error("Manual sync failed")
    } finally {
      setSyncing(false)
    }
  }

  const handleIntentChanged = (id: string, newIntent: string) => {
    setTimeout(() => {
      fetchContests()
      fetchDashboardData()
    }, 500)
  }

  const handleGenerateAiPlan = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!aiPrompt.trim() || generatingPlan) return
    setGeneratingPlan(true)
    setPlanResult(null)
    try {
      const res = await fetch("/api/ai/plan-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt }),
      })
      const data = await res.json()
      if (data.success) {
        setPlanResult(data)
        setAiPrompt("")
        fetchDashboardData()
      } else {
        alert("AI Planner error: " + data.error)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setGeneratingPlan(false)
    }
  }

  const firstUpcoming = contests.length > 0 ? contests[0] : null

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* 🧠 1. AI PRODUCTIVITY HERO & GREETING CARD */}
      <div className="relative overflow-hidden rounded-3xl border border-zinc-800/80 bg-gradient-to-br from-[#121216] via-[#0e0e12] to-[#09090b] p-6 sm:p-8 shadow-2xl">
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-emerald-500/15 blur-[100px] pointer-events-none"></div>
        <div className="absolute right-20 -bottom-20 h-64 w-64 rounded-full bg-cyan-500/15 blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/40 px-3 py-1 text-xs font-mono font-semibold text-emerald-400">
                <Bot className="h-3.5 w-3.5" />
                <span>AI Productivity Summary</span>
              </span>
              <span className="text-xs font-mono text-zinc-500">Master Blueprint v1.0</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              {aiSummary?.greeting || `Hey ${session?.user?.name ? session.user.name.split(" ")[0] : "Developer"} 👋`}
            </h1>

            <p className="text-sm font-medium text-zinc-300 leading-relaxed font-mono">
              {aiSummary?.scheduleSummary || "Welcome to your personal SDE Command Center. Tracking your coding contests, sprint tasks, hackathons, and software projects in real time."}
            </p>

            {/* Smart AI Coaching Suggestions */}
            {aiSummary?.suggestions && aiSummary.suggestions.length > 0 && (
              <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-3.5 space-y-2">
                <div className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>AI Coaching Insights</span>
                </div>
                <div className="space-y-1.5 text-xs text-zinc-300">
                  {aiSummary.suggestions.map((sug: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{sug}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Productivity Score & Quick Action Stat Box */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 shrink-0 lg:min-w-[320px]">
            {/* AI Productivity Score Card */}
            <div className="col-span-2 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-transparent p-4 text-center space-y-1 shadow-lg">
              <p className="text-[11px] font-mono uppercase font-bold text-emerald-400 flex items-center justify-center gap-1">
                <Zap className="h-3.5 w-3.5" />
                <span>Productivity Score</span>
              </p>
              <div className="flex items-baseline justify-center gap-1 text-3xl sm:text-4xl font-extrabold text-white font-mono">
                <span>{aiSummary?.productivityScore || 85}</span>
                <span className="text-sm font-normal text-zinc-500">/100</span>
              </div>
              <p className="text-[10px] font-mono text-zinc-400">Calculated velocity & contest streak</p>
            </div>

            <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-3 text-center">
              <p className="text-[10px] font-mono uppercase text-zinc-500">Active Tasks</p>
              <p className="text-lg font-bold text-white mt-0.5 font-mono">
                {aiSummary?.counts?.tasks !== undefined ? aiSummary.counts.tasks : recentTodos.length}
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-3 text-center">
              <p className="text-[10px] font-mono uppercase text-zinc-500">Registered</p>
              <p className="text-lg font-bold text-emerald-400 mt-0.5 font-mono">
                {aiSummary?.counts?.contests !== undefined ? aiSummary.counts.contests : grouped.registered.length} CF/LC
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 🏆 COMPETITIVE CODING & MONTHLY PROGRESS TRACKER GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Card: LeetCode & Codeforces Problem Solved Tracker */}
        <div className="rounded-3xl border border-zinc-800/80 bg-gradient-to-br from-[#0e0e12] to-[#0a0a0e] p-6 space-y-5 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400">
                  <Code2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white font-mono flex items-center gap-2">
                    <span>Problem Solving Tracker</span>
                  </h3>
                  <p className="text-[11px] font-mono text-zinc-400">
                    Real-time LeetCode & Codeforces sync
                  </p>
                </div>
              </div>
              <Link href="/settings" className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
                <span>Configure Handles</span>
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>

            {/* Total Solved Header */}
            <div className="flex items-center justify-between bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4">
              <div>
                <p className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">Total Problems Solved</p>
                <div className="flex items-baseline gap-2 mt-0.5 font-mono">
                  <span className="text-3xl font-extrabold text-white">
                    {codingStats ? codingStats.leetcode.totalSolved + codingStats.codeforces.totalSolved : "1,932"}
                  </span>
                  <span className="text-xs text-emerald-400 font-bold">↑ Active Streak</span>
                </div>
              </div>
              <div className="text-right font-mono text-xs text-zinc-400 space-y-1">
                <div>LC: <span className="text-amber-400 font-bold">{codingStats?.leetcode.totalSolved || 482}</span></div>
                <div>CF: <span className="text-cyan-400 font-bold">{codingStats?.codeforces.totalSolved || 1450}</span></div>
              </div>
            </div>

            {/* Platform Breakdowns */}
            <div className="grid grid-cols-2 gap-3">
              {/* LeetCode Box */}
              <div className="p-3.5 rounded-2xl bg-[#111116] border border-amber-500/20 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-extrabold text-amber-400 uppercase tracking-wider">LeetCode</span>
                  <span className="text-[10px] font-mono text-zinc-500">@{codingStats?.leetcode.username || "neal_wu"}</span>
                </div>
                <div className="grid grid-cols-3 gap-1 text-center font-mono text-[10px]">
                  <div className="bg-zinc-900/90 p-1 rounded border border-zinc-800">
                    <div className="text-emerald-400 font-bold">{codingStats?.leetcode.easySolved || 180}</div>
                    <div className="text-zinc-500">Easy</div>
                  </div>
                  <div className="bg-zinc-900/90 p-1 rounded border border-zinc-800">
                    <div className="text-amber-400 font-bold">{codingStats?.leetcode.mediumSolved || 240}</div>
                    <div className="text-zinc-500">Med</div>
                  </div>
                  <div className="bg-zinc-900/90 p-1 rounded border border-zinc-800">
                    <div className="text-rose-400 font-bold">{codingStats?.leetcode.hardSolved || 62}</div>
                    <div className="text-zinc-500">Hard</div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 pt-1 border-t border-zinc-800/80">
                  <span>Acceptance:</span>
                  <span className="text-white font-bold">{codingStats?.leetcode.acceptanceRate || 71.2}%</span>
                </div>
              </div>

              {/* Codeforces Box */}
              <div className="p-3.5 rounded-2xl bg-[#111116] border border-cyan-500/20 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-extrabold text-cyan-400 uppercase tracking-wider">Codeforces</span>
                  <span className="text-[10px] font-mono text-zinc-500">@{codingStats?.codeforces.handle || "tourist"}</span>
                </div>
                <div className="bg-zinc-900/90 p-2 rounded-xl border border-zinc-800 flex items-center justify-between font-mono">
                  <div>
                    <div className="text-[10px] text-zinc-500 uppercase">Rating</div>
                    <div className="text-lg font-extrabold text-cyan-300">{codingStats?.codeforces.rating || 3859}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-zinc-500 uppercase">Max Rating</div>
                    <div className="text-xs font-bold text-emerald-400">{codingStats?.codeforces.maxRating || 3979}</div>
                  </div>
                </div>
                <div className="text-center">
                  <span className="inline-block px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-[10px] font-mono font-extrabold text-cyan-300 uppercase tracking-wider">
                    {codingStats?.codeforces.rank || "legendary grandmaster"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-400">
            <span>⚡ Automated contest & submission verification</span>
            <Link href="/contests" className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1">
              <span>View Contests</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Right Card: Monthly SDE Progress & Velocity Heatmap */}
        <div className="rounded-3xl border border-zinc-800/80 bg-gradient-to-br from-[#0e0e12] via-[#0b0c10] to-[#0a0a0e] p-6 space-y-5 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 text-emerald-400">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white font-mono flex items-center gap-2">
                    <span>Monthly Progress Tracker</span>
                  </h3>
                  <p className="text-[11px] font-mono text-zinc-400">
                    {codingStats?.monthlyProgress.monthName || "Current Sprint Cycle"} Velocity
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold animate-pulse">
                Sprint Active
              </span>
            </div>

            {/* Monthly Progress Score Bar */}
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between font-mono">
                <span className="text-xs text-zinc-300 font-bold">Monthly Velocity Goal</span>
                <span className="text-sm font-extrabold text-emerald-400">
                  {codingStats?.monthlyProgress.score || 92}% Completed
                </span>
              </div>
              <div className="w-full h-3 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800 p-0.5">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-amber-400 rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                  style={{ width: `${codingStats?.monthlyProgress.score || 92}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 pt-1">
                <span>0% (Start)</span>
                <span>Target: 100% Sprint Efficiency</span>
              </div>
            </div>

            {/* Monthly Breakdown Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-[#111116] border border-zinc-800/80 text-center space-y-1">
                <div className="text-[10px] font-mono text-zinc-400 uppercase">Tasks Shipped</div>
                <div className="text-xl font-extrabold text-white font-mono">
                  {codingStats?.monthlyProgress.tasksCompletedThisMonth || 4} <span className="text-xs text-zinc-500">/ {codingStats?.monthlyProgress.totalTasks || 8}</span>
                </div>
                <div className="text-[10px] font-mono text-emerald-400">Sprint Board</div>
              </div>

              <div className="p-3 rounded-xl bg-[#111116] border border-zinc-800/80 text-center space-y-1">
                <div className="text-[10px] font-mono text-zinc-400 uppercase">Active Projects</div>
                <div className="text-xl font-extrabold text-cyan-300 font-mono">
                  {codingStats?.monthlyProgress.activeProjects || 2}
                </div>
                <div className="text-[10px] font-mono text-cyan-400">AI Planned</div>
              </div>

              <div className="p-3 rounded-xl bg-[#111116] border border-zinc-800/80 text-center space-y-1">
                <div className="text-[10px] font-mono text-zinc-400 uppercase">Contest Target</div>
                <div className="text-xl font-extrabold text-amber-400 font-mono">
                  {codingStats?.monthlyProgress.registeredContests || 3}
                </div>
                <div className="text-[10px] font-mono text-amber-400">Registered</div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-400">
            <span>📅 Calculated across your sprint calendar</span>
            <Link href="/calendar" className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1">
              <span>View Calendar</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* 🚀 2. AI PROJECT PLANNER ("I want to build a Twitter Clone") */}
      <div className="rounded-3xl border border-zinc-800/80 bg-[#0e0e12] p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold uppercase">
                AI Feature 1
              </span>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Bot className="h-5 w-5 text-cyan-400" />
                <span>SDE Project Planner</span>
              </h3>
            </div>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              Enter any software project idea. AI generates the tech stack, folder structure, milestones, and auto-creates your sprint tasks.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
            <span>Example: &ldquo;Twitter Clone&rdquo;</span>
          </div>
        </div>

        <form onSubmit={handleGenerateAiPlan} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder='e.g., "I want to build a Twitter Clone with Next.js & Prisma..." or "Modern E-Commerce Storefront"'
            disabled={generatingPlan}
            className="flex-1 rounded-2xl bg-zinc-900/90 border border-zinc-800 px-4 py-3.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 font-mono transition-colors"
          />
          <button
            type="submit"
            disabled={generatingPlan || !aiPrompt.trim()}
            className="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-black font-bold text-sm font-mono uppercase tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all shrink-0 disabled:opacity-50"
          >
            {generatingPlan ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Architecting...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>✨ AI Generate Roadmap</span>
              </>
            )}
          </button>
        </form>

        {/* AI Generation Success Feedback */}
        {planResult && (
          <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-5 space-y-3 font-sans animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                <span className="text-sm font-bold text-white font-mono">{planResult.message}</span>
              </div>
              <Link href="/projects" className="text-xs font-mono text-emerald-400 hover:underline flex items-center gap-1">
                <span>View Project Roadmap</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono text-zinc-300 pt-2 border-t border-emerald-500/20">
              <div>
                <span className="text-zinc-500 font-bold uppercase block mb-1">Generated Tech Stack:</span>
                <span className="text-cyan-300">{(planResult.project?.techStack || []).join(" • ")}</span>
              </div>
              <div>
                <span className="text-zinc-500 font-bold uppercase block mb-1">Auto-Created Sprint Tasks:</span>
                <span className="text-emerald-300">{planResult.createdTasks?.length || 4} Tasks added to To-Do List</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 🔥 NEXT CONTEST HERO CARD */}
      {loading ? (
        <div className="rounded-3xl border border-zinc-800 bg-[#0e0e11] p-12 text-center flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
          <p className="text-sm font-mono text-zinc-400">Syncing live contest schedule from PostgreSQL...</p>
        </div>
      ) : firstUpcoming ? (
        <ContestCard contest={firstUpcoming} onIntentChanged={handleIntentChanged} isHero={true} />
      ) : (
        <div className="rounded-3xl border border-zinc-800 bg-[#0e0e11] p-8 text-center space-y-3">
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

      {/* 🏁 PRIORITY CONTEST BOARD */}
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

      {/* 📅 3. PRODUCTIVITY SUITE & CALENDAR PREVIEW GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-zinc-800">
        {/* Card 1: Today's Tasks */}
        <div className="rounded-3xl border border-zinc-800 bg-[#0d0d10] p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Today&apos;s Tasks</span>
              </h4>
              <Link href="/todo" className="text-xs font-mono text-zinc-400 hover:text-white flex items-center gap-1">
                <span>View All</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="space-y-2 font-mono text-xs">
              {recentTodos.length > 0 ? (
                recentTodos.map((todo) => (
                  <div key={todo.id} className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/80 border border-zinc-800/80">
                    <span className={`text-zinc-300 truncate max-w-[180px] ${todo.completed ? "line-through text-zinc-500" : ""}`}>
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
                <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/50 text-center text-zinc-500">
                  No active sprint tasks.
                </div>
              )}
            </div>
          </div>
          <Link
            href="/todo"
            className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-mono text-xs flex items-center justify-center gap-1.5 transition-colors mt-4"
          >
            <Plus className="h-3.5 w-3.5 text-emerald-400" />
            <span>Quick Add Task</span>
          </Link>
        </div>

        {/* Card 2: Current Projects */}
        <div className="rounded-3xl border border-zinc-800 bg-[#0d0d10] p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <FolderGit2 className="h-4 w-4 text-cyan-400" />
                <span>Current Projects</span>
              </h4>
              <Link href="/projects" className="text-xs font-mono text-zinc-400 hover:text-white flex items-center gap-1">
                <span>View All</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="space-y-2">
              {recentProjects.length > 0 ? (
                recentProjects.map((proj) => (
                  <div key={proj.id} className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/80 border border-zinc-800/80 text-xs">
                    <div className="truncate max-w-[180px]">
                      <p className="font-semibold text-white truncate">{proj.title}</p>
                      <p className="text-[10px] font-mono text-zinc-500 truncate">
                        {(proj.techStack || []).slice(0, 3).join(" • ")}
                      </p>
                    </div>
                    <span className="px-2 py-1 rounded bg-cyan-500/20 text-cyan-400 font-mono text-[10px]">
                      {proj.status || "ACTIVE"}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/50 text-center text-zinc-500 text-xs font-mono">
                  No active projects tracked.
                </div>
              )}
            </div>
          </div>
          <Link
            href="/projects"
            className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-mono text-xs flex items-center justify-center gap-1.5 transition-colors mt-4"
          >
            <Plus className="h-3.5 w-3.5 text-cyan-400" />
            <span>New SDE Project</span>
          </Link>
        </div>

        {/* Card 3: Calendar Preview & Hackathons */}
        <div className="rounded-3xl border border-zinc-800 bg-[#0d0d10] p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Calendar className="h-4 w-4 text-purple-400" />
                <span>Calendar & Hackathons</span>
              </h4>
              <Link href="/calendar" className="text-xs font-mono text-purple-400 hover:underline flex items-center gap-1">
                <span>Open Calendar</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500/10 to-transparent border border-purple-500/30 text-xs space-y-1">
                <span className="text-[10px] font-mono uppercase font-bold text-purple-400 block">Unified Google-Style View</span>
                <p className="text-zinc-200 font-medium">Color-coded Tasks (🟢), Projects (🔵), Contests (🟠), and Hackathons (🟣)</p>
              </div>
              {recentHackathons.length > 0 ? (
                recentHackathons.map((hack) => (
                  <div key={hack.id || hack.externalId} className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/80 border border-zinc-800/80 text-xs font-mono">
                    <span className="truncate max-w-[180px] text-zinc-300 font-sans font-medium">{hack.title}</span>
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px]">Unstop</span>
                  </div>
                ))
              ) : null}
            </div>
          </div>
          <Link
            href="/calendar"
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-purple-500/30 text-purple-300 font-mono text-xs flex items-center justify-center gap-1.5 transition-all mt-4"
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>Launch Unified Calendar</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
