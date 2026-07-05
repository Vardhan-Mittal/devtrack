"use client"

import React, { useState } from "react"
import { Trophy, Filter, Calendar, ExternalLink, Star, Check, RefreshCw } from "lucide-react"

export default function ContestsPage() {
  const [filter, setFilter] = useState("ALL") // "ALL", "CODEFORCES", "LEETCODE"

  return (
    <div className="space-y-6 pb-12 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Trophy className="h-6 w-6 text-emerald-400" />
            <span>Contests Explorer</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Auto-synced from Codeforces & LeetCode API. Mark your status to prioritize on your dashboard.
          </p>
        </div>

        {/* Platform Filters */}
        <div className="flex items-center gap-1.5 bg-[#0e0e11] p-1 rounded-xl border border-zinc-800">
          <button
            onClick={() => setFilter("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
              filter === "ALL" ? "bg-emerald-500 text-black font-bold" : "text-zinc-400 hover:text-white"
            }`}
          >
            All Platforms
          </button>
          <button
            onClick={() => setFilter("CODEFORCES")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
              filter === "CODEFORCES" ? "bg-red-500 text-white font-bold" : "text-zinc-400 hover:text-white"
            }`}
          >
            Codeforces
          </button>
          <button
            onClick={() => setFilter("LEETCODE")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
              filter === "LEETCODE" ? "bg-amber-500 text-black font-bold" : "text-zinc-400 hover:text-white"
            }`}
          >
            LeetCode
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-[#0d0d10] p-12 text-center space-y-4">
        <div className="inline-flex p-4 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <RefreshCw className="h-8 w-8 animate-spin" />
        </div>
        <h3 className="text-lg font-bold text-white">Phase 2 Auto-Fetch Engine Ready</h3>
        <p className="text-sm text-zinc-400 max-w-md mx-auto">
          We are ready to connect our live Codeforces and LeetCode API cron fetchers in Phase 2!
        </p>
      </div>
    </div>
  )
}
