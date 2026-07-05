import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Helper to extract real coding stats for given usernames
async function extractCodingStats(lcUsername: string, cfHandle: string) {
  // 1. LeetCode Stats Extraction
  let lcStats = {
    totalSolved: 0,
    easySolved: 0,
    mediumSolved: 0,
    hardSolved: 0,
    ranking: 0,
    acceptanceRate: 0,
    username: lcUsername || "Not Connected",
    isReal: false,
  }

  if (lcUsername && lcUsername !== "Not Connected") {
    try {
      const lcQuery = `
        query userProblemsSolved($username: String!) {
          matchedUser(username: $username) {
            profile {
              ranking
            }
            submitStatsGlobal {
              acSubmissionNum {
                difficulty
                count
              }
              totalSubmissionNum {
                difficulty
                count
              }
            }
          }
        }
      `
      const lcRes = await fetch("https://leetcode.com/graphql/", {
        method: "POST",
        headers: { "Content-Type": "application/json", "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
        body: JSON.stringify({ query: lcQuery, variables: { username: lcUsername.trim() } }),
        cache: "no-store",
      })

      if (lcRes.ok) {
        const lcData = await lcRes.json()
        const matched = lcData?.data?.matchedUser
        if (matched?.submitStatsGlobal?.acSubmissionNum) {
          const ac = matched.submitStatsGlobal.acSubmissionNum
          const totalSub = matched.submitStatsGlobal.totalSubmissionNum

          const all = ac.find((item: any) => item.difficulty === "All")?.count || 0
          const easy = ac.find((item: any) => item.difficulty === "Easy")?.count || 0
          const medium = ac.find((item: any) => item.difficulty === "Medium")?.count || 0
          const hard = ac.find((item: any) => item.difficulty === "Hard")?.count || 0
          const ranking = matched.profile?.ranking || 0

          const totalAllSub = totalSub?.find((item: any) => item.difficulty === "All")?.count || 0
          const acceptanceRate = totalAllSub > 0 ? parseFloat(((all / totalAllSub) * 100).toFixed(1)) : 0

          lcStats = {
            totalSolved: all,
            easySolved: easy,
            mediumSolved: medium,
            hardSolved: hard,
            ranking,
            acceptanceRate,
            username: lcUsername.trim(),
            isReal: true,
          }
        }
      }
    } catch (err) {
      console.error("LeetCode extraction error for:", lcUsername, err)
    }
  }

  // 2. Codeforces Stats Extraction
  let cfStats = {
    handle: cfHandle || "Not Connected",
    rating: 0,
    maxRating: 0,
    rank: "Unrated",
    maxRank: "Unrated",
    totalSolved: 0,
    isReal: false,
  }

  if (cfHandle && cfHandle !== "Not Connected") {
    try {
      // Get user info (rating, rank)
      const cfInfoRes = await fetch(`https://codeforces.com/api/user.info?handles=${cfHandle.trim()}`, {
        cache: "no-store",
      })
      if (cfInfoRes.ok) {
        const cfInfoData = await cfInfoRes.json()
        if (cfInfoData.status === "OK" && cfInfoData.result?.length > 0) {
          const info = cfInfoData.result[0]
          
          // Get user submissions to calculate exact unique solved problems
          let solvedCount = 0
          try {
            const cfStatusRes = await fetch(`https://codeforces.com/api/user.status?handle=${cfHandle.trim()}`, {
              cache: "no-store",
            })
            if (cfStatusRes.ok) {
              const statusData = await cfStatusRes.json()
              if (statusData.status === "OK" && statusData.result) {
                const solvedSet = new Set()
                statusData.result.forEach((sub: any) => {
                  if (sub.verdict === "OK" && sub.problem) {
                    solvedSet.add(`${sub.problem.contestId}-${sub.problem.index}`)
                  }
                })
                solvedCount = solvedSet.size
              }
            }
          } catch (statusErr) {
            console.error("Codeforces submission count error:", statusErr)
          }

          cfStats = {
            handle: info.handle || cfHandle.trim(),
            rating: info.rating || 0,
            maxRating: info.maxRating || 0,
            rank: info.rank || "Unrated",
            maxRank: info.maxRank || "Unrated",
            totalSolved: solvedCount,
            isReal: true,
          }
        }
      }
    } catch (err) {
      console.error("Codeforces extraction error for:", cfHandle, err)
    }
  }

  return { lcStats, cfStats }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    let lcUsername = searchParams.get("lc") || ""
    let cfHandle = searchParams.get("cf") || ""

    const session = await getServerSession(authOptions)
    let user = null

    if (session?.user?.id) {
      user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
          tasks: true,
          projects: true,
          contestStatus: true,
        },
      })
    }
    if (!user && session?.user?.email) {
      user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
          tasks: true,
          projects: true,
          contestStatus: true,
        },
      })
    }

    // Use saved user usernames if not explicitly passed in query params
    if (user) {
      if (!lcUsername && user.lcUsername) lcUsername = user.lcUsername
      if (!cfHandle && user.cfHandle) cfHandle = user.cfHandle
    }

    // Extract real stats (no fake fallbacks)
    const { lcStats, cfStats } = await extractCodingStats(lcUsername, cfHandle)

    // Calculate Monthly Progress & Productivity Metrics
    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const totalTasks = user?.tasks?.length || 8
    const completedTasks = user?.tasks?.filter((t) => t.completed).length || 5
    const monthlyTasks = user?.tasks?.filter((t) => new Date(t.createdAt) >= firstDayOfMonth).length || 6
    const monthlyCompleted = user?.tasks?.filter((t) => t.completed && new Date(t.updatedAt) >= firstDayOfMonth).length || 4

    const activeProjects = user?.projects?.filter((p) => p.status === "ONGOING").length || 2
    const completedProjects = user?.projects?.filter((p) => p.status === "COMPLETED").length || 1

    const registeredContests = user?.contestStatus?.filter((c) => c.intent === "REGISTERED").length || 3

    // Monthly Progress Score out of 100
    const taskVelocityScore = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 40) : 30
    const codingScore = Math.min(40, Math.round(((lcStats.totalSolved + cfStats.totalSolved) / 300) * 40))
    const contestScore = Math.min(20, registeredContests * 7)
    const monthlyScore = Math.min(100, taskVelocityScore + codingScore + contestScore)

    return NextResponse.json({
      success: true,
      leetcode: lcStats,
      codeforces: cfStats,
      monthlyProgress: {
        score: monthlyScore,
        monthName: now.toLocaleString("default", { month: "long", year: "numeric" }),
        tasksCompletedThisMonth: monthlyCompleted,
        tasksCreatedThisMonth: monthlyTasks,
        totalTasksCompleted: completedTasks,
        totalTasks: totalTasks,
        activeProjects,
        completedProjects,
        registeredContests,
        totalProblemsSolved: lcStats.totalSolved + cfStats.totalSolved,
      },
    })
  } catch (error: any) {
    console.error("Coding stats API error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { lcUsername, cfHandle } = await req.json()
    const session = await getServerSession(authOptions)

    // Save to PostgreSQL if logged in
    if (session?.user?.id || session?.user?.email) {
      try {
        if (session?.user?.id) {
          await prisma.user.update({
            where: { id: session.user.id },
            data: { lcUsername: lcUsername || null, cfHandle: cfHandle || null },
          })
        } else if (session?.user?.email) {
          await prisma.user.update({
            where: { email: session.user.email },
            data: { lcUsername: lcUsername || null, cfHandle: cfHandle || null },
          })
        }
      } catch (dbErr) {
        console.warn("Could not save handles to DB, proceeding with live extraction:", dbErr)
      }
    }

    // Extract live stats immediately
    const { lcStats, cfStats } = await extractCodingStats(lcUsername, cfHandle)

    return NextResponse.json({
      success: true,
      leetcode: lcStats,
      codeforces: cfStats,
    })
  } catch (error: any) {
    console.error("POST Coding stats error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
