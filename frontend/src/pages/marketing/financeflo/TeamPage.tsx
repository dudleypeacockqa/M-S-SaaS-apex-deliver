import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Navigation } from '@/components/marketing/financeflo/Navigation';
import { Footer } from '@/components/marketing/financeflo/Footer';
import TeamSection from '@/components/marketing/financeflo/TeamSection';
import { Award, Users, Globe, TrendingUp } from 'lucide-react';

const TeamPage: React.FC = () => {
  const achievements = [
    {
      icon: <Users className="w-8 h-8" />,
      number: "230+",
      label: "ERP Implementations",
      description: "Successful transformations across multiple industries"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      number: "20+",
      label: "Years Experience",
      description: "Proven track record in business transformation"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      number: "3",
      label: "Global Regions",
      description: "UK, Europe, and Southern Africa coverage"
    },
    {
      icon: <Award className="w-8 h-8" />,
      number: "300-500%",
      label: "Average ROI",
      description: "Delivered through our implementations"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Our Team - FinanceFlo.ai | ERP & AI Experts</title>
        <meta 
          name="description" 
          content="Meet the expert team behind FinanceFlo.ai. Led by Dudley Peacock, our team combines 20+ years of ERP expertise with cutting-edge AI innovation to transform finance operations." 
        />
        <meta name="keywords" content="ERP team, AI experts, finance transformation, Dudley Peacock, FinanceFlo team" />
      </Helmet>

      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Meet the Experts Behind
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400 block mt-2">
                Your Transformation
              </span>
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed max-w-3xl mx-auto">
              Our world-class team combines decades of ERP expertise with cutting-edge AI innovation 
              to deliver transformational results for finance leaders across the globe.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Proven Track Record of Excellence
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Our team's achievements speak for themselves. We've transformed businesses 
              across industries with measurable, lasting results.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl p-8 group-hover:shadow-lg transition-shadow duration-300">
                  <div className="text-blue-600 mb-4 flex justify-center">
                    {achievement.icon}
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-2">
                    {achievement.number}
                  </div>
                  <div className="text-lg font-semibold text-slate-700 mb-2">
                    {achievement.label}
                  </div>
                  <div className="text-sm text-slate-600">
                    {achievement.description}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <TeamSection />

      {/* Company Culture Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Our Values Drive
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600 ml-3">
                Everything We Do
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              We believe in making complex systems simple, delivering real results, 
              and building lasting partnerships with our clients.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Problem Solvers First",
                description: "We don't start with software - we start with your challenges. Our team brings decades of experience solving real business problems."
              },
              {
                title: "We Stick Around",
                description: "No more implement-and-disappear consultants. We're here for the long haul, ensuring you get real value from your investment."
              },
              {
                title: "We Make It Simple",
                description: "Complex doesn't have to mean complicated. We handle the technical heavy lifting so you can focus on running your business."
              },
              {
                title: "Results Matter",
                description: "Everything we do is about making your life easier and your business more successful. We measure our success by your results."
              }
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  {value.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default TeamPage;

