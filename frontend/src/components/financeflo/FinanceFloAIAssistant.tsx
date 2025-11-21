import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Calendar, Calculator, FileText, Phone } from 'lucide-react';

const FinanceFloAIAssistant: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-card to-accent/20 border-border/50 shadow-lg">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-[var(--gradient-primary)] rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="text-2xl">🤖</div>
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">
          FinanceFlo.ai Assistant
        </h3>
        <p className="text-sm text-muted-foreground mb-1">
          AI-Powered Finance Expert
        </p>
        <div className="w-full h-px bg-border mb-4"></div>
        <p className="text-sm text-foreground">
          👋 Hello! I'm your FinanceFlo.ai AI assistant. I'm here to help you transform your finance operations with our AI-powered ERP solutions. How can I assist you today?
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button
          onClick={() => handleNavigation('/contact')}
          className="bg-info hover:bg-info/90 text-info-foreground border-0 py-3 px-4 text-sm font-medium transition-all duration-200 hover:shadow-md"
          size="sm"
        >
          <Phone className="w-4 h-4 mr-2" />
          Book Demo Call
        </Button>
        
        <Button
          onClick={() => handleNavigation('/readiness-assessment')}
          className="bg-success hover:bg-success/90 text-success-foreground border-0 py-3 px-4 text-sm font-medium transition-all duration-200 hover:shadow-md"
          size="sm"
        >
          <Calculator className="w-4 h-4 mr-2" />
          Schedule Assessment
        </Button>
        
        <Button
          onClick={() => handleNavigation('/roi-calculator')}
          className="bg-warning hover:bg-warning/90 text-warning-foreground border-0 py-3 px-4 text-sm font-medium transition-all duration-200 hover:shadow-md"
          size="sm"
        >
          <Calculator className="w-4 h-4 mr-2" />
          ROI Calculator
        </Button>
        
        <Button
          onClick={() => handleNavigation('/implementation-guides')}
          variant="outline" 
          className="border-border hover:bg-accent hover:text-accent-foreground py-3 px-4 text-sm font-medium transition-all duration-200 hover:shadow-md"
          size="sm"
        >
          <FileText className="w-4 h-4 mr-2" />
          Download Guide
        </Button>
      </div>
    </Card>
  );
};

export default FinanceFloAIAssistant;