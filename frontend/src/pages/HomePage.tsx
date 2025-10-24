export const HomePage: React.FC = () => {
  return (
    <section aria-labelledby="home-heading" style={{ display: "grid", gap: "1.5rem" }}>
      <header>
        <h1 id="home-heading" style={{ fontSize: "2rem", fontWeight: 700 }}>M&A Intelligence Platform</h1>
        <p style={{ color: "#475569", maxWidth: "60ch" }}>
          ApexDeliver centralizes your deal flow, diligence workspaces, and collaboration tools so you can
          move faster on every transaction.
        </p>
      </header>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <a
          href="/sign-up"
          style={{
            backgroundColor: "#312e81",
            color: "#ffffff",
            padding: "0.75rem 1.5rem",
            borderRadius: "0.5rem",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          Create your account
        </a>
        <a
          href="/sign-in"
          style={{
            backgroundColor: "#ffffff",
            color: "#312e81",
            border: "1px solid #312e81",
            padding: "0.75rem 1.5rem",
            borderRadius: "0.5rem",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          Sign in
        </a>
      </div>
    </section>
  )
}
