import { NextResponse } from "next/server"
import { evaluateAndSendReminders } from "@/lib/reminders/evaluator"

export async function GET() {
  try {
    const result = await evaluateAndSendReminders()
    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

export async function POST() {
  try {
    const result = await evaluateAndSendReminders()
    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
