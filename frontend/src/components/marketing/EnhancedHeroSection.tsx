/**
 * Enhanced Hero Section - CapLiquify FP&A + ApexDeliver story
 */

import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Button } from '../ui'
import { trackCtaClick } from '../../lib/analytics'
import { DashboardMockup } from './DashboardMockup'

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Portfolio CFO, Apex Capital',
    quote: 'CapLiquify replaced 17 spreadsheets and gave the partners a real forecast they trust.',
  },
  {
    name: 'James Morrison',
    role: 'VP Finance, TechVentures',
    quote: 'We surface working-capital issues weeks sooner and walk into diligence prepared.',
  },
  {
    name: 'Emma Rodriguez',
    role: 'Partner, Sterling PE',
    quote: 'Two-hour weekly updates instead of a full finance day. It scales with every new acquisition.',
  },
]

const trustIndicators = [
  '95%+ forecast accuracy',
  '2-hour weekly update',
  'Rolling 13-week cash view',
  'SOC 2 • GDPR • ISO 27001',
]

const stats = [
  { value: '95.8%', label: 'Cash forecast accuracy', detail: '13-week rolling variance vs. actuals' },
  { value: '£2.8M', label: 'Working capital unlocked', detail: 'Average per portfolio in 12 months' },
  { value: '12 hrs', label: 'Finance hours saved weekly', detail: 'Manual spreadsheet cleanup eliminated' },
]

const roiChips = [
  { label: '450+ finance & deal teams', color: 'from-emerald-600 to-green-400' },
  { label: '66% reduction in manual prep', color: 'from-blue-500 to-cyan-400' },
  { label: '500% average ROI', color: 'from-purple-500 to-pink-400' },
]

const integrations = ['Sage Intacct', 'Odoo', 'CSV Imports', 'ApexDeliver Workspace']

export const EnhancedHeroSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.35'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            animation: 'grid-drift 30s linear infinite',
          }}
        />
      </div>
      <div className="absolute top-20 -left-20 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 -right-20 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-emerald-700/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className={`text-center lg:text-left space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 shadow-lg">
              <span className="text-sm font-semibold text-blue-100">CapLiquify FP&A + ApexDeliver Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              13-Week Cash Forecasting, Working Capital & Deal Execution in One Stack
            </h1>

            <p className="text-xl sm:text-2xl text-blue-100 max-w-3xl mx-auto lg:mx-0">
              CapLiquify FP&A delivers banker-grade forecasts, variance analysis, and scenario planning. Upgrade into ApexDeliver for secure data rooms, valuations, and master admin oversight—starting at{' '}
              <span className="font-bold text-white">£598/mo + £2,500 setup</span>.
            </p>

            <div className="grid sm:grid-cols-3 gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-4 shadow-xl">
                  <div className="text-3xl font-extrabold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-blue-200 font-semibold">{stat.label}</div>
                  <div className="text-xs text-blue-200/80 mt-1">{stat.detail}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/sign-up" className="group" onClick={() => trackCtaClick('start-free-trial', 'hero')}>
                <Button
                  variant="primary"
                  btnSize="lg"
                  className="w-full sm:w-auto text-lg px-8 py-6 shadow-2xl hover:shadow-blue-500/50 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                >
                  Start Free 14-Day Trial
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              </Link>

              <Link to="/pricing" className="group" onClick={() => trackCtaClick('view-pricing', 'hero')}>
                <Button
                  variant="ghost"
                  btnSize="lg"
                  className="w-full sm:w-auto text-lg px-8 py-6 bg-white/10 backdrop-blur-sm border-2 border-white/30 hover:bg-white/20"
                >
                  See Pricing & Setup
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 text-blue-200 text-sm">
              {trustIndicators.map((label) => (
                <div key={label} className="inline-flex items-center gap-2 px-3 py-2 bg-white/5 rounded-full border border-white/10">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span>{label}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
              {roiChips.map((chip) => (
                <div
                  key={chip.label}
                  className={`px-4 py-2 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${chip.color} shadow-lg shadow-black/10`}
                >
                  {chip.label}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 text-blue-200/80 text-xs uppercase tracking-wide">
              {integrations.map((name) => (
                <div key={name} className="px-3 py-1 bg-white/5 rounded-full border border-white/5">
                  {name}
                </div>
              ))}
            </div>

            <div className="relative h-20 overflow-hidden">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.name}
                  className={`absolute inset-0 transition-all duration-500 ${index === activeTestimonial ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                >
                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                    <p className="text-sm text-blue-100 italic mb-2">"{testimonial.quote}"</p>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-600" />
                      <div>
                        <div className="text-xs font-semibold text-white">{testimonial.name}</div>
                        <div className="text-xs text-blue-300">{testimonial.role}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <DashboardMockup />
            <div className="absolute -bottom-10 left-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex flex-wrap gap-4">
              {[
                { title: 'Portfolio CFO Mode', detail: 'Roll-ups across every entity in seconds' },
                { title: 'Scenario Builder', detail: 'Drag revenue or cost drivers, export to deck' },
              ].map((item) => (
                <div key={item.title} className="flex-1 min-w-[180px]">
                  <div className="text-sm font-semibold text-white">{item.title}</div>
                  <div className="text-xs text-blue-200">{item.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-blue-200 mb-4">Join 500+ deal teams already standardising on CapLiquify + ApexDeliver</p>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {['Brookline Partners', 'Northwind Equity', 'Seven Peaks PE', 'Oriant Capital', 'Fjord Holdings'].map((company) => (
              <div key={company} className="px-4 py-2 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 text-xs text-blue-200">
                {company}
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-white/50 rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes grid-drift {
          from { transform: translate(0, 0); }
          to { transform: translate(60px, 60px); }
        }
      `}</style>
    </section>
  )
}
