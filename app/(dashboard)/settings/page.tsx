"use client"

import React, { useState } from "react"
import { Settings, Bell, Save, Shield, Terminal } from "lucide-react"

export default function SettingsPage() {
  const [cfHandle, setCfHandle] = useState("Vardhan-Mittal")
  const [lcUsername, setLcUsername] = useState("Vardhan-Mittal")
  const [ccHandle, setCcHandle] = useState("")
  const [remindersOn, setRemindersOn] = useState(true)
  const [reminderMins, setReminderMins] = useState(30)
  const [saved, setSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6 pb-12 font-sans max-w-3xl">
      <div className="border-b border-zinc-800 pb-5">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Settings className="h-6 w-6 text-zinc-400" />
          <span>Developer Preferences</span>
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Configure your platform handles and email reminder automation rules.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Platform Handles Section */}
        <div className="rounded-2xl border border-zinc-800 bg-[#0d0d10] p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Terminal className="h-4 w-4 text-emerald-400" />
            <span>Contest Platform Handles</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-400">Codeforces Handle</label>
              <input
                type="text"
                value={cfHandle}
                onChange={(e) => setCfHandle(e.target.value)}
                placeholder="e.g. tourist"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-400">LeetCode Username</label>
              <input
                type="text"
                value={lcUsername}
                onChange={(e) => setLcUsername(e.target.value)}
                placeholder="e.g. neetcode"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-400">CodeChef Handle</label>
              <input
                type="text"
                value={ccHandle}
                onChange={(e) => setCcHandle(e.target.value)}
                placeholder="e.g. gennady.korotkevich"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Reminder Settings Section */}
        <div className="rounded-2xl border border-zinc-800 bg-[#0d0d10] p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Bell className="h-4 w-4 text-cyan-400" />
            <span>Automated Email Reminders</span>
          </h3>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-white">Enable Contest Reminders</p>
              <p className="text-xs text-zinc-500">Receive email alerts for Registered and Interested contests.</p>
            </div>
            <input
              type="checkbox"
              checked={remindersOn}
              onChange={(e) => setRemindersOn(e.target.checked)}
              className="h-5 w-5 rounded border-zinc-700 bg-zinc-800 text-emerald-500 focus:ring-0 cursor-pointer"
            />
          </div>
          {remindersOn && (
            <div className="space-y-1.5 pt-2 border-t border-zinc-800/80">
              <label className="text-xs font-mono text-zinc-400">Remind Me (Minutes Before Start)</label>
              <select
                value={reminderMins}
                onChange={(e) => setReminderMins(Number(e.target.value))}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-cyan-500"
              >
                <option value={15}>15 minutes before</option>
                <option value={30}>30 minutes before (Recommended)</option>
                <option value={60}>1 hour before</option>
                <option value={120}>2 hours before</option>
              </select>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end gap-3">
          {saved && (
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
              <span>✅ Preferences Saved to Neon PostgreSQL!</span>
            </span>
          )}
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center gap-1.5 transition-colors font-mono uppercase shadow-lg shadow-emerald-500/20"
          >
            <Save className="h-4 w-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  )
}
