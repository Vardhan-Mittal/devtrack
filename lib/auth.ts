import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET || "devtrack-secret-key-change-in-prod",
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID || process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_SECRET || process.env.GITHUB_CLIENT_SECRET || "",
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email || `${profile.login}@users.noreply.github.com`,
          image: profile.avatar_url,
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub

        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.sub },
            select: {
              cfHandle: true,
              lcUsername: true,
              unstopProfile: true,
              githubUsername: true,
              remindersOn: true,
              reminderMins: true,
            },
          })
          if (dbUser) {
            session.user = {
              ...session.user,
              ...dbUser,
            }
          }
        } catch (error) {
          console.error("Error fetching user profile in session callback:", error)
        }
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
      }
      return token
    },
  },
  events: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "github" && profile) {
        const login = (profile as any).login || (profile as any).preferred_username
        if (login && user?.id) {
          try {
            await prisma.user.update({
              where: { id: user.id },
              data: { githubUsername: login },
            })
          } catch (e) {
            console.error("Failed to link githubUsername:", e)
          }
        }
      }
    },
  },
  debug: false,
}
