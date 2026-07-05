"use client"

import React, { useState, useEffect } from "react"
import { 
  Calendar, 
  Clock, 
  ExternalLink, 
  Star, 
  Check, 
  ArrowUpRight,
  Flame,
  PlusCircle,
  Loader2
} from "lucide-react"

export interface ContestProps {
  id: string
  externalId: string
  platform: string
  title: string
  startTime: string
  durationSec: number
  url: string
  intent: string
}

export default function ContestCard({
  contest,
  onIntentChanged,
  isHero = false,
}: {
  contest: ContestProps
  onIntentChanged?: (id: string, newIntent: string) => void
  isHero?: boolean
}) {
  const [intent, setIntent] = useState(contest.intent || "NOT_REGISTERED")
  const [loading, setLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState("")
  const [isLive, setIsLive] = useState(false)

  const isCF = contest.platform === "CODEFORCES"
  const isRegistered = intent === "REGISTERED"
  const isInterested = intent === "INTERESTED"

  // Live countdown calculation
  useEffect(() => {
    const updateCountdown = () => {
      const now = Date.now()
      const start = new Date(contest.startTime).getTime()
      const end = start + contest.durationSec * 1000

      if (now >= start && now <= end) {
        setIsLive(true)
        const diff = end - now
        const h = Math.floor(diff / 3600000)
        const m = Math.floor((diff % 3600000) / 60000)
        const s = Math.floor((diff % 60000) / 1000)
        setTimeLeft(`LIVE! Ends in ${h}h ${m}m ${s}s`)
      } else if (now < start) {
        setIsLive(false)
        const diff = start - now
        const d = Math.floor(diff / 86400000)
        const h = Math.floor((diff % 86400000) / 3600000)
        const m = Math.floor((diff % 3600000) / 60000)
        const s = Math.floor((diff % 60000) / 1000)
        if (d > 0) {
          setTimeLeft(`${d}d ${h}h ${m}m`)
        } else {
          setTimeLeft(`${h < 10 ? "0" + h : h}h ${m < 10 ? "0" + m : m}m ${s < 10 ? "0" + s : s}s`)
        }
      } else {
        setIsLive(false)
        setTimeLeft("Finished")
      }
    }

    updateCountdown()
    const timer = setInterval(updateCountdown, 1000)
    return () => clearInterval(timer)
  }, [contest.startTime, contest.durationSec])

  const handleToggleIntent = async (newIntent: string) => {
    const targetIntent = intent === newIntent ? "NOT_REGISTERED" : newIntent
    setIntent(targetIntent) // Optimistic UI update
    if (onIntentChanged) onIntentChanged(contest.id, targetIntent)

    setLoading(true)
    try {
      await fetch(`/api/contests/${contest.id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intent: targetIntent }),
      })
    } catch (err) {
      console.error("Failed to update status on server")
      setIntent(contest.intent) // Revert on failure
    } finally {
      setLoading(false)
    }
  }

  // Google Calendar URL generator
  const getGoogleCalendarUrl = () => {
    const start = new Date(contest.startTime)
    const end = new Date(start.getTime() + contest.durationSec * 1000)
    const formatTime = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, "")
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(contest.title)}&dates=${formatTime(start)}/${formatTime(end)}&details=${encodeURIComponent(`Contest URL: ${contest.url}`)}&location=${encodeURIComponent(contest.platform)}`
  }

  if (isHero) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/30 via-zinc-900/90 to-zinc-950 p-6 sm:p-7 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex h-6 items-center gap-1.5 rounded-md bg-emerald-500 px-2 text-[11px] font-bold uppercase text-black font-mono">
                <Flame className="h-3.5 w-3.5 fill-black" />
                Next Up
              </span>
              <span className={`text-xs font-mono px-2 py-0.5 rounded font-bold uppercase border ${
                isCF ? "bg-red-500/10 text-red-400 border-red-500/30" : "bg-amber-500/10 text-amber-400 border-amber-500/30"
              }`}>
                {contest.platform}
              </span>
              {isLive && (
                <span className="animate-pulse px-2 py-0.5 rounded bg-rose-500 text-white text-[10px] font-bold uppercase font-mono">
                  LIVE NOW
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white hover:text-emerald-300 transition-colors">
              <a href={contest.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <span>{contest.title}</span>
                <ExternalLink className="h-4 w-4 text-zinc-500" />
              </a>
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-zinc-500" />
                {new Date(contest.startTime).toLocaleDateString([], { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-zinc-500" />
                Duration: {contest.durationSec / 3600}h
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 border border-zinc-800 bg-[#0e0e11] p-4 rounded-xl">
            <div className="text-center sm:text-left">
              <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                {isLive ? "Status" : "Starts in"}
              </p>
              <p className={`text-2xl sm:text-3xl font-black font-mono tracking-tight ${
                isLive ? "text-rose-400 animate-bounce" : "text-emerald-400 animate-pulse"
              }`}>
                {timeLeft || "Calculating..."}
              </p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-zinc-800 pt-3 sm:pt-0 sm:pl-4">
              <a
                href={contest.url}
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
    )
  }

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

        {/* Timing Details & Countdown */}
        <div className="mt-3 space-y-1.5 text-xs font-mono text-zinc-400">
          <div className="flex items-center justify-between p-2 rounded bg-zinc-900/80 border border-zinc-800">
            <span className="text-[11px] text-zinc-500">{isLive ? "Status:" : "Countdown:"}</span>
            <span className={`font-bold ${isLive ? "text-rose-400 animate-pulse" : "text-emerald-400"}`}>
              {timeLeft || "Calculating..."}
            </span>
          </div>
          <p className="flex items-center gap-1.5 pt-1">
            <Calendar className="h-3.5 w-3.5 text-zinc-500" />
            <span>{new Date(contest.startTime).toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
          </p>
          <p className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-zinc-500">
              <Clock className="h-3.5 w-3.5" />
              <span>Duration: {contest.durationSec / 3600}h</span>
            </span>
            <a
              href={getGoogleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              title="Add to Google Calendar"
              className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1"
            >
              <PlusCircle className="h-3 w-3" />
              <span>Cal</span>
            </a>
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
          {loading && <Loader2 className="h-3.5 w-3.5 animate-spin text-zinc-500 mr-1" />}
          <button
            onClick={() => handleToggleIntent("REGISTERED")}
            title={isRegistered ? "Remove Registration" : "Mark as Registered"}
            className={`p-1.5 rounded-md transition-colors ${
              isRegistered ? "bg-emerald-500 text-black font-bold shadow-lg shadow-emerald-500/20" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
            }`}
          >
            <Check className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => handleToggleIntent("INTERESTED")}
            title={isInterested ? "Remove Interest" : "Mark as Interested"}
            className={`p-1.5 rounded-md transition-colors ${
              isInterested ? "bg-amber-500 text-black font-bold shadow-lg shadow-amber-500/20" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
            }`}
          >
            <Star className={`h-3.5 w-3.5 ${isInterested ? "fill-black" : ""}`} />
          </button>
        </div>
      </div>
    </div>
  )
}
