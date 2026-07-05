import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      // If unauthenticated, return sample default tasks or error
      return NextResponse.json({
        success: true,
        tasks: [
          { id: "sample-1", title: "⚡ Connect Codeforces API cron worker", priority: "HIGH", completed: true },
          { id: "sample-2", title: "🔐 Set up Resend API key for contest reminders", priority: "MEDIUM", completed: false },
          { id: "sample-3", title: "🏆 Participate in LeetCode Biweekly Contest", priority: "HIGH", completed: false },
        ],
      })
    }

    const tasks = await prisma.task.findMany({
      where: { userId: session.user.id },
      orderBy: [{ completed: "asc" }, { createdAt: "desc" }],
    })

    return NextResponse.json({ success: true, tasks })
  } catch (error: any) {
    console.error("❌ Error fetching todos:", error.message)
    return NextResponse.json(
      { success: false, error: "Failed to load engineering tasks" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Must be logged in to save tasks to Neon DB" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, priority = "MEDIUM" } = body

    if (!title?.trim()) {
      return NextResponse.json(
        { success: false, error: "Task title cannot be empty" },
        { status: 400 }
      )
    }

    const newTask = await prisma.task.create({
      data: {
        userId: session.user.id,
        title: title.trim(),
        priority: priority.toUpperCase(),
      },
    })

    return NextResponse.json({ success: true, task: newTask })
  } catch (error: any) {
    console.error("❌ Error creating todo:", error.message)
    return NextResponse.json(
      { success: false, error: "Failed to create task" },
      { status: 500 }
    )
  }
}
