import { useState } from 'react';

export const EnhancedTestimonials: React.FC = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    {
      name: 'James Davidson',
      role: 'Independent M&A Advisor',
      company: 'Davidson Advisory',
      image: 'JD',
      content: 'ApexDeliver has been a game-changer for my practice. The AI-powered financial analysis saves me hours on every deal, and the pricing makes it accessible for solo practitioners like me. I\'ve closed 5 additional deals this year thanks to the time savings.',
      metrics: {
        timeSaved: '120 hours/year',
        dealsClosed: '+5 deals',
        roi: '450%'
      },
      rating: 5
    },
    {
      name: 'Sarah Reynolds',
      role: 'VP, Growth Equity',
      company: 'Horizon Capital Partners',
      image: 'SR',
      content: 'Our team closed 30% more deals this quarter using ApexDeliver. The collaboration features and secure data rooms are best-in-class, and the ROI is undeniable. The AI deal matching has introduced us to opportunities we would have never found otherwise.',
      metrics: {
        dealsIncrease: '+30%',
        teamSize: '12 users',
        dealValue: '£180M'
      },
      rating: 5
    },
    {
      name: 'Michael Park',
      role: 'Corporate Development Director',
      company: 'TechVentures PLC',
      image: 'MP',
      content: 'The valuation suite and deal matching features are incredible. We discovered two acquisition targets through the platform that we wouldn\'t have found otherwise. The automated document generation alone has saved us thousands in legal fees.',
      metrics: {
        targetsFound: '2 acquisitions',
        legalSavings: '£25K',
        efficiency: '+40%'
      },
      rating: 5
    },
    {
      name: 'Emma Thompson',
      role: 'Managing Partner',
      company: 'Sterling M&A',
      image: 'ET',
      content: 'We switched from a £15K/year enterprise platform to ApexDeliver and couldn\'t be happier. The AI features are more advanced, the interface is more intuitive, and we\'re saving £10K annually. Best decision we made this year.',
      metrics: {
        savings: '£10K/year',
        satisfaction: '10/10',
        teamAdoption: '100%'
      },
      rating: 5
    },
    {
      name: 'David Chen',
      role: 'Principal',
      company: 'Pacific Bridge Capital',
      image: 'DC',
      content: 'The financial intelligence engine is phenomenal. It connects to our accounting systems and provides instant analysis that would take our team days to compile manually. The deal readiness scores have helped us prioritize opportunities effectively.',
      metrics: {
        analysisTime: '-85%',
        accuracy: '98%',
        dealsAnalyzed: '45+'
      },
      rating: 5
    }
  ];

  const current = testimonials[activeTestimonial];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Trusted by M&A Professionals Worldwide
          </h2>
          <p className="text-xl text-gray-600">
            Join 500+ dealmakers who have transformed their M&A workflow
          </p>
        </div>

        {/* Main Testimonial Card */}
        <div className="max-w-5xl mx-auto mb-12">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="grid md:grid-cols-3 gap-0">
              {/* Left Side - Person Info */}
              <div className="bg-gradient-to-br from-indigo-900 to-blue-900 text-white p-8 flex flex-col justify-center items-center text-center">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold mb-4 border-4 border-white/30">
                  {current.image}
                </div>
                <h3 className="text-xl font-bold mb-1">{current.name}</h3>
                <p className="text-blue-200 text-sm mb-1">{current.role}</p>
                <p className="text-blue-300 text-xs font-semibold">{current.company}</p>
                
                {/* Rating */}
                <div className="flex mt-4 space-x-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Verified Badge */}
                <div className="mt-4 flex items-center text-xs text-blue-200">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verified Customer
                </div>
              </div>

              {/* Right Side - Testimonial Content */}
              <div className="md:col-span-2 p-8">
                {/* Quote Icon */}
                <svg className="w-12 h-12 text-blue-200 mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>

                <p className="text-lg text-gray-700 leading-relaxed mb-6 italic">
                  "{current.content}"
                </p>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(current.metrics).map(([key, value]) => (
                    <div key={key} className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{value}</div>
                      <div className="text-xs text-gray-600 mt-1 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial Navigation */}
        <div className="flex justify-center items-center space-x-4 mb-12">
          <button
            onClick={() => setActiveTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
            className="p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeTestimonial ? 'bg-blue-600 w-8' : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setActiveTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))}
            className="p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Company Logos */}
        <div className="border-t border-gray-200 pt-12">
          <p className="text-center text-sm text-gray-500 mb-8">
            Trusted by professionals from leading firms
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center opacity-60">
            {['Goldman Sachs', 'KKR', 'Barclays', 'BlackRock', 'Morgan Stanley'].map((company) => (
              <div key={company} className="text-center">
                <div className="text-2xl font-bold text-gray-400">{company}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-600">500+</div>
            <div className="text-sm text-gray-600 mt-1">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-600">£50B+</div>
            <div className="text-sm text-gray-600 mt-1">Deals Managed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-600">4.9/5</div>
            <div className="text-sm text-gray-600 mt-1">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-600">99.9%</div>
            <div className="text-sm text-gray-600 mt-1">Uptime</div>
          </div>
        </div>
      </div>
    </section>
  );
};

