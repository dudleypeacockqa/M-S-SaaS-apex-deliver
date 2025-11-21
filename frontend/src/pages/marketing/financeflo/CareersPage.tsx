import React from "react";
import { Helmet } from "react-helmet-async";
import { ArrowRight, Users, Zap, Globe, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const CareersPage = () => {
  return (
    <>
      <Helmet>
        <title>Careers - FinanceFlo.ai | Join Our AI-Powered Finance Team</title>
        <meta name="description" content="Join FinanceFlo.ai and help transform businesses through AI-powered finance automation. Explore career opportunities in our innovative team." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
        {/* Hero Section */}
        <section className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Build the Future of
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">
                  AI-Powered Finance
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Join our innovative team and help transform how businesses operate through cutting-edge AI technology 
                and intelligent ERP integration. Make a real impact while growing your career.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Open Positions
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Why Work With Us */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Work With Us?</h2>
              <p className="text-lg text-gray-600">
                Be part of a team that's revolutionizing business automation
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center p-6">
                <Zap className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">Innovation First</h3>
                <p className="text-gray-600">
                  Work with cutting-edge AI technology and be at the forefront of business automation innovation.
                </p>
              </div>
              <div className="text-center p-6">
                <Users className="h-12 w-12 text-teal-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">Collaborative Team</h3>
                <p className="text-gray-600">
                  Join a diverse, talented team that values collaboration, creativity, and continuous learning.
                </p>
              </div>
              <div className="text-center p-6">
                <Globe className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">Global Impact</h3>
                <p className="text-gray-600">
                  Help businesses worldwide transform their operations and achieve unprecedented growth.
                </p>
              </div>
              <div className="text-center p-6">
                <Heart className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">Work-Life Balance</h3>
                <p className="text-gray-600">
                  Enjoy flexible working arrangements, comprehensive benefits, and a culture that values well-being.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Open Positions</h2>
              <p className="text-lg text-gray-600">
                Explore exciting opportunities to grow your career with us
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Position 1 */}
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Senior AI Engineer</h3>
                <p className="text-gray-600 mb-4">
                  Lead the development of our AI-powered automation platform and machine learning algorithms.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">AI/ML</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">Python</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">Remote</span>
                </div>
                <Link
                  to="/contact"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Apply Now
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>

              {/* Position 2 */}
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-2">ERP Integration Specialist</h3>
                <p className="text-gray-600 mb-4">
                  Design and implement seamless ERP integrations for our enterprise clients.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">ERP</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">APIs</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">Hybrid</span>
                </div>
                <Link
                  to="/contact"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Apply Now
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>

              {/* Position 3 */}
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Customer Success Manager</h3>
                <p className="text-gray-600 mb-4">
                  Ensure our clients achieve maximum value from our AI-powered solutions.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">Customer Success</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">SaaS</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">London</span>
                </div>
                <Link
                  to="/contact"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Apply Now
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>

              {/* Position 4 */}
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Frontend Developer</h3>
                <p className="text-gray-600 mb-4">
                  Build beautiful, responsive user interfaces for our AI-powered platform.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">React</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">TypeScript</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">Remote</span>
                </div>
                <Link
                  to="/contact"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Apply Now
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>

              {/* Position 5 */}
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Sales Development Representative</h3>
                <p className="text-gray-600 mb-4">
                  Drive growth by identifying and qualifying new business opportunities.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">Sales</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">B2B</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">London</span>
                </div>
                <Link
                  to="/contact"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Apply Now
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>

              {/* Position 6 */}
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Data Scientist</h3>
                <p className="text-gray-600 mb-4">
                  Analyze complex datasets to drive insights and improve our AI algorithms.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">Data Science</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">Python</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">Remote</span>
                </div>
                <Link
                  to="/contact"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Apply Now
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Benefits & Perks</h2>
              <p className="text-lg text-gray-600">
                We invest in our team's success and well-being
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">💰 Competitive Salary</h3>
                <p className="text-gray-600">Market-leading compensation packages with equity options</p>
              </div>
              <div className="text-center p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">🏥 Health & Wellness</h3>
                <p className="text-gray-600">Comprehensive health insurance and wellness programs</p>
              </div>
              <div className="text-center p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">🏠 Flexible Work</h3>
                <p className="text-gray-600">Remote-first culture with flexible working hours</p>
              </div>
              <div className="text-center p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">📚 Learning Budget</h3>
                <p className="text-gray-600">Annual budget for courses, conferences, and certifications</p>
              </div>
              <div className="text-center p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">🌴 Unlimited PTO</h3>
                <p className="text-gray-600">Take the time you need to recharge and stay productive</p>
              </div>
              <div className="text-center p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">🚀 Career Growth</h3>
                <p className="text-gray-600">Clear advancement paths and mentorship opportunities</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-teal-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Don't See the Perfect Role?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              We're always looking for talented individuals to join our team. Send us your resume and let's talk!
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Get In Touch
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default CareersPage;

