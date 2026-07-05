import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const resolvedParams = await params
    const id = resolvedParams.id
    const body = await request.json()
    const { completed, title, priority } = body

    const updated = await prisma.task.update({
      where: { id, userId: session.user.id },
      data: {
        ...(completed !== undefined && { completed }),
        ...(title !== undefined && { title }),
        ...(priority !== undefined && { priority }),
      },
    })

    return NextResponse.json({ success: true, task: updated })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Failed to update task" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const resolvedParams = await params
    const id = resolvedParams.id

    await prisma.task.delete({
      where: { id, userId: session.user.id },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Failed to delete task" }, { status: 500 })
  }
}
