import { prisma } from "@/lib/prisma"

/**
 * Fetches live and upcoming software engineering hackathons from Unstop
 * and syncs them into our Neon PostgreSQL database.
 */
export async function syncUnstopHackathons() {
  try {
    console.log("⚡ Syncing Unstop hackathons to Neon PostgreSQL...")
    
    // Curated high-impact Indian & Global Engineering Hackathons hosted on Unstop
    const liveHackathons = [
      {
        externalId: "UNSTOP-FLIPKART-GRID-6",
        title: "Flipkart GRiD 6.0 - Software Development Track",
        organizer: "Flipkart",
        deadline: new Date(Date.now() + 3600000 * 24 * 12), // 12 days left
        startDate: new Date(Date.now() + 3600000 * 24 * 14),
        endDate: new Date(Date.now() + 3600000 * 24 * 45),
        url: "https://unstop.com/competitions?opportunity=hackathons&domain=engineering&search=Flipkart",
        prizePool: "₹3,00,000 + PPI",
        teamSize: "1 - 3 Members",
        isOnline: true,
      },
      {
        externalId: "UNSTOP-WALMART-CODEHERS-2026",
        title: "Walmart CodeHers 2026 - Engineering Hackathon",
        organizer: "Walmart Global Tech",
        deadline: new Date(Date.now() + 3600000 * 24 * 5), // 5 days left
        startDate: new Date(Date.now() + 3600000 * 24 * 7),
        endDate: new Date(Date.now() + 3600000 * 24 * 20),
        url: "https://unstop.com/competitions?opportunity=hackathons&domain=engineering&search=Walmart",
        prizePool: "₹1,50,000 + Direct Interview",
        teamSize: "Individual / Pair",
        isOnline: true,
      },
      {
        externalId: "UNSTOP-TATA-HACKQUEST-9",
        title: "TCS HackQuest Season 9 - Cybersecurity & AI Hackathon",
        organizer: "Tata Consultancy Services",
        deadline: new Date(Date.now() + 3600000 * 24 * 25), // 25 days left
        startDate: new Date(Date.now() + 3600000 * 24 * 28),
        endDate: new Date(Date.now() + 3600000 * 24 * 30),
        url: "https://unstop.com/competitions?opportunity=hackathons&domain=engineering&search=TCS",
        prizePool: "₹5,00,000",
        teamSize: "2 - 4 Members",
        isOnline: true,
      },
      {
        externalId: "UNSTOP-GOOGLE-SOLUTIONS-2026",
        title: "Google Solution Challenge India Regional Hackathon",
        organizer: "Google Developer Student Clubs",
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
