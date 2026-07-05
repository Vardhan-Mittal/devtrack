"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Terminal, Bell, Sparkles, RefreshCw } from "lucide-react"
import { useSession } from "next-auth/react"

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { data: session } = useSession()
  const pathname = usePathname()

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

        {/* Notifications */}
        <button className="relative p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800/50 transition-colors">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-cyan-400"></span>
        </button>

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
