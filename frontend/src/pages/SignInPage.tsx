import { SignInButton, SignedIn, SignedOut } from "@clerk/clerk-react"

export const SignInPage: React.FC = () => {
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
        <SignInButton mode="modal">
          Sign in with Clerk
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <p style={{ color: "#16a34a" }}>You are already signed in.</p>
      </SignedIn>
    </section>
  )
}
