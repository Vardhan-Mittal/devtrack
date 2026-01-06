"use client"

import { signIn } from "next-auth/react"

export default function LoginPage() {
  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <button
        onClick={() => signIn("google")}
        style={{
          padding: "12px 20px",
          fontSize: "16px",
          cursor: "pointer"
        }}
      >
        Sign in with Google
      </button>
    </div>
  )
}
