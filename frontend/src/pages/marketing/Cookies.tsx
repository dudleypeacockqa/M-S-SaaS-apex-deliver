import React from 'react';
import MarketingNav from '@/components/MarketingNav'; // Assuming this component exists
import MarketingFooter from '@/components/MarketingFooter'; // Assuming this component exists
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

/**
 * Cookies Policy Page Component
 * Explains cookie usage, types, third-party cookies, and management.
 * Adheres to M&A/finance branding (Navy Blue, Emerald Green, Bright Blue).
 */

const CookiesPolicy: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navigation Bar */}
      <MarketingNav />

      {/* Main Content Section */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#001F3F] mb-4">
            Cookies Policy
          </h1>
          <p className="text-xl text-gray-600">
            Last Updated: October 29, 2025
          </p>
        </header>

        <div className="max-w-4xl mx-auto space-y-12">
          {/* Introduction */}
          <section id="introduction">
            <h2 className="text-3xl font-bold text-[#001F3F] mb-4 border-l-4 border-[#007F7F] pl-3">
              1. What Are Cookies?
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Our website, a joint platform for ApexDeliver and CapLiquify, uses cookies and similar technologies (like web beacons and pixels) to distinguish you from other users. This helps us provide you with a better experience when you browse our website and also allows us to improve our site and services in the complex M&A and financial advisory space.
            </p>
            <p className="mt-4 text-lg text-gray-700 leading-relaxed">
              A cookie is a small file of letters and numbers that we store on your browser or the hard drive of your computer if you agree. Cookies contain information that is transferred to your computer's hard drive.
            </p>
          </section>

          <Separator className="bg-gray-200" />

          {/* Types of Cookies We Use */}
          <section id="types">
            <h2 className="text-3xl font-bold text-[#001F3F] mb-6 border-l-4 border-[#007F7F] pl-3">
              2. Types of Cookies Used
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Strictly Necessary Cookies */}
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-[#007F7F]">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-[#001F3F]">Strictly Necessary Cookies</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-700">
                  <p>These are required for the operation of our website. They include, for example, cookies that enable you to log into secure areas of our site or use a shopping cart.</p>
                </CardContent>
              </Card>

              {/* Analytical/Performance Cookies */}
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-[#007F7F]">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-[#001F3F]">Analytical/Performance Cookies</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-700">
                  <p>They allow us to recognize and count the number of visitors and to see how visitors move around our website when they are using it. This helps us improve the way our website works.</p>
                </CardContent>
              </Card>

              {/* Functionality Cookies */}
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-[#007F7F]">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-[#001F3F]">Functionality Cookies</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-700">
                  <p>These are used to recognize you when you return to our website. This enables us to personalize our content for you and remember your preferences (for example, your choice of language or region).</p>
                </CardContent>
              </Card>

              {/* Targeting Cookies */}
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-[#007F7F]">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-[#001F3F]">Targeting Cookies</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-700">
                  <p>These cookies record your visit to our website, the pages you have visited and the links you have followed. We will use this information to make our website and the advertising displayed on it more relevant to your interests.</p>
                </CardContent>
              </Card>
            </div>
          </section>

          <Separator className="bg-gray-200" />

          {/* Third-Party Cookies */}
          <section id="third-party">
            <h2 className="text-3xl font-bold text-[#001F3F] mb-4 border-l-4 border-[#007F7F] pl-3">
              3. Third-Party Cookies
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Please note that third parties (including, for example, advertising networks and providers of external services like web traffic analysis services) may also use cookies, over which we have no control. These cookies are likely to be analytical/performance cookies or targeting cookies.
            </p>
            <p className="mt-4 text-lg text-gray-700 leading-relaxed">
              Specifically, we use services such as Google Analytics for performance tracking and LinkedIn for professional networking and advertising. Your interaction with these third parties is governed by their respective privacy and cookie policies.
            </p>
            <div className="mt-6">
              <Button
                variant="link"
                className="text-[#007F7F] hover:text-[#005A5A] font-semibold p-0 h-auto"
              >
                <a href="/privacy-policy" className="underline">
                  View our Privacy Policy for more details on third-party data usage.
                </a>
              </Button>
            </div>
          </section>

          <Separator className="bg-gray-200" />

          {/* Managing Your Preferences */}
          <section id="management">
            <h2 className="text-3xl font-bold text-[#001F3F] mb-6 border-l-4 border-[#007F7F] pl-3">
              4. Managing Your Cookie Preferences
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              You can manage your cookie preferences at any time. Most web browsers allow some control of most cookies through the browser settings.
            </p>

            <Card className="border-[#007F7F] border-2 bg-[#F0F8FF]">
              <CardHeader>
                <CardTitle className="text-2xl text-[#001F3F]">Browser Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  You can block cookies by activating the setting on your browser that allows you to refuse the setting of all or some cookies. However, if you use your browser settings to block all cookies (including essential cookies) you may not be able to access all or parts of our site.
                </p>
                <ul className="list-disc list-inside ml-4 text-gray-700 space-y-1">
                  <li><span className="font-semibold">Chrome:</span> Settings &gt; Privacy and security &gt; Site settings &gt; Cookies and site data.</li>
                  <li><span className="font-semibold">Firefox:</span> Options &gt; Privacy &amp; Security &gt; Enhanced Tracking Protection.</li>
                  <li><span className="font-semibold">Safari:</span> Preferences &gt; Privacy &gt; Block all cookies.</li>
                </ul>
              </CardContent>
            </Card>

            <div className="mt-8 text-center">
              <Button
                className="bg-[#007F7F] hover:bg-[#005A5A] text-white font-bold py-3 px-8 rounded-full transition-colors duration-300 shadow-md hover:shadow-lg"
              >
                Open Cookie Settings Panel
              </Button>
              <p className="mt-3 text-sm text-gray-500">
                (Note: This button would typically trigger a client-side modal or preference center)
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <MarketingFooter />
    </div>
  );
};

export default CookiesPolicy;