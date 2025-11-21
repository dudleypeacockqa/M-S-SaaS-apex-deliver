import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Send, Sparkles, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import AIThinkingIndicator from '@/components/brand/AIThinkingIndicator';

const examplePrompts = [
  "Connect Salesforce to QuickBooks for real-time customer data sync",
  "Integrate our e-commerce platform with inventory management system",
  "Set up automated invoice processing from Gmail attachments to accounting software",
  "Create a workflow that updates CRM when orders are shipped",
  "Sync employee data between HR system and payroll platform"
];

const simulatedResponses = {
  "Connect Salesforce to QuickBooks for real-time customer data sync": {
    analysis: "I'll create a bi-directional integration between Salesforce CRM and QuickBooks Online.",
    steps: [
      "Authenticate both Salesforce and QuickBooks APIs",
      "Map customer fields: Name, Email, Phone, Address",
      "Set up real-time webhooks for immediate data sync",
      "Configure data transformation rules",
      "Enable duplicate detection and conflict resolution"
    ],
    estimatedTime: "2 minutes",
    confidence: 98
  },
  "Integrate our e-commerce platform with inventory management system": {
    analysis: "I'll establish a seamless connection between your e-commerce store and inventory system.",
    steps: [
      "Connect to e-commerce platform API (Shopify/WooCommerce/Magento)",
      "Link inventory management system",
      "Set up real-time stock level synchronization",
      "Configure low stock alerts and auto-reordering",
      "Enable product catalog synchronization"
    ],
    estimatedTime: "3 minutes",
    confidence: 95
  },
  "Set up automated invoice processing from Gmail attachments to accounting software": {
    analysis: "I'll create an intelligent document processing workflow with OCR capabilities.",
    steps: [
      "Monitor Gmail for invoice attachments",
      "Extract data using AI-powered OCR",
      "Validate and categorize invoice data",
      "Map to accounting software fields",
      "Auto-post to accounting system with approval workflow"
    ],
    estimatedTime: "4 minutes",
    confidence: 92
  },
  "Create a workflow that updates CRM when orders are shipped": {
    analysis: "I'll set up an automated trigger-based workflow for order status updates.",
    steps: [
      "Monitor shipping system for status changes",
      "Extract order and tracking information",
      "Match orders to CRM customer records",
      "Update opportunity/deal stages automatically",
      "Send customer notifications with tracking details"
    ],
    estimatedTime: "2 minutes",
    confidence: 97
  },
  "Sync employee data between HR system and payroll platform": {
    analysis: "I'll create a secure, compliant employee data synchronization workflow.",
    steps: [
      "Establish secure connections to both systems",
      "Map employee data fields and permissions",
      "Set up encrypted data transformation",
      "Configure change detection and approval workflows",
      "Enable audit logging for compliance"
    ],
    estimatedTime: "3 minutes",
    confidence: 96
  }
};

export function AIConfigurationDemo() {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [showSteps, setShowSteps] = useState(false);

  const handleSubmit = async () => {
    if (!input.trim()) return;
    
    setIsProcessing(true);
    setResponse(null);
    setShowSteps(false);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const matchedResponse = simulatedResponses[input as keyof typeof simulatedResponses] || {
      analysis: "I'll analyze your requirements and create a custom integration solution.",
      steps: [
        "Analyze source and target systems",
        "Design optimal data flow architecture",
        "Configure authentication and security",
        "Set up data transformation rules",
        "Deploy and test the integration"
      ],
      estimatedTime: "3 minutes",
      confidence: 94
    };
    
    setResponse(matchedResponse);
    setIsProcessing(false);
    
    // Show steps after a brief delay
    setTimeout(() => setShowSteps(true), 800);
  };

  const handleExamplePrompt = (prompt: string) => {
    setInput(prompt);
    setResponse(null);
    setShowSteps(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <Badge variant="secondary" className="bg-gradient-to-r from-blue-100 to-teal-100 text-blue-700 border-blue-200">
          <Sparkles className="w-4 h-4 mr-2" />
          Live AI Demo
        </Badge>
        <h3 className="text-2xl font-bold text-gray-900">
          Natural Language Integration Configuration
        </h3>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Describe your integration needs in plain English and watch IntelliFlow's AI instantly create a complete configuration plan.
        </p>
      </div>

      {/* Input Section */}
      <Card className="border-blue-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            Tell IntelliFlow what you need
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your integration requirements in plain English..."
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            />
            <Button 
              onClick={handleSubmit}
              disabled={!input.trim() || isProcessing}
              className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
            >
              {isProcessing ? <AIThinkingIndicator size="sm" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>
          
          {/* Example Prompts */}
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Try these examples:</p>
            <div className="flex flex-wrap gap-2">
              {examplePrompts.slice(0, 3).map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleExamplePrompt(prompt)}
                  className="text-xs hover:bg-blue-50 hover:border-blue-300"
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
        <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-teal-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <AIThinkingIndicator />
              <div className="space-y-1">
                <p className="font-semibold text-blue-900">IntelliFlow AI is analyzing your request...</p>
                <p className="text-sm text-blue-700">Designing optimal integration architecture</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Response */}
      {response && (
        <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <CheckCircle className="w-5 h-5" />
              Configuration Generated Successfully
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-white rounded-lg border border-green-200">
                <Clock className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Estimated Setup</p>
                <p className="font-bold text-green-700">{response.estimatedTime}</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border border-green-200">
                <Sparkles className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">AI Confidence</p>
                <p className="font-bold text-green-700">{response.confidence}%</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border border-green-200">
                <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Status</p>
                <p className="font-bold text-green-700">Ready to Deploy</p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">AI Analysis:</h4>
              <p className="text-gray-700">{response.analysis}</p>
            </div>

            {showSteps && (
              <div className="bg-white rounded-lg p-4 border border-green-200 animate-fade-in">
                <h4 className="font-semibold text-green-800 mb-3">Implementation Steps:</h4>
                <div className="space-y-2">
                  {response.steps.map((step: string, index: number) => (
                    <div key={index} className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: `${index * 200}ms` }}>
                      <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </div>
                      <p className="text-gray-700">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-center pt-4">
              <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                Deploy This Integration
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}