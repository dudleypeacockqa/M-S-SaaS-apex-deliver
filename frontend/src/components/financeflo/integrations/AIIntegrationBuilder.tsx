import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Sparkles, 
  Send, 
  CheckCircle, 
  Clock, 
  ArrowRight, 
  Wand2,
  Brain,
  Zap,
  Code,
  Settings,
  Play
} from 'lucide-react';
import AIThinkingIndicator from '@/components/brand/AIThinkingIndicator';

interface AIResponse {
  analysis: string;
  steps: string[];
  estimatedTime: string;
  confidence: number;
  code?: string;
  config?: any;
}

export const AIIntegrationBuilder: React.FC = () => {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [activeTab, setActiveTab] = useState('natural');
  const [buildStep, setBuildStep] = useState(0);

  const examplePrompts = [
    "Connect Salesforce to QuickBooks for real-time customer data sync",
    "Sync inventory levels between Shopify and warehouse management system",
    "Automate invoice processing from Gmail to accounting software",
    "Create workflow that updates CRM when orders are shipped",
    "Integrate HR system with payroll for employee data synchronization"
  ];

  const handleSubmit = async () => {
    if (!input.trim()) return;
    
    setIsProcessing(true);
    setResponse(null);
    setBuildStep(0);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockResponse: AIResponse = {
      analysis: "I'll create a bi-directional integration that ensures real-time data synchronization between your systems while maintaining data integrity and handling conflicts intelligently.",
      steps: [
        "Authenticate with both system APIs",
        "Map data fields and relationships", 
        "Configure real-time webhooks",
        "Set up data transformation rules",
        "Enable conflict resolution",
        "Deploy and test integration"
      ],
      estimatedTime: "2 minutes",
      confidence: 96,
      code: `// Generated Integration Code
const integration = {
  source: "salesforce",
  target: "quickbooks", 
  mapping: {
    "Account.Name": "Customer.CompanyName",
    "Account.Email": "Customer.Email"
  },
  triggers: ["create", "update"],
  webhooks: true
};`,
      config: {
        authType: "OAuth2",
        rateLimit: "1000/hour",
        retryPolicy: "exponential",
        errorHandling: "deadletter"
      }
    };
    
    setResponse(mockResponse);
    setIsProcessing(false);
    
    // Simulate build steps
    const totalSteps = mockResponse.steps.length;
    for (let i = 0; i <= totalSteps; i++) {
      setTimeout(() => setBuildStep(i), i * 500);
    }
  };

  const deployIntegration = () => {
    // Simulate deployment
    console.log('Deploying integration...');
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <Badge variant="secondary" className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700">
          <Brain className="w-4 h-4 mr-2" />
          AI-Powered Builder
        </Badge>
        <h2 className="text-3xl font-bold">Build Integrations with AI</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Describe your integration needs in natural language, and our AI will generate a complete, production-ready integration in minutes.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="natural" className="flex items-center gap-2">
            <Wand2 className="h-4 w-4" />
            Natural Language
          </TabsTrigger>
          <TabsTrigger value="template" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            Advanced
          </TabsTrigger>
        </TabsList>

        <TabsContent value="natural" className="space-y-6">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Describe Your Integration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe what systems you want to connect and what data should flow between them..."
                className="min-h-[100px]"
              />
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleSubmit}
                  disabled={!input.trim() || isProcessing}
                  className="bg-gradient-to-r from-primary to-primary/80"
                >
                  {isProcessing ? (
                    <AIThinkingIndicator size="sm" />
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Generate Integration
                    </>
                  )}
                </Button>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Quick examples:</p>
                <div className="flex flex-wrap gap-2">
                  {examplePrompts.slice(0, 2).map((prompt, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setInput(prompt)}
                      className="text-xs"
                    >
                      {prompt}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Processing */}
          {isProcessing && (
            <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <AIThinkingIndicator />
                  <div className="space-y-1">
                    <p className="font-semibold">AI is analyzing your requirements...</p>
                    <p className="text-sm text-muted-foreground">Generating optimal integration architecture</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* AI Response */}
          {response && (
            <Card className="border-success/20 bg-gradient-to-r from-success/5 to-success/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-success">
                  <CheckCircle className="w-5 h-5" />
                  Integration Plan Generated
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-background rounded-lg border">
                    <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Setup Time</p>
                    <p className="font-bold text-lg">{response.estimatedTime}</p>
                  </div>
                  <div className="text-center p-4 bg-background rounded-lg border">
                    <Brain className="w-6 h-6 text-primary mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">AI Confidence</p>
                    <p className="font-bold text-lg">{response.confidence}%</p>
                  </div>
                  <div className="text-center p-4 bg-background rounded-lg border">
                    <Zap className="w-6 h-6 text-primary mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Complexity</p>
                    <p className="font-bold text-lg">Medium</p>
                  </div>
                </div>

                {/* Analysis */}
                <div className="bg-background rounded-lg p-4 border">
                  <h4 className="font-semibold mb-2">AI Analysis:</h4>
                  <p className="text-muted-foreground">{response.analysis}</p>
                </div>

                {/* Build Steps */}
                <div className="bg-background rounded-lg p-4 border">
                  <h4 className="font-semibold mb-4">Implementation Progress:</h4>
                  <div className="space-y-3">
                    {response.steps.map((step, index) => (
                      <div 
                        key={index} 
                        className={`flex items-center gap-3 transition-all duration-300 ${
                          buildStep > index ? 'opacity-100' : 'opacity-50'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                          buildStep > index 
                            ? 'bg-success text-success-foreground' 
                            : buildStep === index
                            ? 'bg-primary text-primary-foreground animate-pulse'
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {buildStep > index ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            index + 1
                          )}
                        </div>
                        <p className={buildStep > index ? 'text-foreground' : 'text-muted-foreground'}>
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>
                  {buildStep < response.steps.length && (
                    <Progress 
                      value={(buildStep / response.steps.length) * 100} 
                      className="mt-4" 
                    />
                  )}
                </div>

                {/* Action Buttons */}
                {buildStep >= response.steps.length && (
                  <div className="flex justify-center gap-4 pt-4">
                    <Button variant="outline" onClick={() => setActiveTab('advanced')}>
                      <Code className="w-4 h-4 mr-2" />
                      View Code
                    </Button>
                    <Button onClick={deployIntegration} className="bg-success hover:bg-success/90">
                      <Play className="w-4 h-4 mr-2" />
                      Deploy Integration
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="template" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'CRM to Accounting', category: 'Sales & Finance', popular: true },
              { name: 'E-commerce to Inventory', category: 'Retail', popular: true },
              { name: 'HR to Payroll', category: 'Human Resources' },
              { name: 'Marketing to CRM', category: 'Marketing' },
              { name: 'Support to Knowledge Base', category: 'Customer Service' },
              { name: 'Project Management to Time Tracking', category: 'Operations' }
            ].map((template, index) => (
              <Card key={index} className="hover:border-primary/50 cursor-pointer transition-colors">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{template.name}</h4>
                      {template.popular && (
                        <Badge variant="secondary" className="text-xs">Popular</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{template.category}</p>
                    <Button size="sm" variant="outline" className="w-full">
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          {response && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Generated Code</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                    <code>{response.code}</code>
                  </pre>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Configuration</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                    <code>{JSON.stringify(response.config, null, 2)}</code>
                  </pre>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};