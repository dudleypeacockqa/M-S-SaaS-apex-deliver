import React, { useState } from 'react';
import { Button } from "@/components/marketing/financeflo/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/marketing/financeflo/ui/card";
import { Progress } from "@/components/marketing/financeflo/ui/progress";
import { Navigation } from "@/components/marketing/financeflo/Navigation";
import { Footer } from "@/components/marketing/financeflo/Footer";
import { handleFormSubmission } from '@/services/ghl';
import { CheckCircle, ArrowRight, Building, Users, Target, Clock, TrendingUp, Shield } from 'lucide-react';
import { logger } from "@/utils/financeflo/logger";

interface AssessmentQuestion {
  id: string;
  category: string;
  question: string;
  options: { value: number; label: string; description?: string }[];
  weight: number;
}

interface AssessmentResult {
  score: number;
  category: string;
  title: string;
  description: string;
  recommendations: string[];
  nextSteps: string[];
  estimatedROI: string;
  implementationTime: string;
}

const ReadinessAssessmentPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    phone: ''
  });

  const questions: AssessmentQuestion[] = [
    {
      id: 'company_size',
      category: 'Business Profile',
      question: 'What is your company size?',
      options: [
        { value: 1, label: 'Startup (1-10 employees)', description: 'Early stage with basic processes' },
        { value: 2, label: 'Small Business (11-50 employees)', description: 'Growing with some established processes' },
        { value: 3, label: 'Mid-Market (51-250 employees)', description: 'Established with complex operations' },
        { value: 4, label: 'Enterprise (250+ employees)', description: 'Large scale with sophisticated requirements' }
      ],
      weight: 1.2
    },
    {
      id: 'industry',
      category: 'Business Profile',
      question: 'Which industry best describes your business?',
      options: [
        { value: 8, label: 'Financial Services', description: 'Banking, insurance, investment management' },
        { value: 7, label: 'Private Equity', description: 'Investment funds and portfolio management' },
        { value: 6, label: 'Healthcare', description: 'Medical services and healthcare technology' },
        { value: 5, label: 'Manufacturing', description: 'Production and industrial operations' },
        { value: 4, label: 'Construction', description: 'Building and infrastructure projects' },
        { value: 3, label: 'Professional Services', description: 'Consulting and business services' },
        { value: 2, label: 'E-commerce', description: 'Online retail and digital commerce' },
        { value: 1, label: 'Other', description: 'Different industry vertical' }
      ],
      weight: 1.1
    },
    {
      id: 'current_systems',
      category: 'Technical Readiness',
      question: 'What ERP/Finance systems do you currently use?',
      options: [
        { value: 4, label: 'Enterprise ERP (SAP, Oracle, NetSuite)', description: 'Sophisticated enterprise systems' },
        { value: 3, label: 'Mid-Market ERP (Sage, Dynamics)', description: 'Established business systems' },
        { value: 2, label: 'Basic Accounting (QuickBooks, Xero)', description: 'Simple accounting software' },
        { value: 1, label: 'Spreadsheets/Manual Processes', description: 'Manual or basic tracking' }
      ],
      weight: 1.3
    },
    {
      id: 'pain_points',
      category: 'Pain Points Analysis',
      question: 'What is your biggest operational challenge?',
      options: [
        { value: 6, label: 'Manual Data Entry & Processing', description: 'Time-consuming manual work' },
        { value: 5, label: 'Lack of Real-Time Insights', description: 'Delayed or inaccurate reporting' },
        { value: 4, label: 'System Integration Issues', description: 'Disconnected systems and data silos' },
        { value: 3, label: 'Compliance & Risk Management', description: 'Regulatory and risk challenges' },
        { value: 2, label: 'Scalability Limitations', description: 'Systems can\'t handle growth' },
        { value: 1, label: 'Team Productivity', description: 'Inefficient workflows and processes' }
      ],
      weight: 1.4
    },
    {
      id: 'monthly_transactions',
      category: 'Business Scale',
      question: 'How many financial transactions do you process monthly?',
      options: [
        { value: 1, label: 'Under 1,000', description: 'Low volume operations' },
        { value: 2, label: '1,000 - 10,000', description: 'Moderate transaction volume' },
        { value: 3, label: '10,000 - 100,000', description: 'High volume operations' },
        { value: 4, label: 'Over 100,000', description: 'Enterprise-level transaction volume' }
      ],
      weight: 1.2
    },
    {
      id: 'automation_experience',
      category: 'Technical Readiness',
      question: 'What is your experience with automation and AI?',
      options: [
        { value: 4, label: 'Advanced - Using AI/ML in operations', description: 'Sophisticated automation implementation' },
        { value: 3, label: 'Intermediate - Some automation tools', description: 'Basic automation experience' },
        { value: 2, label: 'Beginner - Interested but limited experience', description: 'New to automation' },
        { value: 1, label: 'None - Completely manual processes', description: 'No automation experience' }
      ],
      weight: 1.1
    },
    {
      id: 'implementation_timeline',
      category: 'Implementation Readiness',
      question: 'What is your preferred implementation timeline?',
      options: [
        { value: 4, label: 'Immediate (Within 30 days)', description: 'Urgent implementation needed' },
        { value: 3, label: 'Short-term (1-3 months)', description: 'Quick implementation preferred' },
        { value: 2, label: 'Medium-term (3-6 months)', description: 'Planned implementation approach' },
        { value: 1, label: 'Long-term (6+ months)', description: 'Future consideration' }
      ],
      weight: 1.0
    },
    {
      id: 'budget_range',
      category: 'Investment Readiness',
      question: 'What is your budget range for AI automation?',
      options: [
        { value: 4, label: '£50,000+ annually', description: 'Enterprise-level investment' },
        { value: 3, label: '£20,000 - £50,000 annually', description: 'Substantial investment capacity' },
        { value: 2, label: '£5,000 - £20,000 annually', description: 'Moderate investment budget' },
        { value: 1, label: 'Under £5,000 annually', description: 'Limited investment budget' }
      ],
      weight: 1.2
    },
    {
      id: 'team_size',
      category: 'Implementation Readiness',
      question: 'How many people are in your finance team?',
      options: [
        { value: 4, label: '10+ team members', description: 'Large finance organization' },
        { value: 3, label: '5-10 team members', description: 'Medium-sized finance team' },
        { value: 2, label: '2-5 team members', description: 'Small finance team' },
        { value: 1, label: '1 person (just me)', description: 'Solo finance management' }
      ],
      weight: 1.0
    },
    {
      id: 'success_metrics',
      category: 'Success Criteria',
      question: 'What would define success for you?',
      options: [
        { value: 5, label: 'Significant ROI (300%+)', description: 'Substantial return on investment' },
        { value: 4, label: 'Time Savings (50%+ efficiency)', description: 'Major productivity improvements' },
        { value: 3, label: 'Better Decision Making', description: 'Enhanced insights and analytics' },
        { value: 2, label: 'Reduced Errors & Compliance', description: 'Improved accuracy and compliance' },
        { value: 1, label: 'Team Satisfaction', description: 'Better work experience for team' }
      ],
      weight: 1.1
    }
  ];

  const calculateResults = (): AssessmentResult => {
    let totalScore = 0;
    let maxScore = 0;

    questions.forEach(question => {
      const answer = answers[question.id] || 0;
      totalScore += answer * question.weight;
      maxScore += 4 * question.weight;
    });

    const percentage = Math.round((totalScore / maxScore) * 100);

    if (percentage >= 80) {
      return {
        score: percentage,
        category: 'Enterprise Ready',
        title: 'Excellent Fit for Advanced AI Automation',
        description: 'Your organization demonstrates exceptional readiness for enterprise-level AI automation. You have the scale, complexity, and resources to achieve significant ROI from our Adaptive Intelligence Framework™.',
        recommendations: [
          'Immediate implementation of full AI automation suite',
          'Enterprise-level customization and integration',
          'Advanced analytics and predictive modeling',
          'Dedicated implementation team and support',
          'Custom AI model training for your specific needs'
        ],
        nextSteps: [
          'Schedule executive strategy session',
          'Conduct detailed technical assessment',
          'Develop custom implementation roadmap',
          'Begin proof-of-concept development',
          'Establish success metrics and KPIs'
        ],
        estimatedROI: '400-600% within 12 months',
        implementationTime: '30-60 days'
      };
    } else if (percentage >= 60) {
      return {
        score: percentage,
        category: 'High Potential',
        title: 'Strong Candidate for AI Automation',
        description: 'Your organization shows strong potential for AI automation success. With some preparation and the right approach, you can achieve excellent results from our platform.',
        recommendations: [
          'Phased implementation approach starting with core modules',
          'Team training and change management support',
          'Integration with existing systems',
          'Regular optimization and performance monitoring',
          'Gradual expansion to advanced features'
        ],
        nextSteps: [
          'Book detailed consultation call',
          'Review current system architecture',
          'Develop phased implementation plan',
          'Identify quick wins and pilot projects',
          'Establish training and support framework'
        ],
        estimatedROI: '250-400% within 12 months',
        implementationTime: '60-90 days'
      };
    } else if (percentage >= 40) {
      return {
        score: percentage,
        category: 'Moderate Fit',
        title: 'Good Opportunity with Preparation',
        description: 'Your organization has good potential for AI automation, but may benefit from some foundational improvements before full implementation.',
        recommendations: [
          'Start with basic automation modules',
          'Focus on process standardization first',
          'Invest in team training and development',
          'Gradual system integration approach',
          'Build automation capabilities over time'
        ],
        nextSteps: [
          'Schedule consultation to discuss readiness',
          'Assess current process maturity',
          'Develop preparation roadmap',
          'Identify foundational improvements needed',
          'Plan gradual automation introduction'
        ],
        estimatedROI: '150-250% within 18 months',
        implementationTime: '90-120 days'
      };
    } else {
      return {
        score: percentage,
        category: 'Early Stage',
        title: 'Foundation Building Recommended',
        description: 'Your organization would benefit from establishing stronger operational foundations before implementing advanced AI automation.',
        recommendations: [
          'Focus on process standardization and documentation',
          'Invest in basic automation tools first',
          'Build team capabilities and training',
          'Establish data quality and governance',
          'Consider starting with consulting services'
        ],
        nextSteps: [
          'Schedule foundation assessment call',
          'Review current operational maturity',
          'Develop capability building plan',
          'Identify immediate improvement opportunities',
          'Plan long-term automation strategy'
        ],
        estimatedROI: '100-200% within 24 months',
        implementationTime: '120+ days'
      };
    }
  };

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const nextStep = async () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Assessment completed - submit to GHL
      try {
        const assessmentScore = calculateResults().score;
        const formData = {
          firstName: userInfo.name.split(' ')[0] || userInfo.name,
          lastName: userInfo.name.split(' ').slice(1).join(' ') || '',
          email: userInfo.email,
          phone: userInfo.phone,
          companyName: userInfo.company,
          position: userInfo.role,
          assessmentScore: assessmentScore,
          assessmentAnswers: answers,
          formType: 'Assessment'
        };

        await handleFormSubmission(formData, 'Assessment');
        setShowResults(true);
      } catch (error) {
        logger.error('Error submitting assessment', error as Error);
        // Still show results even if GHL submission fails
        setShowResults(true);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = ((currentStep + 1) / questions.length) * 100;
  const currentQuestion = questions[currentStep];
  const results = showResults ? calculateResults() : null;

  if (showResults && results) {
    return (
      <div className="min-h-screen bg-brand-grey">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Results Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-teal-600/10 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-brand-teal-600" />
              </div>
              <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">
                Assessment Complete!
              </h1>
              <p className="text-lg text-gray-600">
                Here's your personalized readiness analysis
              </p>
            </div>

            {/* Score Card */}
            <Card className="mb-8 border-2 border-brand-navy/20 bg-gradient-to-r from-brand-navy/5 to-brand-blue/5 rounded-2xl">
              <CardHeader className="text-center">
                <div className="text-6xl font-bold text-brand-navy mb-2">
                  {results.score}%
                </div>
                <CardTitle className="text-2xl text-gray-900 font-heading">
                  {results.category}
                </CardTitle>
                <CardDescription className="text-lg">
                  {results.title}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-center leading-relaxed">
                  {results.description}
                </p>
              </CardContent>
            </Card>

            {/* Key Metrics */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-heading">
                    <TrendingUp className="w-5 h-5 text-brand-teal-600" />
                    Estimated ROI
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-brand-teal-600">
                    {results.estimatedROI}
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-heading">
                    <Clock className="w-5 h-5 text-brand-navy" />
                    Implementation Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-brand-navy">
                    {results.implementationTime}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recommendations */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-heading">
                    <Target className="w-5 h-5 text-brand-navy" />
                    Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {results.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-brand-teal-600 mt-1 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-heading">
                    <ArrowRight className="w-5 h-5 text-brand-blue" />
                    Next Steps
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {results.nextSteps.map((step, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-4 h-4 bg-brand-teal-600/10 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                          <span className="text-xs font-bold text-brand-teal-600">{index + 1}</span>
                        </div>
                        <span className="text-sm text-gray-700">{step}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* CTA Section */}
            <Card className="bg-gradient-to-r from-brand-navy via-brand-navy-light to-brand-navy-dark text-white rounded-2xl">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold font-heading mb-4">
                  Ready to Transform Your Business?
                </h3>
                <p className="text-white/80 mb-6 text-lg">
                  Based on your assessment, you're an excellent candidate for our AI automation platform.
                  Let's discuss how we can help you achieve {results.estimatedROI} ROI.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="bg-brand-teal-600 text-white hover:bg-brand-teal-600/90 font-semibold"
                    onClick={() => window.location.href = '/contact'}
                  >
                    <Building className="w-5 h-5 mr-2" />
                    Book Strategy Session
                  </Button>
                  <Button
                    size="lg"
                    className="bg-white text-brand-navy hover:bg-brand-grey border-2 border-white font-semibold"
                    onClick={() => window.location.href = '/resources/roi-calculator'}
                  >
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Calculate Detailed ROI
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Additional Resources */}
            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">
                Want to learn more about our solutions?
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = '/industries'}
                >
                  Industry Solutions
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = '/pricing'}
                >
                  View Pricing
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = '/blog'}
                >
                  Success Stories
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-grey">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">
              AI Readiness Assessment
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              Discover how AI automation can transform your business
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                5 minutes
              </div>
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4" />
                Confidential
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                Personalized results
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Question {currentStep + 1} of {questions.length}
              </span>
              <span className="text-sm font-medium text-gray-700">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question Card */}
          <Card className="mb-8 rounded-2xl">
            <CardHeader>
              <div className="text-sm font-medium text-brand-navy mb-2">
                {currentQuestion.category}
              </div>
              <CardTitle className="text-xl font-heading">
                {currentQuestion.question}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <div
                    key={index}
                    className={`p-4 border-2 rounded-2xl cursor-pointer transition-all ${
                      answers[currentQuestion.id] === option.value
                        ? 'border-brand-navy bg-brand-navy/5'
                        : 'border-gray-200 hover:border-brand-blue hover:bg-brand-blue/5'
                    }`}
                    onClick={() => handleAnswer(currentQuestion.id, option.value)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 mt-0.5 ${
                        answers[currentQuestion.id] === option.value
                          ? 'border-brand-navy bg-brand-navy'
                          : 'border-gray-300'
                      }`}>
                        {answers[currentQuestion.id] === option.value && (
                          <div className="w-full h-full rounded-full bg-white scale-50"></div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {option.label}
                        </div>
                        {option.description && (
                          <div className="text-sm text-gray-600 mt-1">
                            {option.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white"
            >
              Previous
            </Button>
            <Button
              onClick={nextStep}
              disabled={!answers[currentQuestion.id]}
              className="bg-brand-teal-600 hover:bg-brand-teal-600/90 text-white"
            >
              {currentStep === questions.length - 1 ? 'Get Results' : 'Next'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 mb-4">
              Trusted by 500+ UK businesses
            </p>
            <div className="flex justify-center items-center gap-6 text-xs text-gray-400">
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                GDPR Compliant
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                No Spam
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                Expert Support
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ReadinessAssessmentPage;

