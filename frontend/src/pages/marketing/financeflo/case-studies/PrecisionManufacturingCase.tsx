import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Navigation } from '../../components/Navigation';
import { Footer } from '../../components/Footer';
import { ArrowLeft, Factory, TrendingUp, Clock, DollarSign, CheckCircle, Users, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrecisionManufacturingCase: React.FC = () => {
  const metrics = [
    {
      icon: <TrendingUp className="w-8 h-8" />,
      value: "82%",
      label: "Reduction in Inventory Management Time",
      description: "Automated inventory valuation and optimization"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      value: "90%",
      label: "Work-in-Progress Automation",
      description: "Streamlined production accounting"
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      value: "£520,000",
      label: "Annual Cost Savings",
      description: "Comprehensive operational improvements"
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      value: "320%",
      label: "ROI in 7 Months",
      description: "Outstanding return on investment"
    }
  ];

  const challenges = [
    "Manual inventory valuation across 5,000+ SKUs",
    "Complex work-in-progress accounting for long production cycles",
    "Supplier payment optimization challenges",
    "No predictive maintenance cost planning",
    "Quality cost tracking requiring manual analysis",
    "Regulatory compliance for aerospace standards"
  ];

  const solutions = [
    "Intelligent inventory valuation and optimization",
    "Predictive maintenance cost forecasting",
    "Automated work-in-progress tracking",
    "Smart supplier payment scheduling",
    "AI-powered quality cost analysis",
    "Automated regulatory compliance reporting"
  ];

  const results = [
    "99.2% inventory accuracy achieved",
    "18% reduction in inventory carrying costs",
    "25% improvement in cash flow from optimized payments",
    "30% reduction in downtime through predictive maintenance",
    "Real-time cost visibility across all production lines",
    "Enhanced supplier relationship management"
  ];

  return (
    <>
      <Helmet>
        <title>Precision Manufacturing Ltd Case Study - FinanceFlo.ai</title>
        <meta 
          name="description" 
          content="Discover how Precision Manufacturing achieved 82% reduction in inventory management time and £520,000 annual savings with AI-powered manufacturing ERP automation." 
        />
        <meta name="keywords" content="manufacturing ERP case study, NetSuite automation, aerospace manufacturing, inventory optimization" />
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
              <Factory className="w-12 h-12 text-blue-300 mr-4" />
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">
                  Precision Manufacturing Ltd
                </h1>
                <p className="text-xl text-blue-200">
                  Manufacturing • £62M Revenue • 240 Employees
                </p>
              </div>
            </div>
            
            <p className="text-xl leading-relaxed max-w-4xl">
              How an aerospace components manufacturer achieved 82% reduction in inventory 
              management time, 99.2% inventory accuracy, and £520,000 annual savings through 
              intelligent manufacturing automation.
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
              Manufacturing Excellence Results
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Transformative improvements across all manufacturing operations
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
                    <span className="text-sm text-gray-600">240 Employees</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="text-sm text-gray-600">£62M Revenue</span>
                  </div>
                  <div className="flex items-center">
                    <Factory className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="text-sm text-gray-600">Aerospace Manufacturing</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="text-sm text-gray-600">10 Week Implementation</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Precision Manufacturing Ltd specializes in aerospace components with strict 
                quality standards and complex inventory requirements. Managing 5,000+ SKUs 
                with long production cycles and regulatory compliance demands required 
                sophisticated automation solutions.
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
                  <p className="text-gray-600">NetSuite Manufacturing Edition</p>
                </div>
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">AI Enhancement</h4>
                  <p className="text-gray-600">FinanceFlo.ai Adaptive Intelligence Framework™</p>
                </div>
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Specialization</h4>
                  <p className="text-gray-600">Manufacturing-specific AI models for cost accounting and inventory optimization</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Implementation Timeline</h4>
                  <p className="text-gray-600">10 weeks from start to full deployment</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Client Testimonial */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                FinanceFlo.ai's AI understands manufacturing complexity in a way that generic 
                solutions never could. It's like having a team of expert cost accountants 
                working 24/7 to optimize our operations.
              </blockquote>
              <div className="border-t pt-6">
                <div className="font-semibold text-gray-900">Michael Roberts</div>
                <div className="text-gray-600">Finance Director, Precision Manufacturing Ltd</div>
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
              Optimize Your Manufacturing Operations
            </h2>
            <p className="text-xl text-blue-200 mb-8 max-w-3xl mx-auto">
              Discover how FinanceFlo.ai can transform your manufacturing finance operations 
              with intelligent automation and predictive analytics.
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

export default PrecisionManufacturingCase;

