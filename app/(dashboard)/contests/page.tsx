"use client"

import React, { useState, useEffect } from "react"
import { Trophy, Calendar, RefreshCw, Loader2, Search } from "lucide-react"
import ContestCard, { ContestProps } from "@/components/ContestCard"

export default function ContestsPage() {
  const [contests, setContests] = useState<ContestProps[]>([])
  const [filter, setFilter] = useState("ALL") // "ALL", "CODEFORCES", "LEETCODE"
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)

  const fetchContests = async () => {
    try {
      const res = await fetch("/api/contests")
      if (res.ok) {
        const data = await res.json()
        if (data.success) {
          setContests(data.contests || [])
        }
      }
    } catch (err) {
      console.error("Failed to fetch contests explorer data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContests()
  }, [])

  const handleManualSync = async () => {
    setSyncing(true)
    try {
      await fetch("/api/contests", { method: "POST" })
      await fetchContests()
    } catch (err) {
      console.error("Sync failed")
    } finally {
      setSyncing(false)
    }
  }

  const handleIntentChanged = (id: string, newIntent: string) => {
    setContests((prev) =>
      prev.map((c) => (c.id === id ? { ...c, intent: newIntent } : c))
    )
  }

  const filteredContests = contests.filter((c) => {
    const matchesPlatform = filter === "ALL" || c.platform === filter
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase())
    return matchesPlatform && matchesSearch
  })

  return (
    <div className="space-y-6 pb-12 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Trophy className="h-6 w-6 text-emerald-400" />
            <span>Contests Explorer</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Auto-synced from Codeforces & LeetCode APIs. Toggle your registration status to prioritize on your home dashboard.
          </p>
        </div>

        {/* Sync Button & Platform Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleManualSync}
            disabled={syncing}
            className="flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-[#0e0e11] px-3.5 py-2 text-xs font-mono font-medium text-zinc-300 hover:border-zinc-700 hover:text-white transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${syncing ? "animate-spin text-emerald-400" : ""}`} />
            <span>{syncing ? "Syncing..." : "Sync APIs"}</span>
          </button>

          <div className="flex items-center gap-1 bg-[#0e0e11] p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => setFilter("ALL")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
                filter === "ALL" ? "bg-emerald-500 text-black font-bold" : "text-zinc-400 hover:text-white"
              }`}
            >
              All
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
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-zinc-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by contest round or name..."
          className="w-full bg-[#0e0e11] border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 font-mono"
        />
      </div>

      {/* Contests Grid */}
      {loading ? (
        <div className="rounded-2xl border border-zinc-800 bg-[#0d0d10] p-16 text-center flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
          <p className="text-sm font-mono text-zinc-400">Loading contests from Neon PostgreSQL...</p>
        </div>
      ) : filteredContests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredContests.map((c) => (
            <ContestCard key={c.id} contest={c} onIntentChanged={handleIntentChanged} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-zinc-800 bg-[#0d0d10] p-12 text-center space-y-3">
          <p className="text-sm text-zinc-400">No contests found matching your search or filter.</p>
          <button
            onClick={handleManualSync}
            className="px-5 py-2 rounded-xl bg-emerald-500 text-black font-bold text-xs font-mono uppercase"
          >
            Force API Sync
          </button>
        </div>
      )}
    </div>
  )
}
