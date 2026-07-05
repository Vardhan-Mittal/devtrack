import { prisma } from "@/lib/prisma"

const LEETCODE_GRAPHQL_URL = "https://leetcode.com/graphql"

const CONTEST_QUERY = `
  query topTwoContests {
    topTwoContests {
      title
      titleSlug
      startTime
      duration
      cardImg
      company {
        name
      }
    }
  }
`

/**
 * Fetches upcoming LeetCode Weekly and Biweekly contests via official GraphQL API
 * and syncs them into our Neon PostgreSQL database.
 */
export async function syncLeetCodeContests() {
  try {
    console.log("⚡ Fetching LeetCode contests from public GraphQL API...")
    const res = await fetch(LEETCODE_GRAPHQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "DevTrack-SDE-Dashboard/1.0",
        "Referer": "https://leetcode.com/contest/",
      },
      body: JSON.stringify({ query: CONTEST_QUERY }),
      next: { revalidate: 3600 },
    })

    if (!res.ok) {
      throw new Error(`LeetCode GraphQL responded with status ${res.status}`)
    }

    const data = await res.json()
    const contests = data?.data?.topTwoContests

    if (!Array.isArray(contests)) {
      throw new Error("Invalid GraphQL format received from LeetCode API")
    }

    console.log(`Found ${contests.length} upcoming LeetCode contests. Syncing to DB...`)

    let syncedCount = 0
    for (const contest of contests) {
      if (!contest.startTime || !contest.titleSlug) continue

      const externalId = `LC-${contest.titleSlug}`
      const startTime = new Date(contest.startTime * 1000)
      const url = `https://leetcode.com/contest/${contest.titleSlug}/`
      const durationSec = contest.duration || 5400 // Usually 1.5 hours (5400s)

      await prisma.contest.upsert({
        where: { externalId },
        update: {
          title: contest.title,
          startTime,
          durationSec,
          url,
          platform: "LEETCODE",
        },
        create: {
          externalId,
          platform: "LEETCODE",
          title: contest.title,
          startTime,
          durationSec,
          url,
        },
      })
      syncedCount++
    }

    return { success: true, platform: "LEETCODE", count: syncedCount }
  } catch (error: any) {
    console.error("❌ Error syncing LeetCode contests:", error.message)
    return { success: false, platform: "LEETCODE", error: error.message }
  }
}
