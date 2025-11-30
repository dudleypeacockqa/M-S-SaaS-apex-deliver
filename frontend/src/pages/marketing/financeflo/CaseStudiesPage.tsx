import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp, Clock, Users, DollarSign } from "lucide-react";
import { Helmet } from "react-helmet-async";

const CaseStudiesPage: React.FC = () => {
  const [selectedIndustry, setSelectedIndustry] = React.useState("All");

  const caseStudies = [
    {
      id: "meridian-construction",
      title: "Meridian Construction",
      industry: "Construction",
      challenge: "Manual project tracking and financial reporting",
      solution: "AI-powered project management and real-time financial dashboards",
      results: [
        { metric: "Project Efficiency", improvement: "45%", icon: TrendingUp },
        { metric: "Reporting Time", improvement: "80%", icon: Clock },
        { metric: "Cost Accuracy", improvement: "95%", icon: DollarSign }
      ],
      description: "How Meridian Construction transformed their project management and achieved 45% efficiency gains through AI-powered automation.",
      image: "/images/case-studies/meridian-construction-hero.jpg",
      link: "/case-studies/meridian-construction"
    },
    {
      id: "techflow-financial",
      title: "TechFlow Financial",
      industry: "Financial Services",
      challenge: "Complex compliance reporting and risk management",
      solution: "Automated compliance engine with real-time risk monitoring",
      results: [
        { metric: "Compliance Accuracy", improvement: "99.8%", icon: TrendingUp },
        { metric: "Processing Time", improvement: "75%", icon: Clock },
        { metric: "Risk Detection", improvement: "90%", icon: Users }
      ],
      description: "TechFlow Financial achieved 99.8% compliance accuracy while reducing processing time by 75% with our AI compliance engine.",
      image: "/images/case-studies/techflow-financial-hero.jpg",
      link: "/case-studies/techflow-financial"
    },
    {
      id: "precision-manufacturing",
      title: "Precision Manufacturing Ltd",
      industry: "Manufacturing",
      challenge: "Inventory management and production optimization",
      solution: "Predictive analytics for inventory and production planning",
      results: [
        { metric: "Inventory Efficiency", improvement: "60%", icon: TrendingUp },
        { metric: "Production Downtime", improvement: "40%", icon: Clock },
        { metric: "Cost Reduction", improvement: "35%", icon: DollarSign }
      ],
      description: "Precision Manufacturing achieved 60% inventory efficiency improvement and 40% reduction in production downtime.",
      image: "/images/case-studies/precision-manufacturing-hero.jpg",
      link: "/case-studies/precision-manufacturing"
    }
  ];

  const industries = ["All", "Construction", "Financial Services", "Manufacturing", "Healthcare", "Private Equity"];

  const filteredCaseStudies = selectedIndustry === "All"
    ? caseStudies
    : caseStudies.filter(study => study.industry === selectedIndustry);

  return (
    <>
      <Helmet>
        <title>Success Stories & Case Studies | FinanceFlo</title>
        <meta name="description" content="Discover how leading UK businesses are transforming their operations with FinanceFlo's AI-powered finance automation. Real results, proven success." />
      </Helmet>

      <div className="min-h-screen bg-brand-grey">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-brand-navy via-brand-navy-light to-brand-navy-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">
              Success Stories
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
              Discover how leading businesses across the UK are transforming their operations with FinanceFlo.ai
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/20">
                <span className="font-semibold text-brand-teal-600">500+</span> <span className="text-white/80">Implementations</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/20">
                <span className="font-semibold text-brand-teal-600">£50M+</span> <span className="text-white/80">Cost Savings</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/20">
                <span className="font-semibold text-brand-teal-600">95%</span> <span className="text-white/80">Success Rate</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-white border-b border-brand-grey-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {industries.map((industry) => (
              <button
                key={industry}
                onClick={() => setSelectedIndustry(industry)}
                className={`px-6 py-2 rounded-2xl border transition-all duration-300 font-medium ${
                  selectedIndustry === industry
                    ? "bg-brand-navy text-white border-brand-navy shadow-md hover:shadow-lg"
                    : "bg-white text-gray-700 border-gray-300 hover:border-brand-blue hover:text-brand-blue hover:shadow-md"
                }`}
              >
                {industry}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredCaseStudies.map((study) => (
              <div key={study.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="h-48 relative overflow-hidden">
                  {study.image && study.image !== "/api/placeholder/400/250" ? (
                    <img
                      src={study.image}
                      alt={`${study.title} case study`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-brand-navy to-brand-navy-light flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-white text-6xl font-bold opacity-20 mb-2">
                          {study.title.charAt(0)}
                        </div>
                        <div className="text-white/60 text-sm font-medium">
                          {study.industry}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-brand-teal-600/10 text-brand-teal-600 text-xs font-semibold px-3 py-1 rounded-full border border-brand-teal-600/20">
                      {study.industry}
                    </span>
                  </div>
                  <h3 className="text-xl font-heading font-bold text-brand-navy mb-3">{study.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{study.description}</p>
                  
                  {/* Results */}
                  <div className="space-y-3 mb-6">
                    {study.results.map((result, index) => {
                      const Icon = result.icon;
                      return (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Icon className="h-4 w-4 text-brand-blue" />
                            <span className="text-sm text-gray-600">{result.metric}</span>
                          </div>
                          <span className="text-sm font-semibold text-brand-teal-600">+{result.improvement}</span>
                        </div>
                      );
                    })}
                  </div>

                  <Link
                    to={study.link}
                    className="inline-flex items-center text-brand-blue hover:text-brand-navy font-medium transition-colors group"
                  >
                    Read Full Case Study
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-brand-navy to-brand-navy-light text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
            Ready to Write Your Success Story?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Join hundreds of businesses already transforming their operations with FinanceFlo.ai
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/assessment"
              className="bg-brand-teal-600 text-white px-8 py-3 rounded-2xl font-semibold hover:bg-brand-teal-400 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              Start Free Assessment
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-2xl font-semibold hover:bg-white hover:text-brand-navy transition-all duration-300"
            >
              Speak with Expert
            </Link>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default CaseStudiesPage;

