import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found in database" }, { status: 404 })
    }

    const body = await req.json()
    const prompt = (body.prompt || "New Software Project").trim()

    // Smart Architectural Generator based on SDE design patterns
    let title = prompt.length > 30 ? prompt.substring(0, 30) + "..." : prompt
    let techStack = ["Next.js 16", "TypeScript", "Tailwind CSS v4", "Prisma ORM", "Neon PostgreSQL"]
    let folderStructure = [
      "/app/page.tsx",
      "/app/api/route.ts",
      "/components/Navbar.tsx",
      "/lib/prisma.ts",
      "/prisma/schema.prisma",
    ]
    let milestones = [
      "Milestone 1: Project Scoping & Database Schema Design",
      "Milestone 2: Core API Endpoints & Authentication Setup",
      "Milestone 3: Interactive UI Components & State Management",
      "Milestone 4: Production Deployment & E2E Testing",
    ]
    let tasksToCreate = [
      `[${title}] Define Prisma models & push schema to Neon DB`,
      `[${title}] Build responsive UI dashboard layout with Tailwind v4`,
      `[${title}] Implement API controllers and NextAuth JWT session logic`,
      `[${title}] Deploy production Edge bundle to Vercel`,
    ]

    // Customize breakdown based on keywords in developer's prompt
    const lower = prompt.toLowerCase()
    if (lower.includes("twitter") || lower.includes("social") || lower.includes("clone") || lower.includes("chat")) {
      title = lower.includes("twitter") ? "Twitter / X Real-Time Clone" : "Real-Time Social Platform"
      techStack = ["Next.js 16", "TypeScript", "Tailwind v4", "Prisma ORM", "PostgreSQL", "Pusher / WebSockets"]
      folderStructure = [
        "/app/(main)/feed/page.tsx",
        "/components/TweetCard.tsx",
        "/app/api/tweets/route.ts",
        "/components/Sidebar.tsx",
        "/prisma/schema.prisma",
      ]
      milestones = [
        "Milestone 1: User Profile & NextAuth Google/GitHub OAuth",
        "Milestone 2: Infinite Tweet Feed & Real-time Like/Retweet Engine",
        "Milestone 3: Follower Graph & Notifications System",
        "Milestone 4: Vercel Edge Deployment & Performance Tuning",
      ]
      tasksToCreate = [
        `[${title}] Setup user following graph and Tweet schema in Prisma`,
        `[${title}] Build interactive feed component with optimistic UI updates`,
        `[${title}] Implement real-time notifications for likes and retweets`,
        `[${title}] Verify production build and push to GitHub`,
      ]
    } else if (lower.includes("ecommerce") || lower.includes("shop") || lower.includes("store")) {
      title = "Modern E-Commerce Storefront & Admin"
      techStack = ["Next.js 16", "TypeScript", "Stripe API", "Prisma ORM", "Tailwind CSS v4", "Zustand"]
      folderStructure = [
        "/app/(shop)/products/[id]/page.tsx",
        "/app/(admin)/dashboard/page.tsx",
        "/components/CartDrawer.tsx",
        "/app/api/checkout/stripe/route.ts",
        "/lib/stripe.ts",
      ]
      milestones = [
        "Milestone 1: Product Catalog & Dynamic Filtering Engine",
        "Milestone 2: Shopping Cart State & Stripe Payment Gateway Integration",
        "Milestone 3: Admin Inventory Management Dashboard",
        "Milestone 4: Webhook Handling & Order Email Automation",
      ]
      tasksToCreate = [
        `[${title}] Integrate Stripe Checkout sessions & webhook endpoints`,
        `[${title}] Build persistent Zustand cart drawer & product grid`,
        `[${title}] Implement admin order tracking and analytics table`,
        `[${title}] Run end-to-end payment test in Stripe test mode`,
      ]
    } else if (lower.includes("ai") || lower.includes("gpt") || lower.includes("bot") || lower.includes("llm")) {
      title = "AI GenAI Productivity Application"
      techStack = ["Next.js 16", "TypeScript", "Vercel AI SDK", "OpenAI / Gemini API", "Tailwind CSS v4", "Prisma ORM"]
      folderStructure = [
        "/app/(chat)/agent/page.tsx",
        "/app/api/ai/generate/route.ts",
        "/components/MessageBubble.tsx",
        "/lib/ai-client.ts",
        "/prisma/schema.prisma",
      ]
      milestones = [
        "Milestone 1: Vercel AI SDK Streaming Router & Prompt Engineering",
        "Milestone 2: Interactive Chat Interface & Markdown Rendering",
        "Milestone 3: User Chat History Persistence in PostgreSQL",
        "Milestone 4: Rate Limiting & Token Optimization",
      ]
      tasksToCreate = [
        `[${title}] Configure AI streaming response handler with Vercel AI SDK`,
        `[${title}] Build responsive chat UI with markdown and code syntax highlighting`,
        `[${title}] Store conversation logs and token usage in PostgreSQL`,
        `[${title}] Add copy-to-clipboard and export feature for AI responses`,
      ]
    }

    // 1. Create the Project in database
    const project = await prisma.project.create({
      data: {
        userId: user.id,
        title,
        description: `AI-Generated architectural roadmap for: "${prompt}"`,
        status: "ONGOING",
        techStack,
        notes: `### 🏗️ Recommended Folder Structure\n${folderStructure.map((f) => `- \`${f}\``).join("\n")}\n\n### 🎯 Project Milestones\n${milestones.map((m) => `- ${m}`).join("\n")}`,
        roadmap: {
          folderStructure,
          milestones,
          generatedAt: new Date().toISOString(),
        },
        progress: 15,
        deadline: new Date(Date.now() + 3600000 * 24 * 14), // 14 days default
      },
    })

    // 2. Automatically create sprint tasks linked to this user
    const createdTasks = []
    for (const taskTitle of tasksToCreate) {
      const t = await prisma.task.create({
        data: {
          userId: user.id,
          title: taskTitle,
          priority: "HIGH",
          dueDate: new Date(Date.now() + 3600000 * 24 * 3), // 3 days due
        },
      })
      createdTasks.push(t)
    }

    return NextResponse.json({
      success: true,
      project,
      createdTasks,
      message: `Successfully generated roadmap for ${title} and added ${createdTasks.length} tasks to your sprint!`,
    })
  } catch (error: any) {
    console.error("AI Project Planner error:", error)
    return NextResponse.json({ success: false, error: error.message || "Failed to generate AI project plan" }, { status: 500 })
  }
}
