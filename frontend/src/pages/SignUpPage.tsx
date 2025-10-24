import { SignUpButton } from "@clerk/clerk-react"

export const SignUpPage: React.FC = () => {
  return (
    <section aria-labelledby="sign-up-heading" style={{ display: "grid", gap: "1.5rem" }}>
      <header>
        <h1 id="sign-up-heading" style={{ fontSize: "2rem", fontWeight: 700 }}>
          Create your ApexDeliver account
        </h1>
        <p style={{ color: "#475569", maxWidth: "60ch" }}>
          Join the M&A Intelligence Platform to streamline diligence, deal sourcing, and collaboration.
        </p>
      </header>

      <SignUpButton mode="modal">
        Start your trial
      </SignUpButton>
    </section>
  )
}
