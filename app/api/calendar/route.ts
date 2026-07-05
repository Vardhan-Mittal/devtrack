import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        tasks: true,
        projects: true,
        contestStatus: { include: { contest: true } },
        hackathonStatus: { include: { hackathon: true } },
      },
    })

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    const events: any[] = []

    // 1. Tasks (Green 🟢)
    user.tasks.forEach((t) => {
      if (t.dueDate) {
        events.push({
          id: `task-${t.id}`,
          title: `[Task] ${t.title}`,
          date: t.dueDate,
          type: "TASK",
          color: "green",
          completed: t.completed,
          priority: t.priority,
        })
      }
    })

    // 2. Projects (Blue 🔵)
    user.projects.forEach((p) => {
      if (p.deadline || p.createdAt) {
        events.push({
          id: `project-${p.id}`,
          title: `[Project] ${p.title}`,
          date: p.deadline || p.createdAt,
          type: "PROJECT",
          color: "blue",
          status: p.status,
          techStack: p.techStack,
        })
      }
    })

    // 3. Contests (Orange 🟠) - All contests in DB or registered ones
    const allContests = await prisma.contest.findMany()
    allContests.forEach((c) => {
      const isReg = user.contestStatus.some((s) => s.contestId === c.id && s.intent === "REGISTERED")
      const isInt = user.contestStatus.some((s) => s.contestId === c.id && s.intent === "INTERESTED")
      events.push({
        id: `contest-${c.id}`,
        title: `[${c.platform}] ${c.title}`,
        date: c.startTime,
        type: "CONTEST",
        color: "orange",
        url: c.url,
        intent: isReg ? "REGISTERED" : isInt ? "INTERESTED" : "PUBLIC",
      })
    })

    // 4. Hackathons (Purple 🟣)
    const allHackathons = await prisma.hackathon.findMany()
    allHackathons.forEach((h) => {
      events.push({
        id: `hackathon-${h.id}`,
        title: `[Hackathon] ${h.title}`,
        date: h.deadline,
        type: "HACKATHON",
        color: "purple",
        url: h.url,
        prizePool: h.prizePool,
      })
    })

    // Sort chronologically
    events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    return NextResponse.json({ success: true, events })
  } catch (error: any) {
    console.error("Calendar API error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
