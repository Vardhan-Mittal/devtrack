import "next-auth"
import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      cfHandle?: string | null
      lcUsername?: string | null
      ccHandle?: string | null
      unstopProfile?: string | null
      githubUsername?: string | null
      remindersOn?: boolean
      reminderMins?: number
    } & DefaultSession["user"]
  }
}
