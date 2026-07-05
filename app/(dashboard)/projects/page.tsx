"use client"

import React from "react"
import { FolderGit2, ExternalLink, Github, Plus, Layers } from "lucide-react"

const mockProjects = [
  {
    id: "p1",
    title: "SnapScribe AI Image Caption",
    description: "Production web application generating AI image captions via Gradio and Hugging Face direct REST API.",
    status: "COMPLETED",
    techStack: ["React 19", "Vite", "Tailwind CSS", "Gradio API"],
    repoUrl: "https://github.com/Vardhan-Mittal/SnapScribe-AI-Image-Caption",
    liveUrl: "https://snapscribe-ai.vercel.app",
  },
  {
    id: "p2",
    title: "DevTrack — SDE Command Center",
    description: "Developer productivity platform auto-tracking coding contests, hackathons, and sprint todos.",
    status: "ONGOING",
    techStack: ["Next.js 16", "Prisma ORM", "Neon PostgreSQL", "NextAuth"],
    repoUrl: "https://github.com/Vardhan-Mittal/devtrack",
    liveUrl: "https://devtrack.vercel.app",
  },
]

export default function ProjectsPage() {
  return (
    <div className="space-y-6 pb-12 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FolderGit2 className="h-6 w-6 text-cyan-400" />
            <span>SDE Projects Tracker</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Track your repositories, tech stacks, and live deployments across Planned, Ongoing, and Shipped states.
          </p>
        </div>
        <button className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center gap-1.5 transition-colors font-mono">
          <Plus className="h-4 w-4" />
          <span>New Project</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockProjects.map((p) => (
          <div key={p.id} className="rounded-2xl border border-zinc-800 bg-[#0d0d10] p-6 flex flex-col justify-between space-y-5 hover:border-zinc-700 transition-colors">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider border ${
                  p.status === "COMPLETED" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" :
                  "bg-amber-500/10 text-amber-400 border-amber-500/30"
                }`}>
                  {p.status === "COMPLETED" ? "🚀 Shipped" : "⏳ Ongoing"}
                </span>
                <div className="flex items-center gap-2 text-zinc-400">
                  {p.repoUrl && (
                    <a href={p.repoUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                      <Github className="h-4 w-4" />
                    </a>
                  )}
                  {p.liveUrl && (
                    <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>

              <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                {p.title}
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {p.description}
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-zinc-800/80">
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-500 uppercase">
                <Layers className="h-3 w-3" />
                <span>Tech Stack</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {p.techStack.map((tech) => (
                  <span key={tech} className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono text-[11px]">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
