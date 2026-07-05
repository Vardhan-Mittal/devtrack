"use client"

import React, { useState, useEffect } from "react"
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, ExternalLink, CheckCircle2, FolderGit2, Trophy, Flame, Filter, Loader2, Sparkles } from "lucide-react"

export default function CalendarPage() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<"MONTH" | "AGENDA">("MONTH")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null)
  const [filterType, setFilterType] = useState<string>("ALL")

  const fetchCalendarEvents = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/calendar")
      if (res.ok) {
        const data = await res.json()
        if (data.success) setEvents(data.events || [])
      }
    } catch (err) {
      console.error("Failed to load calendar events")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCalendarEvents()
  }, [])

  // Month navigation
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  const currentMonthName = monthNames[currentDate.getMonth()]
  const currentYear = currentDate.getFullYear()

  // Generate calendar grid days for Month view
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()

  const calendarDays = []
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i))
  }

  const filteredEvents = events.filter((ev) => {
    if (filterType === "ALL") return true
    return ev.type === filterType
  })

  const getEventsForDate = (date: Date) => {
    return filteredEvents.filter((ev) => {
      const evDate = new Date(ev.date)
      return (
        evDate.getFullYear() === date.getFullYear() &&
        evDate.getMonth() === date.getMonth() &&
        evDate.getDate() === date.getDate()
      )
    })
  }

  const getBadgeColor = (color: string) => {
    switch (color) {
      case "green": return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30"
      case "blue": return "bg-cyan-500/20 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/30"
      case "orange": return "bg-amber-500/20 text-amber-300 border-amber-500/30 hover:bg-amber-500/30"
      case "purple": return "bg-purple-500/20 text-purple-300 border-purple-500/30 hover:bg-purple-500/30"
      default: return "bg-zinc-800 text-zinc-300 border-zinc-700"
    }
  }

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Top Header / Legend Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-zinc-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[11px] font-mono text-emerald-400">
              <Sparkles className="h-3 w-3" />
              <span>Google Calendar Style</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 flex items-center gap-2">
            <span>SDE Unified Calendar</span>
          </h1>
          <p className="text-xs text-zinc-400 font-mono">
            All your coding contests, sprint tasks, project milestones, and hackathon deadlines in one view.
          </p>
        </div>

        {/* View toggles & Filter bar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Color coding legend & filter */}
          <div className="flex items-center gap-1.5 bg-zinc-900/80 border border-zinc-800 rounded-xl p-1 text-xs font-mono">
            <button
              onClick={() => setFilterType("ALL")}
              className={`px-2.5 py-1 rounded-lg transition-colors ${filterType === "ALL" ? "bg-zinc-800 text-white font-bold" : "text-zinc-400 hover:text-white"}`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType("TASK")}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors ${filterType === "TASK" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold" : "text-zinc-400 hover:text-emerald-400"}`}
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              <span>Tasks</span>
            </button>
            <button
              onClick={() => setFilterType("PROJECT")}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors ${filterType === "PROJECT" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold" : "text-zinc-400 hover:text-cyan-400"}`}
            >
              <span className="h-2 w-2 rounded-full bg-cyan-500"></span>
              <span>Projects</span>
            </button>
            <button
              onClick={() => setFilterType("CONTEST")}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors ${filterType === "CONTEST" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold" : "text-zinc-400 hover:text-amber-400"}`}
            >
              <span className="h-2 w-2 rounded-full bg-amber-500"></span>
              <span>Contests</span>
            </button>
            <button
              onClick={() => setFilterType("HACKATHON")}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors ${filterType === "HACKATHON" ? "bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold" : "text-zinc-400 hover:text-purple-400"}`}
            >
              <span className="h-2 w-2 rounded-full bg-purple-500"></span>
              <span>Hackathons</span>
            </button>
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-xl p-1 text-xs font-mono">
            <button
              onClick={() => setView("MONTH")}
              className={`px-3 py-1 rounded-lg transition-colors ${view === "MONTH" ? "bg-emerald-500 text-black font-bold" : "text-zinc-400 hover:text-white"}`}
            >
              Month Grid
            </button>
            <button
              onClick={() => setView("AGENDA")}
              className={`px-3 py-1 rounded-lg transition-colors ${view === "AGENDA" ? "bg-emerald-500 text-black font-bold" : "text-zinc-400 hover:text-white"}`}
            >
              Agenda List
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-zinc-800 bg-[#0e0e11] p-16 text-center flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
          <p className="text-sm font-mono text-zinc-400">Loading your developer calendar events...</p>
        </div>
      ) : view === "MONTH" ? (
        /* 📅 MONTH GRID VIEW */
        <div className="rounded-3xl border border-zinc-800/80 bg-[#0e0e12] overflow-hidden shadow-2xl">
          {/* Calendar Month Navigation Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-zinc-800/80 bg-[#121216]">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-white font-mono">
                {currentMonthName} {currentYear}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-200 transition-colors"
              >
                Today
              </button>
              <button
                onClick={handlePrevMonth}
                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 border-b border-zinc-800/80 bg-zinc-900/60 text-center py-2 text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 auto-rows-[110px] sm:auto-rows-[130px] divide-x divide-y divide-zinc-800/80">
            {calendarDays.map((dateObj, idx) => {
              if (!dateObj) {
                return <div key={`empty-${idx}`} className="bg-zinc-900/20 p-2"></div>
              }
              const isToday =
                dateObj.getDate() === new Date().getDate() &&
                dateObj.getMonth() === new Date().getMonth() &&
                dateObj.getFullYear() === new Date().getFullYear()

              const dayEvents = getEventsForDate(dateObj)

              return (
                <div
                  key={dateObj.toISOString()}
                  className={`p-2 overflow-y-auto transition-colors hover:bg-zinc-900/40 ${isToday ? "bg-emerald-500/5 ring-1 ring-inset ring-emerald-500/40" : ""}`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-xs font-mono font-bold flex h-6 w-6 items-center justify-center rounded-full ${
                        isToday ? "bg-emerald-500 text-black font-extrabold shadow-md shadow-emerald-500/30" : "text-zinc-400"
                      }`}
                    >
                      {dateObj.getDate()}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="text-[10px] font-mono text-zinc-500">{dayEvents.length} ev</span>
                    )}
                  </div>

                  {/* Day Event Chips */}
                  <div className="space-y-1">
                    {dayEvents.map((ev) => (
                      <button
                        key={ev.id}
                        onClick={() => setSelectedEvent(ev)}
                        className={`w-full text-left truncate px-1.5 py-0.5 rounded text-[10px] font-mono border block transition-all ${getBadgeColor(
                          ev.color
                        )}`}
                      >
                        {ev.title}
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        /* 📋 AGENDA LIST VIEW */
        <div className="rounded-3xl border border-zinc-800 bg-[#0e0e12] p-6 space-y-4">
          <h3 className="text-sm font-mono uppercase tracking-wider text-zinc-400 font-bold border-b border-zinc-800 pb-3">
            Chronological Agenda ({filteredEvents.length} Events)
          </h3>
          <div className="space-y-2.5">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((ev) => (
                <div
                  key={ev.id}
                  onClick={() => setSelectedEvent(ev)}
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all hover:scale-[1.005] ${getBadgeColor(
                    ev.color
                  )}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="h-3 w-3 rounded-full shrink-0 bg-current"></span>
                    <div className="min-w-0">
                      <p className="text-sm font-bold truncate text-white">{ev.title}</p>
                      <p className="text-xs font-mono text-zinc-400">
                        {new Date(ev.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono uppercase tracking-wider px-2 py-1 rounded bg-black/40 border border-current/30 shrink-0">
                    {ev.type}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 text-center text-zinc-500 font-mono text-xs">
                No calendar events found matching the selected filter.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 🔮 EVENT DETAILS MODAL POPUP */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl border border-zinc-800 bg-[#0e0e12] p-6 shadow-2xl space-y-4 font-sans">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold uppercase border ${getBadgeColor(selectedEvent.color)}`}>
                {selectedEvent.type} EVENT
              </span>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-xs font-mono text-zinc-500 hover:text-white"
              >
                Close ✕
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white">{selectedEvent.title}</h3>
              <p className="text-xs font-mono text-zinc-400 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-emerald-400" />
                <span>{new Date(selectedEvent.date).toLocaleString()}</span>
              </p>
            </div>

            {selectedEvent.url && (
              <a
                href={selectedEvent.url}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg hover:from-emerald-400 hover:to-cyan-400 transition-colors"
              >
                <span>Open External Opportunity URL</span>
                <ExternalLink className="h-3.5 w-3.5 stroke-[2.5]" />
              </a>
            )}

            <button
              onClick={() => setSelectedEvent(null)}
              className="w-full py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-mono text-xs transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
