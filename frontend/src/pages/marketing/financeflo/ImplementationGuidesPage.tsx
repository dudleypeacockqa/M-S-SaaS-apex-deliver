import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Download, Clock, Users, CheckCircle, ArrowRight, Filter } from "lucide-react";

const ImplementationGuidesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");

  const categories = ["All", "ERP Implementation", "AI Integration", "Industry-Specific", "Best Practices", "Troubleshooting"];
  const levels = ["All", "Beginner", "Intermediate", "Advanced"];

  const guides = [
    {
      id: "complete-erp-implementation",
      title: "Complete ERP Implementation Guide",
      description: "A comprehensive 50-page guide covering every aspect of ERP implementation from planning to go-live.",
      category: "ERP Implementation",
      level: "Intermediate",
      duration: "2-3 hours",
      pages: 50,
      downloads: 2847,
      featured: true,
      topics: ["Project Planning", "Data Migration", "User Training", "Go-Live Strategy"],
      preview: "Learn the proven methodology used in 500+ successful ERP implementations across the UK."
    },
    {
      id: "ai-integration-playbook",
      title: "AI Integration Playbook",
      description: "Step-by-step guide to integrating AI capabilities into existing business systems.",
      category: "AI Integration",
      level: "Advanced",
      duration: "3-4 hours",
      pages: 65,
      downloads: 1923,
      featured: true,
      topics: ["AI Strategy", "Technology Selection", "Implementation Phases", "ROI Measurement"],
      preview: "Master the art of AI integration with real-world examples and proven frameworks."
    },
    {
      id: "construction-erp-guide",
      title: "Construction Industry ERP Guide",
      description: "Industry-specific implementation guide for construction companies.",
      category: "Industry-Specific",
      level: "Intermediate",
      duration: "1-2 hours",
      pages: 35,
      downloads: 1456,
      featured: false,
      topics: ["Project Management", "Cost Control", "Resource Planning", "Compliance"],
      preview: "Tailored specifically for construction companies with unique requirements."
    },
    {
      id: "financial-services-compliance",
      title: "Financial Services Compliance Guide",
      description: "Navigate regulatory requirements while implementing modern ERP systems.",
      category: "Industry-Specific",
      level: "Advanced",
      duration: "2-3 hours",
      pages: 42,
      downloads: 1234,
      featured: false,
      topics: ["Regulatory Compliance", "Data Security", "Audit Trails", "Risk Management"],
      preview: "Ensure compliance while modernizing your financial services operations."
    },
    {
      id: "change-management-guide",
      title: "Change Management Best Practices",
      description: "Guide to managing organizational change during ERP implementation.",
      category: "Best Practices",
      level: "Beginner",
      duration: "1 hour",
      pages: 28,
      downloads: 3421,
      featured: false,
      topics: ["Stakeholder Engagement", "Communication Strategy", "Training Programs", "Resistance Management"],
      preview: "Successfully navigate the human side of technology transformation."
    },
    {
      id: "data-migration-guide",
      title: "Data Migration Masterclass",
      description: "Complete guide to planning and executing successful data migrations.",
      category: "ERP Implementation",
      level: "Advanced",
      duration: "2 hours",
      pages: 38,
      downloads: 1876,
      featured: false,
      topics: ["Data Assessment", "Migration Strategy", "Quality Assurance", "Validation"],
      preview: "Avoid common pitfalls and ensure data integrity throughout migration."
    },
    {
      id: "troubleshooting-guide",
      title: "Common Implementation Issues & Solutions",
      description: "Quick reference guide for resolving common implementation challenges.",
      category: "Troubleshooting",
      level: "Intermediate",
      duration: "30 minutes",
      pages: 22,
      downloads: 2156,
      featured: false,
      topics: ["Performance Issues", "Integration Problems", "User Adoption", "System Errors"],
      preview: "Quick solutions to the most common implementation challenges."
    },
    {
      id: "roi-measurement-guide",
      title: "ROI Measurement Framework",
      description: "Comprehensive framework for measuring and maximizing ERP ROI.",
      category: "Best Practices",
      level: "Intermediate",
      duration: "1.5 hours",
      pages: 31,
      downloads: 1687,
      featured: false,
      topics: ["KPI Definition", "Baseline Measurement", "Progress Tracking", "Optimization"],
      preview: "Prove the value of your ERP investment with measurable results."
    }
  ];

  const filteredGuides = guides.filter(guide => {
    const matchesCategory = selectedCategory === "All" || guide.category === selectedCategory;
    const matchesLevel = selectedLevel === "All" || guide.level === selectedLevel;
    return matchesCategory && matchesLevel;
  });

  const featuredGuides = guides.filter(guide => guide.featured);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <BookOpen className="h-16 w-16 mx-auto mb-6 text-blue-300" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Implementation Guides
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Comprehensive guides and best practices from 500+ successful ERP implementations
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <span className="font-semibold">15+</span> Comprehensive Guides
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <span className="font-semibold">500+</span> Pages of Content
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <span className="font-semibold">10,000+</span> Downloads
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Featured Guides */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Guides</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredGuides.map((guide) => (
              <div key={guide.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                      {guide.category}
                    </span>
                    <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                      Featured
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{guide.title}</h3>
                  <p className="text-gray-600 mb-4">{guide.preview}</p>
                  
                  {/* Stats */}
                  <div className="flex items-center space-x-6 mb-6 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{guide.pages} pages</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{guide.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Download className="h-4 w-4" />
                      <span>{guide.downloads.toLocaleString()} downloads</span>
                    </div>
                  </div>

                  {/* Topics */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">What You'll Learn:</h4>
                    <div className="flex flex-wrap gap-2">
                      {guide.topics.map((topic, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center">
                      <Download className="h-4 w-4 mr-2" />
                      Download Guide
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-colors">
                      Preview
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Filters */}
        <section className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level</label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {levels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* All Guides */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">All Implementation Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGuides.map((guide) => (
              <div key={guide.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                      {guide.category}
                    </span>
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded ${
                      guide.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                      guide.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {guide.level}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{guide.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{guide.description}</p>
                  
                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <BookOpen className="h-3 w-3" />
                      <span>{guide.pages}p</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{guide.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Download className="h-3 w-3" />
                      <span>{guide.downloads}</span>
                    </div>
                  </div>

                  <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Need Personalized Guidance?</h2>
          <p className="text-xl mb-6 text-blue-100">
            Get expert consultation tailored to your specific implementation needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Schedule Consultation
            </Link>
            <Link
              to="/assessment"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Start Free Assessment
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ImplementationGuidesPage;

