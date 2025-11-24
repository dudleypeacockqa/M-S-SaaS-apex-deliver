import React from "react";
import { Link } from "react-router-dom";
import { Users, ShieldCheck, Sparkles, Target } from "lucide-react";
import { MarketingLayout } from "../../components/marketing/MarketingLayout";
import { SEO } from "../../components/common/SEO";

export const AboutPage: React.FC = () => {
  return (
    <MarketingLayout>
      <SEO
        title="About FinanceFlo | ERP Implementation + CapLiquify & ApexDeliver"
        description="FinanceFlo is the UK ERP partner behind CapLiquify FP&A and the ApexDeliver deal workspace—delivering Sage Intacct, Odoo, Microsoft, and NetSuite programs with AI consulting and managed support."
        ogTitle="About FinanceFlo"
        ogDescription="Meet the ERP implementation pods and AI consultants powering CapLiquify + ApexDeliver for CFOs, deal teams, and GTM leaders."
        ogUrl="https://financeflo.ai/about"
        canonical="https://financeflo.ai/about"
      />

      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50">
        <section className="pt-20 pb-16 text-center">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
              FinanceFlo is the ERP + AI partner behind CapLiquify FP&A and the ApexDeliver deal workspace.
            </h1>
            <p className="mt-6 text-lg md:text-xl text-slate-600">
              We implement and resell Sage Intacct, Odoo, Microsoft, and NetSuite, wire CapLiquify FP&A guardrails, deploy ApexDeliver deal, pricing, and community modules, and stay on the hook with AI copilots plus managed support so every customer owns their first 100 days and the next 1,000.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 shadow">
                <Users className="h-4 w-4 text-emerald-600" />
                ERP implementation pods
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
                Give every finance, deal, and GTM team the ERP backbone, CapLiquify insights, and ApexDeliver workflows elite PE operators use. Owning the first 100 days starts with stabilising cash, launching portals, and wiring governance on day zero.
              </p>
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold text-slate-900">Vision</h2>
              <p className="text-lg text-slate-600">
                Founded by Dudley Peacock, FinanceFlo blends two decades of ERP, FP&amp;A, and GTM playbook building with automation. CapLiquify + ApexDeliver become part of every delivery, so customers never stitch point tools or agencies together again.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "ERP + AI Operators",
                  description: "Certified Sage Intacct, Odoo, Microsoft, and NetSuite practitioners who also build Copilot and iPaaS flows."
                },
                {
                  title: "Security & Trust",
                  description: "SOC 2 aligned controls, regional data residency, watermarking, and finance-grade audit logs baked into every workspace."
                },
                {
                  title: "Customer-Ready Playbooks",
                  description: "Every rollout ships with CapLiquify dashboards, ApexDeliver templates, and checklist libraries proven inside PE value-creation plans."
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
            <h2 className="text-3xl font-bold">Built for implementation, automation, and expansion.</h2>
            <p className="text-lg text-indigo-100">
              Stabilize cash with CapLiquify, execute deals and GTM programs inside ApexDeliver, and keep FinanceFlo operators on call for every new entity, promo, and acquisition.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3 text-lg font-semibold text-indigo-900 shadow-xl hover:-translate-y-0.5 transition"
              >
                Book Implementation Blueprint
                <Sparkles className="h-5 w-5 text-emerald-500" />
              </Link>
              <Link
                to="/sign-up"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white px-8 py-3 text-lg font-semibold text-white/90 hover:bg-white/10 transition"
              >
                Start CapLiquify + ApexDeliver Trial
              </Link>
            </div>
          </div>
        </section>
      </div>
    </MarketingLayout>
  );
};

export default AboutPage;
