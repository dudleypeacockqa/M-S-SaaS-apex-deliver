import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/marketing/financeflo/ui/card';
import { Button } from '@/components/marketing/financeflo/ui/button';
import { Badge } from '@/components/marketing/financeflo/ui/badge';
import { Input } from '@/components/marketing/financeflo/ui/input';
import { Textarea } from '@/components/marketing/financeflo/ui/textarea';
import { 
  Zap, 
  Users, 
  Calendar, 
  Mail, 
  Phone, 
  MessageSquare,
  Target,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertTriangle,
  Settings,
  Database,
  Workflow,
  BarChart3
} from 'lucide-react';
import { useAnalytics } from './AnalyticsTracker';
import { useZoomInfoTracking } from './ZoomInfoTrackerDisabled';
import { logger } from '@/utils/logger';

interface GHLContact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  tags: string[];
  customFields: Record<string, any>;
  source: string;
  dateAdded: Date;
  lastActivity: Date;
  leadScore?: number;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'closed-won' | 'closed-lost';
}

interface GHLWorkflow {
  id: string;
  name: string;
  trigger: string;
  status: 'active' | 'paused';
  enrolledContacts: number;
  completionRate: number;
}

interface GHLAppointment {
  id: string;
  contactId: string;
  title: string;
  dateTime: Date;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  type: 'discovery' | 'demo' | 'consultation' | 'follow-up';
}

interface GoHighLevelIntegrationProps {
  apiKey?: string;
  locationId?: string;
  onContactCreated?: (contact: GHLContact) => void;
  onAppointmentBooked?: (appointment: GHLAppointment) => void;
  showDashboard?: boolean;
}

export const GoHighLevelIntegration: React.FC<GoHighLevelIntegrationProps> = ({
  apiKey,
  locationId,
  onContactCreated,
  onAppointmentBooked,
  showDashboard = false
}) => {
  const [contacts, setContacts] = useState<GHLContact[]>([]);
  const [workflows, setWorkflows] = useState<GHLWorkflow[]>([]);
  const [appointments, setAppointments] = useState<GHLAppointment[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalContacts: 0,
    newLeads: 0,
    qualifiedLeads: 0,
    appointmentsToday: 0,
    conversionRate: 0
  });

  const { trackEvent } = useAnalytics();
  const { trackEvent: trackZoomInfo } = useZoomInfoTracking();

  useEffect(() => {
    if (apiKey && locationId) {
      initializeGHLConnection();
    }
  }, [apiKey, locationId]);

  const initializeGHLConnection = async () => {
    setLoading(true);
    try {
      // Simulate GHL API connection
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsConnected(true);
      
      // Load initial data
      await loadContacts();
      await loadWorkflows();
      await loadAppointments();
      
      trackEvent('ghl_connected', {
        category: 'integration',
        label: 'gohighlevel_connected'
      });
      
    } catch (error) {
      logger.error('GHL connection failed', error instanceof Error ? error : new Error(String(error)), {
        apiKey: !!apiKey,
        locationId: !!locationId
      });
    } finally {
      setLoading(false);
    }
  };

  const loadContacts = async () => {
    // Simulate loading contacts from GHL
    const mockContacts: GHLContact[] = [
      {
        id: '1',
        firstName: 'James',
        lastName: 'Wilson',
        email: 'james.wilson@techcorp.co.uk',
        phone: '+44 7700 900123',
        company: 'TechCorp Ltd',
        tags: ['manufacturing', 'sage-intacct', 'hot-lead'],
        customFields: {
          industry: 'Manufacturing',
          companySize: '250-500',
          currentERP: 'QuickBooks',
          timeline: 'immediate'
        },
        source: 'website',
        dateAdded: new Date('2025-01-10'),
        lastActivity: new Date('2025-01-11'),
        leadScore: 85,
        status: 'qualified'
      },
      {
        id: '2',
        firstName: 'Sarah',
        lastName: 'Thompson',
        email: 'sarah.thompson@financeco.co.uk',
        phone: '+44 7700 900124',
        company: 'FinanceCo Ltd',
        tags: ['financial-services', 'compliance', 'warm-lead'],
        customFields: {
          industry: 'Financial Services',
          companySize: '100-250',
          currentERP: 'Xero',
          timeline: 'short'
        },
        source: 'linkedin',
        dateAdded: new Date('2025-01-09'),
        lastActivity: new Date('2025-01-11'),
        leadScore: 72,
        status: 'contacted'
      }
    ];
    
    setContacts(mockContacts);
    
    // Update stats
    setStats(prev => ({
      ...prev,
      totalContacts: mockContacts.length,
      newLeads: mockContacts.filter(c => c.status === 'new').length,
      qualifiedLeads: mockContacts.filter(c => c.status === 'qualified').length
    }));
  };

  const loadWorkflows = async () => {
    const mockWorkflows: GHLWorkflow[] = [
      {
        id: '1',
        name: 'ERP Assessment Nurture Sequence',
        trigger: 'form_submission',
        status: 'active',
        enrolledContacts: 45,
        completionRate: 78
      },
      {
        id: '2',
        name: 'Demo Follow-up Sequence',
        trigger: 'demo_completed',
        status: 'active',
        enrolledContacts: 23,
        completionRate: 85
      },
      {
        id: '3',
        name: 'Cold Lead Reactivation',
        trigger: 'no_activity_30_days',
        status: 'active',
        enrolledContacts: 67,
        completionRate: 42
      }
    ];
    
    setWorkflows(mockWorkflows);
  };

  const loadAppointments = async () => {
    const mockAppointments: GHLAppointment[] = [
      {
        id: '1',
        contactId: '1',
        title: 'ERP Discovery Call - TechCorp Ltd',
        dateTime: new Date('2025-01-12T14:00:00'),
        duration: 60,
        status: 'scheduled',
        type: 'discovery'
      },
      {
        id: '2',
        contactId: '2',
        title: 'Sage Intacct Demo - FinanceCo Ltd',
        dateTime: new Date('2025-01-12T16:00:00'),
        duration: 45,
        status: 'scheduled',
        type: 'demo'
      }
    ];
    
    setAppointments(mockAppointments);
    
    const today = new Date();
    const appointmentsToday = mockAppointments.filter(apt => 
      apt.dateTime.toDateString() === today.toDateString()
    ).length;
    
    setStats(prev => ({
      ...prev,
      appointmentsToday
    }));
  };

  const createContact = async (contactData: Partial<GHLContact>) => {
    if (!isConnected) return;
    
    try {
      // Simulate GHL API call to create contact
      const newContact: GHLContact = {
        id: Date.now().toString(),
        firstName: contactData.firstName || '',
        lastName: contactData.lastName || '',
        email: contactData.email || '',
        phone: contactData.phone,
        company: contactData.company,
        tags: contactData.tags || [],
        customFields: contactData.customFields || {},
        source: contactData.source || 'website',
        dateAdded: new Date(),
        lastActivity: new Date(),
        status: 'new'
      };
      
      setContacts(prev => [...prev, newContact]);
      
      if (onContactCreated) {
        onContactCreated(newContact);
      }
      
      trackEvent('ghl_contact_created', {
        category: 'lead_generation',
        label: 'contact_created',
        contact_source: newContact.source
      });
      
      trackZoomInfo('ghl_contact_created', {
        contact_source: newContact.source,
        company: newContact.company
      });
      
      return newContact;
    } catch (error) {
      logger.error('Failed to create GHL contact', error instanceof Error ? error : new Error(String(error)), {
        contactData
      });
      throw error;
    }
  };

  const addToWorkflow = async (contactId: string, workflowId: string) => {
    if (!isConnected) return;
    
    try {
      // Simulate adding contact to workflow
      trackEvent('ghl_workflow_enrolled', {
        category: 'automation',
        label: 'workflow_enrolled',
        workflow_id: workflowId
      });
      
      logger.info('Contact added to workflow', {
        contactId,
        workflowId
      });
    } catch (error) {
      logger.error('Failed to add contact to workflow', error instanceof Error ? error : new Error(String(error)), {
        contactId,
        workflowId
      });
    }
  };

  const bookAppointment = async (appointmentData: Partial<GHLAppointment>) => {
    if (!isConnected) return;
    
    try {
      const newAppointment: GHLAppointment = {
        id: Date.now().toString(),
        contactId: appointmentData.contactId || '',
        title: appointmentData.title || '',
        dateTime: appointmentData.dateTime || new Date(),
        duration: appointmentData.duration || 60,
        status: 'scheduled',
        type: appointmentData.type || 'consultation'
      };
      
      setAppointments(prev => [...prev, newAppointment]);
      
      if (onAppointmentBooked) {
        onAppointmentBooked(newAppointment);
      }
      
      trackEvent('ghl_appointment_booked', {
        category: 'conversion',
        label: 'appointment_booked',
        appointment_type: newAppointment.type
      });
      
      trackZoomInfo('ghl_appointment_booked', {
        appointment_type: newAppointment.type,
        contact_id: newAppointment.contactId
      });
      
      return newAppointment;
    } catch (error) {
      logger.error('Failed to book appointment', error instanceof Error ? error : new Error(String(error)), {
        contactId: appointmentData.contactId,
        appointmentType: appointmentData.type
      });
      throw error;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'proposal': return 'bg-purple-100 text-purple-800';
      case 'closed-won': return 'bg-emerald-100 text-emerald-800';
      case 'closed-lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!showDashboard && !isConnected) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="w-5 h-5 mr-2 text-orange-600" />
            GoHighLevel Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <Settings className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Connect to GoHighLevel
            </h3>
            <p className="text-gray-600 mb-4">
              Integrate with your GoHighLevel CRM to automate lead management and nurturing.
            </p>
            <Button onClick={initializeGHLConnection} disabled={loading}>
              {loading ? 'Connecting...' : 'Connect Now'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Dashboard */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Contacts</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalContacts}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">New Leads</p>
                <p className="text-2xl font-bold text-gray-900">{stats.newLeads}</p>
              </div>
              <Target className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Qualified Leads</p>
                <p className="text-2xl font-bold text-gray-900">{stats.qualifiedLeads}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Appointments Today</p>
                <p className="text-2xl font-bold text-gray-900">{stats.appointmentsToday}</p>
              </div>
              <Calendar className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Contacts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Recent Contacts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contacts.slice(0, 5).map(contact => (
              <div key={contact.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {contact.firstName[0]}{contact.lastName[0]}
                  </div>
                  <div>
                    <div className="font-semibold">{contact.firstName} {contact.lastName}</div>
                    <div className="text-sm text-gray-600">{contact.company}</div>
                    <div className="text-sm text-gray-500">{contact.email}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {contact.leadScore && (
                    <Badge variant="outline" className="font-semibold">
                      Score: {contact.leadScore}
                    </Badge>
                  )}
                  <Badge className={getStatusColor(contact.status)}>
                    {contact.status.replace('-', ' ').toUpperCase()}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Workflows */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Workflow className="w-5 h-5 mr-2" />
            Active Workflows
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {workflows.map(workflow => (
              <div key={workflow.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-semibold">{workflow.name}</div>
                  <div className="text-sm text-gray-600">
                    {workflow.enrolledContacts} contacts enrolled
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">
                    {workflow.completionRate}% completion
                  </Badge>
                  <Badge className={workflow.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {workflow.status.toUpperCase()}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Upcoming Appointments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {appointments.filter(apt => apt.status === 'scheduled').map(appointment => (
              <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-semibold">{appointment.title}</div>
                  <div className="text-sm text-gray-600">
                    {appointment.dateTime.toLocaleDateString()} at {appointment.dateTime.toLocaleTimeString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    Duration: {appointment.duration} minutes
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-800">
                  {appointment.type.toUpperCase()}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Hook for easy GHL integration
export const useGoHighLevel = () => {
  const [isConnected, setIsConnected] = useState(false);
  
  const createContact = async (contactData: any) => {
    // Implementation would go here
    logger.info('Creating GHL contact', { contactData });
  };
  
  const addToWorkflow = async (contactId: string, workflowId: string) => {
    // Implementation would go here
    logger.info('Adding to workflow', { contactId, workflowId });
  };
  
  const bookAppointment = async (appointmentData: any) => {
    // Implementation would go here
    logger.info('Booking appointment', { appointmentData });
  };
  
  return {
    isConnected,
    createContact,
    addToWorkflow,
    bookAppointment
  };
};

export default GoHighLevelIntegration;

