import React from 'react';
import { Navigation } from '@/components/marketing/financeflo/Navigation';
import { Footer } from '@/components/marketing/financeflo/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/marketing/financeflo/ui/card';
import { Button } from '@/components/marketing/financeflo/ui/button';
import { Phone, MessageCircle, Clock, Globe, Zap, Shield } from 'lucide-react';

const VoiceAIDemoPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Voice AI Assistant Demo
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience our Synthflow-powered voice AI that understands your ERP needs and provides 
              instant solutions with human-like conversation quality.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <Card className="p-8 bg-gradient-to-br from-blue-50 to-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Phone className="h-8 w-8 text-blue-600" />
                  Call Our AI Assistant
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Speak directly with our AI assistant trained on 500+ ERP implementations.
                  </p>
                  
                  <div className="bg-white p-4 rounded-lg border">
                    <h3 className="font-semibold mb-2">What our AI Assistant can help with:</h3>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• ERP system recommendations</li>
                      <li>• ROI calculations and projections</li>
                      <li>• Implementation timelines</li>
                      <li>• Pricing and consultation booking</li>
                      <li>• Technical specifications</li>
                    </ul>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">24/7</div>
                      <div className="text-xs text-gray-600">Available</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">30s</div>
                      <div className="text-xs text-gray-600">Response</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">95%</div>
                      <div className="text-xs text-gray-600">Accuracy</div>
                    </div>
                  </div>

                  <Button 
                    size="lg" 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    onClick={() => window.open('tel:+447360539147', '_self')}
                  >
                    <Phone className="h-5 w-5 mr-2" />
                    Call Now: +44 7360 539147
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="p-8 bg-gradient-to-br from-green-50 to-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <MessageCircle className="h-8 w-8 text-green-600" />
                  Chat with AI Assistant
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Start a conversation with our AI chatbot for instant answers and guidance.
                  </p>
                  
                  <div className="bg-white p-4 rounded-lg border">
                    <h3 className="font-semibold mb-2">Try asking:</h3>
                    <div className="space-y-2">
                      <div className="text-sm bg-gray-100 p-2 rounded">"How can AI improve my finance processes?"</div>
                      <div className="text-sm bg-gray-100 p-2 rounded">"What's the ROI of ERP automation?"</div>
                      <div className="text-sm bg-gray-100 p-2 rounded">"Schedule a demo for my team"</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <Clock className="h-6 w-6 mx-auto text-green-500 mb-1" />
                      <div className="text-xs text-gray-600">Instant</div>
                    </div>
                    <div>
                      <Globe className="h-6 w-6 mx-auto text-blue-500 mb-1" />
                      <div className="text-xs text-gray-600">Multi-language</div>
                    </div>
                    <div>
                      <Shield className="h-6 w-6 mx-auto text-purple-500 mb-1" />
                      <div className="text-xs text-gray-600">Secure</div>
                    </div>
                  </div>

                  <Button 
                    size="lg" 
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                    disabled
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Chat Demo (Temporarily Unavailable)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default VoiceAIDemoPage;