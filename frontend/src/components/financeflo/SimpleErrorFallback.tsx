import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

const SimpleErrorFallback = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full bg-card border border-border rounded-lg p-6 shadow-lg text-center">
        <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
        
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Website Loading Issue
        </h1>
        
        <p className="text-muted-foreground mb-6">
          There was a problem loading the website. Please refresh the page to try again.
        </p>

        <Button 
          onClick={() => window.location.reload()}
          className="w-full"
          variant="default"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Page
        </Button>
      </div>
    </div>
  );
};

export default SimpleErrorFallback;