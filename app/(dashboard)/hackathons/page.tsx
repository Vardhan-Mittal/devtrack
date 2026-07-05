"use client"

import React from "react"
import { Flame, Calendar, ExternalLink, Award } from "lucide-react"

export default function HackathonsPage() {
  return (
    <div className="space-y-6 pb-12 font-sans">
      <div className="border-b border-zinc-800 pb-5">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Flame className="h-6 w-6 text-amber-400" />
          <span>Hackathon Calendar (Unstop Only)</span>
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Auto-fetched from Unstop. Never miss a major hackathon registration deadline again.
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-[#0d0d10] p-12 text-center space-y-4">
        <div className="inline-flex p-4 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <Award className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-bold text-white">Unstop Hackathon Tracker Ready for Phase 3</h3>
        <p className="text-sm text-zinc-400 max-w-md mx-auto">
          In Phase 3, we will hook up our automated Unstop scraper/fetcher to display live deadlines and prize pools!
        </p>
      </div>
    </div>
  )
}
