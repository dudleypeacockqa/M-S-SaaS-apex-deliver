export const industryLinks = [
  { name: "Construction", path: "/industries/construction" },
  { name: "Financial Services", path: "/industries/financial-services" },
  { name: "Healthcare", path: "/industries/healthcare" },
  { name: "Investment Banking", path: "/industries/investment-banking" },
  { name: "Family Office", path: "/industries/family-office" },
  { name: "Insurance", path: "/industries/insurance" },
  { name: "Capital Markets", path: "/industries/capital-markets" },
  { name: "Professional Services", path: "/industries/professional-services" },
  { name: "Subscription Business", path: "/industries/subscription-business" },
  { name: "Ecommerce", path: "/industries/ecommerce" },
];

// ERP Implementation Services (New main menu item)
export const implementationLinks = [
  { name: "Sage Intacct", path: "/implementation/sage-intacct", description: "Certified implementation partner for cloud financial management" },
  { name: "Acumatica", path: "/implementation/acumatica", description: "Expert cloud ERP implementations with unlimited scalability" },
  { name: "Odoo", path: "/implementation/odoo", description: "Open-source ERP solutions with unlimited customization" },
  { name: "Sage X3", path: "/implementation/sage-x3", description: "Enterprise-grade manufacturing and distribution ERP implementation" },
];

// ERP Systems (Core ERP pages with VSL videos)
export const erpLinks = [
  { name: "Sage Intacct", path: "/erp/sage-intacct", description: "Cloud financial management for growing businesses" },
  { name: "Acumatica", path: "/erp/acumatica", description: "Unlimited cloud ERP with true scalability" },
  { name: "Odoo", path: "/erp/odoo", description: "Open-source ERP with complete customization" },
  { name: "Sage X3", path: "/erp/sage-x3", description: "Enterprise manufacturing and distribution ERP" },
];

// AI Enhancement Services (New section)
export const aiEnhancementLinks = [
  { name: "Sage Intacct AI", path: "/ai-enhancement/sage-intacct", description: "AI-powered enhancements for existing Sage Intacct systems" },
  { name: "Acumatica AI", path: "/ai-enhancement/acumatica", description: "Intelligent automation for your Acumatica cloud ERP" },
  { name: "Odoo AI", path: "/ai-enhancement/odoo", description: "Advanced AI capabilities for your Odoo implementation" },
  { name: "Sage X3 AI", path: "/ai-enhancement/sage-x3", description: "Enterprise AI for manufacturing and distribution" },
];

// iPaaS & Integration Services (New section)
export const ipaasLinks = [
  { name: "IntelliFlow Platform", path: "/ipaas/intelliflow", description: "The world's most intelligent iPaaS platform with Agentic AI" },
  { name: "AI Integration Strategy", path: "/ipaas/strategy", description: "Comprehensive AI-powered integration planning and architecture" },
  { name: "Intelligent Connectors", path: "/ipaas/connectors", description: "AI-enhanced integration solutions for unique requirements" },
  { name: "AI-Powered API Management", path: "/ipaas/api-management", description: "Cognitive API strategy and management services" },
];

export const maSolutionsLinks = [
  { name: "CapLiquify FP&A", path: "/capliquify-fpa", description: "13-week cash forecasting and working capital automation" },
  { name: "ApexDeliver M&A Suite", path: "/features", description: "Deal management, valuations, and PMI execution" },
  { name: "Post-Merger Integration", path: "/4-stage-cycle", description: "Finance ops stabilisation for Day 100 success" },
  { name: "Customer Portal Suite", path: "/solutions/cfo", description: "White-label ERP portals for acquisition targets" },
  { name: "Sales & Pricing Accelerator", path: "/sales-promotion-pricing", description: "Dynamic pricing, promotions, and GTM tooling" },
];

export const resourceLinks = [
  { name: "Working Capital Calculator", path: "/calculator", description: "Analyze cash flow and unlock working capital potential" },
  { name: "Readiness Assessment", path: "/assessment", description: "Evaluate your business readiness for AI-powered ERP transformation" },
  { name: "ROI Calculator", path: "/resources/roi-calculator", description: "Calculate your potential ROI with AI-powered ERP automation" },
  { name: "Team", path: "/team", description: "Meet our expert team of ERP and AI specialists" },
  { name: "Blog", path: "/blog", description: "Latest insights on ERP automation and AI integration" },
  { name: "Case Studies", path: "/case-studies", description: "Real-world success stories of AI-powered ERP transformations" },
];

export const vslLinks = [
  { name: "Construction & Real Estate", path: "/vsl/construction/opt-in" },
  { name: "Healthcare", path: "/vsl/healthcare/opt-in" },
  { name: "Finance Services", path: "/vsl/financial-services/opt-in" },
  { name: "Private Equity", path: "/vsl/private-equity/opt-in" },
  { name: "e-commerce", path: "/vsl/ecommerce/opt-in" },
  { name: "Manufacturing", path: "/vsl/manufacturing/opt-in" },
  { name: "Professional Services", path: "/vsl/professional-services/opt-in" },
];

// Get Started Links (New main menu item)
export const getStartedLinks = [
  { name: "Apply for Transformation", path: "/ecommerce-application", description: "Apply for our exclusive AI-powered ERP transformation program" },
  { name: "Free Assessment", path: "/assessment", description: "Evaluate your business readiness for AI-powered ERP transformation" },
  { name: "ROI Calculator", path: "/resources/roi-calculator", description: "Calculate your potential ROI with AI automation" },
  { name: "Schedule Demo", path: "/demo", description: "See our AI-powered ERP solutions in action" },
  { name: "Contact Us", path: "/contact", description: "Speak with our ERP transformation experts" },
];

// LeverageFlo.ai Marketing Automation (New main menu item)
export const leverageFloLinks = [
  { name: "Cold Outbound System", path: "/leverageflo/cold-outbound", description: "Enterprise-level cold outbound nurturing with Voice AI - 800+ qualified prospects monthly" },
  { name: "Lead Generation Automation", path: "/leverageflo/lead-generation", description: "Complete marketing automation ecosystem with AI-powered optimization" },
  { name: "Reviews & Referral System", path: "/leverageflo/reviews-referrals", description: "Automated reputation management and systematic referral generation" },
  { name: "ERP Integration", path: "/leverageflo/erp-integration", description: "Seamless integration with ERP systems and unified prospect data" },
  { name: "Standalone Implementation", path: "/leverageflo/standalone", description: "Complete white-label marketing solution for any industry" },
  { name: "System Demo", path: "/leverageflo/demo", description: "Interactive demonstration of LeverageFlo.ai capabilities" },
  { name: "Apply Now", path: "/leverageflo/application", description: "Apply for LeverageFlo cold outbound automation system" },
];

// Solutions Menu - Combined top-level menu
export const solutionsLinks = [
  {
    name: "M&A & Finance Solutions",
    path: "/features",
    description: "CapLiquify FP&A + ApexDeliver deal execution",
    subLinks: maSolutionsLinks
  },
  {
    name: "ERP Solutions",
    path: "/erp/sage-intacct",
    description: "Cloud financial management and ERP systems",
    subLinks: erpLinks
  },
  {
    name: "AI Enhancement",
    path: "/ai-enhancement/sage-intacct",
    description: "AI-powered enhancements for existing ERP systems",
    subLinks: aiEnhancementLinks
  },
  {
    name: "Implementation",
    path: "/implementation/sage-intacct",
    description: "Expert ERP implementation services",
    subLinks: implementationLinks
  },
  {
    name: "iPaaS & Integration",
    path: "/ipaas/intelliflow",
    description: "Intelligent integration platform services",
    subLinks: ipaasLinks
  },
  {
    name: "LeverageFlo.ai",
    path: "/leverageflo/cold-outbound",
    description: "AI-powered marketing automation",
    subLinks: leverageFloLinks
  },
];

