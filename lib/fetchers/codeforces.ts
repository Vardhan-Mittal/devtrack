import { prisma } from "@/lib/prisma"

export interface CFContest {
  id: number
  name: string
  type: string
  phase: string
  frozen: boolean
  durationSeconds: number
  startTimeSeconds?: number
  relativeTimeSeconds?: number
}

/**
 * Fetches upcoming and live coding contests from Codeforces official public API
 * and syncs them into our Neon PostgreSQL database.
 */
export async function syncCodeforcesContests() {
  try {
    console.log("⚡ Fetching Codeforces contests from public API...")
    const res = await fetch("https://codeforces.com/api/contest.list", {
      next: { revalidate: 3600 }, // Cache for 1 hour in Next.js App Router
      headers: { "User-Agent": "DevTrack-SDE-Dashboard/1.0" },
    })

    if (!res.ok) {
      throw new Error(`Codeforces API responded with status ${res.status}`)
    }

    const data = await res.json()
    if (data.status !== "OK" || !Array.isArray(data.result)) {
      throw new Error("Invalid format received from Codeforces API")
    }

    // Filter for upcoming contests (phase === "BEFORE") and live (phase === "CODING")
    const upcoming = data.result.filter(
      (c: CFContest) => (c.phase === "BEFORE" || c.phase === "CODING") && c.startTimeSeconds
    )

    console.log(`Found ${upcoming.length} upcoming/live Codeforces contests. Syncing to DB...`)

    let syncedCount = 0
    for (const contest of upcoming) {
      if (!contest.startTimeSeconds) continue
      
      const externalId = `CF-${contest.id}`
      const startTime = new Date(contest.startTimeSeconds * 1000)
      const url = `https://codeforces.com/contests/${contest.id}`

      await prisma.contest.upsert({
        where: { externalId },
        update: {
          title: contest.name,
          startTime,
          durationSec: contest.durationSeconds || 7200,
          url,
          platform: "CODEFORCES",
        },
        create: {
          externalId,
          platform: "CODEFORCES",
          title: contest.name,
          startTime,
          durationSec: contest.durationSeconds || 7200,
          url,
        },
      })
      syncedCount++
    }

    return { success: true, platform: "CODEFORCES", count: syncedCount }
  } catch (error: any) {
    console.error("❌ Error syncing Codeforces contests:", error.message)
    return { success: false, platform: "CODEFORCES", error: error.message }
  }
}
