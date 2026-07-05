"use client"

import React, { useState, useEffect } from "react"
import { FolderGit2, Plus, Github, ExternalLink, Loader2, Trash2, CheckCircle2, Clock, Sparkles } from "lucide-react"

interface ProjectProps {
  id: string
  title: string
  description?: string
  status: string // "PLANNED", "ONGOING", "COMPLETED"
  techStack: string[]
  repoUrl?: string
  liveUrl?: string
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectProps[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Form State
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState("ONGOING")
  const [techStack, setTechStack] = useState("Next.js, TypeScript, Tailwind CSS")
  const [repoUrl, setRepoUrl] = useState("")
  const [liveUrl, setLiveUrl] = useState("")

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects")
      if (res.ok) {
        const data = await res.json()
        if (data.success) {
          setProjects(data.projects || [])
        }
      }
    } catch (err) {
      console.error("Failed to load projects")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || submitting) return
    setSubmitting(true)

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          status,
          techStack: techStack.split(",").map((t) => t.trim()).filter(Boolean),
          repoUrl,
          liveUrl,
        }),
      })

      if (res.ok) {
        await fetchProjects()
        setIsModalOpen(false)
        setTitle("")
        setDescription("")
        setRepoUrl("")
        setLiveUrl("")
      }
    } catch (err) {
      console.error("Failed to save project")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteProject = async (id: string) => {
    setProjects(projects.filter((p) => p.id !== id))
    try {
      if (!id.startsWith("proj-")) {
        await fetch(`/api/projects/${id}`, { method: "DELETE" })
      }
    } catch (err) {
      console.error("Failed to delete project")
    }
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    setProjects(projects.map((p) => (p.id === id ? { ...p, status: newStatus } : p)))
    try {
      if (!id.startsWith("proj-")) {
        await fetch(`/api/projects/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        })
      }
    } catch (err) {
      console.error("Failed to update status")
    }
  }

  return (
    <div className="space-y-8 pb-16 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FolderGit2 className="h-6 w-6 text-emerald-400" />
            <span>SDE Portfolio & Project Tracker</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Showcase your high-impact engineering repositories, track deployment progress, and organize tech stacks.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-4 py-2.5 text-xs font-mono font-bold text-black uppercase tracking-wider transition-colors self-start sm:self-auto shadow-lg shadow-emerald-500/10"
        >
          <Plus className="h-4 w-4" />
          <span>New Project</span>
        </button>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-zinc-800 bg-[#0d0d10] p-16 text-center flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
          <p className="text-sm font-mono text-zinc-400">Loading your engineering portfolio...</p>
        </div>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="group relative flex flex-col justify-between rounded-2xl border border-zinc-800 bg-[#0e0e11] p-6 hover:border-zinc-700 transition-all duration-200"
            >
              <div>
                {/* Status Badge & Actions */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <select
                    value={proj.status}
                    onChange={(e) => handleStatusChange(proj.id, e.target.value)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider bg-zinc-900 border cursor-pointer focus:outline-none ${
                      proj.status === "COMPLETED" ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" :
                      proj.status === "ONGOING" ? "text-amber-400 border-amber-500/30 bg-amber-500/10" :
                      "text-zinc-400 border-zinc-800"
                    }`}
                  >
                    <option value="ONGOING">🔥 Ongoing</option>
                    <option value="COMPLETED">✅ Completed</option>
                    <option value="PLANNED">📌 Planned</option>
                  </select>

                  <button
                    onClick={() => handleDeleteProject(proj.id)}
                    className="text-zinc-500 hover:text-rose-400 p-1 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Title & Description */}
                <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                  {proj.title}
                </h3>
                <p className="text-xs text-zinc-400 mt-2 line-clamp-3 leading-relaxed">
                  {proj.description || "No description provided."}
                </p>

                {/* Tech Stack Badges */}
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {proj.techStack.map((tech, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-zinc-900/90 border border-zinc-800 text-[10px] font-mono text-zinc-300">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Links Footer */}
              <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between gap-3 text-xs font-mono">
                {proj.repoUrl ? (
                  <a
                    href={proj.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-zinc-300 hover:text-white transition-colors"
                  >
                    <Github className="h-4 w-4 text-zinc-400" />
                    <span>Repository</span>
                  </a>
                ) : (
                  <span className="text-zinc-600">No Repo Link</span>
                )}

                {proj.liveUrl && (
                  <a
                    href={proj.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-bold"
                  >
                    <span>Live Demo</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-zinc-800 bg-[#0d0d10] p-16 text-center space-y-3">
          <p className="text-sm text-zinc-400">No projects added to your portfolio yet.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 text-black font-bold text-xs font-mono uppercase"
          >
            Add Your First Project
          </button>
        </div>
      )}

      {/* Modal for New Project */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0e0e11] border border-zinc-800 rounded-2xl w-full max-w-lg p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-400" />
                <span>Add SDE Project</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white text-sm font-mono">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-zinc-400 mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. WanderWise AI Travel Planner"
                  className="w-full bg-[#09090b] border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="High-level engineering overview, algorithms used, architecture..."
                  className="w-full bg-[#09090b] border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-[#09090b] border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="ONGOING">🔥 Ongoing</option>
                    <option value="COMPLETED">✅ Completed</option>
                    <option value="PLANNED">📌 Planned</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Tech Stack (comma separated)</label>
                  <input
                    type="text"
                    value={techStack}
                    onChange={(e) => setTechStack(e.target.value)}
                    placeholder="Next.js, TypeScript, PostgreSQL"
                    className="w-full bg-[#09090b] border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">GitHub Repo URL</label>
                  <input
                    type="url"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full bg-[#09090b] border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Live Demo URL</label>
                  <input
                    type="url"
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    placeholder="https://...vercel.app"
                    className="w-full bg-[#09090b] border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !title.trim()}
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase flex items-center gap-1.5"
                >
                  {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                  <span>Save Project</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
