import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/marketing/financeflo/ui/card';
import { Badge } from '@/components/marketing/financeflo/ui/badge';
import { Button } from '@/components/marketing/financeflo/ui/button';
import { 
  TrendingUp, 
  Target, 
  Star, 
  Clock, 
  Users, 
  Building, 
  Phone, 
  Mail,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Zap,
  Brain,
  BarChart3,
  ArrowRight
} from 'lucide-react';
import { useAnalytics } from './AnalyticsTracker';
import { useZoomInfoTracking } from './ZoomInfoTrackerDisabled';

interface LeadData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company: string;
  role: string;
  industry?: string;
  companySize?: string;
  currentSystem?: string;
  challenges: string;
  timeline: string;
  budget?: string;
  source: string;
  timestamp: Date;
  interactions: LeadInteraction[];
  score?: number;
  grade?: 'A' | 'B' | 'C' | 'D';
  status?: 'new' | 'qualified' | 'nurturing' | 'hot' | 'cold';
}

interface LeadInteraction {
  type: 'page_view' | 'video_watch' | 'form_fill' | 'download' | 'email_open' | 'email_click' | 'phone_call';
  timestamp: Date;
  details: string;
  score: number;
}

interface LeadScoringEngineProps {
  leadData?: LeadData;
  onScoreUpdate?: (leadId: string, score: number, grade: string) => void;
  onStatusChange?: (leadId: string, status: string) => void;
  showDashboard?: boolean;
}

export const LeadScoringEngine: React.FC<LeadScoringEngineProps> = ({
  leadData,
  onScoreUpdate,
  onStatusChange,
  showDashboard = false
}) => {
  const [leads, setLeads] = useState<LeadData[]>([]);
  const [selectedLead, setSelectedLead] = useState<LeadData | null>(null);
  const [scoringRules, setScoringRules] = useState({
    demographics: {
      seniorRole: 25, // C-level, Director, VP
      midRole: 15,    // Manager, Head of
      juniorRole: 5,  // Analyst, Coordinator
      targetIndustry: 20, // Manufacturing, Financial Services, etc.
      companySize: {
        enterprise: 30,   // 500+ employees
        midMarket: 20,    // 50-500 employees
        small: 10         // <50 employees
      }
    },
    behavioral: {
      videoWatch: 15,
      formComplete: 25,
      downloadResource: 10,
      multiplePageViews: 10,
      timeOnSite: 5,
      returnVisitor: 15
    },
    engagement: {
      emailOpen: 5,
      emailClick: 10,
      phoneInquiry: 30,
      demoRequest: 40,
      consultationBooked: 50
    },
    intent: {
      immediateTimeline: 30,  // 0-3 months
      shortTimeline: 20,      // 3-6 months
      mediumTimeline: 10,     // 6-12 months
      longTimeline: 5,        // 12+ months
      budgetConfirmed: 25,
      currentSystemPain: 20
    }
  });

  const { trackEvent } = useAnalytics();
  const { trackEvent: trackZoomInfo } = useZoomInfoTracking();

  useEffect(() => {
    if (leadData) {
      const score = calculateLeadScore(leadData);
      const grade = getLeadGrade(score);
      const status = getLeadStatus(score, leadData);
      
      const updatedLead = {
        ...leadData,
        score,
        grade,
        status
      };
      
      setSelectedLead(updatedLead);
      
      if (onScoreUpdate) {
        onScoreUpdate(leadData.id, score, grade);
      }
      
      if (onStatusChange) {
        onStatusChange(leadData.id, status);
      }
      
      // Track lead scoring event
      trackEvent('lead_scored', {
        category: 'lead_generation',
        label: `${grade}_grade`,
        lead_score: score,
        lead_grade: grade,
        lead_status: status
      });
      
      trackZoomInfo('lead_scored', {
        lead_score: score,
        lead_grade: grade,
        lead_status: status,
        company: leadData.company,
        industry: leadData.industry
      });
    }
  }, [leadData]);

  const calculateLeadScore = (lead: LeadData): number => {
    let score = 0;
    
    // Demographics scoring
    score += calculateDemographicsScore(lead);
    
    // Behavioral scoring
    score += calculateBehavioralScore(lead);
    
    // Engagement scoring
    score += calculateEngagementScore(lead);
    
    // Intent scoring
    score += calculateIntentScore(lead);
    
    return Math.min(score, 100); // Cap at 100
  };

  const calculateDemographicsScore = (lead: LeadData): number => {
    let score = 0;
    
    // Role scoring
    const role = lead.role.toLowerCase();
    if (role.includes('ceo') || role.includes('cfo') || role.includes('cto') || 
        role.includes('director') || role.includes('vp') || role.includes('president')) {
      score += scoringRules.demographics.seniorRole;
    } else if (role.includes('manager') || role.includes('head')) {
      score += scoringRules.demographics.midRole;
    } else {
      score += scoringRules.demographics.juniorRole;
    }
    
    // Industry scoring
    const targetIndustries = ['manufacturing', 'financial services', 'construction', 'healthcare', 'professional services'];
    if (lead.industry && targetIndustries.some(industry => 
      lead.industry!.toLowerCase().includes(industry))) {
      score += scoringRules.demographics.targetIndustry;
    }
    
    // Company size scoring
    if (lead.companySize) {
      const size = lead.companySize.toLowerCase();
      if (size.includes('500+') || size.includes('enterprise')) {
        score += scoringRules.demographics.companySize.enterprise;
      } else if (size.includes('50-500') || size.includes('mid')) {
        score += scoringRules.demographics.companySize.midMarket;
      } else {
        score += scoringRules.demographics.companySize.small;
      }
    }
    
    return score;
  };

  const calculateBehavioralScore = (lead: LeadData): number => {
    let score = 0;
    
    lead.interactions.forEach(interaction => {
      switch (interaction.type) {
        case 'video_watch':
          score += scoringRules.behavioral.videoWatch;
          break;
        case 'form_fill':
          score += scoringRules.behavioral.formComplete;
          break;
        case 'download':
          score += scoringRules.behavioral.downloadResource;
          break;
        case 'page_view':
          score += scoringRules.behavioral.multiplePageViews;
          break;
      }
    });
    
    return score;
  };

  const calculateEngagementScore = (lead: LeadData): number => {
    let score = 0;
    
    lead.interactions.forEach(interaction => {
      switch (interaction.type) {
        case 'email_open':
          score += scoringRules.engagement.emailOpen;
          break;
        case 'email_click':
          score += scoringRules.engagement.emailClick;
          break;
        case 'phone_call':
          score += scoringRules.engagement.phoneInquiry;
          break;
      }
    });
    
    return score;
  };

  const calculateIntentScore = (lead: LeadData): number => {
    let score = 0;
    
    // Timeline scoring
    switch (lead.timeline) {
      case 'immediate':
        score += scoringRules.intent.immediateTimeline;
        break;
      case 'short':
        score += scoringRules.intent.shortTimeline;
        break;
      case 'medium':
        score += scoringRules.intent.mediumTimeline;
        break;
      case 'long':
        score += scoringRules.intent.longTimeline;
        break;
    }
    
    // Budget scoring
    if (lead.budget && lead.budget !== 'under-50k') {
      score += scoringRules.intent.budgetConfirmed;
    }
    
    // Pain point scoring
    if (lead.challenges && lead.challenges.length > 50) {
      score += scoringRules.intent.currentSystemPain;
    }
    
    return score;
  };

  const getLeadGrade = (score: number): 'A' | 'B' | 'C' | 'D' => {
    if (score >= 80) return 'A';
    if (score >= 60) return 'B';
    if (score >= 40) return 'C';
    return 'D';
  };

  const getLeadStatus = (score: number, lead: LeadData): 'new' | 'qualified' | 'nurturing' | 'hot' | 'cold' => {
    if (score >= 80) return 'hot';
    if (score >= 60) return 'qualified';
    if (score >= 40) return 'nurturing';
    if (score >= 20) return 'new';
    return 'cold';
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-green-100 text-green-800';
      case 'B': return 'bg-blue-100 text-blue-800';
      case 'C': return 'bg-yellow-100 text-yellow-800';
      case 'D': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hot': return 'bg-red-100 text-red-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'nurturing': return 'bg-blue-100 text-blue-800';
      case 'new': return 'bg-purple-100 text-purple-800';
      case 'cold': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleContactLead = (method: 'phone' | 'email' | 'calendar') => {
    if (!selectedLead) return;
    
    trackEvent('lead_contact_initiated', {
      category: 'lead_generation',
      label: method,
      lead_score: selectedLead.score,
      lead_grade: selectedLead.grade,
      contact_method: method
    });
    
    trackZoomInfo('lead_contact_initiated', {
      contact_method: method,
      lead_score: selectedLead.score,
      lead_grade: selectedLead.grade,
      company: selectedLead.company
    });
    
    switch (method) {
      case 'phone':
        window.location.href = `tel:${selectedLead.phone}`;
        break;
      case 'email':
        window.location.href = `mailto:${selectedLead.email}`;
        break;
      case 'calendar':
        // Integrate with GoHighLevel calendar booking
        window.open('/contact', '_blank');
        break;
    }
  };

  if (!selectedLead && !showDashboard) {
    return null;
  }

  return (
    <div className="space-y-6">
      {selectedLead && (
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold">
                Lead Intelligence Dashboard
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Badge className={`${getGradeColor(selectedLead.grade!)} font-bold`}>
                  Grade {selectedLead.grade}
                </Badge>
                <Badge className={`${getStatusColor(selectedLead.status!)} font-bold`}>
                  {selectedLead.status?.toUpperCase()}
                </Badge>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Lead Information */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Profile</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">Name</div>
                      <div className="font-semibold">{selectedLead.firstName} {selectedLead.lastName}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Company</div>
                      <div className="font-semibold">{selectedLead.company}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Role</div>
                      <div className="font-semibold">{selectedLead.role}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Industry</div>
                      <div className="font-semibold">{selectedLead.industry || 'Not specified'}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Timeline</div>
                      <div className="font-semibold">{selectedLead.timeline}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Budget</div>
                      <div className="font-semibold">{selectedLead.budget || 'Not specified'}</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Challenges</h3>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                    {selectedLead.challenges}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Interactions</h3>
                  <div className="space-y-2">
                    {selectedLead.interactions.slice(0, 5).map((interaction, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          <span className="font-medium">{interaction.type.replace('_', ' ')}</span>
                          <span className="text-gray-600">{interaction.details}</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {interaction.timestamp.toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Score & Actions */}
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
                    <span className="text-3xl font-bold text-white">{selectedLead.score}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Lead Score</h3>
                  <p className="text-gray-600">Out of 100 points</p>
                </div>
                
                <div className="space-y-3">
                  <Button
                    onClick={() => handleContactLead('phone')}
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={!selectedLead.phone}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call Now
                  </Button>
                  
                  <Button
                    onClick={() => handleContactLead('email')}
                    variant="outline"
                    className="w-full"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Send Email
                  </Button>
                  
                  <Button
                    onClick={() => handleContactLead('calendar')}
                    variant="outline"
                    className="w-full"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Meeting
                  </Button>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Recommended Actions</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    {selectedLead.score! >= 80 && (
                      <li>• Priority follow-up within 1 hour</li>
                    )}
                    {selectedLead.score! >= 60 && (
                      <li>• Schedule demo presentation</li>
                    )}
                    {selectedLead.score! >= 40 && (
                      <li>• Send case study materials</li>
                    )}
                    <li>• Add to nurturing sequence</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LeadScoringEngine;

