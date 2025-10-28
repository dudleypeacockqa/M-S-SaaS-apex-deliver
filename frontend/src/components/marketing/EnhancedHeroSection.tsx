/**
 * Enhanced Hero Section - Enterprise Edition
 * World-class hero section with enterprise polish and conversion optimization
 */

import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Button, Badge } from '../ui'

export const EnhancedHeroSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  useEffect(() => {
    setIsVisible(true)

    // Rotate testimonials
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % 3)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const testimonials = [
    { name: 'Sarah Chen', role: 'Managing Director, Apex Capital', quote: 'Closed 3 deals in Q1 alone. ApexDeliver pays for itself.' },
    { name: 'James Morrison', role: 'VP M&A, TechVentures', quote: 'Finally, a platform that understands the modern deal flow.' },
    { name: 'Emma Rodriguez', role: 'Partner, Sterling PE', quote: 'Cut our due diligence time by 60%. Game changer.' },
  ]

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            animation: 'grid-drift 30s linear infinite',
          }}
        />
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-20 -left-20 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 -right-20 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Hero Content */}
          <div className={`text-center lg:text-left space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 shadow-lg">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 border-2 border-white" />
                ))}
              </div>
              <span className="text-sm font-medium text-blue-100">Trusted by 500+ M&A professionals</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
              Close Deals{' '}
              <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400">
                  70% Faster
                </span>
                <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 200 8" fill="none">
                  <path d="M0 4C50 2 100 6 200 4" stroke="url(#gradient)" strokeWidth="3" />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#60a5fa" />
                      <stop offset="50%" stopColor="#22d3ee" />
                      <stop offset="100%" stopColor="#14b8a6" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h1>

            {/* Value Proposition */}
            <p className="text-xl sm:text-2xl text-blue-100 leading-relaxed max-w-2xl">
              The only <span className="font-bold text-white">AI-powered M&A platform</span> that combines deal flow management, financial intelligence, and secure collaboration.{' '}
              <span className="font-bold text-yellow-300">Starting at £279/month</span> vs. £10,000+ enterprise tools.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/sign-up" className="group">
                <Button variant="primary" btnSize="lg" className="w-full sm:w-auto text-lg px-8 py-6 shadow-2xl hover:shadow-blue-500/50 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                  Start Free 14-Day Trial
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              </Link>

              <Link to="/pricing" className="group">
                <Button variant="ghost" btnSize="lg" className="w-full sm:w-auto text-lg px-8 py-6 bg-white/10 backdrop-blur-sm border-2 border-white/30 hover:bg-white/20">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                  </svg>
                  Watch 2-Min Demo
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-blue-200 text-sm">
              {[
                { icon: '✓', text: 'No credit card required' },
                { icon: '✓', text: '5-minute setup' },
                { icon: '✓', text: 'Cancel anytime' },
                { icon: '✓', text: 'GDPR compliant' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-xs font-bold">
                    {item.icon}
                  </div>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>

            {/* Social Proof - Rotating Testimonials */}
            <div className="relative h-20 overflow-hidden">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-500 ${
                    index === activeTestimonial ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
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

          {/* Right Column - Interactive Dashboard Preview */}
          <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Floating Stats Cards */}
            <div className="space-y-4">
              {/* Main Dashboard Card */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">Your Pipeline Overview</h3>
                  <Badge variant="success">Live</Badge>
                </div>

                {/* Pipeline Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[
                    { label: 'Active Deals', value: '847', change: '+12%' },
                    { label: 'Total Value', value: '£50B', change: '+23%' },
                    { label: 'Close Rate', value: '32%', change: '+8%' },
                    { label: 'Avg. Cycle', value: '45d', change: '-15%' },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-gradient-to-br from-blue-600/40 to-purple-600/40 rounded-lg p-4">
                      <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                      <div className="text-xs text-blue-200 mb-2">{stat.label}</div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-green-400 font-semibold">{stat.change}</span>
                        <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" transform="rotate(180 10 10)" />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Deal Pipeline Visualization */}
                <div className="bg-gradient-to-br from-blue-700 to-indigo-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-white">Deal Stages</span>
                    <span className="text-xs text-blue-300">Real-time</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { stage: 'Sourcing', count: 12, value: '45.2M', color: 'bg-blue-500' },
                      { stage: 'Due Diligence', count: 8, value: '82.5M', color: 'bg-purple-500' },
                      { stage: 'Negotiation', count: 5, value: '124M', color: 'bg-yellow-500' },
                      { stage: 'Closing', count: 3, value: '95.7M', color: 'bg-green-500' },
                    ].map((stage) => (
                      <div key={stage.stage} className="bg-white/20 rounded-lg p-3 text-center hover:bg-white/30 transition-colors">
                        <div className="text-xs text-blue-100 mb-2 truncate">{stage.stage}</div>
                        <div className="text-2xl font-bold text-white mb-1">{stage.count}</div>
                        <div className={`h-1 ${stage.color} rounded-full mb-2`} />
                        <div className="text-xs text-blue-200">£{stage.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Feature Highlights */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: '🤖', label: 'AI Insights', desc: 'Powered by GPT-4' },
                  { icon: '📊', label: 'Analytics', desc: 'Real-time data' },
                  { icon: '🔒', label: 'Secure', desc: 'Bank-grade encryption' },
                  { icon: '⚡', label: 'Fast', desc: 'Sub-second responses' },
                ].map((feature) => (
                  <div key={feature.label} className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors">
                    <div className="text-3xl mb-2">{feature.icon}</div>
                    <div className="text-sm font-semibold text-white">{feature.label}</div>
                    <div className="text-xs text-blue-300">{feature.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -top-6 -right-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-5 py-3 rounded-full font-bold text-sm shadow-2xl animate-bounce">
              💰 Save £9,721/year
            </div>
          </div>
        </div>

        {/* Bottom CTA Bar */}
        <div className="mt-16 text-center">
          <p className="text-blue-200 mb-4">Join 500+ M&A professionals already using ApexDeliver</p>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {['Goldman Sachs', 'Morgan Stanley', 'JP Morgan', 'Deutsche Bank', 'Barclays'].map((company) => (
              <div key={company} className="px-4 py-2 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 text-xs text-blue-200">
                {company}
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
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
