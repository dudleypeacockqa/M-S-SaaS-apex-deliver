export const DashboardPage: React.FC = () => {
  return (
    <section aria-labelledby="dashboard-heading" style={{ display: "grid", gap: "1.25rem" }}>
      <header>
        <h1 id="dashboard-heading" style={{ fontSize: "2rem", fontWeight: 700 }}>
          Dashboard
        </h1>
        <p style={{ color: "#475569", maxWidth: "60ch" }}>
          Welcome back. Review your current deals and next actions.
        </p>
      </header>

      <div style={{ display: "grid", gap: "1rem" }}>
        <article style={{ backgroundColor: "#ffffff", padding: "1rem", borderRadius: "0.75rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 600 }}>Recent activity</h2>
          <p style={{ color: "#64748b" }}>No activity recorded yet.</p>
        </article>
      </div>
    </section>
  )
}
