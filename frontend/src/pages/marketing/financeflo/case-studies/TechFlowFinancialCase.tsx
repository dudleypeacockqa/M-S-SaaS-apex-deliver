import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Navigation } from '../../components/Navigation';
import { Footer } from '../../components/Footer';
import { ArrowLeft, CreditCard, TrendingUp, Clock, DollarSign, CheckCircle, Users, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const TechFlowFinancialCase: React.FC = () => {
  const metrics = [
    {
      icon: <TrendingUp className="w-8 h-8" />,
      value: "89%",
      label: "Reduction in Manual Reconciliation",
      description: "Automated transaction processing and matching"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      value: "2 weeks → 2 days",
      label: "Client Billing Cycle",
      description: "Dramatically improved billing efficiency"
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      value: "£245,000",
      label: "Annual Cost Savings",
      description: "Operational efficiency improvements"
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      value: "280%",
      label: "ROI in 8 Months",
      description: "Exceptional return on investment"
    }
  ];

  const challenges = [
    "Processing 50,000+ transactions monthly with manual reconciliation",
    "Multi-currency accounting errors causing regulatory compliance issues",
    "Client billing taking 2 weeks to complete each month",
    "No automated fraud detection capabilities",
    "Revenue recognition complexities with subscription models",
    "Audit preparation requiring 3 months of intensive work"
  ];

  const solutions = [
    "Intelligent transaction categorization and reconciliation",
    "Automated multi-currency conversion and hedging recommendations",
    "AI-powered fraud detection and risk assessment",
    "Smart revenue recognition for subscription billing",
    "Predictive cash flow modeling",
    "Automated regulatory reporting for FCA compliance"
  ];

  const results = [
    "95% automation of routine transaction processing",
    "99.7% accuracy in multi-currency reconciliations",
    "40% reduction in compliance costs",
    "94% improvement in fraud detection accuracy",
    "Real-time compliance monitoring",
    "Enhanced audit trail capabilities"
  ];

  return (
    <>
      <Helmet>
        <title>TechFlow Financial Services Case Study - FinanceFlo.ai</title>
        <meta 
          name="description" 
          content="Learn how TechFlow Financial Services achieved 89% reduction in manual reconciliation and £245,000 annual savings with AI-powered ERP automation." 
        />
        <meta name="keywords" content="financial services ERP, Acumatica automation, fintech case study, transaction processing automation" />
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
              <CreditCard className="w-12 h-12 text-blue-300 mr-4" />
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">
                  TechFlow Financial Services
                </h1>
                <p className="text-xl text-blue-200">
                  Financial Services • £28M Revenue • 95 Employees
                </p>
              </div>
            </div>
            
            <p className="text-xl leading-relaxed max-w-4xl">
              How a growing fintech company automated 50,000+ monthly transactions, 
              achieved 89% reduction in manual reconciliation, and saved £245,000 annually 
              through intelligent financial automation.
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
              Exceptional improvements in transaction processing and compliance
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
                    <span className="text-sm text-gray-600">95 Employees</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="text-sm text-gray-600">£28M Revenue</span>
                  </div>
                  <div className="flex items-center">
                    <CreditCard className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="text-sm text-gray-600">Financial Services</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="text-sm text-gray-600">6 Week Implementation</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">
                TechFlow Financial Services is a growing fintech company providing payment 
                processing solutions. With rapid growth came the challenge of processing 
                50,000+ transactions monthly while maintaining regulatory compliance and 
                managing complex multi-currency reconciliations.
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
                  <p className="text-gray-600">Acumatica Cloud ERP</p>
                </div>
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">AI Enhancement</h4>
                  <p className="text-gray-600">FinanceFlo.ai Adaptive Intelligence Framework™</p>
                </div>
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Specialization</h4>
                  <p className="text-gray-600">Financial services-specific AI models for transaction processing and compliance</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Implementation Timeline</h4>
                  <p className="text-gray-600">6 weeks from start to full deployment</p>
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
              Rapid growth overwhelming manual financial processes
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
                  <h4 className="font-semibold text-red-800 mb-2">Transaction Bottleneck</h4>
                  <p className="text-red-700 text-sm">
                    Manual processing of 50,000+ monthly transactions creating severe delays
                  </p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-800 mb-2">Compliance Risk</h4>
                  <p className="text-orange-700 text-sm">
                    Multi-currency errors threatening regulatory compliance and customer trust
                  </p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-800 mb-2">Audit Burden</h4>
                  <p className="text-yellow-700 text-sm">
                    3-month audit preparation consuming critical resources
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
              Financial services-specific AI models for transaction processing and compliance
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
              Transformative improvements in financial operations and compliance
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
                The AI doesn't just process our transactions—it understands the nuances of 
                financial services. It caught compliance issues we didn't even know we had 
                and now gives us confidence that we're always audit-ready.
              </blockquote>
              <div className="border-t pt-6">
                <div className="font-semibold text-gray-900">David Chen</div>
                <div className="text-gray-600">CFO, TechFlow Financial Services</div>
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
              Transform Your Financial Operations
            </h2>
            <p className="text-xl text-blue-200 mb-8 max-w-3xl mx-auto">
              See how FinanceFlo.ai can automate your transaction processing and 
              ensure regulatory compliance. Start your transformation today.
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

      <Footer />
    </>
  );
};

export default TechFlowFinancialCase;

