import { MarketingLayout } from "@/components/marketing/MarketingLayout"
import { SEO } from "@/components/common/SEO"
import { Link } from "react-router-dom"

const platformTiers = [
  {
    name: "CapLiquify FP&A",
    price: "£598 / month",
    setup: "£2,500 onboarding",
    highlights: [
      "13-week cash + working-capital cockpit",
      "Automated ledger normalization",
      "FinanceOps dashboards + variance alerts",
    ],
  },
  {
    name: "FinanceFlo Platform",
    price: "£1,598 / month",
    setup: "£7,500 onboarding",
    highlights: [
      "Everything in CapLiquify",
      "ApexDeliver deal rooms + valuations",
      "Document automation + workflow library",
    ],
  },
  {
    name: "Enterprise Suite",
    price: "Custom",
    setup: "Bespoke enablement",
    highlights: [
      "Multi-entity + master admin controls",
      "Private community + portal toolkit",
      "Operator-led deployment + integrations",
    ],
  },
]

const platformAddOns = [
  {
    name: "Sales & Promotion Pricing Studio",
    description: "Advanced pricing guardrails, promo modeling, and approvals tied into CapLiquify + ApexDeliver workspaces.",
  },
  {
    name: "Event & Content Accelerator",
    description: "Turnkey campaigns, event templates, and podcast workflows connected to the FinanceFlo CRM + community layer.",
  },
  {
    name: "Managed Implementations",
    description: "FinanceFlo operators embed for 6-12 weeks to deliver process design, data hygiene, and system integrations.",
  },
]

export default function PlatformPricingPage() {
  return (
    <MarketingLayout>
      <SEO
        title="Platform Pricing | FinanceFlo"
        description="Compare CapLiquify FP&A, the FinanceFlo Platform, and Enterprise bundles. Choose the operating system that fits your finance and deal team."
        ogTitle="FinanceFlo Platform Pricing"
        ogDescription="Side-by-side pricing for CapLiquify FP&A, FinanceFlo Platform, and Enterprise bundles with add-ons for pricing, events, and managed services."
        ogUrl="https://financeflo.ai/pricing/platform"
        canonical="https://financeflo.ai/pricing/platform"
      />
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-900 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="uppercase tracking-[0.3em] text-sm font-semibold text-emerald-300 mb-4">
            Platform Pricing
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Start with CapLiquify, Scale into FinanceFlo</h1>
          <p className="text-xl text-indigo-100">
            Land the finance foundation, then unlock the complete ApexDeliver experience with master admin controls, data rooms,
            and pricing studios in one stack.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            {platformTiers.map((tier) => (
              <div key={tier.name} className="border border-gray-200 rounded-3xl p-8 shadow-lg flex flex-col">
                <p className="text-sm font-semibold text-indigo-700 uppercase tracking-wide">{tier.name}</p>
                <h2 className="text-3xl font-bold text-gray-900 mt-2">{tier.price}</h2>
                <p className="text-sm text-gray-500 mt-1">{tier.setup}</p>
                <ul className="mt-6 space-y-3 text-gray-700 flex-grow">
                  {tier.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-2">
                      <span className="text-emerald-600 mt-1">●</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/contact"
                  className="mt-8 inline-flex justify-center px-6 py-3 rounded-xl bg-indigo-900 text-white font-semibold hover:bg-indigo-800 transition"
                >
                  Talk to sales
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Add-On Programs</h2>
            <p className="text-gray-600 mt-2">
              Extend FinanceFlo with operator-led studios for pricing, events, and managed implementations.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {platformAddOns.map((addon) => (
              <div key={addon.name} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold text-indigo-700 uppercase tracking-wide mb-2">{addon.name}</p>
                <p className="text-gray-700 text-sm leading-relaxed">{addon.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MarketingLayout>
  )
}

