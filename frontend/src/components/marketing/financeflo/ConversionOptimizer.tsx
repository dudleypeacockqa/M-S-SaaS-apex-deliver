
import React, { useEffect, useState, useCallback } from 'react';
import { useAnalytics } from '@/hooks/marketing/financeflo/useAnalytics';

interface FunnelStep {
  step: string;
  conversions: number;
  rate: number;
}

interface HeatmapData {
  element: string;
  clicks: number;
  scrollDepth: number;
}

interface UserMetrics {
  bounceRate: number;
  avgTimeOnPage: number;
  conversionRate: number;
  pageViews: number;
}

interface ConversionOptimizerProps {
  enableHeatmap?: boolean;
  enableScrollTracking?: boolean;
  funnelSteps?: Array<{ name: string }>;
  children: React.ReactNode;
}

const ConversionOptimizer: React.FC<ConversionOptimizerProps> = ({
  enableHeatmap = true,
  enableScrollTracking = true,
  funnelSteps = [
    { name: 'page_view' },
    { name: 'scroll_50' },
    { name: 'cta_click' },
    { name: 'form_start' },
    { name: 'form_submit' }
  ],
  children
}) => {
  const [funnelData, setFunnelData] = useState<FunnelStep[]>([]);
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([]);
  const [userMetrics, setUserMetrics] = useState<UserMetrics>({
    bounceRate: 0,
    avgTimeOnPage: 0,
    conversionRate: 0,
    pageViews: 0
  });
  const [isOptimizing, setIsOptimizing] = useState(false);
  
  const { trackEvent, trackScrollDepth } = useAnalytics();

  // Track scroll depth for optimization
  const handleScroll = useCallback(() => {
    if (!enableScrollTracking) return;

    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = Math.round((scrollTop / docHeight) * 100);

    if (scrollPercent >= 25 && scrollPercent < 50) {
      trackScrollDepth(25, 100);
    } else if (scrollPercent >= 50 && scrollPercent < 75) {
      trackScrollDepth(50, 100);
    } else if (scrollPercent >= 75 && scrollPercent < 100) {
      trackScrollDepth(75, 100);
    } else if (scrollPercent >= 100) {
      trackScrollDepth(100, 100);
    }
  }, [enableScrollTracking, trackScrollDepth]);

  // Track clicks for heatmap data
  const handleClick = useCallback((event: MouseEvent) => {
    if (!enableHeatmap) return;

    const target = event.target as HTMLElement;
    const elementType = target.tagName.toLowerCase();
    const elementClass = target.className;
    const elementId = target.id;
    
    const elementIdentifier = elementId ? `#${elementId}` : 
                            elementClass ? `.${elementClass.split(' ')[0]}` : 
                            elementType;

    trackEvent({
      category: 'Heatmap',
      action: 'Click',
      label: elementIdentifier,
      customProperties: {
        element_type: elementType,
        element_class: elementClass,
        element_id: elementId,
        page_x: event.pageX,
        page_y: event.pageY
      }
    });
  }, [enableHeatmap, trackEvent]);

  // Initialize optimization tracking
  useEffect(() => {
    if (enableScrollTracking) {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }
    
    if (enableHeatmap) {
      document.addEventListener('click', handleClick);
    }

    return () => {
      if (enableScrollTracking) {
        window.removeEventListener('scroll', handleScroll);
      }
      if (enableHeatmap) {
        document.removeEventListener('click', handleClick);
      }
    };
  }, [enableScrollTracking, enableHeatmap, handleScroll, handleClick]);

  // Generate mock funnel data based on funnelSteps
  useEffect(() => {
    const generateFunnelData = () => {
      const mockData: FunnelStep[] = funnelSteps.map((step, index) => {
        const baseUsers = 1000;
        const dropoffRate = index * 0.2; // 20% dropoff per step
        const remainingUsers = Math.round(baseUsers * (1 - dropoffRate));
        const conversionRate = index === 0 ? 100 : Math.round(((remainingUsers / baseUsers) * 100));
        
        return {
          step: step.name,
          conversions: remainingUsers,
          rate: conversionRate
        };
      });
      
      setFunnelData(mockData);
    };

    generateFunnelData();
  }, [funnelSteps]);

  // Generate mock user metrics
  useEffect(() => {
    const generateUserMetrics = () => {
      setUserMetrics({
        bounceRate: 35.2,
        avgTimeOnPage: 145,
        conversionRate: 8.7,
        pageViews: 2450
      });
    };

    generateUserMetrics();
  }, []);

  // Optimization recommendations based on data
  const getOptimizationRecommendations = () => {
    const recommendations = [];
    
    if (userMetrics.bounceRate > 40) {
      recommendations.push("High bounce rate detected. Consider improving page loading speed and hero section.");
    }
    
    if (userMetrics.avgTimeOnPage < 120) {
      recommendations.push("Low time on page. Add more engaging content or interactive elements.");
    }
    
    if (userMetrics.conversionRate < 5) {
      recommendations.push("Low conversion rate. Optimize call-to-action buttons and form placement.");
    }

    return recommendations;
  };

  return (
    <div className="conversion-optimizer">
      {children}
      
      {/* Optimization Dashboard - Only visible in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-white shadow-2xl rounded-lg p-4 max-w-sm z-50 border">
          <h3 className="font-bold text-sm mb-2">Conversion Optimizer</h3>
          
          {/* Funnel Analysis */}
          <div className="mb-3">
            <h4 className="font-semibold text-xs mb-1">Funnel Performance</h4>
            <div className="space-y-1">
              {funnelData.map((step, index) => (
                <div key={index} className="flex justify-between text-xs">
                  <span className="capitalize">{step.step.replace('_', ' ')}</span>
                  <span className="font-mono">{step.conversions} ({step.rate}%)</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Metrics */}
          <div className="mb-3">
            <h4 className="font-semibold text-xs mb-1">Key Metrics</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-600">Bounce:</span>
                <span className="font-mono ml-1">{userMetrics.bounceRate}%</span>
              </div>
              <div>
                <span className="text-gray-600">Time:</span>
                <span className="font-mono ml-1">{userMetrics.avgTimeOnPage}s</span>
              </div>
              <div>
                <span className="text-gray-600">Conv:</span>
                <span className="font-mono ml-1">{userMetrics.conversionRate}%</span>
              </div>
              <div>
                <span className="text-gray-600">Views:</span>
                <span className="font-mono ml-1">{userMetrics.pageViews}</span>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="mb-3">
            <h4 className="font-semibold text-xs mb-1">Recommendations</h4>
            <div className="text-xs text-gray-600">
              {getOptimizationRecommendations().length > 0 ? (
                <ul className="space-y-1">
                  {getOptimizationRecommendations().slice(0, 2).map((rec, index) => (
                    <li key={index} className="text-xs">• {rec}</li>
                  ))}
                </ul>
              ) : (
                <span className="text-green-600">All metrics looking good!</span>
              )}
            </div>
          </div>

          {/* Status Indicators */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full mr-1 ${enableHeatmap ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <span>Heatmap</span>
            </div>
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full mr-1 ${enableScrollTracking ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <span>Scroll</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversionOptimizer;
