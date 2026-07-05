"use client"

import React, { useState } from "react"
import { CheckSquare, Plus, Trash2, Calendar, Flag } from "lucide-react"

export default function TodoPage() {
  const [tasks, setTasks] = useState([
    { id: "1", title: "Refactor NextAuth callback to use JWT strategy", priority: "HIGH", completed: true },
    { id: "2", title: "Build Codeforces contest auto-fetcher worker", priority: "HIGH", completed: false },
    { id: "3", title: "Set up Resend API key for automated contest reminders", priority: "MEDIUM", completed: false },
  ])
  const [newTask, setNewTask] = useState("")

  const addTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTask.trim()) return
    setTasks([...tasks, { id: Date.now().toString(), title: newTask, priority: "MEDIUM", completed: false }])
    setNewTask("")
  }

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id))
  }

  return (
    <div className="space-y-6 pb-12 font-sans max-w-4xl">
      <div className="border-b border-zinc-800 pb-5">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <CheckSquare className="h-6 w-6 text-emerald-400" />
          <span>Engineering To-Do List</span>
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Private task management for your coding sprints and debugging goals.
        </p>
      </div>

      {/* Add Task Form */}
      <form onSubmit={addTask} className="flex gap-3">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new engineering task or bug to fix..."
          className="flex-1 bg-[#0e0e11] border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 font-mono"
        />
        <button
          type="submit"
          className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center gap-1.5 transition-colors font-mono uppercase"
        >
          <Plus className="h-4 w-4" />
          <span>Add Task</span>
        </button>
      </form>

      {/* Task List */}
      <div className="space-y-2.5">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
              task.completed ? "bg-zinc-900/40 border-zinc-800/50 opacity-60" : "bg-[#0d0d10] border-zinc-800 hover:border-zinc-700"
            }`}
          >
            <div className="flex items-center gap-3.5 flex-1">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                className="h-4 w-4 rounded border-zinc-700 bg-zinc-800 text-emerald-500 focus:ring-0 cursor-pointer"
              />
              <span className={`text-sm font-mono ${task.completed ? "line-through text-zinc-500" : "text-zinc-200 font-medium"}`}>
                {task.title}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                task.priority === "HIGH" ? "bg-rose-500/10 text-rose-400 border border-rose-500/30" :
                task.priority === "MEDIUM" ? "bg-amber-500/10 text-amber-400 border border-amber-500/30" :
                "bg-zinc-800 text-zinc-400"
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
    </div>
  )
}
