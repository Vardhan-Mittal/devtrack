import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    let user = null
    if (session?.user?.id) {
      user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
          tasks: true,
          projects: true,
          contestStatus: { include: { contest: true } },
          hackathonStatus: { include: { hackathon: true } },
        },
      })
    }
    if (!user && session?.user?.email) {
      user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
          tasks: true,
          projects: true,
          contestStatus: { include: { contest: true } },
          hackathonStatus: { include: { hackathon: true } },
        },
      })
    }

    const events: any[] = []

    if (!user) {
      // Demo / fallback mode
      const now = new Date()
      return NextResponse.json({
        success: true,
        events: [
          { id: "demo-task-1", title: "[Task] Connect Codeforces API cron worker", date: new Date(now.getTime() + 86400000), type: "TASK", color: "green", priority: "HIGH" },
          { id: "demo-proj-1", title: "[Project] Twitter / X Full-Stack Clone", date: new Date(now.getTime() + 86400000 * 5), type: "PROJECT", color: "blue", status: "ONGOING" },
          { id: "demo-cont-1", title: "[Codeforces] Educational Codeforces Round 173", date: new Date(now.getTime() + 86400000 * 2), type: "CONTEST", color: "orange", intent: "REGISTERED" },
          { id: "demo-cont-2", title: "[CodeChef] Starters 165 (Rated for All)", date: new Date(now.getTime() + 86400000 * 3), type: "CONTEST", color: "brown", intent: "INTERESTED" },
          { id: "demo-hack-1", title: "[Hackathon] Smart India Hackathon 2026", date: new Date(now.getTime() + 86400000 * 10), type: "HACKATHON", color: "purple" },
        ],
      })
    }

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

    // 3. Contests (Orange 🟠 & Brown 🟤)
    const allContests = await prisma.contest.findMany()
    allContests.forEach((c) => {
      const isReg = user.contestStatus.some((s) => s.contestId === c.id && s.intent === "REGISTERED")
      const isInt = user.contestStatus.some((s) => s.contestId === c.id && s.intent === "INTERESTED")
      events.push({
        id: `contest-${c.id}`,
        title: `[${c.platform}] ${c.title}`,
        date: c.startTime,
        type: "CONTEST",
        color: c.platform === "CODECHEF" ? "brown" : "orange",
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

    events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    return NextResponse.json({ success: true, events })
  } catch (error: any) {
    console.error("Calendar API error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
