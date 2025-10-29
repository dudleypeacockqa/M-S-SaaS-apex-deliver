import React from 'react';
import { Check, X, ArrowRight, Minus } from 'lucide-react';

// Assume these components are available in the project structure
// They are not defined here as per the instruction to only provide the page content.
// import MarketingNav from './MarketingNav';
// import MarketingFooter from './MarketingFooter';

// --- SHADCN/UI COMPONENT SIMULATIONS (for a self-contained file) ---
// In a real project, these would be imported from a library like '~/components/ui'

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'outline' | 'ghost', size?: 'default' | 'lg' }> = ({ children, className, variant = 'default', size = 'default', ...props }) => (
  <button
    className={`
      inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50
      ${size === 'default' ? 'h-10 px-4 py-2' : 'h-12 px-6 text-base'}
      ${variant === 'default' ? 'bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-emerald-500' : ''}
      ${variant === 'outline' ? 'border border-navy-600 text-navy-800 hover:bg-navy-50 focus-visible:ring-navy-500' : ''}
      ${variant === 'ghost' ? 'text-navy-800 hover:bg-navy-50 focus-visible:ring-navy-500' : ''}
      ${className}
    `}
    {...props}
  >
    {children}
  </button>
);

const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => (
  <div
    className={`
      rounded-xl border bg-white shadow-lg transition-shadow hover:shadow-xl
      ${className}
    `}
    {...props}
  >
    {children}
  </div>
);

const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props}>
    {children}
  </div>
);

const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ children, className, ...props }) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`} {...props}>
    {children}
  </h3>
);

const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ children, className, ...props }) => (
  <p className={`text-sm text-gray-500 ${className}`} {...props}>
    {children}
  </p>
);

const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => (
  <div className={`p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
);

const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => (
  <div className={`flex items-center p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
);

const Accordion: React.FC<{ type: 'single', collapsible: boolean, className?: string, children: React.ReactNode }> = ({ children, className }) => (
  <div className={`w-full space-y-4 ${className}`}>{children}</div>
);

const AccordionItem: React.FC<{ value: string, className?: string, children: React.ReactNode }> = ({ children, className }) => (
  <div className={`border-b ${className}`}>{children}</div>
);

const AccordionTrigger: React.FC<{ className?: string, children: React.ReactNode }> = ({ children, className }) => (
  <button className={`flex w-full items-center justify-between py-4 text-lg font-medium transition-all hover:underline ${className}`}>
    {children}
    <Minus className="h-4 w-4 shrink-0 transition-transform duration-200" />
  </button>
);

const AccordionContent: React.FC<{ className?: string, children: React.ReactNode }> = ({ children, className }) => (
  <div className={`pb-4 text-sm text-gray-600 ${className}`}>{children}</div>
);

// --- COLOR PALETTE (Tailwind Classes) ---
// Navy Blue: bg-navy-800, text-navy-800, border-navy-800 (simulated with blue-900/800)
// Emerald Green: bg-emerald-600, text-emerald-600 (simulated with emerald-600)
// Bright Blue: bg-blue-500, text-blue-500 (simulated with blue-500)

// Custom Tailwind classes for branding
const BRAND_NAVY = 'text-gray-900 dark:text-white'; // Using a neutral dark for text, but will use a custom color for accents
const BRAND_NAVY_ACCENT = 'bg-blue-900 text-white hover:bg-blue-800'; // Simulating Navy Blue
const BRAND_EMERALD = 'bg-emerald-600 text-white hover:bg-emerald-700'; // Emerald Green for CTA
const BRAND_BRIGHT_BLUE_TEXT = 'text-blue-500'; // Bright Blue for highlights

// --- DATA ---

const pricingTiers = [
  {
    name: 'CapLiquify FP&A',
    price: '£598',
    period: 'per month',
    description: 'Essential tools for foundational financial planning and analysis.',
    features: [
      { text: 'Single-user license', available: true },
      { text: 'Core FP&A modeling suite', available: true },
      { text: 'Standard data integration (CSV, Excel)', available: true },
      { text: 'Monthly reporting dashboard', available: true },
      { text: 'Basic scenario analysis', available: false },
      { text: 'Dedicated account manager', available: false },
      { text: 'M&A synergy calculator', available: false },
    ],
    cta: 'Start 14-Day Free Trial',
    ctaVariant: 'outline' as const,
    highlight: false,
  },
  {
    name: 'Professional',
    price: '£1,598',
    period: 'per month',
    description: 'Advanced capabilities for growing finance teams and complex modeling.',
    features: [
      { text: 'Up to 5 user licenses', available: true },
      { text: 'Core FP&A modeling suite', available: true },
      { text: 'Advanced data integration (API access)', available: true },
      { text: 'Real-time performance dashboard', available: true },
      { text: 'Advanced scenario analysis', available: true },
      { text: 'Dedicated account manager', available: false },
      { text: 'M&A synergy calculator', available: false },
    ],
    cta: 'Get Started',
    ctaVariant: 'default' as const,
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: '£2,997',
    period: 'per month',
    description: 'Full-suite platform for large corporations and institutional finance.',
    features: [
      { text: 'Unlimited user licenses', available: true },
      { text: 'Core FP&A modeling suite', available: true },
      { text: 'Advanced data integration (API access)', available: true },
      { text: 'Real-time performance dashboard', available: true },
      { text: 'Advanced scenario analysis', available: true },
      { text: 'Dedicated account manager', available: true },
      { text: 'M&A synergy calculator', available: false },
    ],
    cta: 'Request a Demo',
    ctaVariant: 'outline' as const,
    highlight: false,
  },
  {
    name: 'Portfolio',
    price: 'Custom',
    period: 'Contact Sales',
    description: 'Tailored solutions for private equity and multi-entity portfolio management.',
    features: [
      { text: 'Unlimited user licenses', available: true },
      { text: 'Core FP&A modeling suite', available: true },
      { text: 'Advanced data integration (API access)', available: true },
      { text: 'Real-time performance dashboard', available: true },
      { text: 'Advanced scenario analysis', available: true },
      { text: 'Dedicated account manager', available: true },
      { text: 'M&A synergy calculator', available: true },
    ],
    cta: 'Contact Sales',
    ctaVariant: 'outline' as const,
    highlight: false,
  },
];

const faqItems = [
  {
    question: 'Is there a contract or can I cancel anytime?',
    answer: 'All our monthly plans are on a rolling, month-to-month basis. You can upgrade, downgrade, or cancel your subscription at any time without penalty. Annual plans offer a discount but are billed upfront.',
  },
  {
    question: 'What is the difference between Advanced and Core data integration?',
    answer: 'Core integration supports manual data uploads via CSV and Excel. Advanced integration includes direct, secure API connections to your existing ERP, accounting, and CRM systems for real-time data synchronization.',
  },
  {
    question: 'Do you offer a free trial for Enterprise plans?',
    answer: 'We offer a 14-day free trial for our CapLiquify FP&A plan. For Enterprise and Portfolio plans, we provide a personalized, in-depth demo and a tailored Proof of Concept (POC) setup to ensure the solution meets your specific needs before commitment.',
  },
  {
    question: 'How is the "M&A synergy calculator" different from standard modeling?',
    answer: 'The M&A synergy calculator is a specialized module designed to model and track post-merger integration savings and revenue uplifts with granular detail, a critical feature for our private equity and corporate development clients.',
  },
];

// --- COMPONENTS ---

interface FeatureItemProps {
  text: string;
  available: boolean;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ text, available }) => (
  <li className="flex items-start space-x-3 text-sm">
    {available ? (
      <Check className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
    ) : (
      <X className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" aria-hidden="true" />
    )}
    <span className={available ? BRAND_NAVY : 'text-gray-500'}>{text}</span>
  </li>
);

interface PricingCardProps {
  tier: typeof pricingTiers[0];
}

const PricingCard: React.FC<PricingCardProps> = ({ tier }) => {
  const isHighlighted = tier.highlight;
  const isPortfolio = tier.name === 'Portfolio';

  return (
    <Card
      className={`
        flex flex-col justify-between h-full
        ${isHighlighted ? 'border-4 border-emerald-600 shadow-2xl scale-[1.02] transition-transform' : 'border-gray-200'}
      `}
    >
      <CardHeader>
        <CardTitle className={isHighlighted ? BRAND_EMERALD : BRAND_NAVY}>
          {tier.name}
        </CardTitle>
        <CardDescription>{tier.description}</CardDescription>
        <div className="mt-4">
          <p className="text-5xl font-extrabold text-gray-900">
            {tier.price.startsWith('£') ? (
              <>
                <span className="text-3xl font-semibold align-top mr-1">£</span>
                {tier.price.substring(1)}
              </>
            ) : (
              <span className={BRAND_BRIGHT_BLUE_TEXT}>{tier.price}</span>
            )}
          </p>
          <p className="text-base font-medium text-gray-500 mt-1">
            {tier.period}
          </p>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <ul role="list" className="space-y-4">
          {tier.features.map((feature, index) => (
            <FeatureItem key={index} {...feature} />
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          variant={isHighlighted ? 'default' : tier.ctaVariant}
          size="lg"
          className={`w-full ${isHighlighted ? BRAND_EMERALD : tier.ctaVariant === 'outline' ? 'border-2 border-blue-900 text-blue-900 hover:bg-blue-50' : BRAND_EMERALD}`}
          aria-label={`Select ${tier.name} plan`}
        >
          {tier.cta}
          {!isPortfolio && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
      </CardFooter>
    </Card>
  );
};

// --- MAIN PAGE COMPONENT ---

const Pricing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* <MarketingNav /> */}
      <main>
        {/* Header Section */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-base font-semibold tracking-wide uppercase text-emerald-600">
              Transparent Pricing
            </h1>
            <p className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Investment-Grade Financial Intelligence.
            </p>
            <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-500">
              Choose the plan that best fits your firm's scale, complexity, and strategic needs in M&A and FP&A.
            </p>
          </div>
        </section>

        {/* Pricing Table Section */}
        <section className="py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="sr-only">Pricing Plans</h2>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-4 lg:gap-10">
              {pricingTiers.map((tier) => (
                <PricingCard key={tier.name} tier={tier} />
              ))}
            </div>
            <div className="mt-12 text-center text-sm text-gray-500">
                All prices exclude VAT. Billed monthly. Annual plans available with a 15% discount.
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-gray-900 text-center sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <div className="mt-12">
              <Accordion type="single" collapsible className="space-y-6">
                {faqItems.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger>
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent>
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* Final CTA Section (Bright Blue Accent) */}
        <section className="bg-blue-900">
          <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 lg:flex lg:items-center lg:justify-between">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              <span className="block">Ready to elevate your financial strategy?</span>
              <span className="block text-emerald-400">Start your 14-day free trial today.</span>
            </h2>
            <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
              <div className="inline-flex rounded-md shadow">
                <Button
                  variant="default"
                  size="lg"
                  className="bg-emerald-400 text-blue-900 hover:bg-emerald-300"
                  aria-label="Start Free Trial Now"
                >
                  Start Free Trial
                </Button>
              </div>
              <div className="ml-3 inline-flex rounded-md shadow">
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-900"
                  aria-label="Contact Sales for Enterprise"
                >
                  Contact Sales
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      {/* <MarketingFooter /> */}
    </div>
  );
};

export default Pricing;