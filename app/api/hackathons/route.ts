import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { syncUnstopHackathons } from "@/lib/fetchers/unstop"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id

    let hackathonsList = await prisma.hackathon.findMany({
      orderBy: { deadline: "asc" },
    })

    if (hackathonsList.length === 0) {
      console.log("No hackathons found in DB. Running initial Unstop sync...")
      await syncUnstopHackathons()
      hackathonsList = await prisma.hackathon.findMany({
        orderBy: { deadline: "asc" },
      })
    }

    // Map user intents if authenticated
    let statusMap = new Map<string, string>()
    if (userId) {
      const statuses = await prisma.userHackathonStatus.findMany({
        where: { userId },
      })
      statuses.forEach((s) => statusMap.set(s.hackathonId, s.intent))
    }

    // Attach intent status to each hackathon
    const enriched = hackathonsList.map((h) => ({
      ...h,
      intent: statusMap.get(h.id) || "NOT_REGISTERED",
    }))

    // Sort by priority algorithm: REGISTERED -> INTERESTED -> NOT_REGISTERED, nearest deadline first
    const registered = enriched
      .filter((h) => h.intent === "REGISTERED")
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())

    const interested = enriched
      .filter((h) => h.intent === "INTERESTED")
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())

    const upcoming = enriched
      .filter((h) => h.intent === "NOT_REGISTERED")
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())

    const prioritized = [...registered, ...interested, ...upcoming]

    return NextResponse.json({
      success: true,
      hackathons: prioritized,
      grouped: { registered, interested, upcoming },
      total: prioritized.length,
    })
  } catch (error: any) {
    console.error("❌ Error fetching hackathons:", error.message)
    return NextResponse.json(
      { success: false, error: "Failed to load hackathon schedule" },
      { status: 500 }
    )
  }
}

export async function POST() {
  try {
    const result = await syncUnstopHackathons()
    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
