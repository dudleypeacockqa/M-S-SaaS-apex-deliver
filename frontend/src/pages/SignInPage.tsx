import { useNavigate } from "react-router-dom"
import { SignInButton, SignedIn, SignedOut } from "@clerk/clerk-react"

export const SignInPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <section aria-labelledby="sign-in-heading" style={{ display: "grid", gap: "1.5rem" }}>
      <header>
        <h1 id="sign-in-heading" style={{ fontSize: "2rem", fontWeight: 700 }}>
          Sign in to ApexDeliver
        </h1>
        <p style={{ color: "#475569", maxWidth: "60ch" }}>
          Access secure deal workspaces, data rooms, and automation tools.
        </p>
      </header>

      <SignedOut>
        <SignInButton fallbackRedirectUrl="/dashboard" signUpFallbackRedirectUrl="/dashboard">
          Sign in with Clerk
        </SignInButton>
        <button
          type="button"
          onClick={() => navigate("/sign-up")}
          style={{
            marginTop: "1rem",
            color: "#312e81",
            background: "none",
            border: "none",
            fontWeight: 600,
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          Need an account? Sign up
        </button>
      </SignedOut>

      <SignedIn>
        <p style={{ color: "#16a34a" }}>You are already signed in.</p>
      </SignedIn>
    </section>
  )
}
