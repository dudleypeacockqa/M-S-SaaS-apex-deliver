import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/marketing/financeflo/ui/card';
import { Button } from '@/components/marketing/financeflo/ui/button';
import { Badge } from '@/components/marketing/financeflo/ui/badge';
import { Input } from '@/components/marketing/financeflo/ui/input';
import { Textarea } from '@/components/marketing/financeflo/ui/textarea';
import { 
  Mail, 
  Send, 
  Clock, 
  Users, 
  TrendingUp,
  Eye,
  MousePointer,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Target,
  BarChart3,
  Settings,
  Zap,
  MessageSquare,
  FileText,
  Download
} from 'lucide-react';
import { useAnalytics } from './AnalyticsTracker';
import { useZoomInfoTracking } from './ZoomInfoTrackerDisabled';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: 'welcome' | 'nurture' | 'demo-follow-up' | 'proposal' | 'case-study' | 'reactivation';
  industry?: string;
  personalization: string[];
  cta: {
    text: string;
    url: string;
    type: 'primary' | 'secondary';
  }[];
}

interface EmailCampaign {
  id: string;
  name: string;
  templateId: string;
  status: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed';
  recipients: number;
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  replied: number;
  unsubscribed: number;
  scheduledDate?: Date;
  createdDate: Date;
  industry?: string;
  segment?: string;
}

interface EmailSequence {
  id: string;
  name: string;
  trigger: 'form_submission' | 'demo_request' | 'download' | 'page_visit' | 'manual';
  emails: {
    templateId: string;
    delay: number; // days
    conditions?: string[];
  }[];
  enrolledContacts: number;
  completionRate: number;
  conversionRate: number;
  status: 'active' | 'paused';
}

interface EmailAutomationEngineProps {
  onCampaignCreated?: (campaign: EmailCampaign) => void;
  onSequenceTriggered?: (sequenceId: string, contactId: string) => void;
  showDashboard?: boolean;
}

export const EmailAutomationEngine: React.FC<EmailAutomationEngineProps> = ({
  onCampaignCreated,
  onSequenceTriggered,
  showDashboard = true
}) => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [sequences, setSequences] = useState<EmailSequence[]>([]);
  const [stats, setStats] = useState({
    totalSent: 0,
    openRate: 0,
    clickRate: 0,
    replyRate: 0,
    unsubscribeRate: 0,
    activeCampaigns: 0,
    activeSequences: 0
  });

  const { trackEvent } = useAnalytics();
  const { trackEvent: trackZoomInfo } = useZoomInfoTracking();

  useEffect(() => {
    loadEmailTemplates();
    loadCampaigns();
    loadSequences();
    calculateStats();
  }, []);

  const loadEmailTemplates = () => {
    const mockTemplates: EmailTemplate[] = [
      {
        id: '1',
        name: 'ERP Assessment Welcome',
        subject: 'Your ERP Assessment Results - {{firstName}}',
        content: `Hi {{firstName}},

Thank you for completing our ERP Assessment. Based on your responses, we've identified several opportunities to optimize your financial operations.

Your current {{currentSystem}} setup could benefit from:
• Automated financial reporting
• Real-time dashboard visibility  
• Streamlined month-end processes

I'd love to show you exactly how {{companyName}} could achieve 40% faster month-end close with our Adaptive Intelligence Framework™.

Would you be available for a 15-minute call this week?

Best regards,
Sarah Mitchell
Senior ERP Consultant`,
        type: 'welcome',
        personalization: ['firstName', 'companyName', 'currentSystem'],
        cta: [
          {
            text: 'Schedule Your Call',
            url: '/contact',
            type: 'primary'
          }
        ]
      },
      {
        id: '2',
        name: 'Manufacturing Case Study',
        subject: 'How {{industryPeer}} Achieved 300% ROI with AI+ERP',
        content: `Hi {{firstName}},

I thought you'd find this case study particularly relevant for {{companyName}}.

{{industryPeer}}, a {{companySize}} manufacturing company, was facing similar challenges:
• Manual inventory tracking
• Disconnected production planning
• Delayed financial reporting

After implementing our Adaptive Intelligence Framework™:
✓ 300% ROI within 12 months
✓ 85% reduction in manual data entry
✓ Real-time production visibility

The full case study shows exactly how they transformed their operations.

Would you like to see how this applies to your specific situation?

Best regards,
James Wilson
Manufacturing Specialist`,
        type: 'case-study',
        industry: 'manufacturing',
        personalization: ['firstName', 'companyName', 'industryPeer', 'companySize'],
        cta: [
          {
            text: 'Download Case Study',
            url: '/case-studies/manufacturing',
            type: 'primary'
          },
          {
            text: 'Book Strategy Call',
            url: '/contact',
            type: 'secondary'
          }
        ]
      },
      {
        id: '3',
        name: 'Demo Follow-up',
        subject: 'Next Steps for {{companyName}} - Implementation Timeline',
        content: `Hi {{firstName}},

Thank you for taking the time to see our Adaptive Intelligence Framework™ demo yesterday.

As discussed, {{companyName}} could achieve:
• {{projectedSavings}} in annual cost savings
• {{timelineReduction}} faster month-end close
• {{efficiencyGain}} improvement in team efficiency

I've prepared a custom implementation roadmap based on your specific requirements.

The next step would be a technical assessment to finalize the integration approach with your {{currentSystem}} system.

Are you available for a 30-minute technical call this week?

Best regards,
Sarah Mitchell
Senior Implementation Consultant`,
        type: 'demo-follow-up',
        personalization: ['firstName', 'companyName', 'projectedSavings', 'timelineReduction', 'efficiencyGain', 'currentSystem'],
        cta: [
          {
            text: 'Schedule Technical Call',
            url: '/contact',
            type: 'primary'
          },
          {
            text: 'View Implementation Guide',
            url: '/implementation-guide',
            type: 'secondary'
          }
        ]
      }
    ];
    
    setTemplates(mockTemplates);
  };

  const loadCampaigns = () => {
    const mockCampaigns: EmailCampaign[] = [
      {
        id: '1',
        name: 'Manufacturing ERP Nurture',
        templateId: '2',
        status: 'active',
        recipients: 245,
        sent: 245,
        delivered: 242,
        opened: 156,
        clicked: 47,
        replied: 12,
        unsubscribed: 3,
        createdDate: new Date('2025-01-08'),
        industry: 'manufacturing',
        segment: 'mid-market'
      },
      {
        id: '2',
        name: 'Financial Services Compliance',
        templateId: '1',
        status: 'active',
        recipients: 189,
        sent: 189,
        delivered: 186,
        opened: 134,
        clicked: 38,
        replied: 9,
        unsubscribed: 2,
        createdDate: new Date('2025-01-09'),
        industry: 'financial-services',
        segment: 'enterprise'
      }
    ];
    
    setCampaigns(mockCampaigns);
  };

  const loadSequences = () => {
    const mockSequences: EmailSequence[] = [
      {
        id: '1',
        name: 'ERP Assessment Follow-up',
        trigger: 'form_submission',
        emails: [
          { templateId: '1', delay: 0 },
          { templateId: '2', delay: 3, conditions: ['not_opened_previous'] },
          { templateId: '3', delay: 7, conditions: ['opened_but_not_clicked'] }
        ],
        enrolledContacts: 156,
        completionRate: 78,
        conversionRate: 24,
        status: 'active'
      },
      {
        id: '2',
        name: 'Demo Request Nurture',
        trigger: 'demo_request',
        emails: [
          { templateId: '3', delay: 0 },
          { templateId: '2', delay: 2, conditions: ['demo_completed'] },
          { templateId: '1', delay: 5, conditions: ['no_response'] }
        ],
        enrolledContacts: 89,
        completionRate: 85,
        conversionRate: 42,
        status: 'active'
      }
    ];
    
    setSequences(mockSequences);
  };

  const calculateStats = () => {
    // Calculate overall email performance stats
    const totalSent = campaigns.reduce((sum, campaign) => sum + campaign.sent, 0);
    const totalOpened = campaigns.reduce((sum, campaign) => sum + campaign.opened, 0);
    const totalClicked = campaigns.reduce((sum, campaign) => sum + campaign.clicked, 0);
    const totalReplied = campaigns.reduce((sum, campaign) => sum + campaign.replied, 0);
    const totalUnsubscribed = campaigns.reduce((sum, campaign) => sum + campaign.unsubscribed, 0);
    
    setStats({
      totalSent,
      openRate: totalSent > 0 ? Math.round((totalOpened / totalSent) * 100) : 0,
      clickRate: totalSent > 0 ? Math.round((totalClicked / totalSent) * 100) : 0,
      replyRate: totalSent > 0 ? Math.round((totalReplied / totalSent) * 100) : 0,
      unsubscribeRate: totalSent > 0 ? Math.round((totalUnsubscribed / totalSent) * 100) : 0,
      activeCampaigns: campaigns.filter(c => c.status === 'active').length,
      activeSequences: sequences.filter(s => s.status === 'active').length
    });
  };

  const createCampaign = async (campaignData: Partial<EmailCampaign>) => {
    const newCampaign: EmailCampaign = {
      id: Date.now().toString(),
      name: campaignData.name || '',
      templateId: campaignData.templateId || '',
      status: 'draft',
      recipients: 0,
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      replied: 0,
      unsubscribed: 0,
      createdDate: new Date(),
      industry: campaignData.industry,
      segment: campaignData.segment
    };
    
    setCampaigns(prev => [...prev, newCampaign]);
    
    if (onCampaignCreated) {
      onCampaignCreated(newCampaign);
    }
    
    trackEvent('email_campaign_created', {
      category: 'email_marketing',
      label: 'campaign_created',
      campaign_type: newCampaign.industry || 'general'
    });
    
    return newCampaign;
  };

  const triggerSequence = async (sequenceId: string, contactId: string) => {
    if (onSequenceTriggered) {
      onSequenceTriggered(sequenceId, contactId);
    }
    
    trackEvent('email_sequence_triggered', {
      category: 'email_automation',
      label: 'sequence_triggered',
      sequence_id: sequenceId
    });
    
    trackZoomInfo('email_sequence_triggered', {
      sequence_id: sequenceId,
      contact_id: contactId
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPercentage = (value: number, total: number) => {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  };

  return (
    <div className="space-y-6">
      {/* Email Performance Stats */}
      <div className="grid md:grid-cols-4 lg:grid-cols-7 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Sent</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSent.toLocaleString()}</p>
              </div>
              <Send className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Open Rate</p>
                <p className="text-2xl font-bold text-gray-900">{stats.openRate}%</p>
              </div>
              <Eye className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Click Rate</p>
                <p className="text-2xl font-bold text-gray-900">{stats.clickRate}%</p>
              </div>
              <MousePointer className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Reply Rate</p>
                <p className="text-2xl font-bold text-gray-900">{stats.replyRate}%</p>
              </div>
              <MessageSquare className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Unsubscribe</p>
                <p className="text-2xl font-bold text-gray-900">{stats.unsubscribeRate}%</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Campaigns</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeCampaigns}</p>
              </div>
              <Target className="w-8 h-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Sequences</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeSequences}</p>
              </div>
              <Zap className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Campaigns */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="w-5 h-5 mr-2" />
            Active Email Campaigns
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {campaigns.filter(campaign => campaign.status === 'active').map(campaign => (
              <div key={campaign.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{campaign.name}</h3>
                    <p className="text-sm text-gray-600">
                      {campaign.industry} • {campaign.segment}
                    </p>
                  </div>
                  <Badge className={getStatusColor(campaign.status)}>
                    {campaign.status.toUpperCase()}
                  </Badge>
                </div>
                
                <div className="grid md:grid-cols-6 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Recipients</div>
                    <div className="font-semibold">{campaign.recipients.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Delivered</div>
                    <div className="font-semibold">
                      {formatPercentage(campaign.delivered, campaign.sent)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">Opened</div>
                    <div className="font-semibold">
                      {formatPercentage(campaign.opened, campaign.delivered)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">Clicked</div>
                    <div className="font-semibold">
                      {formatPercentage(campaign.clicked, campaign.opened)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">Replied</div>
                    <div className="font-semibold">
                      {formatPercentage(campaign.replied, campaign.opened)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">Unsubscribed</div>
                    <div className="font-semibold">
                      {formatPercentage(campaign.unsubscribed, campaign.sent)}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Email Sequences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="w-5 h-5 mr-2" />
            Automated Email Sequences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sequences.map(sequence => (
              <div key={sequence.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{sequence.name}</h3>
                    <p className="text-sm text-gray-600">
                      Trigger: {sequence.trigger.replace('_', ' ')} • {sequence.emails.length} emails
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">
                      {sequence.conversionRate}% conversion
                    </Badge>
                    <Badge className={getStatusColor(sequence.status)}>
                      {sequence.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Enrolled Contacts</div>
                    <div className="font-semibold">{sequence.enrolledContacts.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Completion Rate</div>
                    <div className="font-semibold">{sequence.completionRate}%</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Conversion Rate</div>
                    <div className="font-semibold">{sequence.conversionRate}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Email Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Email Templates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map(template => (
              <div key={template.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{template.name}</h3>
                  <Badge variant="outline" className="text-xs">
                    {template.type.replace('-', ' ').toUpperCase()}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">
                  Subject: {template.subject}
                </p>
                
                <div className="text-xs text-gray-500 mb-3">
                  Personalization: {template.personalization.join(', ')}
                </div>
                
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="text-xs">
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs">
                    Preview
                  </Button>
                  <Button size="sm" className="text-xs">
                    Use Template
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailAutomationEngine;

