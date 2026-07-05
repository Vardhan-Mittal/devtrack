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
        { success: false, error: "Authentication required to update contest status" },
        { status: 401 }
      )
    }

    const resolvedParams = await params
    const contestId = resolvedParams.id
    const body = await request.json()
    const { intent } = body

    if (!Object.values(ContestIntent).includes(intent)) {
      return NextResponse.json(
        { success: false, error: "Invalid contest intent value provided" },
        { status: 400 }
      )
    }

    const updated = await prisma.userContestStatus.upsert({
      where: {
        userId_contestId: {
          userId: session.user.id,
          contestId,
        },
      },
      update: {
        intent: intent as ContestIntent,
      },
      create: {
        userId: session.user.id,
        contestId,
        intent: intent as ContestIntent,
      },
    })

    return NextResponse.json({
      success: true,
      status: updated,
      message: `Contest marked as ${intent}`,
    })
  } catch (error: any) {
    console.error("❌ Error updating contest status:", error.message)
    return NextResponse.json(
      { success: false, error: "Failed to update contest status" },
      { status: 500 }
    )
  }
}
