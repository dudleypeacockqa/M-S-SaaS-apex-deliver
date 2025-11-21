import React from "react";
import { Link } from "react-router-dom";
import { Users, ShieldCheck, Sparkles, Target } from "lucide-react";
import { MarketingLayout } from "../../components/marketing/MarketingLayout";
import { SEO } from "../../components/common/SEO";

export const AboutPage: React.FC = () => {
  return (
    <MarketingLayout>
      <SEO
        title="About 100 Days & Beyond | ApexDeliver + CapLiquify"
        description="Learn how ApexDeliver + CapLiquify empowers ambitious businesses to own their first 100 days with AI-assisted finance, deal, and revenue operations."
        ogTitle="About 100 Days & Beyond"
        ogDescription="We combine CapLiquify FP&A with ApexDeliver deal execution so ambitious teams can run every motion from a single operating system."
        ogUrl="https://100daysandbeyond.com/about"
        canonical="https://100daysandbeyond.com/about"
      />

      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50">
        <section className="pt-20 pb-16 text-center">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
              Our mission is to empower ambitious businesses to own the first 100 days and the next 1,000.
            </h1>
            <p className="mt-6 text-lg md:text-xl text-slate-600">
              Every business deserves access to the same level of financial and strategic tooling that elite PE-backed operators rely on. We pair modern product strategy with hands-on operators so every customer can turn chaos into momentum.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 shadow">
                <Users className="h-4 w-4 text-emerald-600" />
                Operator-led onboarding
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 shadow">
                <ShieldCheck className="h-4 w-4 text-indigo-600" />
                Enterprise-grade trust
              </span>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 px-4">
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold text-slate-900">Mission</h2>
              <p className="text-lg text-slate-600">
                We envision a future where every business has the financial intelligence, governance, and GTM command center previously reserved for the Fortune 500. Owning the first 100 days means compressing diligence, spinning up portals, and proving cash confidence faster than anyone else.
              </p>
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold text-slate-900">Vision</h2>
              <p className="text-lg text-slate-600">
                ApexDeliver was founded by Dudley Peacock after two decades of building pricing studios, FP&amp;A teams, and PE value-creation programs. Today we blend that operator DNA with CapLiquify automation so that ambitious teams never have to stitch point tools together again.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "User-First Design",
                  description: "We sweat the small details so CFOs, corp dev, and GTM leads can move without friction across desktop and mobile."
                },
                {
                  title: "Security & Trust",
                  description: "SOC 2 aligned controls, regional data residency, and watermarking mean your most sensitive data always has a bodyguard."
                },
                {
                  title: "Operator Expertise",
                  description: "Every workflow ships with proven playbooks, checklists, and integration help from real practitioners."
                }
              ].map((value) => (
                <div key={value.title} className="rounded-2xl bg-white p-6 shadow-md border border-slate-100">
                  <div className="flex items-center gap-3 mb-4">
                    <Target className="h-5 w-5 text-emerald-600" />
                    <h3 className="text-xl font-semibold text-slate-900">{value.title}</h3>
                  </div>
                  <p className="text-slate-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-r from-indigo-900 to-emerald-800 text-white">
          <div className="max-w-4xl mx-auto text-center px-4 space-y-6">
            <h2 className="text-3xl font-bold">Built for the first 100 days and beyond.</h2>
            <p className="text-lg text-indigo-100">
              Whether you are stabilizing cash, preparing diligence, or orchestrating GTM launches, the ApexDeliver + CapLiquify operating system keeps finance, deal, and revenue teams aligned.
            </p>
            <Link
              to="/sign-up"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3 text-lg font-semibold text-indigo-900 shadow-xl hover:-translate-y-0.5 transition"
            >
              Start Your Free Trial
              <Sparkles className="h-5 w-5 text-emerald-500" />
            </Link>
          </div>
        </section>
      </div>
    </MarketingLayout>
  );
};

export default AboutPage;
