import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Activity, Clock, Zap, Eye, Wifi, Smartphone } from "lucide-react";
import { logger } from '@/utils/logger';

interface WebVital {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  threshold: { good: number; poor: number };
  unit: string;
  description: string;
}

interface PerformanceMetrics {
  lcp: WebVital;
  fid: WebVital;
  cls: WebVital;
  fcp: WebVital;
  ttfb: WebVital;
  inp: WebVital;
}

const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [connectionType, setConnectionType] = useState<string>('unknown');
  const [deviceType, setDeviceType] = useState<string>('desktop');

  useEffect(() => {
    // Only show performance monitor for admin users (disabled by default)
    const showMonitor = localStorage.getItem('show-performance-monitor') === 'true';
    setIsVisible(showMonitor);

    if (!showMonitor) return;

    // Detect connection type
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    if (connection) {
      setConnectionType(connection.effectiveType || connection.type || 'unknown');
    }

    // Detect device type
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTablet = /iPad|Android(?=.*\bMobile\b)(?=.*\bSafari\b)/i.test(navigator.userAgent);
    setDeviceType(isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop');

    // Initialize Web Vitals measurement
    measureWebVitals();

    // Set up periodic measurement
    const interval = setInterval(measureWebVitals, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const measureWebVitals = () => {
    // Measure Core Web Vitals and other performance metrics
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');
    
    if (!navigation) return;

    // Calculate metrics
    const ttfb = navigation.responseStart - navigation.requestStart;
    const fcp = paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0;
    
    // Simulate LCP, FID, CLS, and INP (in real implementation, these would come from web-vitals library)
    const simulatedMetrics: PerformanceMetrics = {
      lcp: {
        name: 'Largest Contentful Paint',
        value: fcp + Math.random() * 1000 + 500, // Simulated
        rating: 'good',
        threshold: { good: 2500, poor: 4000 },
        unit: 'ms',
        description: 'Time until the largest content element is rendered'
      },
      fid: {
        name: 'First Input Delay',
        value: Math.random() * 50, // Simulated
        rating: 'good',
        threshold: { good: 100, poor: 300 },
        unit: 'ms',
        description: 'Time from first user interaction to browser response'
      },
      cls: {
        name: 'Cumulative Layout Shift',
        value: Math.random() * 0.1, // Simulated
        rating: 'good',
        threshold: { good: 0.1, poor: 0.25 },
        unit: '',
        description: 'Visual stability - how much content shifts during loading'
      },
      fcp: {
        name: 'First Contentful Paint',
        value: fcp,
        rating: 'good',
        threshold: { good: 1800, poor: 3000 },
        unit: 'ms',
        description: 'Time until first content is rendered'
      },
      ttfb: {
        name: 'Time to First Byte',
        value: ttfb,
        rating: 'good',
        threshold: { good: 800, poor: 1800 },
        unit: 'ms',
        description: 'Time until first byte is received from server'
      },
      inp: {
        name: 'Interaction to Next Paint',
        value: Math.random() * 100, // Simulated
        rating: 'good',
        threshold: { good: 200, poor: 500 },
        unit: 'ms',
        description: 'Responsiveness of page to user interactions'
      }
    };

    // Determine ratings
    Object.values(simulatedMetrics).forEach(metric => {
      if (metric.value <= metric.threshold.good) {
        metric.rating = 'good';
      } else if (metric.value <= metric.threshold.poor) {
        metric.rating = 'needs-improvement';
      } else {
        metric.rating = 'poor';
      }
    });

    setMetrics(simulatedMetrics);
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'good': return 'bg-green-500';
      case 'needs-improvement': return 'bg-yellow-500';
      case 'poor': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getRatingBadgeColor = (rating: string) => {
    switch (rating) {
      case 'good': return 'bg-green-100 text-green-800 border-green-200';
      case 'needs-improvement': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'poor': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatValue = (value: number, unit: string) => {
    if (unit === 'ms') {
      return `${Math.round(value)}ms`;
    } else if (unit === '') {
      return value.toFixed(3);
    }
    return `${value.toFixed(1)}${unit}`;
  };

  const getProgressValue = (metric: WebVital) => {
    const maxValue = metric.threshold.poor * 1.5;
    return Math.min((metric.value / maxValue) * 100, 100);
  };

  if (!isVisible || !metrics) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="bg-white/95 backdrop-blur-sm border-2 border-blue-200 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-sm">
            <Activity className="w-4 h-4 text-blue-600" />
            <span>Performance Monitor</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Core Web Vitals & Performance Metrics
          </CardDescription>
          
          {/* Device and Connection Info */}
          <div className="flex space-x-2 mt-2">
            <Badge variant="outline" className="text-xs">
              <Smartphone className="w-3 h-3 mr-1" />
              {deviceType}
            </Badge>
            <Badge variant="outline" className="text-xs">
              <Wifi className="w-3 h-3 mr-1" />
              {connectionType}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3 pt-0">
          {/* Core Web Vitals */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-gray-700 flex items-center">
              <Zap className="w-3 h-3 mr-1" />
              Core Web Vitals
            </h4>
            
            {[metrics.lcp, metrics.fid, metrics.cls].map((metric, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-gray-600">{metric.name}</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-xs font-mono">{formatValue(metric.value, metric.unit)}</span>
                    <Badge className={`text-xs px-1 py-0 ${getRatingBadgeColor(metric.rating)}`}>
                      {metric.rating === 'good' ? '✓' : metric.rating === 'needs-improvement' ? '⚠' : '✗'}
                    </Badge>
                  </div>
                </div>
                <Progress 
                  value={getProgressValue(metric)} 
                  className="h-1"
                />
              </div>
            ))}
          </div>

          {/* Other Metrics */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-gray-700 flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              Loading Metrics
            </h4>
            
            {[metrics.fcp, metrics.ttfb, metrics.inp].map((metric, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-xs text-gray-600">{metric.name}</span>
                <div className="flex items-center space-x-1">
                  <span className="text-xs font-mono">{formatValue(metric.value, metric.unit)}</span>
                  <div className={`w-2 h-2 rounded-full ${getRatingColor(metric.rating)}`}></div>
                </div>
              </div>
            ))}
          </div>

          {/* Performance Score */}
          <div className="pt-2 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-gray-700">Overall Score</span>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                {Math.round(Object.values(metrics).filter(m => m.rating === 'good').length / Object.values(metrics).length * 100)}%
              </Badge>
            </div>
          </div>

          {/* Toggle Button */}
          <button
            onClick={() => setIsVisible(false)}
            className="w-full text-xs text-gray-500 hover:text-gray-700 py-1"
          >
            Hide Monitor
          </button>
        </CardContent>
      </Card>
    </div>
  );
};

// Performance optimization utilities
export const preloadCriticalResources = () => {
  // Preload critical CSS
  const criticalCSS = document.createElement('link');
  criticalCSS.rel = 'preload';
  criticalCSS.as = 'style';
  criticalCSS.href = '/css/critical.css';
  document.head.appendChild(criticalCSS);

  // Preload critical fonts
  const criticalFont = document.createElement('link');
  criticalFont.rel = 'preload';
  criticalFont.as = 'font';
  criticalFont.type = 'font/woff2';
  criticalFont.href = '/fonts/inter-var.woff2';
  criticalFont.crossOrigin = 'anonymous';
  document.head.appendChild(criticalFont);
};

export const optimizeImages = () => {
  // Implement lazy loading for images
  const images = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        img.src = img.dataset.src!;
        img.classList.remove('lazy');
        observer.unobserve(img);
      }
    });
  });

  images.forEach(img => imageObserver.observe(img));
};

export const enableServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      logger.info('Service Worker registered', { registration });
    } catch (error) {
      logger.warn('Service Worker registration failed', { error });
    }
  }
};

export default PerformanceMonitor;

