import { syncCodeforcesContests } from "./codeforces"
import { syncLeetCodeContests } from "./leetcode"
import { prisma } from "@/lib/prisma"

/**
 * Orchestrates synchronization across all supported contest platforms
 * and purges contests that finished more than 48 hours ago.
 */
export async function syncAllContests() {
  console.log("🚀 Starting global auto-sync for coding contests...")
  
  const [cfResult, lcResult] = await Promise.all([
    syncCodeforcesContests(),
    syncLeetCodeContests(),
  ])

  // Cleanup: Delete contests whose start time + duration is more than 48 hours in the past
  const cleanupThreshold = new Date(Date.now() - 48 * 3600 * 1000)
  try {
    const deleted = await prisma.contest.deleteMany({
      where: {
        startTime: {
          lt: cleanupThreshold,
        },
      },
    })
    if (deleted.count > 0) {
      console.log(`🧹 Cleaned up ${deleted.count} expired historical contests.`)
    }
  } catch (err: any) {
    console.error("⚠️ Cleanup error:", err.message)
  }

  return {
    success: cfResult.success || lcResult.success,
    results: {
      codeforces: cfResult,
      leetcode: lcResult,
    },
    timestamp: new Date().toISOString(),
  }
}
