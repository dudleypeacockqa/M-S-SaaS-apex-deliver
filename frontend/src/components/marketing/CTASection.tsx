import { Link } from 'react-router-dom'
import { trackCtaClick } from '../../lib/analytics'

export const CTASection: React.FC = () => {
  return (
    <section className="bg-indigo-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Ready to Transform Your M&A Workflow?
        </h2>
        <p className="text-xl text-indigo-200 mb-8 max-w-2xl mx-auto">
          Join hundreds of dealmakers who are closing deals faster with AI-powered intelligence and professional-grade tools.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/sign-up"
            className="bg-yellow-400 text-indigo-900 px-8 py-4 rounded-lg text-lg font-bold hover:bg-yellow-300 transition-all transform hover:scale-105 shadow-lg"
            onClick={() => trackCtaClick('start-free-trial', 'cta-section')}
          >
            Start Your Free Trial
          </Link>
          <Link
            to="/contact"
            className="bg-white/10 backdrop-blur-sm text-white border-2 border-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/20 transition-all"
            onClick={() => trackCtaClick('schedule-demo', 'cta-section')}
          >
            Schedule a Demo
          </Link>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-indigo-300">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-700/60">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c1.656 0 3-.895 3-2s-1.344-2-3-2-3 .895-3 2 1.344 2 3 2z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 20v-1a7 7 0 0114 0v1" />
              </svg>
            </span>
            <span>Bank-Grade Security</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-700/60">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12l4 4L19 6" />
              </svg>
            </span>
            <span>GDPR Compliant</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-700/60">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8h.01" />
              </svg>
            </span>
            <span>No Credit Card Required</span>
          </div>
        </div>
      </div>
    </section>
  )
}
