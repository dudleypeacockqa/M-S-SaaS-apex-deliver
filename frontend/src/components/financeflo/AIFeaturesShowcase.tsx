import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Brain, 
  MessageSquare, 
  BarChart3, 
  Wrench, 
  Play, 
  CheckCircle,
  Zap,
  Target,
  Clock
} from 'lucide-react';

interface AIFeature {
  id: string;
  title: string;
  description: string;
  stats: string;
  icon: React.ReactNode;
  visual: React.ReactNode;
}

const AIFeaturesShowcase = () => {
  const [activeTab, setActiveTab] = useState('agentic');

  const features: AIFeature[] = [
    {
      id: 'agentic',
      title: 'Agentic AI Engine™',
      description: 'Our AI agents work autonomously, making intelligent decisions without human intervention. They learn from your business patterns and optimize integrations in real-time.',
      stats: '95% automation success rate',
      icon: <Brain className="h-6 w-6" />,
      visual: (
        <div className="relative bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-xl p-8 h-80 overflow-hidden">
          {/* Animated AI Brain */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* Central Brain */}
              <div className="w-24 h-24 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center animate-pulse">
                <Brain className="h-12 w-12 text-white" />
              </div>
              
              {/* Neural Network Connections */}
              <div className="absolute -inset-16">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-3 h-3 bg-cyan-400 rounded-full animate-ping"
                    style={{
                      left: `${50 + 40 * Math.cos((i * Math.PI) / 4)}%`,
                      top: `${50 + 40 * Math.sin((i * Math.PI) / 4)}%`,
                      animationDelay: `${i * 0.2}s`
                    }}
                  />
                ))}
              </div>
              
              {/* Connection Lines */}
              <svg className="absolute -inset-16 w-32 h-32" viewBox="0 0 128 128">
                {[...Array(8)].map((_, i) => (
                  <line
                    key={i}
                    x1="64"
                    y1="64"
                    x2={64 + 32 * Math.cos((i * Math.PI) / 4)}
                    y2={64 + 32 * Math.sin((i * Math.PI) / 4)}
                    stroke="rgba(34, 211, 238, 0.6)"
                    strokeWidth="1"
                    className="animate-pulse"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </svg>
            </div>
          </div>
          
          {/* Floating Data Points */}
          <div className="absolute top-4 right-4 bg-green-500/20 rounded-lg p-2 animate-bounce">
            <span className="text-green-300 text-xs">Processing...</span>
          </div>
          <div className="absolute bottom-4 left-4 bg-blue-500/20 rounded-lg p-2 animate-bounce delay-500">
            <span className="text-blue-300 text-xs">Learning...</span>
          </div>
        </div>
      )
    },
    {
      id: 'nlp',
      title: 'Natural Language Configuration',
      description: 'Simply tell IntelliFlow what you want: "Connect Salesforce to QuickBooks and sync all new customers daily." Our AI understands and builds the integration.',
      stats: 'Zero coding required',
      icon: <MessageSquare className="h-6 w-6" />,
      visual: (
        <div className="relative bg-gradient-to-br from-gray-900 to-slate-800 rounded-xl p-6 h-80">
          {/* Chat Interface */}
          <div className="bg-white rounded-lg h-full p-4 overflow-hidden">
            <div className="flex items-center mb-4 pb-2 border-b">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm font-medium text-gray-700">IntelliFlow AI Assistant</span>
            </div>
            
            <div className="space-y-4 h-48 overflow-y-auto">
              <div className="bg-blue-100 rounded-lg p-3 max-w-xs">
                <p className="text-sm text-gray-800">"Connect Salesforce to QuickBooks and sync all new customers daily"</p>
              </div>
              
              <div className="bg-gray-100 rounded-lg p-3 max-w-xs ml-auto">
                <p className="text-sm text-gray-800">✅ Integration configured! I've set up automatic daily sync of new Salesforce customers to QuickBooks. Testing connection...</p>
              </div>
              
              <div className="bg-gray-100 rounded-lg p-3 max-w-xs ml-auto">
                <p className="text-sm text-gray-800">🚀 Integration active! 47 customers synced successfully.</p>
              </div>
            </div>
            
            <div className="flex items-center mt-4 p-2 bg-gray-50 rounded-lg">
              <div className="flex-1 bg-white rounded px-3 py-2 text-gray-500 text-sm">
                Type your integration request...
              </div>
              <Button size="sm" className="ml-2">Send</Button>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'predictive',
      title: 'Predictive Intelligence',
      description: 'AI predicts integration failures up to 72 hours in advance, automatically implementing preventive measures to maintain 99.99% uptime.',
      stats: 'Prevents 98% of potential failures',
      icon: <BarChart3 className="h-6 w-6" />,
      visual: (
        <div className="relative bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl p-6 h-80">
          {/* Predictive Dashboard */}
          <div className="bg-white rounded-lg h-full p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-800">Predictive Analytics</h4>
              <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                All Systems Healthy
              </div>
            </div>
            
            {/* Predictive Graph */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4 h-32">
              <div className="flex items-end justify-between h-full">
                {[85, 90, 88, 92, 87, 94, 91, 96].map((height, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div 
                      className="bg-gradient-to-t from-blue-500 to-blue-300 w-4 rounded-t animate-pulse"
                      style={{ height: `${height}%`, animationDelay: `${i * 0.1}s` }}
                    />
                    <span className="text-xs text-gray-500 mt-1">{i + 1}d</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Predictions */}
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-yellow-50 rounded border-l-4 border-yellow-400">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-yellow-600 mr-2" />
                  <span className="text-sm text-gray-700">API Rate Limit Warning</span>
                </div>
                <span className="text-xs text-yellow-600">In 18hrs</span>
              </div>
              
              <div className="flex items-center justify-between p-2 bg-green-50 rounded border-l-4 border-green-400">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm text-gray-700">Auto-optimization scheduled</span>
                </div>
                <span className="text-xs text-green-600">Tomorrow 2AM</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'healing',
      title: 'Self-Healing Systems',
      description: "When issues occur, IntelliFlow's AI agents automatically diagnose, repair, and optimize your integrations without human intervention.",
      stats: 'Average repair time: 30 seconds',
      icon: <Wrench className="h-6 w-6" />,
      visual: (
        <div className="relative bg-gradient-to-br from-emerald-900 to-teal-900 rounded-xl p-6 h-80">
          {/* System Diagram */}
          <div className="bg-white rounded-lg h-full p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-800">System Health Monitor</h4>
              <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full animate-pulse">
                AI Healing Active
              </div>
            </div>
            
            {/* System Components */}
            <div className="grid grid-cols-3 gap-4 h-48">
              {/* Left Components */}
              <div className="space-y-3">
                <div className="bg-green-100 border border-green-300 rounded-lg p-3 text-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mx-auto mb-1"></div>
                  <span className="text-xs text-gray-700">Salesforce API</span>
                </div>
                <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3 text-center">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mx-auto mb-1 animate-pulse"></div>
                  <span className="text-xs text-gray-700">Rate Limiter</span>
                </div>
              </div>
              
              {/* Center - AI Agent */}
              <div className="flex items-center justify-center">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-4" style={{ animation: 'spin 3s linear infinite' }}>
                  <Wrench className="h-6 w-6 text-white" />
                </div>
              </div>
              
              {/* Right Components */}
              <div className="space-y-3">
                <div className="bg-green-100 border border-green-300 rounded-lg p-3 text-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mx-auto mb-1"></div>
                  <span className="text-xs text-gray-700">QuickBooks</span>
                </div>
                <div className="bg-red-100 border border-red-300 rounded-lg p-3 text-center relative">
                  <div className="w-2 h-2 bg-red-500 rounded-full mx-auto mb-1"></div>
                  <span className="text-xs text-gray-700">Webhook</span>
                  <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs px-1 rounded-full animate-pulse">
                    Healing
                  </div>
                </div>
              </div>
            </div>
            
            {/* Healing Log */}
            <div className="mt-4 text-xs space-y-1">
              <div className="text-green-600">✅ Issue detected: Webhook timeout</div>
              <div className="text-blue-600">🔧 Applying fix: Retry with exponential backoff</div>
              <div className="text-green-600">✅ Integration restored - 23 seconds</div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const activeFeature = features.find(f => f.id === activeTab) || features[0];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Tab Navigation */}
      <div className="flex flex-wrap justify-center mb-8 bg-gray-100 rounded-2xl p-2">
        {features.map((feature) => (
          <button
            key={feature.id}
            onClick={() => setActiveTab(feature.id)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              activeTab === feature.id
                ? 'bg-white text-blue-600 shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {feature.icon}
            <span className="hidden sm:inline">{feature.title}</span>
          </button>
        ))}
      </div>

      {/* Active Feature Content */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Visual Panel */}
            <div className="p-8 bg-gray-50">
              {activeFeature.visual}
            </div>
            
            {/* Content Panel */}
            <div className="p-8 flex flex-col justify-center">
              <div className="mb-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white">
                    {activeFeature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{activeFeature.title}</h3>
                </div>
                
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  {activeFeature.description}
                </p>
                
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    <span className="text-blue-900 font-semibold">{activeFeature.stats}</span>
                  </div>
                </div>
              </div>
              
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                <Play className="mr-2 h-4 w-4" />
                Try AI Demo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIFeaturesShowcase;