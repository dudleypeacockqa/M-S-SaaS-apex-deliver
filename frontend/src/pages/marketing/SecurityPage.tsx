import React from 'react';
import { MarketingLayout } from '../../components/marketing/MarketingLayout';
import { SEO } from '../../components/common/SEO';
import { CTASection } from '../../components/marketing/CTASection';

export const SecurityPage: React.FC = () => {
  const securityFeatures = [
    {
      icon: '🔐',
      title: 'Segregated Multi-Tenant Architecture',
      description: 'Complete data isolation between organizations with database-level segregation, ensuring your sensitive M&A data never mingles with other tenants.',
    },
    {
      icon: '🛡️',
      title: 'End-to-End Encryption',
      description: 'AES-256 encryption at rest and TLS 1.3 in transit. All data is encrypted before storage, and encryption keys are managed through AWS KMS with automatic rotation.',
    },
    {
      icon: '👁️',
      title: 'Continuous Security Monitoring',
      description: '24/7 intrusion detection, automated threat response, and real-time security event logging. We detect and respond to threats before they impact your data.',
    },
    {
      icon: '🔑',
      title: 'Advanced Access Controls',
      description: 'Role-based access control (RBAC), multi-factor authentication (MFA), SSO integration, and granular permissions ensure only authorized users access sensitive data.',
    },
    {
      icon: '📊',
      title: 'Comprehensive Audit Logging',
      description: 'Immutable audit trails track every action, API call, and data access. Full compliance with regulatory requirements for financial and healthcare data.',
    },
    {
      icon: '🔄',
      title: '99.95% Uptime SLA',
      description: 'Multi-region active-active architecture with automated failover, <5 minute RTO, and <15 minute RPO. Financial penalties for SLA breaches.',
    },
  ];

  const certifications = [
    'SOC 2 Type II Certified',
    'ISO 27001:2013 Certified',
    'GDPR Compliant',
    'PCI DSS Level 1 Service Provider',
    'HIPAA Compliant (BAA available)',
    'UK Cyber Essentials Plus',
    'NIST Cybersecurity Framework Aligned',
  ];

  const technicalDetails = [
    {
      category: 'Data Protection',
      items: [
        'AES-256-GCM encryption at rest',
        'TLS 1.3 for all data in transit',
        'Encrypted database backups every 6 hours',
        'Point-in-time recovery up to 35 days',
        'AWS KMS for key management with automatic rotation',
        'Secure key storage in hardware security modules (HSMs)',
        'Data residency controls (UK, EU, US regions available)',
        'Right to erasure (GDPR Article 17) compliance',
      ],
    },
    {
      category: 'Infrastructure Security',
      items: [
        'Segregated multi-tenant database architecture',
        'Network isolation with VPC and private subnets',
        'Web Application Firewall (WAF) with OWASP Top 10 protection',
        'DDoS protection with automatic mitigation',
        'Intrusion Detection System (IDS) and Intrusion Prevention System (IPS)',
        'Regular penetration testing by third-party security firms',
        'Vulnerability scanning and patch management',
        'Container security with image scanning and runtime protection',
      ],
    },
    {
      category: 'Access Control',
      items: [
        'Multi-factor authentication (MFA) required for all users',
        'Single Sign-On (SSO) via SAML 2.0 and OAuth 2.0',
        'Role-Based Access Control (RBAC) with least privilege principle',
        'Granular permissions at organization, deal, and document levels',
        'Session management with automatic timeout',
        'IP whitelisting for enterprise customers',
        'API key rotation and rate limiting',
        'Passwordless authentication options',
      ],
    },
    {
      category: 'Compliance & Auditing',
      items: [
        'SOC 2 Type II annual audits',
        'ISO 27001:2013 certification',
        'GDPR compliance with DPA and privacy controls',
        'HIPAA compliance with Business Associate Agreement (BAA)',
        'PCI DSS Level 1 for payment processing',
        'Immutable audit logs retained for 7 years',
        'Detailed access logs for all user actions',
        'Automated compliance reporting',
      ],
    },
    {
      category: 'Application Security',
      items: [
        'OWASP Top 10 vulnerability protection',
        'Input validation and output encoding',
        'SQL injection and XSS prevention',
        'CSRF token protection',
        'Content Security Policy (CSP) headers',
        'Dependency scanning and automated updates',
        'Code review and static analysis',
        'Security training for all personnel with data access',
      ],
    },
    {
      category: 'Business Continuity',
      items: [
        '99.95% uptime SLA with financial penalties for breaches',
        'Multi-region active-active architecture',
        'Automated failover with <5 minute RTO',
        'Recovery Point Objective (RPO) of <15 minutes',
        'Disaster recovery testing every quarter',
        'Redundant power and network connectivity',
        'Geographic distribution across 3+ availability zones',
        'Real-time health monitoring and alerting',
      ],
    },
  ];

  return (
    <MarketingLayout>
      <SEO
        title="Security & Compliance | ApexDeliver + CapLiquify"
        description="Enterprise-grade security with segregated multi-tenant architecture, end-to-end encryption, and 99.95% uptime SLA. SOC 2 Type II and ISO 27001 certified."
        keywords="security, compliance, multi-tenant, encryption, SOC 2, ISO 27001, GDPR, data protection"
      />

      {/* Header */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-6xl mb-6">🛡️</div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
            Enterprise-Grade Security & Compliance
          </h1>
          <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
            Your data is protected by military-grade encryption, segregated multi-tenant architecture, and continuous security monitoring. We maintain 99.95% uptime with zero data breaches since inception.
          </p>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Comprehensive Security Architecture
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Built from the ground up with security as the foundation, not an afterthought. Every layer of our infrastructure is designed to protect your most sensitive M&A and financial data.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {securityFeatures.map((feature, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200 hover:border-indigo-900 transition-colors">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Certifications & Compliance
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We maintain the highest industry standards and undergo regular third-party audits to ensure your data is protected.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center border-2 border-emerald-600">
                <div className="text-3xl mb-3">✓</div>
                <p className="font-semibold text-gray-900">{cert}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Details */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Technical Security Controls
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Detailed breakdown of the security measures protecting your data at every layer of the stack.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {technicalDetails.map((section, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">{section.category}</h3>
                <ul className="space-y-3">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start">
                      <span className="text-emerald-700 mr-3 flex-shrink-0">✓</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Uptime Guarantee */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            99.95% Uptime SLA
          </h2>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            We guarantee 99.95% uptime backed by financial penalties for SLA breaches. Our multi-region active-active architecture ensures your M&A operations never stop, with automated failover in less than 5 minutes and data recovery within 15 minutes.
          </p>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div>
              <div className="text-4xl font-extrabold text-indigo-900 mb-2">99.95%</div>
              <div className="text-gray-600">Uptime SLA</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-indigo-900 mb-2">&lt;5min</div>
              <div className="text-gray-600">Recovery Time Objective</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-indigo-900 mb-2">&lt;15min</div>
              <div className="text-gray-600">Recovery Point Objective</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />
    </MarketingLayout>
  );
};
