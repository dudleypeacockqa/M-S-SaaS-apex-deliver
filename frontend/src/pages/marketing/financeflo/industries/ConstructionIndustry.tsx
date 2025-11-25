import { Card, CardContent } from "@/components/marketing/financeflo/ui/card";
import { Navigation } from "@/components/marketing/financeflo/Navigation";
import { Footer } from "@/components/marketing/financeflo/Footer";
import { ConstructionVSLHero } from "@/components/marketing/financeflo/ConstructionVSLHero";
import { IndustryAssessmentForm } from "@/components/marketing/financeflo/IndustryAssessmentForm";
import { CheckCircle, TrendingUp, Shield, BarChart, Users, Building } from "lucide-react";

const ConstructionIndustry = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* VSL Hero Section */}
      <ConstructionVSLHero />

      {/* Unique Mechanism */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">
            The Project Intelligence System™
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-4xl mx-auto">
            Our construction-specific AI framework integrates with your existing project management tools to provide real-time financial visibility across all projects, from tender to completion.
          </p>
          
          {/* Industry Images */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="relative">
              <img 
                src="/assets/images/industries/construction_site.png" 
                alt="UK construction site with tower cranes and workers in safety gear"
                className="w-full h-64 object-cover rounded-lg shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-lg font-semibold">Active Project Sites</h3>
                <p className="text-sm opacity-90">Real-time project monitoring</p>
              </div>
            </div>
            <div className="relative">
              <img 
                src="/assets/images/industries/construction_office.png" 
                alt="Construction project management office with cost tracking dashboards"
                className="w-full h-64 object-cover rounded-lg shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-lg font-semibold">Project Intelligence</h3>
                <p className="text-sm opacity-90">Advanced cost tracking and forecasting</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-8 mb-12">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="inline-flex p-4 rounded-lg bg-orange-100 text-orange-600 mb-4">
                  <BarChart size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-Time Project Costing</h3>
                <p className="text-gray-600">Live tracking of materials, labour, and overhead costs across all active projects with automated variance alerts.</p>
              </div>
              <div className="text-center">
                <div className="inline-flex p-4 rounded-lg bg-yellow-100 text-yellow-600 mb-4">
                  <Shield size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Cash Flow Forecasting</h3>
                <p className="text-gray-600">Predictive cash flow modeling based on project milestones, payment terms, and historical performance data.</p>
              </div>
              <div className="text-center">
                <div className="inline-flex p-4 rounded-lg bg-red-100 text-red-600 mb-4">
                  <TrendingUp size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Margin Optimization</h3>
                <p className="text-gray-600">AI-powered analysis identifies opportunities to improve project margins and reduce cost overruns.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Three Points */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            How The System Transforms Your Projects
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="text-4xl font-bold text-orange-600 mb-4">1</div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Unified Data Integration</h3>
                <p className="text-gray-600 mb-6">
                  Connects with your existing project management software, accounting systems, and site management tools to create a single source of truth for all project financials.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-1 mr-2" />
                    <span className="text-sm text-gray-600">Project management integration</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-1 mr-2" />
                    <span className="text-sm text-gray-600">Real-time cost tracking</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-1 mr-2" />
                    <span className="text-sm text-gray-600">Automated invoicing</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="text-4xl font-bold text-orange-600 mb-4">2</div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Intelligent Monitoring</h3>
                <p className="text-gray-600 mb-6">
                  AI algorithms continuously monitor project performance against budgets and timelines, providing early warnings for potential issues before they become costly problems.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-1 mr-2" />
                    <span className="text-sm text-gray-600">Budget variance alerts</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-1 mr-2" />
                    <span className="text-sm text-gray-600">Timeline risk assessment</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-1 mr-2" />
                    <span className="text-sm text-gray-600">Resource optimization</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="text-4xl font-bold text-orange-600 mb-4">3</div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Strategic Insights</h3>
                <p className="text-gray-600 mb-6">
                  Generate comprehensive reports and insights that help you make informed decisions about project bidding, resource allocation, and business growth strategies.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-1 mr-2" />
                    <span className="text-sm text-gray-600">Profitability analysis</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-1 mr-2" />
                    <span className="text-sm text-gray-600">Bid optimization</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-1 mr-2" />
                    <span className="text-sm text-gray-600">Performance benchmarking</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Proven Results Across Construction Companies
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 mb-12">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                    <Building className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Balfour Beatty Regional</div>
                    <div className="text-sm text-gray-600">£450M Annual Revenue, 25 Active Projects</div>
                  </div>
                </div>
                <blockquote className="text-gray-700 mb-4">
                  "The Project Intelligence System gave us real-time visibility into all our projects. We identified cost overruns 4 weeks earlier than before, saving us £1.2M in the first year alone."
                </blockquote>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">£1.2M</div>
                    <div className="text-sm text-gray-600">Annual Savings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">4 Weeks</div>
                    <div className="text-sm text-gray-600">Earlier Issue Detection</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                    <Users className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Kier Construction</div>
                    <div className="text-sm text-gray-600">£280M Annual Revenue, 18 Active Projects</div>
                  </div>
                </div>
                <blockquote className="text-gray-700 mb-4">
                  "Our project margins improved by 12% in the first year. The system's cash flow forecasting helped us avoid a major liquidity crisis that could have cost us £3M."
                </blockquote>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">12%</div>
                    <div className="text-sm text-gray-600">Margin Improvement</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">£3M</div>
                    <div className="text-sm text-gray-600">Crisis Avoidance Value</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Card className="inline-block border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="text-4xl font-bold text-orange-600 mb-2">£2.4M</div>
                <div className="text-xl text-gray-600">Average Annual Savings</div>
                <div className="text-sm text-gray-500 mt-2">Across 15+ construction companies</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Assessment CTA */}
      <section className="py-20 bg-orange-50">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="border-0 shadow-2xl">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
                Get Your Construction Finance Assessment
              </h2>
              <p className="text-center text-gray-600 mb-8">
                Discover how the Project Intelligence System can transform your construction finance operations and improve project profitability.
              </p>
              <IndustryAssessmentForm
                industry="Construction"
                assessmentType="Project Intelligence"
                buttonText="Get My Project Assessment"
                buttonColor="orange"
                companyLabel="Construction Company Name"
                field1Label="Annual Revenue"
                field1Placeholder="e.g., £5M-£50M"
                field2Label="Number of Active Projects"
                field2Placeholder="e.g., 5-20 projects"
              />
            </CardContent>
          </Card>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default ConstructionIndustry;

