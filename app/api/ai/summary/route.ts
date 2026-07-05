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
        contestStatus: {
          include: { contest: true },
        },
        hackathonStatus: {
          include: { hackathon: true },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    // Time of day greeting
    const hour = new Date().getHours()
    const timeGreeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"
    const firstName = user.name ? user.name.split(" ")[0] : "Developer"
    const greeting = `${timeGreeting}, ${firstName} 👋`

    // Analyze schedule
    const activeTasks = user.tasks.filter((t) => !t.completed)
    const completedTasks = user.tasks.filter((t) => t.completed)
    const activeProjects = user.projects.filter((p) => p.status === "ONGOING" || p.status === "PLANNED")
    const registeredContests = user.contestStatus.filter((c) => c.intent === "REGISTERED")
    const registeredHackathons = user.hackathonStatus.filter((h) => h.intent === "REGISTERED" || h.intent === "INTERESTED")

    const scheduleSummary = `Today's active schedule: ${activeTasks.length} Sprint Tasks, ${registeredContests.length} Registered Contests, and ${activeProjects.length} Ongoing Projects.`

    // Calculate dynamic SDE Productivity Score (out of 100)
    let baseScore = 70
    if (completedTasks.length > 0) baseScore += Math.min(15, completedTasks.length * 5)
    if (activeTasks.length > 0) baseScore += 5
    if (registeredContests.length > 0) baseScore += 5
    if (activeProjects.length > 0) baseScore += 5
    const productivityScore = Math.min(100, baseScore)

    // Generate intelligent AI coaching suggestions
    const suggestions = []
    if (activeTasks.length > 0) {
      const highPriority = activeTasks.filter((t) => t.priority === "HIGH")
      if (highPriority.length > 0) {
        suggestions.push(`Focus priority: You have ${highPriority.length} HIGH-priority sprint tasks pending. Clear those before starting new modules.`)
      } else {
        suggestions.push(`You have ${activeTasks.length} tasks on your To-Do list. Keep up the sprint velocity!`)
      }
    } else {
      suggestions.push(`Your sprint backlog is clear! Use the AI Project Planner below to scope out a new project or practice a LeetCode problem.`)
    }

    if (registeredContests.length === 0) {
      suggestions.push(`You haven't registered for any upcoming Codeforces or LeetCode contests yet. Check the Contest Priority Board to stay competitive!`)
    } else {
      const nextContest = registeredContests[0].contest
      suggestions.push(`Contest Alert: You are registered for ${nextContest.title}. Make sure your development environment is armed and ready!`)
    }

    if (activeProjects.length > 0) {
      suggestions.push(`Project Velocity: You are currently tracking ${activeProjects.length} active projects. Ensure your GitHub commit streak remains unbroken!`)
    }

    return NextResponse.json({
      success: true,
      summary: {
        greeting,
        scheduleSummary,
        productivityScore,
        suggestions,
        counts: {
          tasks: activeTasks.length,
          contests: registeredContests.length,
          projects: activeProjects.length,
          hackathons: registeredHackathons.length,
        },
      },
    })
  } catch (error: any) {
    console.error("AI Summary error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
