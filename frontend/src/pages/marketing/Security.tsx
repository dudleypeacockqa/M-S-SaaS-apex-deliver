import { Card, CardContent, CardHeader } from "@/components/ui/card";
import MarketingFooter from "@/components/MarketingFooter";
import MarketingNav from "@/components/MarketingNav";
import SEO from "@/components/SEO";
import { Check, Shield, Lock, Server, Database, Eye, FileCheck, AlertTriangle } from "lucide-react";

export default function Security() {
  const securityFeatures = [
    {
      icon: Shield,
      title: "Segregated Multi-Tenant Architecture",
      description: "Complete logical and physical data isolation between tenants using dedicated database schemas, row-level security policies, and encrypted storage partitions. Each customer's data is cryptographically separated with unique encryption keys.",
    },
    {
      icon: Lock,
      title: "End-to-End Encryption",
      description: "TLS 1.3 for all data in transit with perfect forward secrecy. AES-256-GCM encryption for data at rest. All encryption keys are managed through hardware security modules (HSMs) with automatic rotation every 90 days.",
    },
    {
      icon: Database,
      title: "Database Security & Redundancy",
      description: "Automated daily backups with point-in-time recovery up to 35 days. Multi-region replication with automatic failover. All database connections use mutual TLS authentication and are restricted to application servers only.",
    },
    {
      icon: Server,
      title: "Infrastructure Security",
      description: "Containerized microservices architecture with network isolation. Web Application Firewall (WAF) with DDoS protection. Intrusion Detection System (IDS) with real-time threat monitoring. Automated security patching with zero-downtime deployments.",
    },
    {
      icon: Eye,
      title: "Access Control & Authentication",
      description: "OAuth 2.0 and OpenID Connect for secure authentication. Role-Based Access Control (RBAC) with granular permissions. Multi-Factor Authentication (MFA) support. Session management with automatic timeout and token revocation.",
    },
    {
      icon: FileCheck,
      title: "Audit Logging & Compliance",
      description: "Comprehensive audit trails for all data access and modifications. Immutable logs stored for 7 years. GDPR, SOC 2 Type II, and ISO 27001 compliant. Regular third-party security audits and penetration testing.",
    },
  ];

  const technicalDetails = [
    {
      category: "Application Security",
      items: [
        "Input validation and sanitization on all user inputs",
        "Parameterized queries to prevent SQL injection",
        "Content Security Policy (CSP) headers",
        "HTTP Strict Transport Security (HSTS)",
        "Cross-Site Request Forgery (CSRF) protection",
        "Cross-Origin Resource Sharing (CORS) policies",
        "Secure cookie attributes (HttpOnly, Secure, SameSite)",
        "Rate limiting and request throttling",
      ],
    },
    {
      category: "Data Protection",
      items: [
        "Field-level encryption for sensitive data (PII, financial data)",
        "Tokenization for payment card data (PCI DSS compliant)",
        "Data masking in non-production environments",
        "Secure data deletion with cryptographic erasure",
        "Data residency controls (EU, US, UK regions available)",
        "Encrypted backups with separate encryption keys",
        "Zero-knowledge architecture for document storage",
        "Data Loss Prevention (DLP) policies",
      ],
    },
    {
      category: "Network Security",
      items: [
        "Private Virtual Private Cloud (VPC) with subnet isolation",
        "Network Access Control Lists (NACLs) and Security Groups",
        "VPN and IP whitelisting for enterprise customers",
        "DDoS mitigation with automatic traffic filtering",
        "Web Application Firewall (WAF) with OWASP Top 10 protection",
        "TLS certificate pinning for mobile applications",
        "DNS security with DNSSEC validation",
        "Egress filtering to prevent data exfiltration",
      ],
    },
    {
      category: "Operational Security",
      items: [
        "24/7 Security Operations Center (SOC) monitoring",
        "Automated vulnerability scanning and remediation",
        "Incident response plan with <1 hour response time",
        "Regular penetration testing by certified ethical hackers",
        "Bug bounty program with responsible disclosure",
        "Security awareness training for all employees",
        "Background checks for all personnel with data access",
        "Secure software development lifecycle (SDLC)",
      ],
    },
    {
      category: "Business Continuity",
      items: [
        "99.95% uptime SLA with financial penalties for breaches",
        "Multi-region active-active architecture",
        "Automated failover with <5 minute RTO",
        "Recovery Point Objective (RPO) of <15 minutes",
        "Disaster recovery testing every quarter",
        "Redundant power and network connectivity",
        "Geographic distribution across 3+ availability zones",
        "Real-time health monitoring and alerting",
      ],
    },
  ];

  const certifications = [
    "SOC 2 Type II Certified",
    "ISO 27001:2013 Certified",
    "GDPR Compliant",
    "PCI DSS Level 1 Service Provider",
    "HIPAA Compliant (BAA available)",
    "UK Cyber Essentials Plus",
    "NIST Cybersecurity Framework Aligned",
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title="Security & Compliance"
        description="Enterprise-grade security with segregated multi-tenant architecture, end-to-end encryption, and 99.95% uptime SLA. SOC 2 Type II and ISO 27001 certified."
        keywords="security, compliance, multi-tenant, encryption, SOC 2, ISO 27001, GDPR, data protection"
      />
      <MarketingNav />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary to-accent text-primary-foreground">
          <div className="container text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary/20 mb-6">
              <Shield className="h-10 w-10 text-secondary" />
            </div>
            <h1 className="mb-4 text-primary-foreground">Enterprise-Grade Security & Compliance</h1>
            <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
              Your data is protected by military-grade encryption, segregated multi-tenant architecture, and continuous security monitoring. We maintain 99.95% uptime with zero data breaches since inception.
            </p>
          </div>
        </section>

        {/* Security Features Grid */}
        <section className="py-20">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="mb-4">Comprehensive Security Architecture</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Built from the ground up with security as the foundation, not an afterthought. Every layer of our infrastructure is designed to protect your most sensitive M&A and financial data.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {securityFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={index} className="border-2 hover:border-secondary transition-all">
                    <CardHeader>
                      <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                        <Icon className="h-6 w-6 text-secondary" />
                      </div>
                      <h3 className="text-xl font-bold">{feature.title}</h3>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Technical Details */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="mb-4">Technical Security Controls</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Detailed breakdown of the security measures protecting your data at every layer of the stack.
              </p>
            </div>
            <div className="grid lg:grid-cols-2 gap-8">
              {technicalDetails.map((section, index) => (
                <Card key={index}>
                  <CardHeader>
                    <h3 className="text-2xl font-bold">{section.category}</h3>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {section.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Uptime & Reliability */}
        <section className="py-20">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <Card className="border-2 border-secondary">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-16 w-16 rounded-full bg-secondary/10 flex items-center justify-center">
                      <Server className="h-8 w-8 text-secondary" />
                    </div>
                    <div>
                      <h2 className="mb-2">99.95% Uptime SLA</h2>
                      <p className="text-lg text-muted-foreground">
                        Powered by enterprise-grade cloud infrastructure with multi-region redundancy
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-muted/50 rounded-lg">
                      <div className="text-4xl font-bold text-secondary mb-2">99.95%</div>
                      <div className="text-sm text-muted-foreground">Guaranteed Uptime</div>
                    </div>
                    <div className="text-center p-6 bg-muted/50 rounded-lg">
                      <div className="text-4xl font-bold text-secondary mb-2">&lt;5 min</div>
                      <div className="text-sm text-muted-foreground">Recovery Time Objective</div>
                    </div>
                    <div className="text-center p-6 bg-muted/50 rounded-lg">
                      <div className="text-4xl font-bold text-secondary mb-2">&lt;15 min</div>
                      <div className="text-sm text-muted-foreground">Recovery Point Objective</div>
                    </div>
                  </div>
                  <div className="bg-accent/10 border-l-4 border-accent p-6 rounded">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold mb-2">Financial Penalties for SLA Breaches</h4>
                        <p className="text-sm text-muted-foreground">
                          We stand behind our uptime commitment. If we fail to meet our 99.95% SLA, you receive automatic service credits:
                          10% credit for 99.9-99.94% uptime, 25% credit for 99.0-99.89% uptime, and 50% credit for below 99% uptime.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Certifications */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="mb-4">Certifications & Compliance</h2>
              <p className="text-lg text-muted-foreground mb-12">
                Independently verified and certified by leading security and compliance auditors.
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {certifications.map((cert, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg border-2 border-border hover:border-secondary transition-colors">
                    <div className="flex items-center justify-center gap-3">
                      <Check className="h-5 w-5 text-secondary flex-shrink-0" />
                      <span className="font-semibold">{cert}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="mb-4">Questions About Security?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our security team is available to answer your questions, provide detailed architecture diagrams, and discuss custom security requirements for enterprise deployments.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8"
                >
                  Contact Security Team
                </a>
                <a
                  href="mailto:security@apex-cap.com"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input hover:bg-accent hover:text-accent-foreground h-11 px-8"
                >
                  security@apex-cap.com
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
