import React, { useState } from 'react';
import { Button } from '@/components/marketing/financeflo/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/marketing/financeflo/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/marketing/financeflo/ui/tabs';
import { ArrowRight, Play, Phone, Mail, Users, BarChart3, Bot, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

const LeverageFloDemo = () => {
  const [activeDemo, setActiveDemo] = useState('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              LeverageFlo.ai System Demo
              <span className="block text-3xl text-blue-600 mt-2">Interactive Platform Walkthrough</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Experience the complete LeverageFlo.ai marketing automation platform. 
              See how it generates 800+ qualified prospects monthly with AI-powered automation.
            </p>
          </div>

          <div className="flex justify-center mb-12">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-blue-100 p-4 rounded-full">
                  <Play className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">System Overview Demo</h3>
              <p className="text-gray-600 text-center mb-6">
                12-minute comprehensive walkthrough of all LeverageFlo.ai capabilities
              </p>
              <Button 
                size="lg" 
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                onClick={() => setActiveDemo('overview')}
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Full Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo Tabs */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Interactive Feature Demos</h2>
            <p className="text-lg text-gray-600">Explore specific capabilities in detail</p>
          </div>

          <Tabs value={activeDemo} onValueChange={setActiveDemo} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="outbound">Cold Outbound</TabsTrigger>
              <TabsTrigger value="automation">Automation</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900">Complete System Overview</h3>
                  <p className="text-gray-600 leading-relaxed">
                    See how all LeverageFlo.ai components work together to create a seamless 
                    marketing automation ecosystem that delivers consistent results.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Target className="h-5 w-5 text-blue-600" />
                      <span className="text-gray-700">Lead identification and qualification</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-blue-600" />
                      <span className="text-gray-700">Voice AI outbound campaigns</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-blue-600" />
                      <span className="text-gray-700">Multi-channel follow-up sequences</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                      <span className="text-gray-700">Real-time performance analytics</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-100 rounded-xl aspect-video flex items-center justify-center">
                  <div className="text-center">
                    <Play className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">System Overview Video</p>
                    <p className="text-sm text-gray-500">12:30 duration</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="outbound" className="space-y-8">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900">Cold Outbound System</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Watch our Voice AI make actual calls to prospects, demonstrating natural 
                    conversation flow and intelligent lead qualification.
                  </p>
                  
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3">Demo Highlights:</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Live Voice AI conversation examples</li>
                      <li>• Prospect qualification process</li>
                      <li>• Appointment booking automation</li>
                      <li>• Follow-up sequence triggers</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gray-100 rounded-xl aspect-video flex items-center justify-center">
                  <div className="text-center">
                    <Phone className="h-16 w-16 text-green-600 mx-auto mb-4" />
                    <p className="text-gray-600">Cold Outbound Demo</p>
                    <p className="text-sm text-gray-500">8:45 duration</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="automation" className="space-y-8">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900">Marketing Automation</h3>
                  <p className="text-gray-600 leading-relaxed">
                    See how our AI optimizes campaigns in real-time, manages lead nurturing 
                    sequences, and automatically adjusts strategies based on performance.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <Bot className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-purple-600">AI</div>
                      <div className="text-sm text-gray-600">Optimization</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-green-600">90%</div>
                      <div className="text-sm text-gray-600">Automation</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-100 rounded-xl aspect-video flex items-center justify-center">
                  <div className="text-center">
                    <Bot className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                    <p className="text-gray-600">Automation Demo</p>
                    <p className="text-sm text-gray-500">6:15 duration</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-8">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900">Advanced Analytics</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Explore our comprehensive analytics dashboard showing real-time campaign 
                    performance, lead quality scoring, and ROI tracking.
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="text-gray-700">Conversion Tracking</span>
                      <span className="text-blue-600 font-semibold">Real-time</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="text-gray-700">Lead Quality Score</span>
                      <span className="text-green-600 font-semibold">AI-Powered</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="text-gray-700">ROI Calculation</span>
                      <span className="text-purple-600 font-semibold">Automated</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-100 rounded-xl aspect-video flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-16 w-16 text-orange-600 mx-auto mb-4" />
                    <p className="text-gray-600">Analytics Demo</p>
                    <p className="text-sm text-gray-500">5:30 duration</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Live Demo Booking */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Book a Live Demo</h2>
            <p className="text-lg text-gray-600">See the system in action with your specific use case</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <CardTitle className="text-lg text-blue-600">Quick Demo</CardTitle>
                <CardDescription>15-minute overview</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-gray-600 mb-4">Perfect for initial evaluation</p>
                <Link to="/contact">
                  <Button variant="outline" className="w-full">Book 15min Demo</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-blue-200 border-2">
              <CardHeader className="text-center">
                <CardTitle className="text-lg text-blue-600">Deep Dive</CardTitle>
                <CardDescription>45-minute detailed walkthrough</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-gray-600 mb-4">Comprehensive feature exploration</p>
                <Link to="/contact">
                  <Button className="w-full">Book 45min Demo</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <CardTitle className="text-lg text-blue-600">Custom Demo</CardTitle>
                <CardDescription>Tailored to your industry</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-gray-600 mb-4">Industry-specific demonstration</p>
                <Link to="/contact">
                  <Button variant="outline" className="w-full">Schedule Custom Demo</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Real Results</h2>
            <p className="text-lg text-gray-600">Average performance across all implementations</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">800+</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Monthly Prospects</h3>
              <p className="text-gray-600 text-sm">Qualified leads generated</p>
            </div>

            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">35%</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Response Rate</h3>
              <p className="text-gray-600 text-sm">Cold outbound engagement</p>
            </div>

            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">90%</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Time Savings</h3>
              <p className="text-gray-600 text-sm">Reduction in manual tasks</p>
            </div>

            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">340%</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">ROI Increase</h3>
              <p className="text-gray-600 text-sm">Average return improvement</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Experience LeverageFlo.ai?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            See how our platform can transform your marketing and generate 800+ qualified prospects monthly
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button size="lg" variant="secondary" className="min-w-[200px]">
                Book Live Demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/leverageflo/cold-outbound">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 min-w-[200px]">
                Explore Features
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LeverageFloDemo;