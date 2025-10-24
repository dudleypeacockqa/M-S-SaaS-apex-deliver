import { Link, Outlet } from "react-router-dom"
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react"

export const RootLayout = () => {
  const { user } = useUser()

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", color: "#0f172a" }}>
      <header
        style={{
          borderBottom: "1px solid #e2e8f0",
          backgroundColor: "#ffffff",
        }}
      >
        <div
          style={{
            maxWidth: "960px",
            margin: "0 auto",
            padding: "1rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <Link
            to="/"
            style={{
              fontWeight: 700,
              fontSize: "1.25rem",
              color: "#312e81",
              textDecoration: "none",
            }}
          >
            ApexDeliver
          </Link>

          <nav style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Link
              to="/"
              style={{ color: "#475569", textDecoration: "none", fontWeight: 500 }}
            >
              Home
            </Link>
            <Link
              to="/dashboard"
              style={{ color: "#475569", textDecoration: "none", fontWeight: 500 }}
            >
              Dashboard
            </Link>
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <SignedOut>
              <SignInButton mode="modal">
                Sign In
              </SignInButton>
              <Link
                to="/sign-up"
                style={{
                  color: "#312e81",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                Create account
              </Link>
            </SignedOut>

            <SignedIn>
              <span style={{ color: "#1f2937", fontWeight: 600 }}>
                {user?.firstName ?? "Account"}
              </span>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: "960px", margin: "0 auto", padding: "2rem 1rem" }}>
        <Outlet />
      </main>
    </div>
  )
}


