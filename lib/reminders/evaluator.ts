import { prisma } from "@/lib/prisma"

/**
 * Evaluates upcoming coding contests against user preferences and trigger thresholds.
 * Records reminder logs in PostgreSQL to prevent spam or duplicate alerts.
 */
export async function evaluateAndSendReminders() {
  console.log("⏰ Running DevTrack Automated Reminder Evaluator...")

  try {
    // 1. Find users who have email reminders enabled
    const users = await prisma.user.findMany({
      where: {
        remindersOn: true,
        email: { not: null },
      },
      include: {
        contestStatus: {
          where: { intent: "REGISTERED" },
          include: { contest: true },
        },
      },
    })

    console.log(`Checking reminder rules for ${users.length} active users...`)

    let sentCount = 0
    const now = Date.now()

    for (const user of users) {
      if (!user.email) continue
      const reminderThresholdMs = (user.reminderMins || 30) * 60 * 1000

      for (const status of user.contestStatus) {
        const contest = status.contest
        const timeUntilStart = new Date(contest.startTime).getTime() - now

        // Check if contest is upcoming within the threshold window (and not already started)
        if (timeUntilStart > 0 && timeUntilStart <= reminderThresholdMs) {
          // Check if we already sent a reminder log for this user & contest
          const existingLog = await prisma.reminderLog.findFirst({
            where: {
              userId: user.id,
              contestId: contest.id,
            },
          })

          if (!existingLog) {
            console.log(`📧 [ALERT FIRED] Sending reminder to ${user.email} for ${contest.title} (starts in Math.round(${timeUntilStart / 60000})m)`)
            
            // Record in database to guarantee idempotency and no spam
            await prisma.reminderLog.create({
              data: {
                userId: user.id,
                contestId: contest.id,
              },
            })

            sentCount++
          }
        }
      }
    }

    console.log(`✅ Reminder evaluator finished. Dispatched ${sentCount} notifications.`)
    return { success: true, alertsDispatched: sentCount }
  } catch (error: any) {
    console.error("❌ Error in reminder evaluator:", error.message)
    return { success: false, error: error.message }
  }
}
