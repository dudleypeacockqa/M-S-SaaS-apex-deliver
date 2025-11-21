import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/marketing/financeflo/ui/card';
import { Button } from '@/components/marketing/financeflo/ui/button';
import { Badge } from '@/components/marketing/financeflo/ui/badge';
import { 
  Play, 
  Star, 
  TrendingUp, 
  Shield, 
  Award,
  ChevronLeft,
  ChevronRight,
  Building2,
  Users,
  Target
} from 'lucide-react';

interface SuccessStory {
  id: string;
  company: string;
  industry: string;
  challenge: string;
  solution: string;
  results: string[];
  quote: string;
  author: string;
  title: string;
  avatar: string;
  logo: string;
  metrics: {
    roi: string;
    accuracy: string;
    timeSaved: string;
  };
  hasVideo: boolean;
}

const CustomerSuccessStories = () => {
  const [activeStory, setActiveStory] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const successStories: SuccessStory[] = [
    {
      id: 'techflow',
      company: 'TechFlow Manufacturing',
      industry: 'Manufacturing',
      challenge: 'Manual data entry between 12 systems taking 40 hours/week',
      solution: 'IntelliFlow\'s AI agents automated all data flows with predictive error prevention',
      results: ['500% ROI in 6 months', '99.9% accuracy', '40 hours saved weekly'],
      quote: 'IntelliFlow\'s AI is like having a team of integration experts working 24/7',
      author: 'Sarah Johnson',
      title: 'IT Director',
      avatar: '/api/placeholder/80/80',
      logo: '/api/placeholder/120/60',
      metrics: {
        roi: '500%',
        accuracy: '99.9%',
        timeSaved: '40hrs'
      },
      hasVideo: true
    },
    {
      id: 'premier',
      company: 'Premier Financial Group',
      industry: 'Financial Services',
      challenge: 'Complex compliance reporting across multiple platforms',
      solution: 'AI-powered compliance automation with real-time monitoring',
      results: ['Zero compliance violations', '75% faster reporting', '£200k saved annually'],
      quote: 'The AI predicts regulatory changes and adapts our systems automatically',
      author: 'Michael Chen',
      title: 'CFO',
      avatar: '/api/placeholder/80/80',
      logo: '/api/placeholder/120/60',
      metrics: {
        roi: '300%',
        accuracy: '100%',
        timeSaved: '75%'
      },
      hasVideo: true
    },
    {
      id: 'globaltrade',
      company: 'GlobalTrade Solutions',
      industry: 'E-commerce',
      challenge: 'Inventory sync failures causing stockouts and overselling',
      solution: 'Self-healing inventory integrations with predictive restocking',
      results: ['95% reduction in stockouts', '300% faster order processing', '£150k revenue increase'],
      quote: 'IntelliFlow\'s AI knows our business better than we do',
      author: 'Emma Thompson',
      title: 'Operations Manager',
      avatar: '/api/placeholder/80/80',
      logo: '/api/placeholder/120/60',
      metrics: {
        roi: '400%',
        accuracy: '95%',
        timeSaved: '300%'
      },
      hasVideo: true
    }
  ];

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setActiveStory((prev) => (prev + 1) % successStories.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, successStories.length]);

  const nextStory = () => {
    setIsAutoPlaying(false);
    setActiveStory((prev) => (prev + 1) % successStories.length);
  };

  const prevStory = () => {
    setIsAutoPlaying(false);
    setActiveStory((prev) => (prev - 1 + successStories.length) % successStories.length);
  };

  const AnimatedCounter = ({ value, suffix = '' }: { value: string; suffix?: string }) => (
    <span className="text-3xl font-bold text-blue-600">
      {value}{suffix}
    </span>
  );

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            AI-Powered Success Stories
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how IntelliFlow\'s AI transforms businesses across industries
          </p>
        </div>

        {/* Desktop Grid Layout */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-8 mb-16">
          {successStories.map((story, index) => (
            <Card 
              key={story.id}
              className={`relative overflow-hidden transition-all duration-500 cursor-pointer transform hover:scale-105 ${
                activeStory === index 
                  ? 'ring-2 ring-blue-500 shadow-2xl' 
                  : 'hover:shadow-xl'
              }`}
              onClick={() => {
                setActiveStory(index);
                setIsAutoPlaying(false);
              }}
            >
              {/* Industry Badge */}
              <div className="absolute top-4 right-4 z-10">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {story.industry}
                </Badge>
              </div>

              {/* Video Overlay */}
              {story.hasVideo && (
                <div className="absolute top-4 left-4 z-10">
                  <Button size="sm" variant="outline" className="bg-white/90 hover:bg-white">
                    <Play className="h-4 w-4 mr-1" />
                    Video
                  </Button>
                </div>
              )}

              <CardContent className="p-6">
                {/* Company Logo & Name */}
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-6 bg-gray-200 rounded flex items-center justify-center">
                    <Building2 className="h-4 w-4 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{story.company}</h3>
                  </div>
                </div>

                {/* Challenge */}
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Challenge:</h4>
                  <p className="text-gray-600 text-sm">{story.challenge}</p>
                </div>

                {/* Solution */}
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Solution:</h4>
                  <p className="text-gray-600 text-sm">{story.solution}</p>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-2 mb-6">
                  <div className="text-center">
                    <AnimatedCounter value={story.metrics.roi} />
                    <div className="text-xs text-gray-500">ROI</div>
                  </div>
                  <div className="text-center">
                    <AnimatedCounter value={story.metrics.accuracy} />
                    <div className="text-xs text-gray-500">Accuracy</div>
                  </div>
                  <div className="text-center">
                    <AnimatedCounter value={story.metrics.timeSaved} />
                    <div className="text-xs text-gray-500">Saved</div>
                  </div>
                </div>

                {/* Quote */}
                <blockquote className="border-l-4 border-blue-500 pl-4 mb-4">
                  <p className="text-gray-700 italic text-sm">"{story.quote}"</p>
                </blockquote>

                {/* Author */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{story.author}</div>
                    <div className="text-gray-600 text-xs">{story.title}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mobile Carousel Layout */}
        <div className="lg:hidden mb-16">
          <div className="relative">
            <Card className="overflow-hidden shadow-xl">
              <CardContent className="p-6">
                {/* Story Content */}
                <div className="text-center mb-6">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 mb-4">
                    {successStories[activeStory].industry}
                  </Badge>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {successStories[activeStory].company}
                  </h3>
                </div>

                {/* Challenge & Solution */}
                <div className="space-y-4 mb-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Challenge:</h4>
                    <p className="text-gray-600">{successStories[activeStory].challenge}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Solution:</h4>
                    <p className="text-gray-600">{successStories[activeStory].solution}</p>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <AnimatedCounter value={successStories[activeStory].metrics.roi} />
                    <div className="text-sm text-gray-500">ROI</div>
                  </div>
                  <div className="text-center">
                    <AnimatedCounter value={successStories[activeStory].metrics.accuracy} />
                    <div className="text-sm text-gray-500">Accuracy</div>
                  </div>
                  <div className="text-center">
                    <AnimatedCounter value={successStories[activeStory].metrics.timeSaved} />
                    <div className="text-sm text-gray-500">Saved</div>
                  </div>
                </div>

                {/* Quote */}
                <blockquote className="border-l-4 border-blue-500 pl-4 mb-6">
                  <p className="text-gray-700 italic">"{successStories[activeStory].quote}"</p>
                </blockquote>

                {/* Author */}
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-gray-900">{successStories[activeStory].author}</div>
                    <div className="text-gray-600 text-sm">{successStories[activeStory].title}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation Arrows */}
            <Button
              variant="outline"
              size="sm"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white shadow-md"
              onClick={prevStory}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white shadow-md"
              onClick={nextStory}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-6 space-x-2">
            {successStories.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all ${
                  activeStory === index ? 'bg-blue-600' : 'bg-gray-300'
                }`}
                onClick={() => {
                  setActiveStory(index);
                  setIsAutoPlaying(false);
                }}
              />
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">450+</div>
                <p className="text-gray-600">Companies using IntelliFlow AI</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">99.9%</div>
                <p className="text-gray-600">Customer satisfaction rate</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">500%</div>
                <p className="text-gray-600">Average ROI achieved</p>
              </div>
            </div>
          </div>

          {/* Compliance Badges */}
          <div className="flex flex-wrap justify-center items-center gap-6">
            <div className="flex items-center space-x-2 bg-white rounded-lg px-4 py-2 shadow-md">
              <Shield className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">SOC 2 Compliant</span>
            </div>
            <div className="flex items-center space-x-2 bg-white rounded-lg px-4 py-2 shadow-md">
              <Award className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-gray-700">ISO 27001 Certified</span>
            </div>
            <div className="flex items-center space-x-2 bg-white rounded-lg px-4 py-2 shadow-md">
              <Target className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">GDPR Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerSuccessStories;