import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      // Sample portfolio projects when unauthenticated
      return NextResponse.json({
        success: true,
        projects: [
          {
            id: "proj-1",
            title: "WanderWise AI Travel Planner",
            description: "Full-stack intelligent itinerary generation engine built with Next.js App Router, Gemini AI, and Neon PostgreSQL.",
            status: "COMPLETED",
            techStack: ["Next.js 16", "TypeScript", "Tailwind CSS", "Neon DB", "Gemini API"],
            repoUrl: "https://github.com/Vardhan-Mittal/WanderWise-Travel-Planner",
            liveUrl: "https://wanderwise-ai.vercel.app",
          },
          {
            id: "proj-2",
            title: "DevTrack Developer Dashboard",
            description: "Autonomous competitive programming and hackathon tracker with automated cron syncs from Codeforces, LeetCode, and Unstop.",
            status: "ONGOING",
            techStack: ["Next.js", "Prisma ORM", "PostgreSQL", "NextAuth", "Turbopack"],
            repoUrl: "https://github.com/Vardhan-Mittal/devtrack",
            liveUrl: "https://devtrack-live.vercel.app",
          },
          {
            id: "proj-3",
            title: "SnapScribe Video AI Summarizer",
            description: "High-performance AI video transcription and chapter summary generator deployed on Vercel Edge functions.",
            status: "COMPLETED",
            techStack: ["React", "Python", "Whisper AI", "Vercel SDK"],
            repoUrl: "https://github.com/Vardhan-Mittal/snapscribe",
            liveUrl: "https://snapscribe-ai.vercel.app",
          },
        ],
      })
    }

    const projects = await prisma.project.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ success: true, projects })
  } catch (error: any) {
    console.error("❌ Error fetching projects:", error.message)
    return NextResponse.json(
      { success: false, error: "Failed to load engineering portfolio projects" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Must be logged in to create projects" }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, status = "PLANNED", techStack = [], repoUrl, liveUrl } = body

    if (!title?.trim()) {
      return NextResponse.json({ success: false, error: "Project title is required" }, { status: 400 })
    }

    const newProject = await prisma.project.create({
      data: {
        userId: session.user.id,
        title: title.trim(),
        description,
        status,
        techStack: Array.isArray(techStack) ? techStack : techStack.split(",").map((t: string) => t.trim()),
        repoUrl,
        liveUrl,
      },
    })

    return NextResponse.json({ success: true, project: newProject })
  } catch (error: any) {
    console.error("❌ Error creating project:", error.message)
    return NextResponse.json({ success: false, error: "Failed to create project" }, { status: 500 })
  }
}
