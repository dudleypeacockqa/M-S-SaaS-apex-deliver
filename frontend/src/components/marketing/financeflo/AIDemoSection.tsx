import React, { useState, useEffect } from 'react';
import { Button } from '@/components/marketing/financeflo/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/marketing/financeflo/ui/card';
import { Badge } from '@/components/marketing/financeflo/ui/badge';
import { 
  Play, 
  MessageSquare, 
  BarChart3, 
  Wrench, 
  CheckCircle,
  AlertTriangle,
  Clock,
  Zap,
  ArrowRight,
  RefreshCw,
  Calendar,
  Loader2,
  Send,
  Monitor,
  Activity,
  Shield,
  Target
} from 'lucide-react';

interface DemoStep {
  id: string;
  title: string;
  description: string;
  duration: number;
  status: 'pending' | 'running' | 'completed';
}

const AIDemoSection = () => {
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  const [demoProgress, setDemoProgress] = useState(0);
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  // Demo 1: Natural Language Configuration
  const [nlcMessages, setNlcMessages] = useState([
    {
      type: 'system',
      content: 'IntelliFlow AI Assistant ready. Describe your integration needs in plain English.',
      timestamp: new Date()
    }
  ]);

  // Demo 2: Predictive Analytics Data
  const [analyticsData, setAnalyticsData] = useState({
    healthScore: 97,
    alerts: [
      { type: 'warning', message: 'Salesforce API rate limit approaching in 2 hours', severity: 'medium' },
      { type: 'info', message: 'Optimization opportunity detected in QuickBooks sync', severity: 'low' }
    ],
    predictions: [
      { system: 'HubSpot → Xero', confidence: 99, nextFailure: '72h', status: 'healthy' },
      { system: 'Salesforce → QuickBooks', confidence: 85, nextFailure: '18h', status: 'warning' }
    ]
  });

  // Demo 3: Self-Healing Steps
  const healingSteps: DemoStep[] = [
    {
      id: 'detect',
      title: 'Issue Detection',
      description: 'AI agent detects webhook timeout in QuickBooks integration',
      duration: 2000,
      status: 'pending'
    },
    {
      id: 'analyze',
      title: 'Root Cause Analysis',
      description: 'Analyzing network patterns and API response times',
      duration: 3000,
      status: 'pending'
    },
    {
      id: 'implement',
      title: 'Implement Fix',
      description: 'Applying exponential backoff retry mechanism',
      duration: 2500,
      status: 'pending'
    },
    {
      id: 'validate',
      title: 'Validation',
      description: 'Testing integration and confirming resolution',
      duration: 2000,
      status: 'pending'
    }
  ];

  const [healingProgress, setHealingProgress] = useState(healingSteps);

  const startDemo = (demoType: string) => {
    setActiveDemo(demoType);
    setDemoProgress(0);
    setCompletedSteps([]);
    
    if (demoType === 'healing') {
      setHealingProgress(healingSteps.map(step => ({ ...step, status: 'pending' })));
      startHealingDemo();
    } else if (demoType === 'analytics') {
      startAnalyticsDemo();
    }
  };

  const startHealingDemo = () => {
    let currentStep = 0;
    const runStep = () => {
      if (currentStep < healingSteps.length) {
        setHealingProgress(prev => 
          prev.map((step, index) => ({
            ...step,
            status: index === currentStep ? 'running' : index < currentStep ? 'completed' : 'pending'
          }))
        );

        setTimeout(() => {
          setHealingProgress(prev => 
            prev.map((step, index) => ({
              ...step,
              status: index === currentStep ? 'completed' : step.status
            }))
          );
          
          currentStep++;
          if (currentStep < healingSteps.length) {
            setTimeout(runStep, 500);
          }
        }, healingSteps[currentStep].duration);
      }
    };
    
    runStep();
  };

  const startAnalyticsDemo = () => {
    const interval = setInterval(() => {
      setAnalyticsData(prev => ({
        ...prev,
        healthScore: Math.max(95, prev.healthScore + (Math.random() - 0.5) * 2),
        predictions: prev.predictions.map(pred => ({
          ...pred,
          confidence: Math.max(80, Math.min(99, pred.confidence + (Math.random() - 0.5) * 5))
        }))
      }));
    }, 2000);

    setTimeout(() => clearInterval(interval), 15000);
  };

  const handleChatSubmit = () => {
    if (!chatInput.trim()) return;
    
    const userMessage = {
      type: 'user',
      content: chatInput,
      timestamp: new Date()
    };
    
    setNlcMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsLoading(true);

    // Simulate AI processing
    setTimeout(() => {
      const aiResponse = {
        type: 'ai',
        content: '✅ Integration configured! I\'ve set up HubSpot → Xero customer sync with invoice automation. Generating workflow diagram...',
        timestamp: new Date()
      };
      setNlcMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
      
      // Show workflow generation
      setTimeout(() => {
        const workflowMessage = {
          type: 'system',
          content: '🚀 Workflow active! Testing connection... 47 customers synced successfully.',
          timestamp: new Date()
        };
        setNlcMessages(prev => [...prev, workflowMessage]);
      }, 2000);
    }, 3000);
  };

  const resetDemo = (demoType: string) => {
    setActiveDemo(null);
    setDemoProgress(0);
    if (demoType === 'nlc') {
      setNlcMessages([nlcMessages[0]]);
      setChatInput('');
    }
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="max-w-7xl mx-auto">
        {/* Demo Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Experience IntelliFlow AI in Action
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            See how our AI agents work autonomously to solve integration challenges
          </p>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge variant="outline" className="bg-white/10 text-white border-white/20">
              <Shield className="h-4 w-4 mr-2" />
              No Installation Required
            </Badge>
            <Badge variant="outline" className="bg-white/10 text-white border-white/20">
              <Clock className="h-4 w-4 mr-2" />
              See Results in 30 Seconds
            </Badge>
            <Badge variant="outline" className="bg-white/10 text-white border-white/20">
              <Monitor className="h-4 w-4 mr-2" />
              Live Demo Available
            </Badge>
          </div>
        </div>

        {/* Demo Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          
          {/* Demo 1: Natural Language Configuration */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white overflow-hidden">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-white">Natural Language Config</CardTitle>
                  <p className="text-gray-300 text-sm">Configure integrations in plain English</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeDemo === 'nlc' ? (
                <div className="space-y-4">
                  {/* Chat Messages */}
                  <div className="bg-gray-800 rounded-lg p-4 h-64 overflow-y-auto">
                    {nlcMessages.map((message, index) => (
                      <div key={index} className={`mb-3 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                        <div className={`inline-block p-2 rounded-lg max-w-xs ${
                          message.type === 'user' 
                            ? 'bg-blue-600 text-white' 
                            : message.type === 'ai'
                            ? 'bg-gray-700 text-gray-100'
                            : 'bg-green-700 text-green-100'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex items-center space-x-2 text-gray-400">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">AI processing...</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Chat Input */}
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Connect HubSpot to Xero and sync all new customers..."
                      className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400"
                      onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
                    />
                    <Button onClick={handleChatSubmit} disabled={isLoading} size="sm">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <Button variant="outline" onClick={() => resetDemo('nlc')} className="w-full">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset Demo
                  </Button>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <p className="text-gray-300">
                    Try our natural language interface. Simply describe your integration needs.
                  </p>
                  <Button onClick={() => startDemo('nlc')} className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600">
                    <Play className="h-4 w-4 mr-2" />
                    Start Demo
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Demo 2: Predictive Analytics Dashboard */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white overflow-hidden">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-white">Predictive Analytics</CardTitle>
                  <p className="text-gray-300 text-sm">AI-powered failure prediction</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeDemo === 'analytics' ? (
                <div className="space-y-4">
                  {/* Health Score */}
                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-300">Overall Health</span>
                      <Badge className="bg-green-600">{analyticsData.healthScore}%</Badge>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-teal-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${analyticsData.healthScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Alerts */}
                  <div className="space-y-2">
                    {analyticsData.alerts.map((alert, index) => (
                      <div key={index} className="bg-gray-800 rounded-lg p-3 border-l-4 border-yellow-500">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm text-gray-300">{alert.message}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Predictions */}
                  <div className="space-y-2">
                    {analyticsData.predictions.map((pred, index) => (
                      <div key={index} className="bg-gray-800 rounded-lg p-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-white">{pred.system}</span>
                          <Badge className={pred.status === 'healthy' ? 'bg-green-600' : 'bg-yellow-600'}>
                            {pred.confidence}%
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-400">Next check: {pred.nextFailure}</div>
                      </div>
                    ))}
                  </div>

                  <Button variant="outline" onClick={() => setActiveDemo(null)} className="w-full">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset Demo
                  </Button>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <p className="text-gray-300">
                    See real-time predictions and health monitoring in action.
                  </p>
                  <Button onClick={() => startDemo('analytics')} className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                    <Play className="h-4 w-4 mr-2" />
                    Start Demo
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Demo 3: Self-Healing in Action */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white overflow-hidden">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <Wrench className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-white">Self-Healing Systems</CardTitle>
                  <p className="text-gray-300 text-sm">Automatic issue resolution</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeDemo === 'healing' ? (
                <div className="space-y-4">
                  {/* Healing Steps */}
                  <div className="space-y-3">
                    {healingProgress.map((step) => (
                      <div key={step.id} className="bg-gray-800 rounded-lg p-3">
                        <div className="flex items-center space-x-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            step.status === 'completed' ? 'bg-green-600' :
                            step.status === 'running' ? 'bg-blue-600' : 'bg-gray-600'
                          }`}>
                            {step.status === 'completed' ? (
                              <CheckCircle className="h-4 w-4 text-white" />
                            ) : step.status === 'running' ? (
                              <Loader2 className="h-4 w-4 text-white animate-spin" />
                            ) : (
                              <Clock className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-white text-sm">{step.title}</div>
                            <div className="text-gray-400 text-xs">{step.description}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Success Message */}
                  {healingProgress.every(step => step.status === 'completed') && (
                    <div className="bg-green-800 border border-green-600 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                        <span className="text-green-100 font-medium">Integration fully restored!</span>
                      </div>
                      <div className="text-green-200 text-sm mt-1">Resolution time: 9.2 seconds</div>
                    </div>
                  )}

                  <Button variant="outline" onClick={() => startDemo('healing')} className="w-full">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Run Again
                  </Button>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <p className="text-gray-300">
                    Watch AI agents automatically detect and fix integration issues.
                  </p>
                  <Button onClick={() => startDemo('healing')} className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                    <Play className="h-4 w-4 mr-2" />
                    Start Demo
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center space-y-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to see IntelliFlow in your environment?
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Schedule a personalized demo with your actual systems and data. 
              See exactly how IntelliFlow AI will transform your integrations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Calendar className="h-5 w-5 mr-2" />
                Schedule Live Demo
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-gray-900"
                onClick={() => window.location.href = '/ipaas/free-trial'}
              >
                <Target className="h-5 w-5 mr-2" />
                Start Free Trial
              </Button>
            </div>
          </div>

          {/* Technical Specs */}
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-white font-semibold mb-1">Real-time Processing</h4>
              <p className="text-gray-400 text-sm">Sub-second response times</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-white font-semibold mb-1">Enterprise Security</h4>
              <p className="text-gray-400 text-sm">SOC 2 & ISO 27001 certified</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-white font-semibold mb-1">99.99% Uptime</h4>
              <p className="text-gray-400 text-sm">SLA-backed reliability</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-600 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <Target className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-white font-semibold mb-1">500+ Integrations</h4>
              <p className="text-gray-400 text-sm">Pre-built connectors</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIDemoSection;