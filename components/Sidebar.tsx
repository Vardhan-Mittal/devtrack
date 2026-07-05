"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Trophy, 
  Flame, 
  CheckSquare, 
  FolderGit2, 
  Settings, 
  LogOut, 
  Terminal,
  Code2,
  Calendar
} from "lucide-react"
import { signOut, useSession } from "next-auth/react"

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Calendar", href: "/calendar", icon: Calendar, badge: "NEW" },
  { name: "Contests", href: "/contests", icon: Trophy, badge: "CF/LC" },
  { name: "Hackathons", href: "/hackathons", icon: Flame, badge: "Unstop" },
  { name: "To-Do List", href: "/todo", icon: CheckSquare },
  { name: "Projects", href: "/projects", icon: FolderGit2 },
  { name: "Settings", href: "/settings", icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-[#0c0c0e] border-r border-zinc-800/80 z-30">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-6 h-16 border-b border-zinc-800/80">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 text-black font-bold shadow-lg shadow-emerald-500/20">
          <Terminal className="h-5 w-5" />
        </div>
        <div>
          <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
            DevTrack
            <span className="text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded">PRO</span>
          </span>
          <p className="text-[11px] font-mono text-zinc-400">Coding Life Organized</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto font-sans">
        <div className="px-3 mb-2">
          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-400">Main Menu</span>
        </div>
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href))
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-gradient-to-r from-emerald-500/15 to-transparent text-emerald-400 border-l-2 border-emerald-500 font-semibold"
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`h-4 w-4 transition-colors ${isActive ? "text-emerald-400" : "text-zinc-500 group-hover:text-zinc-300"}`} />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                  isActive ? "bg-emerald-500/20 text-emerald-300" : "bg-zinc-800 text-zinc-400 group-hover:bg-zinc-700"
                }`}>
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-zinc-800/80 bg-[#09090b]">
        {session?.user ? (
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {session.user.image ? (
                <img src={session.user.image} alt="User avatar" className="h-9 w-9 rounded-full ring-2 ring-emerald-500/30" />
              ) : (
                <div className="h-9 w-9 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-sm">
                  {session.user.name?.[0] || "U"}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-xs font-semibold text-zinc-200 truncate">{session.user.name || "Developer"}</p>
                <p className="text-[10px] font-mono text-zinc-500 truncate">{session.user.email}</p>
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              title="Sign Out"
              className="p-2 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-lg text-xs transition-colors"
          >
            <Code2 className="h-4 w-4" />
            <span>Developer Login</span>
          </Link>
        )}
      </div>
    </aside>
  )
}
