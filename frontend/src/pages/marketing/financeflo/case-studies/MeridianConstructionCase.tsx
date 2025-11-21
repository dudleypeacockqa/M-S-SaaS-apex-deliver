import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Navigation } from '../../components/Navigation';
import { Footer } from '../../components/Footer';
import { ArrowLeft, Building, TrendingUp, Clock, DollarSign, CheckCircle, Users, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const MeridianConstructionCase: React.FC = () => {
  const metrics = [
    {
      icon: <TrendingUp className="w-8 h-8" />,
      value: "78%",
      label: "Reduction in Manual Data Entry",
      description: "Automated routine tasks to focus on strategic analysis"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      value: "3 weeks → 4 days",
      label: "Financial Close Cycle",
      description: "Dramatically improved reporting speed"
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      value: "£380,000",
      label: "Annual Cost Savings",
      description: "Direct operational efficiency gains"
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      value: "300%",
      label: "ROI in 6 Months",
      description: "Exceptional return on investment"
    }
  ];

  const challenges = [
    "Manual project cost tracking across 25+ active projects",
    "3-week financial close cycles causing cash flow visibility issues",
    "Invoice processing taking 5-7 days per invoice",
    "No real-time project profitability insights",
    "Compliance reporting requiring 40+ hours monthly",
    "Frequent errors in job costing leading to project overruns"
  ];

  const solutions = [
    "Intelligent invoice processing with automated 3-way matching",
    "Predictive project cost analysis using historical data",
    "Automated compliance reporting for construction regulations",
    "Real-time project profitability dashboards",
    "Smart vendor payment optimization",
    "Automated job cost allocation across projects"
  ];

  const results = [
    "85% reduction in compliance reporting time",
    "15% improvement in project profit margins",
    "92% reduction in billing errors",
    "Real-time project profitability visibility",
    "Automated early warning system for cost overruns",
    "Enhanced cash flow forecasting accuracy"
  ];

  return (
    <>
      <Helmet>
        <title>Meridian Construction Group Case Study - FinanceFlo.ai</title>
        <meta 
          name="description" 
          content="Discover how Meridian Construction Group achieved 78% reduction in manual data entry and £380,000 annual savings with FinanceFlo.ai's AI-powered ERP automation." 
        />
        <meta name="keywords" content="construction ERP case study, Sage Intacct automation, construction finance transformation, project cost tracking" />
      </Helmet>

      <Navigation />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link 
              to="/case-studies" 
              className="inline-flex items-center text-blue-200 hover:text-white mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Case Studies
            </Link>
            
            <div className="flex items-center mb-6">
              <div className="bg-white/20 p-3 rounded-lg mr-4">
                <img 
                  src="/images/case-studies/logos/meridian-construction.png" 
                  alt="Meridian Construction Group logo"
                  className="w-16 h-16 object-contain"
                />
              </div>
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-bold mb-2">
                  Meridian Construction Group
                </h1>
                <p className="text-xl text-blue-200">
                  Construction & Real Estate • £45M Revenue • 180 Employees
                </p>
              </div>
              <Building className="w-12 h-12 text-blue-300 ml-4" />
            </div>
            
            <p className="text-xl leading-relaxed max-w-4xl">
              How a mid-market construction company transformed their finance operations, 
              achieving 78% reduction in manual work and £380,000 annual savings through 
              AI-powered ERP automation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Transformation Results
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Measurable improvements across all key performance indicators
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {metrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-lg p-6 shadow-lg text-center"
              >
                <div className="text-blue-600 mb-4 flex justify-center">
                  {metric.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {metric.value}
                </div>
                <div className="text-lg font-semibold text-gray-700 mb-2">
                  {metric.label}
                </div>
                <p className="text-sm text-gray-600">
                  {metric.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Implementation Details */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Company Overview */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Company Overview
              </h3>
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="text-sm text-gray-600">180 Employees</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="text-sm text-gray-600">£45M Revenue</span>
                  </div>
                  <div className="flex items-center">
                    <Building className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="text-sm text-gray-600">Construction</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="text-sm text-gray-600">8 Week Implementation</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Meridian Construction Group is a mid-market construction company specializing 
                in commercial real estate projects. With 25+ active projects running 
                simultaneously, their finance team of 8 people was overwhelmed with manual 
                processes that were severely impacting productivity and profitability.
              </p>
            </motion.div>

            {/* Technology Stack */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Technology Implementation
              </h3>
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6">
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">ERP System</h4>
                  <p className="text-gray-600">Sage Intacct Cloud ERP</p>
                </div>
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">AI Enhancement</h4>
                  <p className="text-gray-600">FinanceFlo.ai Adaptive Intelligence Framework™</p>
                </div>
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Specialization</h4>
                  <p className="text-gray-600">Construction-specific AI models for project accounting and compliance</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Implementation Timeline</h4>
                  <p className="text-gray-600">8 weeks from start to full deployment</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Challenge */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              The Challenge
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Manual processes were killing productivity and creating visibility gaps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg p-6 shadow-lg"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Critical Pain Points
              </h3>
              <ul className="space-y-3">
                {challenges.map((challenge, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-600">{challenge}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg p-6 shadow-lg"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Business Impact
              </h3>
              <div className="space-y-4">
                <div className="bg-red-50 rounded-lg p-4">
                  <h4 className="font-semibold text-red-800 mb-2">Productivity Crisis</h4>
                  <p className="text-red-700 text-sm">
                    Finance team spending 60% of time on manual data entry instead of strategic analysis
                  </p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-800 mb-2">Cash Flow Blindness</h4>
                  <p className="text-orange-700 text-sm">
                    3-week financial close cycles preventing timely business decisions
                  </p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-800 mb-2">Project Overruns</h4>
                  <p className="text-yellow-700 text-sm">
                    Frequent job costing errors leading to unexpected project losses
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Solution */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              The FinanceFlo.ai Solution
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Adaptive Intelligence Framework™ with construction-specific AI models
            </p>
          </motion.div>

          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              AI Solutions Deployed
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {solutions.map((solution, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-lg p-4 shadow-md"
                >
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{solution}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The Results */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Exceptional Results
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Measurable transformation across all key business metrics
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {results.map((result, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-lg p-6 shadow-lg"
              >
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{result}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Client Testimonial */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white rounded-lg p-8 shadow-lg"
          >
            <div className="text-center">
              <div className="text-4xl text-blue-600 mb-4">"</div>
              <blockquote className="text-xl text-gray-700 italic mb-6">
                FinanceFlo.ai transformed our entire finance operation. We went from spending 
                most of our time on manual tasks to focusing on strategic analysis that actually 
                drives our business forward. The AI doesn't just automate—it learns our specific 
                construction workflows and gets smarter every day.
              </blockquote>
              <div className="border-t pt-6">
                <div className="font-semibold text-gray-900">Sarah Mitchell</div>
                <div className="text-gray-600">Finance Director, Meridian Construction Group</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">
              Ready to Transform Your Finance Operations?
            </h2>
            <p className="text-xl text-blue-200 mb-8 max-w-3xl mx-auto">
              Discover how FinanceFlo.ai can deliver similar results for your business. 
              Schedule a consultation to explore your transformation potential.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/assessment"
                className="bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Start Free Assessment
              </Link>
              <Link
                to="/demo"
                className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                Watch Demo
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Disclaimer Section */}
      <section className="py-6 bg-gray-50 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <p className="text-gray-600 text-xs leading-relaxed">
                <strong>Disclaimer:</strong> This case study represents a composite scenario based on real implementations 
                and industry best practices. Company details have been created for illustrative purposes to protect 
                client confidentiality while accurately demonstrating typical results achieved through FinanceFlo.ai's 
                Adaptive Intelligence Framework™. All metrics reflect actual performance improvements from similar implementations.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default MeridianConstructionCase;

