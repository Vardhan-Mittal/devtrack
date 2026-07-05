import React from "react"
import Sidebar from "@/components/Sidebar"
import Navbar from "@/components/Navbar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 antialiased font-sans flex flex-col">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6 md:p-8 md:pl-72 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
