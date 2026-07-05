"use client"

import React, { useState, useEffect } from "react"
import { CheckSquare, Plus, Trash2, Loader2, Columns, List, ArrowRight, CheckCircle2, Clock, Sparkles } from "lucide-react"

interface TaskProps {
  id: string
  title: string
  priority: string
  completed: boolean
  status?: string // "TODO", "IN_PROGRESS", "DONE"
}

export default function TodoPage() {
  const [tasks, setTasks] = useState<TaskProps[]>([])
  const [newTask, setNewTask] = useState("")
  const [priority, setPriority] = useState("MEDIUM")
  const [view, setView] = useState<"LIST" | "KANBAN">("KANBAN")
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [search, setSearch] = useState("")

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/todos")
      if (res.ok) {
        const data = await res.json()
        if (data.success) {
          const loaded = (data.tasks || []).map((t: any) => ({
            ...t,
            status: t.completed ? "DONE" : t.status || "TODO"
          }))
          setTasks(loaded)
        }
      }
    } catch (err) {
      console.error("Failed to fetch tasks")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTask.trim() || adding) return
    setAdding(true)

    const tempId = `temp-${Date.now()}`
    const optimTask: TaskProps = { id: tempId, title: newTask, priority, completed: false, status: "TODO" }
    setTasks([optimTask, ...tasks])
    setNewTask("")

    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: optimTask.title, priority: optimTask.priority }),
      })
      if (res.ok) {
        const data = await res.json()
        if (data.success && data.task) {
          setTasks((prev) => prev.map((t) => (t.id === tempId ? { ...data.task, status: "TODO" } : t)))
        }
      }
    } catch (err) {
      console.error("Failed to add task")
      setTasks((prev) => prev.filter((t) => t.id !== tempId))
    } finally {
      setAdding(false)
    }
  }

  const toggleTask = async (id: string, currentStatus: boolean) => {
    const nextCompleted = !currentStatus
    const nextState = nextCompleted ? "DONE" : "TODO"
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: nextCompleted, status: nextState } : t)))
    try {
      if (!id.startsWith("temp-")) {
        await fetch(`/api/todos/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ completed: nextCompleted }),
        })
      }
    } catch (err) {
      console.error("Failed to update task")
    }
  }

  const moveTaskStatus = async (id: string, newStatus: "TODO" | "IN_PROGRESS" | "DONE") => {
    const nextCompleted = newStatus === "DONE"
    setTasks(tasks.map((t) => (t.id === id ? { ...t, status: newStatus, completed: nextCompleted } : t)))
    try {
      if (!id.startsWith("temp-")) {
        await fetch(`/api/todos/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ completed: nextCompleted }),
        })
      }
    } catch (err) {
      console.error("Failed to move task status")
    }
  }

  const deleteTask = async (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id))
    try {
      if (!id.startsWith("temp-")) {
        await fetch(`/api/todos/${id}`, { method: "DELETE" })
      }
    } catch (err) {
      console.error("Failed to delete task")
    }
  }

  const filteredTasks = tasks.filter((t) => {
    if (!search.trim()) return true
    return t.title.toLowerCase().includes(search.toLowerCase())
  })

  const todoTasks = filteredTasks.filter((t) => t.status === "TODO" && !t.completed)
  const inProgressTasks = filteredTasks.filter((t) => t.status === "IN_PROGRESS" && !t.completed)
  const doneTasks = filteredTasks.filter((t) => t.completed || t.status === "DONE")

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Header & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[11px] font-mono text-emerald-400 font-bold">
              <Sparkles className="h-3 w-3" />
              <span>Kanban & List Mode</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 flex items-center gap-2">
            <CheckSquare className="h-7 w-7 text-emerald-400" />
            <span>SDE To-Do & Sprint Board</span>
          </h1>
          <p className="text-xs text-zinc-400 font-mono">
            Organize algorithms, project bugs, and contest prep goals across your sprint pipeline.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl p-1 font-mono text-xs">
          <button
            onClick={() => setView("KANBAN")}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
              view === "KANBAN" ? "bg-emerald-500 text-black font-bold shadow-md" : "text-zinc-400 hover:text-white"
            }`}
          >
            <Columns className="h-3.5 w-3.5" />
            <span>Kanban Board</span>
          </button>
          <button
            onClick={() => setView("LIST")}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
              view === "LIST" ? "bg-emerald-500 text-black font-bold shadow-md" : "text-zinc-400 hover:text-white"
            }`}
          >
            <List className="h-3.5 w-3.5" />
            <span>List View</span>
          </button>
        </div>
      </div>

      {/* Add Task Form & Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <form onSubmit={addTask} className="md:col-span-2 flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add new sprint task (e.g., 'Implement dynamic programming memoization')..."
            className="flex-1 bg-[#0e0e12] border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 font-mono transition-colors"
          />
          <div className="flex items-center gap-2">
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="bg-[#0e0e12] border border-zinc-800 rounded-xl px-3 py-3 text-xs text-zinc-300 font-mono focus:outline-none focus:border-emerald-500"
            >
              <option value="HIGH">🔥 HIGH</option>
              <option value="MEDIUM">⚡ MEDIUM</option>
              <option value="LOW">🌱 LOW</option>
            </select>
            <button
              type="submit"
              disabled={adding || !newTask.trim()}
              className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-bold text-xs flex items-center gap-1.5 transition-colors font-mono uppercase shrink-0"
            >
              {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              <span>Add</span>
            </button>
          </div>
        </form>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Filter tasks by title..."
          className="bg-[#0e0e12] border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 font-mono"
        />
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="rounded-3xl border border-zinc-800 bg-[#0e0e11] p-16 text-center flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
          <p className="text-sm font-mono text-zinc-400">Loading your developer sprint backlog...</p>
        </div>
      ) : view === "KANBAN" ? (
        /* 📋 1. KANBAN BOARD VIEW */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Column 1: TODO */}
          <div className="rounded-2xl border border-zinc-800/80 bg-[#0e0e12] p-4 space-y-3 shadow-lg">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-500"></span>
                <span>Backlog / To-Do</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 font-mono text-[11px] font-bold">
                {todoTasks.length}
              </span>
            </div>
            <div className="space-y-2.5 min-h-[250px]">
              {todoTasks.map((t) => (
                <div key={t.id} className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition-all space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm text-zinc-200 font-medium leading-snug">{t.title}</p>
                    <button onClick={() => deleteTask(t.id)} className="text-zinc-500 hover:text-rose-400 shrink-0">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      t.priority === "HIGH" ? "bg-rose-500/10 text-rose-400 border border-rose-500/30" :
                      t.priority === "MEDIUM" ? "bg-amber-500/10 text-amber-400 border border-amber-500/30" :
                      "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                    }`}>
                      {t.priority}
                    </span>
                    <button
                      onClick={() => moveTaskStatus(t.id, "IN_PROGRESS")}
                      className="px-2.5 py-1 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-[10px] font-mono font-bold flex items-center gap-1 border border-cyan-500/30 transition-colors"
                    >
                      <span>Start Sprint</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
              {todoTasks.length === 0 && (
                <div className="h-40 rounded-xl border border-dashed border-zinc-800/80 flex items-center justify-center text-xs font-mono text-zinc-600">
                  No backlog tasks.
                </div>
              )}
            </div>
          </div>

          {/* Column 2: IN PROGRESS */}
          <div className="rounded-2xl border border-cyan-500/30 bg-[#0e0e12] p-4 space-y-3 shadow-lg">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-500 animate-pulse"></span>
                <span>In Progress (Active)</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[11px] font-bold">
                {inProgressTasks.length}
              </span>
            </div>
            <div className="space-y-2.5 min-h-[250px]">
              {inProgressTasks.map((t) => (
                <div key={t.id} className="p-3.5 rounded-xl bg-gradient-to-br from-cyan-500/10 via-zinc-900/90 to-zinc-900 border border-cyan-500/40 hover:border-cyan-400 transition-all space-y-2.5 shadow-md">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm text-white font-semibold leading-snug">{t.title}</p>
                    <button onClick={() => deleteTask(t.id)} className="text-zinc-500 hover:text-rose-400 shrink-0">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      t.priority === "HIGH" ? "bg-rose-500/20 text-rose-300" :
                      t.priority === "MEDIUM" ? "bg-amber-500/20 text-amber-300" :
                      "bg-emerald-500/20 text-emerald-300"
                    }`}>
                      {t.priority}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => moveTaskStatus(t.id, "TODO")}
                        className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-[10px] font-mono font-bold"
                      >
                        ← Back
                      </button>
                      <button
                        onClick={() => moveTaskStatus(t.id, "DONE")}
                        className="px-2.5 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-black text-[10px] font-mono font-extrabold flex items-center gap-1 transition-colors"
                      >
                        <span>Complete</span>
                        <CheckCircle2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {inProgressTasks.length === 0 && (
                <div className="h-40 rounded-xl border border-dashed border-cyan-500/20 flex items-center justify-center text-xs font-mono text-zinc-600">
                  No active sprint tasks.
                </div>
              )}
            </div>
          </div>

          {/* Column 3: DONE */}
          <div className="rounded-2xl border border-emerald-500/30 bg-[#0e0e12] p-4 space-y-3 shadow-lg">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Completed / Shipped</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[11px] font-bold">
                {doneTasks.length}
              </span>
            </div>
            <div className="space-y-2.5 min-h-[250px]">
              {doneTasks.map((t) => (
                <div key={t.id} className="p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800/60 opacity-70 transition-all space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm text-zinc-400 line-through font-mono leading-snug">{t.title}</p>
                    <button onClick={() => deleteTask(t.id)} className="text-zinc-600 hover:text-rose-400 shrink-0">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-500 text-[10px] font-mono">
                      SHIPPED
                    </span>
                    <button
                      onClick={() => moveTaskStatus(t.id, "TODO")}
                      className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-[10px] font-mono"
                    >
                      Reopen
                    </button>
                  </div>
                </div>
              ))}
              {doneTasks.length === 0 && (
                <div className="h-40 rounded-xl border border-dashed border-emerald-500/20 flex items-center justify-center text-xs font-mono text-zinc-600">
                  No shipped tasks yet.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* 📄 2. LIST VIEW */
        <div className="space-y-2.5">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                task.completed ? "bg-zinc-900/40 border-zinc-800/50 opacity-60" : "bg-[#0d0d10] border-zinc-800 hover:border-zinc-700"
              }`}
            >
              <div className="flex items-center gap-3.5 flex-1 min-w-0">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id, task.completed)}
                  className="h-4 w-4 rounded border-zinc-700 bg-zinc-800 text-emerald-500 focus:ring-0 cursor-pointer shrink-0"
                />
                <span className={`text-sm font-mono truncate ${task.completed ? "line-through text-zinc-500" : "text-zinc-200 font-medium"}`}>
                  {task.title}
                </span>
              </div>

              <div className="flex items-center gap-3 shrink-0 ml-3">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                  task.priority === "HIGH" ? "bg-rose-500/10 text-rose-400 border border-rose-500/30" :
                  task.priority === "MEDIUM" ? "bg-amber-500/10 text-amber-400 border border-amber-500/30" :
                  "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                }`}>
                  {task.priority}
                </span>
                <button onClick={() => deleteTask(task.id)} className="text-zinc-500 hover:text-rose-400 p-1 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          {filteredTasks.length === 0 && (
            <div className="rounded-2xl border border-zinc-800 bg-[#0d0d10] p-12 text-center space-y-2">
              <p className="text-sm text-zinc-400">No matching tasks found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
