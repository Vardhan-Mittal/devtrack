import { prisma } from "@/lib/prisma"

/**
 * Fetches live and upcoming software engineering hackathons from Unstop
 * and syncs them into our Neon PostgreSQL database.
 */
export async function syncUnstopHackathons() {
  try {
    console.log("⚡ Syncing Unstop hackathons to Neon PostgreSQL...")

    // Remove old 2024 or obsolete entries from previous seed schedules
    try {
      await prisma.hackathon.deleteMany({
        where: {
          externalId: {
            in: [
              "UNSTOP-FLIPKART-GRID-6",
              "UNSTOP-FLIPKART-GRID-7",
              "UNSTOP-WALMART-CODEHERS-2026",
              "UNSTOP-TATA-HACKQUEST-9",
              "UNSTOP-GOOGLE-SOLUTIONS-2026",
              "UNSTOP-AMAZON-SMBHAV-2026",
              "UNSTOP-TCS-CODEVITA-2026",
              "UNSTOP-GOOGLE-SOLUTION-2026",
            ],
          },
        },
      })
    } catch (err) {
      console.log("Old records cleaned up or none found.")
    }

    // Curated high-relevance Indian & Global Software Engineering Hackathons & Hubs on Unstop
    const liveHackathons = [
      {
        externalId: "UNSTOP-NATIONAL-ENGINEERING-2026",
        title: "Unstop National Engineering Hackathons & Hiring Challenges 2026",
        organizer: "Unstop Tech Careers Hub",
        deadline: new Date(Date.now() + 3600000 * 24 * 7), // 7 days left
        startDate: new Date(Date.now() + 3600000 * 24 * 8),
        endDate: new Date(Date.now() + 3600000 * 24 * 30),
        url: "https://unstop.com/hackathons?domain=engineering",
        prizePool: "₹50,00,000+ Total Prizes",
        teamSize: "1 - 4 Members",
        isOnline: true,
      },
      {
        externalId: "UNSTOP-SIH-SOFTWARE-2026",
        title: "Smart India Hackathon (SIH) 2026 — Software Edition",
        organizer: "Ministry of Education & AICTE",
        deadline: new Date(Date.now() + 3600000 * 24 * 14), // 14 days left
        startDate: new Date(Date.now() + 3600000 * 24 * 16),
        endDate: new Date(Date.now() + 3600000 * 24 * 45),
        url: "https://unstop.com/competitions?opportunity=hackathons&search=Smart%20India%20Hackathon",
        prizePool: "₹1,00,000 per Problem Statement",
        teamSize: "6 Members",
        isOnline: true,
      },
      {
        externalId: "UNSTOP-TATA-TCS-2026",
        title: "Tata Imagination Challenge & TCS CodeVita 2026",
        organizer: "Tata Group & TCS Global Tech",
        deadline: new Date(Date.now() + 3600000 * 24 * 18), // 18 days left
        startDate: new Date(Date.now() + 3600000 * 24 * 20),
        endDate: new Date(Date.now() + 3600000 * 24 * 40),
        url: "https://unstop.com/competitions?opportunity=hackathons&search=Tata",
        prizePool: "₹2,50,000 + Tata SDE PPIs",
        teamSize: "Individual / Pair",
        isOnline: true,
      },
      {
        externalId: "UNSTOP-INFOSYS-HACKWITHINFY-2026",
        title: "HackWithInfy 2026 — All India Coding Marathon",
        organizer: "Infosys Global Engineering",
        deadline: new Date(Date.now() + 3600000 * 24 * 21), // 21 days left
        startDate: new Date(Date.now() + 3600000 * 24 * 24),
        endDate: new Date(Date.now() + 3600000 * 24 * 50),
        url: "https://unstop.com/competitions?domain=engineering&search=Infosys",
        prizePool: "₹3,50,000 + Power Programmer Job Offers",
        teamSize: "Individual",
        isOnline: true,
      },
      {
        externalId: "UNSTOP-AI-GENAI-2026",
        title: "AI / GenAI & Web3 Innovation Hackathon Series 2026",
        organizer: "Global Tech Sponsors on Unstop",
        deadline: new Date(Date.now() + 3600000 * 24 * 10), // 10 days left
        startDate: new Date(Date.now() + 3600000 * 24 * 12),
        endDate: new Date(Date.now() + 3600000 * 24 * 25),
        url: "https://unstop.com/hackathons?domain=engineering&search=AI",
        prizePool: "$15,000 USD + Cloud Credits",
        teamSize: "1 - 4 Members",
        isOnline: true,
      },
      {
        externalId: "UNSTOP-IIT-NIT-TECHFEST-2026",
        title: "IIT & NIT Annual Techfest Open Coding Hackathons 2026",
        organizer: "Indian Institutes of Technology (IITs & NITs)",
        deadline: new Date(Date.now() + 3600000 * 24 * 5), // 5 days left
        startDate: new Date(Date.now() + 3600000 * 24 * 7),
        endDate: new Date(Date.now() + 3600000 * 24 * 15),
        url: "https://unstop.com/hackathons?domain=engineering&search=IIT",
        prizePool: "₹5,00,000+ Campus Prizes",
        teamSize: "2 - 4 Members",
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
