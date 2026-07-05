import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { syncAllContests } from "@/lib/fetchers"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id

    // Fetch all contests from database
    const rawContests = await prisma.contest.findMany({
      orderBy: { startTime: "asc" },
    })

    // If no contests exist yet, run an initial sync automatically
    let contestsList = rawContests
    if (contestsList.length === 0) {
      console.log("No contests found in DB. Running initial auto-sync...")
      await syncAllContests()
      contestsList = await prisma.contest.findMany({
        orderBy: { startTime: "asc" },
      })
    }

    // Fetch user contest intents if authenticated
    let statusMap = new Map<string, string>()
    if (userId) {
      const statuses = await prisma.userContestStatus.findMany({
        where: { userId },
      })
      statuses.forEach((s) => statusMap.set(s.contestId, s.intent))
    }

    // Attach intent status to each contest
    const enriched = contestsList.map((c) => ({
      ...c,
      intent: statusMap.get(c.id) || "NOT_REGISTERED",
    }))

    // Priority Sorting Algorithm:
    // 1. Registered contests (nearest first)
    // 2. Interested contests (nearest first)
    // 3. Not registered contests (nearest first)
    const registered = enriched
      .filter((c) => c.intent === "REGISTERED")
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())

    const interested = enriched
      .filter((c) => c.intent === "INTERESTED")
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())

    const upcoming = enriched
      .filter((c) => c.intent === "NOT_REGISTERED")
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())

    const prioritized = [...registered, ...interested, ...upcoming]

    return NextResponse.json({
      success: true,
      contests: prioritized,
      grouped: {
        registered,
        interested,
        upcoming,
      },
      total: prioritized.length,
    })
  } catch (error: any) {
    console.error("❌ Error fetching prioritized contests:", error.message)
    return NextResponse.json(
      { success: false, error: "Failed to load contest schedule" },
      { status: 500 }
    )
  }
}

export async function POST() {
  try {
    const syncResult = await syncAllContests()
    return NextResponse.json(syncResult)
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
