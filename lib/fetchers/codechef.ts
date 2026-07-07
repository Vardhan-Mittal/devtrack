import { prisma } from "@/lib/prisma"

export interface CCContest {
  contest_code: string
  contest_name: string
  contest_start_date: string
  contest_end_date: string
  contest_start_date_iso?: string
  contest_end_date_iso?: string
  contest_duration: string
}

/**
 * Fetches upcoming coding contests from CodeChef official API
 * and syncs them into our Neon PostgreSQL database.
 */
export async function syncCodeChefContests() {
  try {
    console.log("⚡ Fetching CodeChef contests from public API...")
    const res = await fetch("https://www.codechef.com/api/list/contests/all?sort_by=START&sorting_order=asc&offset=0&mode=all", {
      next: { revalidate: 3600 },
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
    })

    if (!res.ok) {
      throw new Error(`CodeChef API responded with status ${res.status}`)
    }

    const data = await res.json()
    const upcoming = data.future_contests

    if (!Array.isArray(upcoming)) {
      throw new Error("Invalid format received from CodeChef API")
    }

    console.log(`Found ${upcoming.length} upcoming CodeChef contests. Syncing to DB...`)

    let syncedCount = 0
    for (const contest of upcoming) {
      if (!contest.contest_code || !contest.contest_name) continue

      const externalId = `CC-${contest.contest_code}`
      const startTimeStr = contest.contest_start_date_iso || contest.contest_start_date
      if (!startTimeStr) continue

      const startTime = new Date(startTimeStr)
      if (isNaN(startTime.getTime())) continue

      const durationMins = parseInt(contest.contest_duration || "120", 10)
      const durationSec = (isNaN(durationMins) ? 120 : durationMins) * 60
      const url = `https://www.codechef.com/${contest.contest_code}`

      await prisma.contest.upsert({
        where: { externalId },
        update: {
          title: contest.contest_name,
          startTime,
          durationSec,
          url,
          platform: "CODECHEF",
        },
        create: {
          externalId,
          platform: "CODECHEF",
          title: contest.contest_name,
          startTime,
          durationSec,
          url,
        },
      })
      syncedCount++
    }

    return { success: true, platform: "CODECHEF", count: syncedCount }
  } catch (error: any) {
    console.error("❌ Error syncing CodeChef contests:", error.message)
    return { success: false, platform: "CODECHEF", error: error.message }
  }
}

/**
 * Extracts live user profile stats from CodeChef user profile page.
 */
export async function extractCodeChefStats(username: string) {
  if (!username || username === "Not Connected") {
    return {
      handle: username || "Not Connected",
      rating: 0,
      stars: "Unrated",
      solved: 0,
      globalRank: 0,
      isReal: false,
    }
  }

  try {
    const res = await fetch(`https://www.codechef.com/users/${username.trim()}`, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
      cache: "no-store",
    })

    if (!res.ok) {
      throw new Error(`CodeChef profile HTTP status ${res.status}`)
    }

    const html = await res.text()

    // Rating
    const ratingMatch = html.match(/rating-number[^>]*>\s*(\d+)/i) || html.match(/<div class=["']rating-number["']>[\s\S]*?(\d+)/i)
    const rating = ratingMatch ? parseInt(ratingMatch[1], 10) : 0

    // Stars
    const starsMatch = html.match(/class=["']rating["'][^>]*>([^<]+)/i) || html.match(/(\d+)\s*&#9733;/i) || html.match(/(\d+)\s*★/i)
    let stars = starsMatch ? starsMatch[1].trim() : (rating > 0 ? "1★" : "Unrated")
    stars = stars.replace(/&#9733;/g, "★")
    if (stars && !stars.includes("★") && !isNaN(parseInt(stars, 10))) {
      stars = `${stars}★`
    }

    // Solved
    const solvedMatch = html.match(/Total Problems Solved:[^0-9]*(\d+)/i) || html.match(/Fully Solved[^0-9]*(\d+)/i) || html.match(/<h3>Total Problems Solved:\s*<\/h3>\s*<h5>\s*(\d+)/i)
    const solved = solvedMatch ? parseInt(solvedMatch[1], 10) : 0

    // Global Rank
    const rankMatch = html.match(/Global Rank:\s*<\/strong>\s*<a[^>]*>(\d+)/i) || html.match(/rating-ranks[^>]*>[\s\S]*?<a[^>]*>(\d+)/i)
    const globalRank = rankMatch ? parseInt(rankMatch[1], 10) : 0

    return {
      handle: username.trim(),
      rating: isNaN(rating) ? 0 : rating,
      stars,
      solved: isNaN(solved) ? 0 : solved,
      globalRank: isNaN(globalRank) ? 0 : globalRank,
      isReal: true,
    }
  } catch (err) {
    console.error("CodeChef stats extraction error for:", username, err)
    return {
      handle: username.trim(),
      rating: 0,
      stars: "Unrated",
      solved: 0,
      globalRank: 0,
      isReal: false,
    }
  }
}
