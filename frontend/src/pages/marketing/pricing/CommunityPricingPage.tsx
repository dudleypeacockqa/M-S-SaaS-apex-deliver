import { MarketingLayout } from "@/components/marketing/MarketingLayout"
import { SEO } from "@/components/common/SEO"
import { Link } from "react-router-dom"

const communityBundles = [
  {
    title: "Community Leader",
    price: "£2,997 / month",
    includes: [
      "Private member portal + partner marketplace",
      "Event calendar, sponsor tracking, and ticketing",
      "Podcast + content studio automations",
    ],
  },
  {
    title: "Content & Media Collective",
    price: "£1,250 / month",
    includes: [
      "Podcast tooling + Riverside integration",
      "Newsletter + blog publishing workflow",
      "Guest CRM + campaign tagging",
    ],
  },
  {
    title: "Community Jumpstart (90 Days)",
    price: "£9,500 program",
    includes: [
      "FinanceFlo operator embedded for 13 weeks",
      "Community positioning + sponsor assets",
      "Train-the-trainer for portal + event tooling",
    ],
  },
]

export default function CommunityPricingPage() {
  return (
    <MarketingLayout>
      <SEO
        title="Community Pricing | FinanceFlo"
        description="Detailed pricing for Community Leader, media, and event bundles. Launch member portals, podcasts, and sponsor programs from the FinanceFlo OS."
        ogTitle="FinanceFlo Community Pricing"
        ogDescription="Compare Community Leader, media collective, and jumpstart programs to launch member portals, podcast networks, and sponsor pipelines."
        ogUrl="https://financeflo.ai/pricing/community"
        canonical="https://financeflo.ai/pricing/community"
      />
      <section className="bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="uppercase tracking-[0.3em] text-sm font-semibold text-emerald-300 mb-4">
            Community & Media Pricing
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Monetize Sponsors, Content, and Memberships</h1>
          <p className="text-xl text-indigo-100">
            Bundle portals, podcast tooling, events, and sponsor workflows so every campaign stays tied to finance and deal
            operations.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-8 md:grid-cols-3">
          {communityBundles.map((bundle) => (
            <div key={bundle.title} className="border border-gray-200 rounded-3xl p-8 shadow-lg flex flex-col">
              <p className="text-sm font-semibold text-purple-700 uppercase tracking-wide">{bundle.title}</p>
              <h2 className="text-3xl font-bold text-gray-900 mt-3">{bundle.price}</h2>
              <ul className="mt-6 space-y-3 text-gray-700 flex-grow">
                {bundle.includes.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-1">●</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/contact"
                className="mt-8 inline-flex justify-center px-6 py-3 rounded-xl bg-purple-900 text-white font-semibold hover:bg-purple-800 transition"
              >
                Book a sponsor demo
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Everything Connects to FinanceFlo</h2>
            <p className="text-gray-600 mt-2">
              Community data, event performance, and sponsor revenue roll into CapLiquify + ApexDeliver dashboards so you can see
              the ROI from top-of-funnel through deal close.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm">
              <p className="text-sm font-semibold text-indigo-700 uppercase tracking-wide mb-2">Included Automations</p>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>🎙 Podcast publishing workflow with guest CRM sync</li>
                <li>🎫 Event ticketing + sponsor reporting dashboards</li>
                <li>📧 Newsletter + blog syndication calendar tied to Slack</li>
              </ul>
            </div>
            <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm">
              <p className="text-sm font-semibold text-indigo-700 uppercase tracking-wide mb-2">Services Available</p>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>👥 Community launch playbook + facilitator training</li>
                <li>💼 Sponsor packaging, pricing, and sales collateral</li>
                <li>🧠 Operator drop-in sessions for GTM + content strategy</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </MarketingLayout>
  )
}

