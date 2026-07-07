import { syncCodeforcesContests } from "./codeforces"
import { syncLeetCodeContests } from "./leetcode"
import { syncCodeChefContests } from "./codechef"
import { syncUnstopHackathons } from "./unstop"
import { prisma } from "@/lib/prisma"

/**
 * Orchestrates synchronization across all supported contest platforms & hackathons
 * and purges items that finished more than 48 hours ago.
 */
export async function syncAllContests() {
  console.log("🚀 Starting global auto-sync for coding contests & hackathons...")
  
  const [cfResult, lcResult, ccResult, unstopResult] = await Promise.all([
    syncCodeforcesContests(),
    syncLeetCodeContests(),
    syncCodeChefContests(),
    syncUnstopHackathons(),
  ])

  // Cleanup: Delete contests whose start time + duration is more than 48 hours in the past
  const cleanupThreshold = new Date(Date.now() - 48 * 3600 * 1000)
  try {
    await prisma.contest.deleteMany({
      where: {
        startTime: {
          lt: cleanupThreshold,
        },
      },
    })
  } catch (err: any) {
    console.error("⚠️ Cleanup error:", err.message)
  }

  return {
    success: cfResult.success || lcResult.success || ccResult.success || unstopResult.success,
    results: {
      codeforces: cfResult,
      leetcode: lcResult,
      codechef: ccResult,
      unstop: unstopResult,
    },
    timestamp: new Date().toISOString(),
  }
}
