"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Terminal, Bell, Sparkles, RefreshCw, CheckCircle2, AlertCircle, Clock, ExternalLink, Settings } from "lucide-react"
import { useSession } from "next-auth/react"

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [checkingReminders, setCheckingReminders] = useState(false)
  const { data: session } = useSession()
  const pathname = usePathname()

  const handleRunReminders = async () => {
    setCheckingReminders(true)
    try {
      await fetch("/api/reminders", { method: "POST" })
    } catch (e) {
      console.error(e)
    } finally {
      setTimeout(() => setCheckingReminders(false), 1000)
    }
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-zinc-800/80 bg-[#0c0c0e]/80 px-6 backdrop-blur-md md:pl-72">
      {/* Left: Page Title / Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-zinc-400 hover:text-white md:hidden"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider hidden sm:inline">Workspace /</span>
          <h1 className="text-sm font-semibold text-zinc-200 capitalize">
            {pathname === "/" ? "Dashboard" : pathname.replace("/", "").replace("-", " ")}
          </h1>
        </div>
      </div>

      {/* Right: Quick Action & Status Badges */}
      <div className="flex items-center gap-4">
        {/* Live System Status Badge */}
        <div className="hidden sm:flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-mono text-emerald-400">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>CF & LC Auto-Sync: Active</span>
        </div>

        {/* Quick Refresh Contests Button */}
        <button
          onClick={() => window.location.reload()}
          title="Refresh Data"
          className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 px-2.5 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
        >
          <RefreshCw className="h-3.5 w-3.5 text-zinc-400" />
          <span className="hidden md:inline font-mono">Sync Now</span>
        </button>

        {/* Notifications Bell & Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className={`relative p-2 rounded-lg transition-colors ${
              notificationsOpen ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
            }`}
            title="SDE Alert Center"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
          </button>

          {/* Notifications Dropdown Modal */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl border border-zinc-800 bg-[#0e0e12]/95 shadow-2xl backdrop-blur-xl p-4 z-50 text-left font-sans space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm font-bold text-white">SDE Alert Center</span>
                  <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono">3 Live</span>
                </div>
                <button 
                  onClick={() => setNotificationsOpen(false)}
                  className="text-xs font-mono text-zinc-500 hover:text-zinc-300"
                >
                  Close
                </button>
              </div>

              {/* Alert List */}
              <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                {/* Alert 1: CF Contest */}
                <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800/80 hover:border-zinc-700/80 transition-colors space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-emerald-400 flex items-center gap-1.5 font-mono">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                      REGISTERED PRIORITY
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">Codeforces</span>
                  </div>
                  <p className="text-xs font-medium text-zinc-200">Educational Codeforces Round Schedule</p>
                  <p className="text-[11px] text-zinc-400 font-mono">Registration window active. Automated reminder armed.</p>
                </div>

                {/* Alert 2: Unstop Hackathon */}
                <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800/80 hover:border-zinc-700/80 transition-colors space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-amber-400 flex items-center gap-1.5 font-mono">
                      🔥 HIRING CHALLENGE
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">Unstop</span>
                  </div>
                  <p className="text-xs font-medium text-zinc-200">Smart India Hackathon (SIH) 2026</p>
                  <p className="text-[11px] text-zinc-400 font-mono">Software edition statements live. Team size: 6 Members.</p>
                </div>

                {/* Alert 3: System Cron */}
                <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800/80 hover:border-zinc-700/80 transition-colors space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-cyan-400 flex items-center gap-1.5 font-mono">
                      ⚡ CRON ENGINE
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">System</span>
                  </div>
                  <p className="text-xs font-medium text-zinc-200">Automated Reminder Worker</p>
                  <p className="text-[11px] text-zinc-400 font-mono">Evaluating countdown timers against user email preferences.</p>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={handleRunReminders}
                  disabled={checkingReminders}
                  className="flex-1 py-2 px-3 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${checkingReminders ? "animate-spin" : ""}`} />
                  <span>{checkingReminders ? "Checking..." : "Run Alert Check"}</span>
                </button>
                <Link
                  href="/settings"
                  onClick={() => setNotificationsOpen(false)}
                  className="py-2 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-mono text-xs transition-colors flex items-center gap-1"
                >
                  <span>Settings</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Avatar */}
        <div className="md:hidden">
          {session?.user?.image ? (
            <img src={session.user.image} alt="Avatar" className="h-8 w-8 rounded-full" />
          ) : (
            <div className="h-8 w-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs">
              {session?.user?.name?.[0] || "U"}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-50 bg-[#0c0c0e] p-6 md:hidden border-t border-zinc-800">
          <nav className="flex flex-col gap-3 font-sans">
            <Link onClick={() => setMobileMenuOpen(false)} href="/" className="px-4 py-3 rounded-lg bg-zinc-900 text-white font-medium">Dashboard</Link>
            <Link onClick={() => setMobileMenuOpen(false)} href="/contests" className="px-4 py-3 rounded-lg hover:bg-zinc-900 text-zinc-300">Contests (CF/LC)</Link>
            <Link onClick={() => setMobileMenuOpen(false)} href="/hackathons" className="px-4 py-3 rounded-lg hover:bg-zinc-900 text-zinc-300">Hackathons (Unstop)</Link>
            <Link onClick={() => setMobileMenuOpen(false)} href="/todo" className="px-4 py-3 rounded-lg hover:bg-zinc-900 text-zinc-300">To-Do List</Link>
            <Link onClick={() => setMobileMenuOpen(false)} href="/projects" className="px-4 py-3 rounded-lg hover:bg-zinc-900 text-zinc-300">Projects Tracker</Link>
            <Link onClick={() => setMobileMenuOpen(false)} href="/settings" className="px-4 py-3 rounded-lg hover:bg-zinc-900 text-zinc-300">Settings</Link>
          </nav>
        </div>
      )}
    </header>
  )
}
