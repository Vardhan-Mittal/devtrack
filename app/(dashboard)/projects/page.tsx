"use client"

import React, { useState, useEffect } from "react"
import { FolderGit2, Plus, Github, ExternalLink, Loader2, Trash2, CheckCircle2, Clock, Sparkles, X, Code2, ListTree, ArrowRight, Layers } from "lucide-react"
import Link from "next/link"

interface ProjectProps {
  id: string
  title: string
  description?: string
  status: string // "PLANNED", "ONGOING", "COMPLETED"
  techStack: string[]
  repoUrl?: string
  liveUrl?: string
  notes?: string
  roadmap?: any
  progress?: number
  deadline?: string
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectProps[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<ProjectProps | null>(null)
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
        const data = await res.json()
        if (data.success) {
          setProjects([data.project, ...projects])
          setIsModalOpen(false)
          setTitle("")
          setDescription("")
          setRepoUrl("")
          setLiveUrl("")
        }
      }
    } catch (err) {
      console.error("Error creating project")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteProject = async (id: string) => {
    setProjects(projects.filter((p) => p.id !== id))
    try {
      await fetch(`/api/projects/${id}`, { method: "DELETE" })
    } catch (err) {
      console.error("Error deleting project")
    }
  }

  return (
    <div className="space-y-8 pb-16 font-sans max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-0.5 text-[11px] font-mono text-cyan-400 font-bold">
              <Layers className="h-3 w-3" />
              <span>Engineering Portfolio & Roadmaps</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 flex items-center gap-2.5">
            <FolderGit2 className="h-7 w-7 text-cyan-400" />
            <span>SDE Projects Tracker</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-mono mt-1">
            Track your full-stack apps, AI systems, and competitive coding portfolios. Click any card to inspect AI roadmaps & milestones.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs flex items-center gap-2 transition-all font-mono uppercase shadow-lg shadow-cyan-500/20 shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Add Project</span>
        </button>
      </div>

      {/* Grid of Projects */}
      {loading ? (
        <div className="rounded-3xl border border-zinc-800 bg-[#0e0e11] p-16 text-center flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
          <p className="text-sm font-mono text-zinc-400">Loading your engineering portfolio...</p>
        </div>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="group relative rounded-2xl border border-zinc-800 bg-[#0e0e12] p-5 hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between shadow-lg"
            >
              <div>
                {/* Status Badge & Delete */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold uppercase tracking-wider flex items-center gap-1.5 ${
                      proj.status === "COMPLETED"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                        : proj.status === "ONGOING"
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                        : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                    }`}
                  >
                    {proj.status === "COMPLETED" && <CheckCircle2 className="h-3 w-3 text-emerald-400" />}
                    {proj.status === "ONGOING" && <Clock className="h-3 w-3 text-amber-400 animate-pulse" />}
                    <span>{proj.status}</span>
                  </span>

                  <button
                    onClick={() => handleDeleteProject(proj.id)}
                    className="text-zinc-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-zinc-800/80 transition-colors"
                    title="Delete Project"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Title & Description */}
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors leading-snug">
                  {proj.title}
                </h3>
                <p className="text-xs text-zinc-400 mt-2 line-clamp-3 leading-relaxed font-sans">
                  {proj.description || "No description provided."}
                </p>

                {/* Tech Stack Badges */}
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {(proj.techStack || []).map((tech, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-300 font-medium">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons & Links Footer */}
              <div className="mt-6 pt-4 border-t border-zinc-800/80 space-y-3">
                {/* View AI Roadmap Button */}
                <button
                  onClick={() => setSelectedProject(proj)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 hover:from-cyan-500/20 hover:to-emerald-500/20 border border-cyan-500/30 text-cyan-300 hover:text-white text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <Sparkles className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
                  <span>View AI Roadmap & Milestones</span>
                </button>

                <div className="flex items-center justify-between gap-3 text-xs font-mono pt-1">
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
                    <span className="text-zinc-500 text-[11px] flex items-center gap-1">
                      <FolderGit2 className="h-3.5 w-3.5 text-zinc-600" />
                      <span>Private / Local Repo</span>
                    </span>
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
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-zinc-800 bg-[#0e0e12] p-16 text-center space-y-4">
          <FolderGit2 className="h-12 w-12 text-zinc-600 mx-auto" />
          <div className="space-y-1">
            <p className="text-base font-bold text-white">No projects added to your portfolio yet.</p>
            <p className="text-xs font-mono text-zinc-500 max-w-md mx-auto">
              Use the AI Project Planner on your dashboard or click Add Project above to start organizing your software architecture!
            </p>
          </div>
        </div>
      )}

      {/* 🔮 AI ROADMAP & MILESTONES MODAL */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0e0e12] border border-cyan-500/40 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto space-y-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-start justify-between gap-4 border-b border-zinc-800 pb-4">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-mono font-bold text-emerald-400 mb-2">
                  <Sparkles className="h-3 w-3" />
                  <span>AI Architectural Blueprint</span>
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
                  <span>{selectedProject.title}</span>
                </h2>
                <p className="text-xs text-zinc-400 font-mono mt-1">
                  {selectedProject.description || "Custom engineering project specification"}
                </p>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors shrink-0"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Tech Stack */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Code2 className="h-4 w-4" />
                <span>Selected Tech Stack</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {(selectedProject.techStack || []).map((tech, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-700 font-mono text-xs text-cyan-300 font-semibold">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Folder Structure */}
            {selectedProject.roadmap?.folderStructure && (
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <ListTree className="h-4 w-4" />
                  <span>Recommended Folder Structure</span>
                </h4>
                <div className="bg-[#09090c] border border-zinc-800 rounded-2xl p-4 font-mono text-xs text-zinc-300 space-y-1.5">
                  {selectedProject.roadmap.folderStructure.map((folder: string, i: number) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-emerald-500 font-bold">├──</span>
                      <code className="text-zinc-200 bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-800">{folder}</code>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Milestones / Roadmap */}
            {selectedProject.roadmap?.milestones ? (
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span>Implementation Milestones & Phases</span>
                </h4>
                <div className="space-y-2.5">
                  {selectedProject.roadmap.milestones.map((ms: string, i: number) => (
                    <div key={i} className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-start gap-3 text-xs">
                      <span className="h-5 w-5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-mono font-bold shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <p className="text-zinc-200 font-sans font-medium leading-relaxed">{ms}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : selectedProject.notes ? (
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span>Architectural Notes</span>
                </h4>
                <div className="bg-[#09090c] border border-zinc-800 rounded-2xl p-4 text-xs font-mono text-zinc-300 whitespace-pre-wrap leading-relaxed">
                  {selectedProject.notes}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl border border-dashed border-zinc-800 text-center text-xs font-mono text-zinc-500">
                No automated AI roadmap generated for this custom project.
              </div>
            )}

            {/* Link to To-Do Board */}
            <div className="pt-4 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs font-mono text-zinc-400">
                💡 All sprint tasks for this project are queued in your Kanban Board.
              </span>
              <Link
                href="/todo"
                onClick={() => setSelectedProject(null)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-extrabold text-xs uppercase flex items-center justify-center gap-1.5 transition-colors shrink-0"
              >
                <span>Open Sprint Kanban</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* CREATE PROJECT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e0e12] border border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                <FolderGit2 className="h-5 w-5 text-cyan-400" />
                <span>Add SDE Project</span>
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-500 hover:text-white transition-colors text-sm font-mono"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-zinc-400 mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. WanderWise AI Travel Planner"
                  className="w-full bg-[#09090c] border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="High-level engineering overview, algorithms used, architecture..."
                  className="w-full bg-[#09090c] border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-[#09090c] border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
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
                    className="w-full bg-[#09090c] border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
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
                    className="w-full bg-[#09090c] border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Live Demo URL</label>
                  <input
                    type="url"
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    placeholder="https://...vercel.app"
                    className="w-full bg-[#09090c] border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
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
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold uppercase flex items-center gap-1.5"
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
