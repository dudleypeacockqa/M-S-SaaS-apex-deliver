import React from 'react';
import MarketingNav from '@/components/MarketingNav'; // Assuming component is in a sibling file
import MarketingFooter from '@/components/MarketingFooter'; // Assuming component is in a sibling file
import { Card, CardContent } from '@/components/ui/card'; // shadcn/ui Card component

// Helper component to render the policy content from Markdown-like text
const PolicyContent: React.FC<{ content: string }> = ({ content }) => {
  const sections = content.split('## ').filter(s => s.trim() !== '');

  return (
    <div className="space-y-8">
      {sections.map((section, index) => {
        const [titleAndRest, ...subSections] = section.split('\\n\\n').filter(s => s.trim() !== '');
        const [title, ...restOfTitleSection] = titleAndRest.split('\\n');
        
        // Remove the leading number from the title if present (e.g., "1. Information We Collect")
        const cleanTitle = title.replace(/^[0-9]+\.\s*/, '').trim();

        return (
          <section key={index} className="space-y-4">
            <h2 className="text-3xl font-bold text-[#001F3F] border-b-2 border-[#3D9970] pb-2">
              {cleanTitle}
            </h2>
            <div className="text-gray-700 space-y-4">
              {restOfTitleSection.join('\\n').trim() && (
                <p>{restOfTitleSection.join('\\n').trim()}</p>
              )}
              
              {subSections.map((subSection, subIndex) => {
                const [subTitleLine, ...subContent] = subSection.split('\\n');
                
                // Check if it's a sub-heading (starts with ### or similar)
                if (subTitleLine.startsWith('###')) {
                  const subTitle = subTitleLine.replace('###', '').trim();
                  return (
                    <div key={subIndex} className="space-y-3 pt-2">
                      <h3 className="text-xl font-semibold text-[#0074D9]">
                        {subTitle}
                      </h3>
                      {subContent.join('\\n').split('\\n').map((paragraph, pIndex) => {
                        const trimmed = paragraph.trim();
                        if (trimmed.startsWith('*')) {
                          // Handle list items
                          return (
                            <ul key={pIndex} className="list-disc list-inside ml-4 space-y-1">
                              {trimmed.split('*').filter(item => item.trim()).map((item, i) => (
                                <li key={i}>{item.trim()}</li>
                              ))}
                            </ul>
                          );
                        }
                        if (trimmed.startsWith('**')) {
                            // Handle bold text like "Last Updated:"
                            const parts = trimmed.split(':');
                            return <p key={pIndex}><strong>{parts[0].replace(/\\*\\*/g, '')}:</strong> {parts.slice(1).join(':')}</p>
                        }
                        return trimmed ? <p key={pIndex}>{trimmed}</p> : null;
                      })}
                    </div>
                  );
                }
                
                // Handle general paragraphs outside of sub-sections
                return subSection.split('\\n').map((paragraph, pIndex) => {
                    const trimmed = paragraph.trim();
                    if (trimmed.startsWith('*')) {
                        // Handle list items
                        return (
                            <ul key={pIndex} className="list-disc list-inside ml-4 space-y-1">
                                {trimmed.split('*').filter(item => item.trim()).map((item, i) => (
                                    <li key={i}>{item.trim()}</li>
                                ))}
                            </ul>
                        );
                    }
                    return trimmed ? <p key={pIndex}>{trimmed}</p> : null;
                });
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
};

const PRIVACY_POLICY_MARKDOWN = `
# Privacy Policy

**Last Updated:** October 29, 2025

This Privacy Policy describes how ApexDeliver and CapLiquify (collectively, "We," "Us," or "Our") collect, use, and share information about you through our website and services (collectively, the "Services").

## 1. Information We Collect

We collect information about you in a few ways:

### A. Information You Provide to Us

We collect information you directly provide to us, such as when you:
*   Inquire about our M&A advisory or capital liquefaction services.
*   Sign up for our newsletter or contact list.
*   Communicate with us via email or other channels.

This information may include your name, email address, phone number, company name, job title, and any other information you choose to provide.

### B. Information We Collect Automatically

When you access or use our Services, we may automatically collect information about you, including:
*   **Log Information:** Details of how you used our Services (e.g., access times, pages viewed, IP address, and the page you visited before navigating to our Services).
*   **Device Information:** Information about the computer or mobile device you use to access our Services, including the hardware model, operating system and version, unique device identifiers, and mobile network information.
*   **Location Information:** We may derive your approximate location from your IP address.

### C. Information from Other Sources

We may obtain information from third-party sources, such as public databases or data providers, to supplement the information we collect directly from you.

## 2. Use of Information

We use the information we collect for various business purposes, including to:
*   Provide, maintain, and improve our Services and business operations.
*   Process your inquiries and provide you with the services you request.
*   Communicate with you about products, services, offers, and events offered by ApexDeliver and CapLiquify.
*   Monitor and analyze trends, usage, and activities in connection with our Services.
*   Detect, investigate, and prevent fraudulent transactions and other illegal activities, and protect the rights and property of ApexDeliver and CapLiquify and others.
*   Comply with legal obligations, including financial reporting and regulatory requirements.

## 3. Sharing of Information

We may share information about you as follows or as otherwise described in this Privacy Policy:
*   **With Vendors and Service Providers:** We share information with third-party vendors, consultants, and other service providers who need access to the information to perform services on our behalf (e.g., hosting, analytics, and marketing services).
*   **For Business Transfers:** In connection with any merger, sale of company assets, financing, or acquisition of all or a portion of our business by another company.
*   **For Legal Compliance and Protection:** To comply with applicable law, regulation, or legal process; to enforce our agreements; and to protect the rights, property, and safety of ApexDeliver, CapLiquify, our users, or others.
*   **With Your Consent:** We may share your information with your consent or at your direction.

## 4. Cookies and Tracking Technologies

We use cookies and similar tracking technologies (like web beacons and pixels) to collect information about your browsing behavior and to provide and improve our Services.
*   **What are Cookies?** Cookies are small data files stored on your hard drive or in device memory that help us improve our Services and your experience.
*   **Your Choices:** Most web browsers are set to accept cookies by default. You can usually choose to set your browser to remove or reject browser cookies. Please note that if you choose to remove or reject cookies, this could affect the availability and functionality of our Services.

## 5. Data Security and Retention

We implement reasonable security measures designed to protect your information from unauthorized access, disclosure, alteration, and destruction. However, no security system is impenetrable, and we cannot guarantee the security of our systems 100%. We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.

## 6. Your Rights (GDPR and CCPA Compliance)

Depending on your location, you may have the following rights regarding your personal information:

### A. For European Economic Area (EEA) and UK Residents (GDPR)

If you are a resident of the EEA or the UK, you have the right to:
*   Access your personal data.
*   Rectify inaccurate personal data.
*   Request erasure of your personal data ("right to be forgotten").
*   Restrict the processing of your personal data.
*   Object to the processing of your personal data.
*   Data portability.
*   Lodge a complaint with a supervisory authority.

### B. For California Residents (CCPA/CPRA)

If you are a California resident, you have the right to:
*   Know what personal information is being collected about you.
*   Know whether your personal information is sold or shared, and to whom.
*   Say no to the sale or sharing of your personal information ("right to opt-out").
*   Access your personal information.
*   Request that we delete any personal information about you that we have collected.
*   Non-discrimination for exercising your CCPA rights.

To exercise any of these rights, please contact us using the contact information provided below.

## 7. Changes to This Privacy Policy

We may change this Privacy Policy from time to time. If we make changes, we will notify you by revising the "Last Updated" date at the top of the policy and, in some cases, we may provide you with additional notice (such as adding a statement to our homepage or sending you an email notification). We encourage you to review the Privacy Policy whenever you access the Services to stay informed about our information practices.

## 8. Contact Information

If you have any questions about this Privacy Policy, please contact us:

**ApexDeliver & CapLiquify**
*   **Email:** privacy@apex-cap.com
*   **Address:** [Insert Corporate Address Here]
`;

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <MarketingNav />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <Card className="shadow-2xl border-t-4 border-[#3D9970] max-w-4xl mx-auto">
          <CardContent className="p-6 md:p-10">
            <header className="mb-8 md:mb-12">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-[#001F3F] tracking-tight">
                Privacy Policy
              </h1>
              <p className="mt-2 text-lg text-gray-500">
                A commitment to transparency and data protection for our clients and partners.
              </p>
            </header>
            <PolicyContent content={PRIVACY_POLICY_MARKDOWN} />
          </CardContent>
        </Card>
      </main>
      <MarketingFooter />
    </div>
  );
};

export default PrivacyPolicy;