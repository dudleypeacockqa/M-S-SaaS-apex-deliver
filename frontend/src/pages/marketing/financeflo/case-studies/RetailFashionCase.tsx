import React from 'react';
import { Navigation } from '@/components/marketing/financeflo/Navigation';
import { Footer } from '@/components/marketing/financeflo/Footer';
import { Card, CardContent } from '@/components/marketing/financeflo/ui/card';
import { Button } from '@/components/marketing/financeflo/ui/button';
import { ArrowRight, ShoppingBag, TrendingUp, Zap } from 'lucide-react';

const RetailFashionCase: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <img 
              src="/images/case-studies/logos/retail-fashion.png" 
              alt="Retail Fashion Logo" 
              className="h-16 mx-auto mb-6"
            />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Retail Fashion: Inventory Optimization Success
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Fashion retailer reduced inventory costs by 40% with AI-powered demand forecasting.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="text-center">
              <CardContent className="pt-6">
                <ShoppingBag className="h-12 w-12 text-pink-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-gray-900 mb-2">40%</div>
                <div className="text-gray-600">Inventory reduction</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-gray-900 mb-2">25%</div>
                <div className="text-gray-600">Sales increase</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Zap className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-gray-900 mb-2">85%</div>
                <div className="text-gray-600">Forecast accuracy</div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-pink-600 to-purple-600">
              <a href="/contact">
                Retail Solutions Demo <ArrowRight className="h-5 w-5 ml-2" />
              </a>
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RetailFashionCase;