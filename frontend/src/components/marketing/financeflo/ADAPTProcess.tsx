import React, { useState } from 'react';
import { ArrowRight, CheckCircle, Users, Database, BarChart3, Cog, Target } from 'lucide-react';
import { Button } from '@/components/marketing/financeflo/ui/button';
import { useSecureNavigation } from '@/hooks/marketing/financeflo/useSecureNavigation';

interface ADAPTStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  benefits: string[];
  timeline: string;
  deliverables: string[];
}

const adaptSteps: ADAPTStep[] = [
  {
    title: "Assess Current State",
    description: "Comprehensive analysis of your existing finance processes, systems, and pain points to create a baseline understanding.",
    icon: <BarChart3 className="h-8 w-8" />,
    benefits: [
      "Complete visibility into current workflows",
      "Identification of inefficiencies and bottlenecks",
      "Clear ROI projections for improvement areas",
      "Risk assessment and mitigation strategies"
    ],
    timeline: "Week 1-2",
    deliverables: [
      "Current State Assessment Report",
      "Process Flow Documentation",
      "ROI Analysis & Business Case",
      "Risk Assessment Matrix"
    ]
  },
  {
    title: "Design Solutions",
    description: "Create tailored AI+ERP integration solutions that address your specific business needs and objectives.",
    icon: <Cog className="h-8 w-8" />,
    benefits: [
      "Custom solution architecture",
      "Seamless integration with existing systems",
      "Scalable and future-proof design",
      "User-centric interface planning"
    ],
    timeline: "Week 3-4",
    deliverables: [
      "Solution Architecture Blueprint",
      "Integration Specifications",
      "User Experience Design",
      "Implementation Roadmap"
    ]
  },
  {
    title: "Automate Processes",
    description: "Implement intelligent automation that streamlines workflows while maintaining accuracy and compliance.",
    icon: <Target className="h-8 w-8" />,
    benefits: [
      "Eliminate manual data entry",
      "Reduce processing time by 70%",
      "Improve accuracy and compliance",
      "Enable real-time decision making"
    ],
    timeline: "Week 5-8",
    deliverables: [
      "Automated Workflow Systems",
      "AI-Powered Analytics Dashboard",
      "Integration Testing Results",
      "User Training Materials"
    ]
  },
  {
    title: "Pilot Implementation",
    description: "Controlled rollout with key stakeholders to validate solutions and gather feedback before full deployment.",
    icon: <Users className="h-8 w-8" />,
    benefits: [
      "Risk-free testing environment",
      "User feedback incorporation",
      "Performance optimization",
      "Change management support"
    ],
    timeline: "Week 9-10",
    deliverables: [
      "Pilot Results Report",
      "User Feedback Analysis",
      "Performance Metrics",
      "Optimization Recommendations"
    ]
  },
  {
    title: "Transform & Scale",
    description: "Full deployment across your organization with ongoing support and continuous improvement.",
    icon: <Database className="h-8 w-8" />,
    benefits: [
      "Organization-wide transformation",
      "Continuous performance monitoring",
      "Ongoing optimization and support",
      "Measurable ROI achievement"
    ],
    timeline: "Week 11+",
    deliverables: [
      "Full System Deployment",
      "Performance Monitoring Dashboard",
      "Ongoing Support Framework",
      "Success Metrics Tracking"
    ]
  }
];

interface ADAPTProcessProps {
  variant?: 'hero' | 'detailed' | 'compact';
  showCTA?: boolean;
  className?: string;
}

const ADAPTProcess: React.FC<ADAPTProcessProps> = ({ 
  variant = 'detailed', 
  showCTA = false,
  className = '' 
}) => {
  const { navigateTo } = useSecureNavigation();
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  if (variant === 'hero') {
    return (
      <section className={`py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-muted to-muted/50 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              The ADAPT Framework™
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Our proven 5-step methodology that transforms your finance operations
              from manual chaos to intelligent automation
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 mb-12">
            {adaptSteps.map((step, index) => (
              <div
                key={index}
                className="text-center group cursor-pointer transform transition-all duration-300 hover:scale-105 px-2"
                onMouseEnter={() => setHoveredStep(index)}
                onMouseLeave={() => setHoveredStep(null)}
              >
                <div className="bg-white rounded-full p-4 sm:p-6 shadow-lg mb-3 sm:mb-4 mx-auto w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center group-hover:shadow-xl transition-shadow">
                  <div className="text-primary group-hover:text-accent transition-colors">
                    {step.icon}
                  </div>
                </div>
                <h3 className="font-semibold text-sm sm:text-base text-foreground mb-1 sm:mb-2 group-hover:text-primary transition-colors px-1">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
                  {step.timeline}
                </p>
                {index < adaptSteps.length - 1 && (
                  <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 mx-auto mt-3 sm:mt-4 hidden lg:block" />
                )}
              </div>
            ))}
          </div>

          {showCTA && (
            <div className="text-center">
              <Button
                size="lg"
                variant="brand-cta"
                className="px-8 py-4 text-lg font-semibold"
                onClick={() => navigateTo('/contact')}
              >
                Start Your ADAPT Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </section>
    );
  }


  return (
    <section className={`py-12 sm:py-16 lg:py-20 bg-white ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Our Proven ADAPT Framework™
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            A systematic approach to transforming your finance operations with AI and ERP integration
          </p>
        </div>

        <div className="space-y-6 sm:space-y-8 lg:space-y-12">
          {adaptSteps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col lg:flex-row items-start gap-4 sm:gap-6 lg:gap-8 p-4 sm:p-6 lg:p-8 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="flex-shrink-0">
                <div className="bg-primary text-primary-foreground rounded-full p-3 sm:p-4 shadow-lg">
                  {step.icon}
                </div>
              </div>

              <div className="flex-grow w-full">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
                  <span className="bg-primary/10 text-primary text-xs sm:text-sm font-medium px-3 py-1 rounded-full">
                    Step {index + 1}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-500">{step.timeline}</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">{step.title}</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">{step.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <h4 className="font-semibold text-sm sm:text-base text-gray-900 mb-2 sm:mb-3">Key Benefits</h4>
                    <ul className="space-y-2">
                      {step.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="flex items-start">
                          <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-xs sm:text-sm text-gray-600">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm sm:text-base text-gray-900 mb-2 sm:mb-3">Deliverables</h4>
                    <ul className="space-y-2">
                      {step.deliverables.map((deliverable, deliverableIndex) => (
                        <li key={deliverableIndex} className="flex items-start">
                          <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-xs sm:text-sm text-gray-600">{deliverable}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showCTA && (
          <div className="text-center mt-12">
            <Button 
              size="lg" 
              variant="brand-cta"
              className="px-8 py-4 text-lg font-semibold"
              onClick={() => navigateTo('/contact')}
            >
              Get Started with ADAPT
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ADAPTProcess;
