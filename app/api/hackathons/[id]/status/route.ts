import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ContestIntent } from "@prisma/client"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Authentication required to update hackathon status" },
        { status: 401 }
      )
    }

    const resolvedParams = await params
    const hackathonId = resolvedParams.id
    const body = await request.json()
    const { intent } = body

    if (!Object.values(ContestIntent).includes(intent)) {
      return NextResponse.json(
        { success: false, error: "Invalid intent value provided" },
        { status: 400 }
      )
    }

    const updated = await prisma.userHackathonStatus.upsert({
      where: {
        userId_hackathonId: {
          userId: session.user.id,
          hackathonId,
        },
      },
      update: {
        intent: intent as ContestIntent,
      },
      create: {
        userId: session.user.id,
        hackathonId,
        intent: intent as ContestIntent,
      },
    })

    return NextResponse.json({
      success: true,
      status: updated,
      message: `Hackathon marked as ${intent}`,
    })
  } catch (error: any) {
    console.error("❌ Error updating hackathon status:", error.message)
    return NextResponse.json(
      { success: false, error: "Failed to update hackathon intent" },
      { status: 500 }
    )
  }
}
