"use client"

import React, { useState, useEffect } from "react"
import { Flame, RefreshCw, Loader2, Award, Calendar, Star, Check } from "lucide-react"
import HackathonCard, { HackathonProps } from "@/components/HackathonCard"

export default function HackathonsPage() {
  const [hackathons, setHackathons] = useState<HackathonProps[]>([])
  const [grouped, setGrouped] = useState<{
    registered: HackathonProps[]
    interested: HackathonProps[]
    upcoming: HackathonProps[]
  }>({ registered: [], interested: [], upcoming: [] })
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)

  const fetchHackathons = async () => {
    try {
      const res = await fetch("/api/hackathons")
      if (res.ok) {
        const data = await res.json()
        if (data.success) {
          setHackathons(data.hackathons || [])
          setGrouped(data.grouped || { registered: [], interested: [], upcoming: [] })
        }
      }
    } catch (err) {
      console.error("Failed to load hackathons")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHackathons()
  }, [])

  const handleManualSync = async () => {
    setSyncing(true)
    try {
      await fetch("/api/hackathons", { method: "POST" })
      await fetchHackathons()
    } catch (err) {
      console.error("Sync failed")
    } finally {
      setSyncing(false)
    }
  }

  const handleIntentChanged = () => {
    setTimeout(() => fetchHackathons(), 500)
  }

  return (
    <div className="space-y-8 pb-12 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Flame className="h-6 w-6 text-amber-400" />
            <span>Hackathon Calendar (Unstop Exclusive)</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Auto-synced software engineering hackathons from Unstop. Never miss a major registration deadline or PPI opportunity.
          </p>
        </div>

        <button
          onClick={handleManualSync}
          disabled={syncing}
          className="flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-[#0e0e11] px-4 py-2.5 text-xs font-mono font-medium text-zinc-300 hover:border-zinc-700 hover:text-white transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin text-amber-400" : ""}`} />
          <span>{syncing ? "Syncing Unstop..." : "Sync Hackathons"}</span>
        </button>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-zinc-800 bg-[#0d0d10] p-16 text-center flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
          <p className="text-sm font-mono text-zinc-400">Loading live Unstop hackathon schedule from PostgreSQL...</p>
        </div>
      ) : hackathons.length > 0 ? (
        <div className="space-y-6">
          {/* Group 1: Registered Hackathons */}
          {grouped.registered.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>1. Registered Hackathons ({grouped.registered.length})</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {grouped.registered.map((h) => (
                  <HackathonCard key={h.id} hackathon={h} onIntentChanged={handleIntentChanged} />
                ))}
              </div>
            </div>
          )}

          {/* Group 2: Interested Hackathons */}
          {grouped.interested.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span>2. Interested Hackathons ({grouped.interested.length})</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {grouped.interested.map((h) => (
                  <HackathonCard key={h.id} hackathon={h} onIntentChanged={handleIntentChanged} />
                ))}
              </div>
            </div>
          )}

          {/* Group 3: Upcoming Hackathons */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-zinc-500" />
              <span>3. Upcoming Engineering Hackathons ({grouped.upcoming.length})</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {grouped.upcoming.map((h) => (
                <HackathonCard key={h.id} hackathon={h} onIntentChanged={handleIntentChanged} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-zinc-800 bg-[#0d0d10] p-12 text-center space-y-3">
          <p className="text-sm text-zinc-400">No hackathons found in database.</p>
          <button
            onClick={handleManualSync}
            className="px-5 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs font-mono uppercase"
          >
            Run Unstop Sync
          </button>
        </div>
      )}
    </div>
  )
}
