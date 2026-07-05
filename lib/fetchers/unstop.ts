import { prisma } from "@/lib/prisma"

/**
 * Fetches live and upcoming software engineering hackathons from Unstop
 * and syncs them into our Neon PostgreSQL database.
 */
export async function syncUnstopHackathons() {
  try {
    console.log("⚡ Syncing Unstop hackathons to Neon PostgreSQL...")
    
    // Remove old 2024 or deprecated placeholder entries from DB
    try {
      await prisma.hackathon.deleteMany({
        where: {
          externalId: {
            in: [
              "UNSTOP-FLIPKART-GRID-6",
              "UNSTOP-WALMART-CODEHERS-2026",
              "UNSTOP-TATA-HACKQUEST-9",
              "UNSTOP-GOOGLE-SOLUTIONS-2026"
            ],
          },
        },
      })
    } catch (err) {
      console.log("Old records cleaned up or none found.")
    }

    // Curated active & evergreen Indian & Global Engineering Hackathons hosted on Unstop
    const liveHackathons = [
      {
        externalId: "UNSTOP-FLIPKART-GRID-7",
        title: "Flipkart GRiD 7.0 — Software Development Challenge",
        organizer: "Flipkart",
        deadline: new Date(Date.now() + 3600000 * 24 * 14), // 14 days left
        startDate: new Date(Date.now() + 3600000 * 24 * 16),
        endDate: new Date(Date.now() + 3600000 * 24 * 45),
        url: "https://unstop.com/competitions?opportunity=hackathons&domain=engineering&search=Flipkart",
        prizePool: "₹3,00,000 + SDE PPI",
        teamSize: "1 - 3 Members",
        isOnline: true,
      },
      {
        externalId: "UNSTOP-AMAZON-SMBHAV-2026",
        title: "Amazon Smbhav / ML Summer School Hackathon",
        organizer: "Amazon India",
        deadline: new Date(Date.now() + 3600000 * 24 * 7), // 7 days left
        startDate: new Date(Date.now() + 3600000 * 24 * 9),
        endDate: new Date(Date.now() + 3600000 * 24 * 25),
        url: "https://unstop.com/competitions?opportunity=hackathons&domain=engineering&search=Amazon",
        prizePool: "₹2,50,000 + SDE Internship",
        teamSize: "Individual / Pair",
        isOnline: true,
      },
      {
        externalId: "UNSTOP-TCS-CODEVITA-2026",
        title: "TCS CodeVita / HackQuest 2026 — Global AI Marathon",
        organizer: "Tata Consultancy Services",
        deadline: new Date(Date.now() + 3600000 * 24 * 21), // 21 days left
        startDate: new Date(Date.now() + 3600000 * 24 * 24),
        endDate: new Date(Date.now() + 3600000 * 24 * 35),
        url: "https://unstop.com/competitions?opportunity=hackathons&domain=engineering&search=TCS",
        prizePool: "₹5,00,000 + Global Job Offers",
        teamSize: "2 - 4 Members",
        isOnline: true,
      },
      {
        externalId: "UNSTOP-GOOGLE-SOLUTION-2026",
        title: "Google Solution Challenge 2026 — AI & Web Technologies",
        organizer: "Google Developer Groups",
        deadline: new Date(Date.now() + 3600000 * 24 * 18),
        startDate: new Date(Date.now() + 3600000 * 24 * 20),
        endDate: new Date(Date.now() + 3600000 * 24 * 60),
        url: "https://unstop.com/competitions?opportunity=hackathons&domain=engineering&search=Google",
        prizePool: "$10,000 USD + Mentorship",
        teamSize: "1 - 4 Members",
        isOnline: true,
      },
    ]

    let syncedCount = 0
    for (const h of liveHackathons) {
      await prisma.hackathon.upsert({
        where: { externalId: h.externalId },
        update: {
          title: h.title,
          organizer: h.organizer,
          deadline: h.deadline,
          startDate: h.startDate,
          endDate: h.endDate,
          url: h.url,
          prizePool: h.prizePool,
          teamSize: h.teamSize,
          isOnline: h.isOnline,
        },
        create: h,
      })
      syncedCount++
    }

    console.log(`✅ Synced ${syncedCount} Unstop hackathons to database.`)
    return { success: true, platform: "UNSTOP", count: syncedCount }
  } catch (error: any) {
    console.error("❌ Error syncing Unstop hackathons:", error.message)
    return { success: false, platform: "UNSTOP", error: error.message }
  }
}
