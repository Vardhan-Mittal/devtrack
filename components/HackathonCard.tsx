"use client"

import React, { useState, useEffect } from "react"
import { 
  Flame, 
  Calendar, 
  Clock, 
  ExternalLink, 
  Star, 
  Check, 
  Award, 
  Users, 
  Globe, 
  Loader2 
} from "lucide-react"

export interface HackathonProps {
  id: string
  externalId: string
  title: string
  organizer?: string
  deadline: string
  startDate: string
  endDate: string
  url: string
  prizePool?: string
  teamSize?: string
  isOnline: boolean
  intent: string
}

export default function HackathonCard({
  hackathon,
  onIntentChanged,
}: {
  hackathon: HackathonProps
  onIntentChanged?: (id: string, newIntent: string) => void
}) {
  const [intent, setIntent] = useState(hackathon.intent || "NOT_REGISTERED")
  const [loading, setLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState("")

  const isRegistered = intent === "REGISTERED"
  const isInterested = intent === "INTERESTED"

  useEffect(() => {
    const updateCountdown = () => {
      const now = Date.now()
      const target = new Date(hackathon.deadline).getTime()
      const diff = target - now

      if (diff <= 0) {
        setTimeLeft("Registration Closed")
      } else {
        const d = Math.floor(diff / 86400000)
        const h = Math.floor((diff % 86400000) / 3600000)
        const m = Math.floor((diff % 3600000) / 60000)
        const s = Math.floor((diff % 60000) / 1000)
        if (d > 0) {
          setTimeLeft(`${d}d ${h}h left to apply`)
        } else {
          setTimeLeft(`${h < 10 ? "0" + h : h}h ${m < 10 ? "0" + m : m}m ${s < 10 ? "0" + s : s}s left!`)
        }
      }
    }

    updateCountdown()
    const timer = setInterval(updateCountdown, 1000)
    return () => clearInterval(timer)
  }, [hackathon.deadline])

  const handleToggleIntent = async (newIntent: string) => {
    const targetIntent = intent === newIntent ? "NOT_REGISTERED" : newIntent
    setIntent(targetIntent)
    if (onIntentChanged) onIntentChanged(hackathon.id, targetIntent)

    setLoading(true)
    try {
      await fetch(`/api/hackathons/${hackathon.id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intent: targetIntent }),
      })
    } catch (err) {
      console.error("Failed to update hackathon intent")
      setIntent(hackathon.intent)
    } finally {
      setLoading(false)
    }
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
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30">
            Unstop Exclusive
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

        {/* Title & Organizer */}
        <h4 className="text-sm font-bold text-zinc-100 group-hover:text-amber-400 transition-colors line-clamp-2">
          <a href={hackathon.url} target="_blank" rel="noopener noreferrer">
            {hackathon.title}
          </a>
        </h4>
        {hackathon.organizer && (
          <p className="text-xs font-mono text-zinc-500 mt-0.5">by {hackathon.organizer}</p>
        )}

        {/* Prize Pool & Team Info */}
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-mono">
          {hackathon.prizePool && (
            <div className="flex items-center gap-1.5 p-2 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 font-bold">
              <Award className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{hackathon.prizePool}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
            <Users className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
            <span className="truncate">{hackathon.teamSize || "Team/Individual"}</span>
          </div>
        </div>

        {/* Deadline & Dates */}
        <div className="mt-3 space-y-1.5 text-xs font-mono text-zinc-400">
          <div className="flex items-center justify-between p-2 rounded bg-zinc-900/80 border border-zinc-800">
            <span className="text-[11px] text-zinc-500">Deadline:</span>
            <span className="font-bold text-amber-400">{timeLeft || "Calculating..."}</span>
          </div>
          <p className="flex items-center gap-1.5 pt-1 text-zinc-500 text-[11px]">
            <Calendar className="h-3.5 w-3.5" />
            <span>Hackathon: {new Date(hackathon.startDate).toLocaleDateString([], { month: "short", day: "numeric" })} - {new Date(hackathon.endDate).toLocaleDateString([], { month: "short", day: "numeric" })}</span>
          </p>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-5 pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2">
        <a
          href={hackathon.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
        >
          <span>Apply on Unstop</span>
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
