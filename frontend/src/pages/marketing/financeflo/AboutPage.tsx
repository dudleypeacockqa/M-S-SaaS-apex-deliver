import React from "react";
import { Helmet } from "react-helmet-async";
import { ArrowRight, Users, Target, Award, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const AboutPage = () => {
  return (
    <>
      <Helmet>
        <title>About Us - FinanceFlo.ai | AI-Powered Finance Automation</title>
        <meta name="description" content="Learn about FinanceFlo.ai's mission to transform businesses through AI-powered finance automation and intelligent ERP integration." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
        {/* Hero Section */}
        <section className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Transforming Business Through
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">
                  AI-Powered Innovation
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                We're on a mission to revolutionize how businesses operate by combining cutting-edge AI technology 
                with intelligent ERP integration, delivering measurable results for finance teams across the UK.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
                <p className="text-lg text-gray-600 mb-6">
                  To empower businesses with AI-driven finance automation that transforms operations, 
                  increases efficiency, and drives sustainable growth. We believe every business deserves 
                  access to enterprise-level AI capabilities, regardless of size or industry.
                </p>
                <div className="flex items-center space-x-4">
                  <Target className="h-8 w-8 text-blue-600" />
                  <span className="text-lg font-semibold text-gray-900">
                    500+ Successful Implementations
                  </span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-100 to-teal-100 p-8 rounded-2xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
                <p className="text-gray-700">
                  To become the leading AI-ERP integration platform in the UK, setting the standard 
                  for intelligent business automation and helping organizations achieve unprecedented 
                  levels of operational excellence.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Company Stats */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Impact</h2>
              <p className="text-lg text-gray-600">
                Delivering measurable results for businesses across the UK
              </p>
            </div>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
                <div className="text-gray-600">Businesses Transformed</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-teal-600 mb-2">300%</div>
                <div className="text-gray-600">Average ROI Increase</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">80%</div>
                <div className="text-gray-600">Time Saved</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-600 mb-2">98%</div>
                <div className="text-gray-600">Customer Satisfaction</div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
              <p className="text-lg text-gray-600">
                The principles that guide everything we do
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">Customer-Centric</h3>
                <p className="text-gray-600">
                  Every decision we make is driven by our commitment to delivering exceptional 
                  value and results for our customers.
                </p>
              </div>
              <div className="text-center p-6">
                <Award className="h-12 w-12 text-teal-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">Excellence</h3>
                <p className="text-gray-600">
                  We strive for excellence in everything we do, from our technology solutions 
                  to our customer service and support.
                </p>
              </div>
              <div className="text-center p-6">
                <Globe className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">Innovation</h3>
                <p className="text-gray-600">
                  We continuously push the boundaries of what's possible with AI and ERP 
                  integration to stay ahead of the curve.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-teal-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join 500+ businesses that have revolutionized their operations with our AI-powered platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/assessment"
                className="inline-flex items-center px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Start Free Assessment
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AboutPage;

