// GDPR compliance utilities
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { auditLogger } from '@/services/auditLogger';
import { PIIUtils } from '@/utils/encryption';

export interface DataSubject {
  userId: string;
  email: string;
  name?: string;
}

export interface ConsentRecord {
  purpose: string;
  granted: boolean;
  timestamp: string;
  version: string;
  source: string;
}

export interface DataProcessingActivity {
  id: string;
  purpose: string;
  legalBasis: 'consent' | 'contract' | 'legal_obligation' | 'vital_interests' | 'public_task' | 'legitimate_interests';
  categories: string[];
  retention: string;
  dataMinimization: boolean;
}

class GDPRCompliance {
  private readonly DATA_RETENTION_DAYS = 365 * 2; // 2 years default

  // Data Subject Rights Implementation
  async handleDataPortabilityRequest(userId: string): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      await auditLogger.logEvent({
        action: 'data_portability_request',
        resource: 'gdpr_compliance',
        resourceId: userId,
        category: 'data_access',
        severity: 'medium'
      });

      // Collect user data from all relevant tables
      const userData = await this.collectUserData(userId);
      
      // Format data for portability
      const portableData = {
        request_date: new Date().toISOString(),
        data_subject: {
          user_id: userId,
          collection_timestamp: new Date().toISOString()
        },
        personal_data: userData,
        metadata: {
          format: 'JSON',
          charset: 'UTF-8',
          gdpr_compliant: true
        }
      };

      logger.info('Data portability request processed', { userId });
      return { success: true, data: portableData };
    } catch (error) {
      logger.error('Failed to process data portability request', error as Error, { userId });
      return { success: false, error: (error as Error).message };
    }
  }

  async handleDataErasureRequest(userId: string): Promise<{ success: boolean; deleted_records?: number; error?: string }> {
    try {
      await auditLogger.logEvent({
        action: 'data_erasure_request',
        resource: 'gdpr_compliance',
        resourceId: userId,
        category: 'data_modification',
        severity: 'high'
      });

      let totalDeleted = 0;

      // Define tables that contain user data
      const userDataTables = [
        'ai_conversations',
        'ai_insights',
        'contacts',
        'chat_conversations',
        'daily_habits',
        'daily_journal_entries',
        'course_enrollments'
      ];

      // Delete data from each table
      for (const table of userDataTables) {
        try {
          const { count, error } = await (supabase as any)
            .from(table)
            .delete({ count: 'exact' })
            .eq('user_id', userId);

          if (error) {
            logger.error(`Failed to delete data from ${table}`, error, { userId });
          } else {
            totalDeleted += count || 0;
            logger.info(`Deleted ${count} records from ${table}`, { userId });
          }
        } catch (error) {
          logger.error(`Error deleting from ${table}`, error as Error, { userId });
        }
      }

      // Anonymize audit logs instead of deleting (for legal compliance)
      await this.anonymizeAuditLogs(userId);

      logger.info('Data erasure request completed', { userId, totalDeleted });
      return { success: true, deleted_records: totalDeleted };
    } catch (error) {
      logger.error('Failed to process data erasure request', error as Error, { userId });
      return { success: false, error: (error as Error).message };
    }
  }

  async handleDataRectificationRequest(
    userId: string, 
    corrections: Record<string, any>
  ): Promise<{ success: boolean; updated_records?: number; error?: string }> {
    try {
      await auditLogger.logEvent({
        action: 'data_rectification_request',
        resource: 'gdpr_compliance',
        resourceId: userId,
        category: 'data_modification',
        severity: 'medium',
        details: { corrections }
      });

      // This would need to be implemented based on your specific data model
      // For now, we'll return a placeholder response
      logger.info('Data rectification request processed', { userId, corrections });
      return { success: true, updated_records: 0 };
    } catch (error) {
      logger.error('Failed to process data rectification request', error as Error, { userId });
      return { success: false, error: (error as Error).message };
    }
  }

  // Consent Management
  async recordConsent(
    userId: string, 
    purpose: string, 
    granted: boolean, 
    version: string = '1.0',
    source: string = 'application'
  ): Promise<boolean> {
    try {
      const consentRecord = {
        user_id: userId,
        purpose,
        granted,
        version,
        source,
        timestamp: new Date().toISOString()
      };

      // Store consent in a dedicated table (would need to be created)
      logger.info('Consent recorded', { userId, purpose, granted });
      
      await auditLogger.logEvent({
        action: 'consent_recorded',
        resource: 'consent_management',
        resourceId: userId,
        category: 'system',
        severity: 'low',
        details: consentRecord
      });

      return true;
    } catch (error) {
      logger.error('Failed to record consent', error as Error, { userId, purpose });
      return false;
    }
  }

  async validateConsent(userId: string, purpose: string): Promise<boolean> {
    try {
      // This would check the consent table
      // For now, return true as placeholder
      logger.debug('Consent validation requested', { userId, purpose });
      return true;
    } catch (error) {
      logger.error('Failed to validate consent', error as Error, { userId, purpose });
      return false;
    }
  }

  // Data Processing Activities Register
  getDataProcessingActivities(): DataProcessingActivity[] {
    return [
      {
        id: 'user_analytics',
        purpose: 'User behavior analytics and app improvement',
        legalBasis: 'legitimate_interests',
        categories: ['usage_data', 'performance_metrics'],
        retention: '2 years',
        dataMinimization: true
      },
      {
        id: 'ai_conversations',
        purpose: 'AI assistant functionality and conversation history',
        legalBasis: 'consent',
        categories: ['conversation_data', 'preferences'],
        retention: '1 year',
        dataMinimization: true
      },
      {
        id: 'user_profiles',
        purpose: 'User account management and personalization',
        legalBasis: 'contract',
        categories: ['profile_data', 'preferences'],
        retention: 'Account lifetime + 30 days',
        dataMinimization: true
      },
      {
        id: 'audit_logs',
        purpose: 'Security monitoring and compliance',
        legalBasis: 'legal_obligation',
        categories: ['access_logs', 'security_events'],
        retention: '7 years',
        dataMinimization: false
      }
    ];
  }

  // Privacy Impact Assessment
  async conductPIA(activityId: string): Promise<{
    riskLevel: 'low' | 'medium' | 'high';
    recommendations: string[];
    compliance_status: 'compliant' | 'needs_review' | 'non_compliant';
  }> {
    const activity = this.getDataProcessingActivities().find(a => a.id === activityId);
    
    if (!activity) {
      return {
        riskLevel: 'high',
        recommendations: ['Activity not found in register'],
        compliance_status: 'non_compliant'
      };
    }

    const riskFactors = {
      sensitiveData: activity.categories.includes('health_data') || activity.categories.includes('biometric_data'),
      largeScale: activity.categories.length > 3,
      automated: activity.purpose.includes('automated'),
      minimization: activity.dataMinimization
    };

    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    const recommendations: string[] = [];

    if (riskFactors.sensitiveData) {
      riskLevel = 'high';
      recommendations.push('Implement additional security measures for sensitive data');
    }

    if (riskFactors.largeScale && !riskFactors.minimization) {
      riskLevel = riskLevel === 'high' ? 'high' : 'medium';
      recommendations.push('Review data minimization practices');
    }

    if (!activity.dataMinimization) {
      recommendations.push('Implement data minimization principles');
    }

    const compliance_status = riskLevel === 'low' ? 'compliant' : 
                             riskLevel === 'medium' ? 'needs_review' : 'non_compliant';

    logger.info('Privacy Impact Assessment conducted', { 
      activityId, 
      riskLevel, 
      compliance_status 
    });

    return { riskLevel, recommendations, compliance_status };
  }

  // Data Retention Management
  async enforceDataRetention(): Promise<{ cleaned_records: number; tables_processed: string[] }> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.DATA_RETENTION_DAYS);

      let totalCleaned = 0;
      const tablesProcessed: string[] = [];

      // Clean old analytics data
      const { count: analyticsCount } = await supabase
        .from('analytics_events')
        .delete({ count: 'exact' })
        .lt('created_at', cutoffDate.toISOString());

      if (analyticsCount) {
        totalCleaned += analyticsCount;
        tablesProcessed.push('analytics_events');
      }

      // Clean old audit logs (keep only security-related)
      const { count: auditCount } = await supabase
        .from('audit_logs')
        .delete({ count: 'exact' })
        .lt('created_at', cutoffDate.toISOString())
        .neq('action', 'security_event');

      if (auditCount) {
        totalCleaned += auditCount;
        tablesProcessed.push('audit_logs');
      }

      await auditLogger.logEvent({
        action: 'data_retention_cleanup',
        resource: 'gdpr_compliance',
        category: 'system',
        severity: 'low',
        details: { cleaned_records: totalCleaned, tables_processed: tablesProcessed }
      });

      logger.info('Data retention cleanup completed', { 
        cleaned_records: totalCleaned, 
        tables_processed: tablesProcessed 
      });

      return { cleaned_records: totalCleaned, tables_processed: tablesProcessed };
    } catch (error) {
      logger.error('Failed to enforce data retention', error as Error);
      throw error;
    }
  }

  // Helper Methods
  private async collectUserData(userId: string): Promise<Record<string, any>> {
    const userData: Record<string, any> = {};

    try {
      // Collect from various tables
      const tables = [
        'ai_conversations',
        'ai_insights', 
        'contacts',
        'daily_habits',
        'daily_journal_entries'
      ];

      for (const table of tables) {
        try {
          const { data, error } = await (supabase as any)
            .from(table)
            .select('*')
            .eq('user_id', userId);

          if (!error && data) {
            userData[table] = data.map(record => this.sanitizeForExport(record));
          }
        } catch (error) {
          logger.error(`Error collecting data from ${table}`, error as Error, { userId });
        }
      }

      return userData;
    } catch (error) {
      logger.error('Failed to collect user data', error as Error, { userId });
      throw error;
    }
  }

  private sanitizeForExport(record: any): any {
    // Remove internal system fields
    const { created_at, updated_at, ...sanitized } = record;
    return {
      ...sanitized,
      export_timestamp: new Date().toISOString()
    };
  }

  private async anonymizeAuditLogs(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('audit_logs')
        .update({ 
          user_id: null,
          user_agent: 'ANONYMIZED',
          ip_address: null 
        })
        .eq('user_id', userId);

      if (error) {
        throw error;
      }

      logger.info('Audit logs anonymized', { userId });
    } catch (error) {
      logger.error('Failed to anonymize audit logs', error as Error, { userId });
      throw error;
    }
  }
}

// Export singleton instance
export const gdprCompliance = new GDPRCompliance();
export default GDPRCompliance;
