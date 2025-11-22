import { MarketingLayout } from "@/components/marketing/MarketingLayout"
import { SEO } from "@/components/common/SEO"
import { Link } from "react-router-dom"

const servicePackages = [
  {
    name: "Operator-in-Residence",
    price: "From £12,500 / month",
    duration: "12-week minimum",
    deliverables: [
      "FinanceFlo deployment squad (FP&A + RevOps)",
      "Process mapping, integrations, and data hygiene",
      "Executive coaching + reporting cadences",
    ],
  },
  {
    name: "Transformation Sprint",
    price: "£25,000 fixed",
    duration: "8-week engagement",
    deliverables: [
      "Valuation + diligence room readiness",
      "Sales & Promotion Pricing studio setup",
      "Community + event GTM plan",
    ],
  },
  {
    name: "Advisory Retainer",
    price: "£5,000 / month",
    duration: "6-month retainer",
    deliverables: [
      "Monthly board + lender packs",
      "Deal desk + pricing reviews",
      "Quarterly playbook refresh",
    ],
  },
]

export default function ServicesPricingPage() {
  return (
    <MarketingLayout>
      <SEO
        title="Services Pricing | FinanceFlo"
        description="See how FinanceFlo operators embed alongside your team. Compare operator-in-residence, transformation sprints, and advisory retainers."
        ogTitle="FinanceFlo Services Pricing"
        ogDescription="Operator-in-residence, transformation sprints, and advisory retainers that keep FinanceFlo humming inside your organization."
        ogUrl="https://100daysandbeyond.com/pricing/services"
        canonical="https://100daysandbeyond.com/pricing/services"
      />
      <section className="bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="uppercase tracking-[0.3em] text-sm font-semibold text-emerald-300 mb-4">
            Operator Services
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Work With the Team That Built FinanceFlo</h1>
          <p className="text-xl text-indigo-100">
            Our operators embed with finance, deal, and GTM leaders to implement the playbooks that inspired CapLiquify +
            ApexDeliver.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-8 md:grid-cols-3">
          {servicePackages.map((pkg) => (
            <div key={pkg.name} className="border border-gray-200 rounded-3xl p-8 shadow-xl flex flex-col">
              <p className="text-sm font-semibold text-indigo-700 uppercase tracking-wide">{pkg.name}</p>
              <h2 className="text-3xl font-bold text-gray-900 mt-2">{pkg.price}</h2>
              <p className="text-sm text-gray-500 mt-1">{pkg.duration}</p>
              <ul className="mt-6 space-y-3 text-gray-700 flex-grow">
                {pkg.deliverables.map((deliverable) => (
                  <li key={deliverable} className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-1">●</span>
                    <span>{deliverable}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/contact"
                className="mt-8 inline-flex justify-center px-6 py-3 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition"
              >
                Schedule scope call
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">How Services Connect to the Platform</h2>
            <p className="text-gray-600 mt-2">
              Every engagement drops playbooks, automations, and dashboards directly into your FinanceFlo workspace so the team
              can run independently after we leave.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm">
              <p className="text-sm font-semibold text-indigo-700 uppercase tracking-wide mb-2">Operators Cover</p>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>📊 FP&A + RevOps blueprinting</li>
                <li>📁 Deal desk + diligence runbooks</li>
                <li>🎙 Content, community, and demand playbooks</li>
              </ul>
            </div>
            <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm">
              <p className="text-sm font-semibold text-indigo-700 uppercase tracking-wide mb-2">Artifact Drop-Off</p>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>🧾 SOPs, Loom walkthroughs, and automation recipes</li>
                <li>🛠  Integrations + dashboards wired inside FinanceFlo</li>
                <li>👥  Enablement sessions + quarterly refresh credits</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </MarketingLayout>
  )
}

