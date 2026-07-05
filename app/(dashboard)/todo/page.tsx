"use client"

import React, { useState, useEffect } from "react"
import { CheckSquare, Plus, Trash2, Loader2, AlertCircle } from "lucide-react"

interface TaskProps {
  id: string
  title: string
  priority: string
  completed: boolean
}

export default function TodoPage() {
  const [tasks, setTasks] = useState<TaskProps[]>([])
  const [newTask, setNewTask] = useState("")
  const [priority, setPriority] = useState("MEDIUM")
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/todos")
      if (res.ok) {
        const data = await res.json()
        if (data.success) {
          setTasks(data.tasks || [])
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

    // Optimistic add
    const tempId = `temp-${Date.now()}`
    const optimTask = { id: tempId, title: newTask, priority, completed: false }
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
          setTasks((prev) => prev.map((t) => (t.id === tempId ? data.task : t)))
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
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !currentStatus } : t)))
    try {
      if (!id.startsWith("temp-") && !id.startsWith("sample-")) {
        await fetch(`/api/todos/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ completed: !currentStatus }),
        })
      }
    } catch (err) {
      console.error("Failed to update task")
    }
  }

  const deleteTask = async (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id))
    try {
      if (!id.startsWith("temp-") && !id.startsWith("sample-")) {
        await fetch(`/api/todos/${id}`, { method: "DELETE" })
      }
    } catch (err) {
      console.error("Failed to delete task")
    }
  }

  return (
    <div className="space-y-6 pb-12 font-sans max-w-4xl">
      <div className="border-b border-zinc-800 pb-5">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <CheckSquare className="h-6 w-6 text-emerald-400" />
          <span>Engineering To-Do List</span>
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Private task management for your coding sprints, bug fixes, and contest preparation goals.
        </p>
      </div>

      {/* Add Task Form */}
      <form onSubmit={addTask} className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new engineering task or algorithm to study..."
          className="flex-1 bg-[#0e0e11] border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 font-mono"
        />
        <div className="flex items-center gap-2">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="bg-[#0e0e11] border border-zinc-800 rounded-xl px-3 py-3 text-xs text-zinc-300 font-mono focus:outline-none focus:border-emerald-500"
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
            <span>Add Task</span>
          </button>
        </div>
      </form>

      {/* Task List */}
      {loading ? (
        <div className="rounded-2xl border border-zinc-800 bg-[#0d0d10] p-12 text-center flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
          <p className="text-sm font-mono text-zinc-400">Loading your engineering todos...</p>
        </div>
      ) : tasks.length > 0 ? (
        <div className="space-y-2.5">
          {tasks.map((task) => (
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
        </div>
      ) : (
        <div className="rounded-2xl border border-zinc-800 bg-[#0d0d10] p-12 text-center space-y-2">
          <p className="text-sm text-zinc-400">No active todos in your sprint.</p>
          <p className="text-xs font-mono text-zinc-500">Type above and click Add Task to get started!</p>
        </div>
      )}
    </div>
  )
}
