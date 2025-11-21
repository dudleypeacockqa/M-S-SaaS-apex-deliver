import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { CheckCircle, Download, Calendar, FileText, TrendingUp } from 'lucide-react';
import { getStoredCalculatorData, clearStoredCalculatorData, formatRevenueForPDF } from '@/utils/financeflo/revenueMatching';
import { generateBoardReport } from '@/components/marketing/financeflo/calculator/BoardReport';
import { track } from '@/lib/analytics';
import { Link } from 'react-router-dom';

const CalculatorThankYouPage: React.FC = () => {
  const [downloadStatus, setDownloadStatus] = useState<'downloading' | 'ready' | 'error'>('downloading');
  const [companyName, setCompanyName] = useState('Your Company');
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Extract parameters from URL
    const params = new URLSearchParams(window.location.search);
    let emailParam = params.get('email') || '';
    let companyParam = params.get('company') || params.get('company_name') || params.get('Business_Name') || 'Your Company';
    let nameParam = params.get('name') || params.get('first_name') || params.get('firstName') || params.get('First_Name') || '';

    // Decode URL-encoded placeholders and handle GHL variable placeholders
    // GHL sometimes passes {email} as %7Bemail%7D
    emailParam = decodeURIComponent(emailParam);
    companyParam = decodeURIComponent(companyParam);
    nameParam = decodeURIComponent(nameParam);

    // Check if placeholders weren't replaced by GHL
    if (emailParam === '{email}' || emailParam.includes('{email}') || !emailParam.includes('@')) emailParam = '';
    if (companyParam === '{company_name}' || companyParam === '{Business_Name}' || companyParam === 'Your Company') companyParam = 'Your Company';
    if (nameParam === '{first_name}' || nameParam === '{name}' || nameParam === '{First_Name}') nameParam = '';

    setUserEmail(emailParam);
    setCompanyName(companyParam);
    setUserName(nameParam);

    // Retrieve calculator data from session storage
    const calculatorData = getStoredCalculatorData();

    if (!calculatorData) {
      setDownloadStatus('error');
      console.error('No calculator data found in session storage');
      return;
    }

    const { inputs, results } = calculatorData;

    // Track page view
    track('thank_you_page_viewed', {
      industry: inputs.industry,
      company: companyParam,
      email: emailParam
    });

    // Report is ready, no auto-download
    setDownloadStatus('ready');

    // Auto-open chat widget after page loads
    const openChatWidget = () => {
      if ((window as any).leadConnector?.chatWidget) {
        setTimeout(() => {
          (window as any).leadConnector.chatWidget.openWidget();
        }, 2000); // Wait 2 seconds after page load
      }
    };

    // Listen for widget load event or open immediately if already loaded
    if ((window as any).leadConnector?.chatWidget) {
      openChatWidget();
    } else {
      window.addEventListener('LC_chatWidgetLoaded', openChatWidget, false);
    }

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener('LC_chatWidgetLoaded', openChatWidget);
    };
  }, []);

  const handleManualDownload = async () => {
    const calculatorData = getStoredCalculatorData();
    if (!calculatorData) return;

    const { inputs, results } = calculatorData;

    // Add download tag FIRST (before opening report - more reliable)
    if (userEmail && userEmail.includes('@')) {
      await addDownloadTagToContact(userEmail);
    }

    // Then generate and open report
    const reportHTML = generateBoardReport(results, inputs, companyName);

    // Open in new window for viewing and printing to PDF
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(reportHTML);
      printWindow.document.close();

      // Add print instruction
      setTimeout(() => {
        if (printWindow && !printWindow.closed) {
          printWindow.focus();
          // User can use browser's Print to PDF feature
        }
      }, 500);
    }

    track('pdf_download_clicked', {
      company: companyName,
      industry: inputs.industry
    });

    // Clear session storage after download initiated
    setTimeout(() => {
      clearStoredCalculatorData();
    }, 3000);
  };

  const addDownloadTagToContact = async (email: string) => {
    try {
      const apiKey = import.meta.env.VITE_GHL_API_KEY;
      const locationId = import.meta.env.VITE_GHL_LOCATION_ID;

      if (!apiKey || !locationId) {
        console.warn('GHL API credentials not configured');
        return;
      }

      // Search for contact by email
      const searchResponse = await fetch(
        `https://rest.gohighlevel.com/v1/contacts/?locationId=${locationId}&email=${encodeURIComponent(email)}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!searchResponse.ok) {
        console.warn('Failed to find contact for tag update');
        return;
      }

      const searchData = await searchResponse.json();

      if (!searchData.contacts || searchData.contacts.length === 0) {
        console.warn('Contact not found for tag update');
        return;
      }

      const contact = searchData.contacts[0];
      const contactId = contact.id;
      const existingTags = contact.tags || [];

      // Add new tag if not already present
      if (!existingTags.includes('src:working_capital:report_downloaded')) {
        const updatedTags = [...existingTags, 'src:working_capital:report_downloaded'];

        // Update contact with new tag
        await fetch(
          `https://rest.gohighlevel.com/v1/contacts/${contactId}`,
          {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ tags: updatedTags })
          }
        );
      }
    } catch (error) {
      console.error('Error adding download tag:', error);
      // Don't block download on error
    }
  };

  return (
    <>
      <Helmet>
        <title>Thank You - Your Report is Ready | FinanceFlo</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-brand-grey to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="mb-6 flex justify-center">
              <a href="https://financeflo.ai/" className="inline-block">
                <img
                  src="/FFLightBG-Logo.svg"
                  alt="FinanceFlo"
                  className="h-16 w-auto"
                />
              </a>
            </div>
            <h1 className="text-4xl font-heading font-bold text-brand-navy mb-4">
              {userName ? `${userName}, your Board-Ready Report for ${companyName} is ready to be downloaded` : `Your Board-Ready Report for ${companyName} is ready to be downloaded`}
            </h1>
          </div>

          {/* Download Status */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            {downloadStatus === 'downloading' && (
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green mx-auto mb-4"></div>
                <p className="text-lg text-gray-700">Generating your personalized report...</p>
              </div>
            )}

            {downloadStatus === 'ready' && (
              <div className="text-center">
                <Download className="w-16 h-16 text-brand-green mx-auto mb-6" />
                <p className="text-xl text-gray-700 mb-2 max-w-xl mx-auto font-medium">
                  For your privacy, this is the only opportunity to get this report.
                </p>
                <p className="text-2xl font-semibold text-brand-navy mb-6">
                  Please download it and save it securely.
                </p>
                <button
                  onClick={handleManualDownload}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-brand-green text-white font-semibold text-lg rounded-2xl hover:bg-brand-green-light transition-all shadow-lg hover:shadow-xl"
                >
                  <Download className="w-6 h-6" />
                  Download Your Report
                </button>
                <p className="text-sm text-gray-500 mt-4">
                  Opens in a new window • Use your browser's "Print to PDF" to save
                </p>
              </div>
            )}

            {downloadStatus === 'error' && (
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-red-600">!</span>
                </div>
                <h2 className="text-2xl font-semibold text-brand-navy mb-2">
                  Oops! Something went wrong
                </h2>
                <p className="text-gray-600 mb-4">
                  We couldn't generate your report. Please try again or contact us for assistance.
                </p>
                <Link
                  to="/calculator"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-brand-green text-white font-semibold rounded-2xl hover:bg-brand-green-light transition-colors"
                >
                  Return to Calculator
                </Link>
              </div>
            )}
          </div>

          {/* What's Next Section */}
          {downloadStatus === 'ready' && (
            <>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-heading font-bold text-brand-navy mb-4">
                  What's Next?
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  While you review your report, here's how we can help you implement these insights
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {/* Book Strategy Session */}
                <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow border-2 border-transparent hover:border-brand-green">
                  <div className="w-12 h-12 bg-brand-green/10 rounded-full flex items-center justify-center mb-4">
                    <Calendar className="w-6 h-6 text-brand-green" />
                  </div>
                  <h3 className="text-xl font-semibold text-brand-navy mb-2">
                    Book Free Strategy Session
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Get a personalized 15-minute review of your working capital opportunities with our CFO Advisory team
                  </p>
                  <a
                    href="/contact"
                    className="inline-flex items-center text-brand-green font-semibold hover:text-brand-green-light transition-colors"
                  >
                    Schedule Now →
                  </a>
                </div>

                {/* Case Studies */}
                <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow border-2 border-transparent hover:border-brand-blue">
                  <div className="w-12 h-12 bg-brand-blue/10 rounded-full flex items-center justify-center mb-4">
                    <FileText className="w-6 h-6 text-brand-blue" />
                  </div>
                  <h3 className="text-xl font-semibold text-brand-navy mb-2">
                    See Success Stories
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Learn how other businesses in your industry unlocked cash and improved operations
                  </p>
                  <Link
                    to="/blog"
                    className="inline-flex items-center text-brand-blue font-semibold hover:text-brand-blue-dark transition-colors"
                  >
                    Read Case Studies →
                  </Link>
                </div>

                {/* Explore Solutions */}
                <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow border-2 border-transparent hover:border-brand-navy">
                  <div className="w-12 h-12 bg-brand-navy/10 rounded-full flex items-center justify-center mb-4">
                    <TrendingUp className="w-6 h-6 text-brand-navy" />
                  </div>
                  <h3 className="text-xl font-semibold text-brand-navy mb-2">
                    Explore AI Solutions
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Discover how AI-powered ERP can automate your finance operations and unlock growth
                  </p>
                  <Link
                    to="/"
                    className="inline-flex items-center text-brand-navy font-semibold hover:text-brand-navy-light transition-colors"
                  >
                    Learn More →
                  </Link>
                </div>
              </div>

              {/* Contact CTA */}
              <div className="bg-gradient-to-r from-brand-navy to-brand-navy-light rounded-2xl p-8 text-center text-white">
                <h3 className="text-2xl font-heading font-bold mb-4">
                  Questions About Your Report?
                </h3>
                <p className="text-lg mb-6 text-blue-100">
                  Our team is here to help you understand and implement your working capital optimization strategy
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="tel:+447306604807"
                    className="inline-flex items-center justify-center px-8 py-3 bg-brand-green text-white font-semibold rounded-2xl hover:bg-brand-green-light transition-colors"
                  >
                    Call +44 730 660 4807
                  </a>
                  <a
                    href="mailto:helpdesk@financeflo.ai"
                    className="inline-flex items-center justify-center px-8 py-3 bg-white text-brand-navy font-semibold rounded-2xl hover:bg-gray-100 transition-colors"
                  >
                    Email Us
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CalculatorThankYouPage;
