import { Suspense, lazy, useState, type ComponentType, type LazyExoticComponent, type ReactNode } from "react"
import { BrowserRouter, Navigate, Route, Routes, useParams } from "react-router-dom"
import { RootLayout } from "./layouts/RootLayout"
import { ProtectedLayout } from "./layouts/ProtectedLayout"
import { SignedIn, SignedOut } from "./lib/clerk"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ProtectedRoute } from "./components/auth/ProtectedRoute"
import { HelmetProvider } from "react-helmet-async"

// CACHE BUST: Force fresh Render build - 2025-11-17T16:10Z
import { ErrorBoundary } from "./components/common"
import { BrandedLoader } from "./components/common/BrandedLoader"
import { usePageAnalytics } from "./hooks/usePageAnalytics"
import { useCurrentUser } from "./hooks/useCurrentUser"
import { AnalyticsProvider } from "./components/marketing/AnalyticsProvider"
import { FeatureGate } from "./components/subscription/FeatureGate"
import { EnhancedLandingPage } from "./pages/marketing/EnhancedLandingPage"

const lazyNamed = <T extends ComponentType<any>>(
  importer: () => Promise<Record<string, unknown>>,
  exportName: string,
): LazyExoticComponent<T> =>
  lazy(async () => {
    const module = await importer()
    const component = module[exportName]

    if (!component) {
      throw new Error(`Failed to lazy load component "${exportName}"`)
    }

    return { default: component as T }
  })

const lazyDefault = (importer: () => Promise<{ default: ComponentType<any> }>) => lazy(importer)

// FinanceFlo Pages
const FinanceFloContact = lazyDefault(() => import("./pages/marketing/financeflo/ContactPage"))
const FinanceFloPricing = lazyDefault(() => import("./pages/marketing/financeflo/PricingPage"))
const FinanceFloTeam = lazyDefault(() => import("./pages/marketing/financeflo/TeamPage"))
const FinanceFloBlog = lazyDefault(() => import("./pages/marketing/financeflo/BlogPage"))
const FinanceFloBlogPost = lazyDefault(() => import("./pages/marketing/financeflo/BlogPostPage"))
const FinanceFloCaseStudies = lazyDefault(() => import("./pages/marketing/financeflo/CaseStudiesPage"))
const WorkingCapitalCalculatorPage = lazyDefault(() => import("./pages/marketing/financeflo/WorkingCapitalCalculatorPage"))
const ReadinessAssessmentPage = lazyDefault(() => import("./pages/marketing/financeflo/ReadinessAssessmentPage"))
const ROICalculatorPage = lazyDefault(() => import("./pages/marketing/financeflo/ROICalculatorPage"))
const InteractiveDemoPage = lazyDefault(() => import("./pages/marketing/financeflo/InteractiveDemoPage"))
const EnterpriseROICalculatorPage = lazyDefault(() => import("./pages/marketing/financeflo/EnterpriseROICalculatorPage"))
const EcommerceApplicationPage = lazyDefault(() => import("./pages/marketing/financeflo/ecommerce-application/EcommerceApplicationPage"))

// FinanceFlo Industries
const ConstructionIndustry = lazyDefault(() => import("./pages/marketing/financeflo/industries/ConstructionIndustry"))
const FinancialServicesIndustry = lazyDefault(() => import("./pages/marketing/financeflo/industries/FinancialServicesIndustry"))
const HealthcareIndustry = lazyDefault(() => import("./pages/marketing/financeflo/industries/HealthcareIndustry"))
const InvestmentBankingIndustry = lazyDefault(() => import("./pages/marketing/financeflo/industries/InvestmentBankingIndustry"))
const FamilyOfficeIndustry = lazyDefault(() => import("./pages/marketing/financeflo/industries/FamilyOfficeIndustry"))
const InsuranceIndustry = lazyDefault(() => import("./pages/marketing/financeflo/industries/InsuranceIndustry"))
const CapitalMarketsIndustry = lazyDefault(() => import("./pages/marketing/financeflo/industries/CapitalMarketsIndustry"))
const ProfessionalServicesIndustry = lazyDefault(() => import("./pages/marketing/financeflo/industries/ProfessionalServicesIndustry"))
const SubscriptionBusinessIndustry = lazyDefault(() => import("./pages/marketing/financeflo/industries/SubscriptionBusinessIndustry"))
const EcommerceIndustry = lazyDefault(() => import("./pages/marketing/financeflo/industries/EcommerceIndustry"))

// FinanceFlo Solutions & ERP
const SageIntacctERP = lazyDefault(() => import("./pages/marketing/financeflo/erp/SageIntacctERP"))
const AcumaticaERP = lazyDefault(() => import("./pages/marketing/financeflo/erp/AcumaticaERP"))
const OdooERP = lazyDefault(() => import("./pages/marketing/financeflo/erp/OdooERP"))
const SageX3ERP = lazyDefault(() => import("./pages/marketing/financeflo/erp/SageX3ERP"))

const SageIntacctAI = lazyDefault(() => import("./pages/marketing/financeflo/ai-enhancement/SageIntacctAI"))
const AcumaticaAI = lazyDefault(() => import("./pages/marketing/financeflo/ai-enhancement/AcumaticaAI"))
const OdooAI = lazyDefault(() => import("./pages/marketing/financeflo/ai-enhancement/OdooAI"))
const SageX3AI = lazyDefault(() => import("./pages/marketing/financeflo/ai-enhancement/SageX3AI"))

const SageIntacctImpl = lazyDefault(() => import("./pages/marketing/financeflo/implementation/SageIntacctImplementation"))
const AcumaticaImpl = lazyDefault(() => import("./pages/marketing/financeflo/implementation/AcumaticaImplementation"))
const OdooImpl = lazyDefault(() => import("./pages/marketing/financeflo/implementation/OdooImplementation"))
const SageX3Impl = lazyDefault(() => import("./pages/marketing/financeflo/implementation/SageX3Implementation"))

// FinanceFlo VSLs
const ConstructionVSL = lazyDefault(() => import("./pages/marketing/financeflo/vsl/ConstructionVSL"))
const HealthcareVSL = lazyDefault(() => import("./pages/marketing/financeflo/vsl/HealthcareVSL"))
const ManufacturingVSL = lazyDefault(() => import("./pages/marketing/financeflo/vsl/ManufacturingVSL"))
const EcommerceVSL = lazyDefault(() => import("./pages/marketing/financeflo/vsl/EcommerceVSL"))

const RouteLoader = () => <BrandedLoader />

const FinanceFloIndex = lazyDefault(() => import("./pages/marketing/financeflo/EnhancedIndex"))
const SignInPage = lazyNamed(() => import("./pages/SignInPage"), "SignInPage")
const SignUpPage = lazyNamed(() => import("./pages/SignUpPage"), "SignUpPage")
const DashboardPage = lazyNamed(() => import("./pages/DashboardPage"), "DashboardPage")
const AdminDashboard = lazyNamed(() => import("./pages/admin/AdminDashboard"), "AdminDashboard")
const UserManagement = lazyNamed(() => import("./pages/admin/UserManagement"), "UserManagement")
const OrganizationManagement = lazyNamed(() => import("./pages/admin/OrganizationManagement"), "OrganizationManagement")
const SystemHealth = lazyNamed(() => import("./pages/admin/SystemHealth"), "SystemHealth")
const DealPipeline = lazyNamed(() => import("./pages/deals/DealPipeline"), "DealPipeline")
const NewDealPage = lazyNamed(() => import("./pages/deals/NewDealPage"), "NewDealPage")
const DealDetails = lazyNamed(() => import("./pages/deals/DealDetails"), "DealDetails")
const DealWorkspaceDirectory = lazyNamed(() => import("./pages/deals/DealWorkspaceDirectory"), "DealWorkspaceDirectory")
const DataRoom = lazyNamed(() => import("./pages/deals/DataRoom"), "DataRoom")
const ValuationSuite = lazyNamed(() => import("./pages/deals/valuation/ValuationSuite"), "ValuationSuite")
const FinancialDashboard = lazyDefault(() => import("./pages/deals/FinancialDashboard"))
const BillingDashboard = lazyNamed(() => import("./pages/dashboard/BillingDashboard"), "BillingDashboard")
const CheckoutSuccess = lazyNamed(() => import("./pages/checkout/CheckoutSuccess"), "CheckoutSuccess")
const CheckoutCancel = lazyNamed(() => import("./pages/checkout/CheckoutCancel"), "CheckoutCancel")
const PricingPage = lazyNamed(() => import("./pages/marketing/PricingPage"), "PricingPage")
const FeaturesPage = lazyNamed(() => import("./pages/marketing/FeaturesPage"), "FeaturesPage")
const AboutPage = lazyNamed(() => import("./pages/marketing/AboutPage"), "AboutPage")
const ContactPage = lazyNamed(() => import("./pages/marketing/ContactPage"), "ContactPage")
const TeamPage = lazyNamed(() => import("./pages/marketing/TeamPage"), "TeamPage")
const PodcastPage = lazyNamed(() => import("./pages/marketing/PodcastPage"), "PodcastPage")
const SecurityPage = lazyNamed(() => import("./pages/marketing/SecurityPage"), "SecurityPage")
const BlogListingPage = lazyNamed(() => import("./pages/marketing/BlogListingPage"), "BlogListingPage")
const BlogPostPage = lazyNamed(() => import("./pages/marketing/BlogPostPage"), "BlogPostPage")
const FAQPage = lazyNamed(() => import("./pages/marketing/FAQPage"), "FAQPage");
const CapLiquifyFPAPage = lazyNamed(() => import("./pages/marketing/CapLiquifyFPAPage"), "CapLiquifyFPAPage");
const FourStageCyclePage = lazyNamed(() => import("./pages/marketing/FourStageCyclePage"), "FourStageCyclePage");
const SalesPromotionPricingPage = lazyNamed(() => import("./pages/marketing/SalesPromotionPricingPage"), "SalesPromotionPricingPage");
const PlatformPricingPage = lazyDefault(() => import("./pages/marketing/pricing/PlatformPricingPage"));
const CommunityPricingPage = lazyDefault(() => import("./pages/marketing/pricing/CommunityPricingPage"));
const ServicesPricingPage = lazyDefault(() => import("./pages/marketing/pricing/ServicesPricingPage"));
const CaseStudiesPage = lazyNamed(() => import("./pages/marketing/CaseStudiesPage"), "CaseStudiesPage");
const BookTrial = lazyNamed(() => import("./pages/marketing/BookTrial"), "BookTrial");
const BlogAdminEditor = lazyDefault(() => import("./pages/admin/BlogAdminEditor"));
const CalculatorPage = lazyNamed(() => import("./pages/marketing/CalculatorPage"), "CalculatorPage");
const TermsOfService = lazyNamed(() => import("./pages/marketing/legal/TermsOfService"), "TermsOfService")
const PrivacyPolicy = lazyNamed(() => import("./pages/marketing/legal/PrivacyPolicy"), "PrivacyPolicy")
const CookiePolicy = lazyNamed(() => import("./pages/marketing/legal/CookiePolicy"), "CookiePolicy")
const DealRoomAlternative = lazyNamed(() => import("./pages/marketing/compare/DealRoomAlternative"), "DealRoomAlternative")
const MidaxoAlternative = lazyNamed(() => import("./pages/marketing/compare/MidaxoAlternative"), "MidaxoAlternative")
const SolutionCFO = lazyNamed(() => import("./pages/marketing/solutions/SolutionCFO"), "SolutionCFO")
const SolutionDealTeam = lazyNamed(() => import("./pages/marketing/solutions/SolutionDealTeam"), "SolutionDealTeam")
const DocumentEditor = lazyNamed(() => import("./pages/documents/DocumentEditor"), "DocumentEditor")
const DocumentRoomPage = lazyNamed(() => import("./pages/deals/DocumentRoomPage"), "DocumentRoomPage")
const FeatureNotAvailable = lazyNamed(() => import("./pages/FeatureNotAvailable"), "FeatureNotAvailable")
const MasterAdminDashboard = lazyNamed(() => import("./pages/master-admin/MasterAdminDashboard"), "MasterAdminDashboard")
// Lazy load heavy components for better code splitting
const PodcastStudio = lazyNamed(() => import("./pages/podcast/PodcastStudio"), "PodcastStudio")
const EventDashboard = lazyNamed(() => import("./pages/events/EventDashboard"), "EventDashboard")
const EventCreator = lazyNamed(() => import("./pages/events/EventCreator"), "EventCreator")
const EventDetails = lazyNamed(() => import("./pages/events/EventDetails"), "EventDetails")
const CommunityFeed = lazyNamed(() => import("./pages/community/CommunityFeed"), "CommunityFeed")
const ActivityTracker = lazyNamed(() => import("./pages/master-admin/ActivityTracker"), "ActivityTracker")
const ProspectPipeline = lazyNamed(() => import("./pages/master-admin/ProspectPipeline"), "ProspectPipeline")
const CampaignManager = lazyNamed(() => import("./pages/master-admin/CampaignManager"), "CampaignManager")
const VoiceCampaign = lazyNamed(() => import("./pages/master-admin/VoiceCampaign"), "VoiceCampaign")
const TemplateManager = lazyNamed(() => import("./pages/master-admin/TemplateManager"), "TemplateManager")
const ContentStudio = lazyNamed(() => import("./pages/master-admin/ContentStudio"), "ContentStudio")
const LeadCapture = lazyNamed(() => import("./pages/master-admin/LeadCapture"), "LeadCapture")
const SalesCollateral = lazyNamed(() => import("./pages/master-admin/SalesCollateral"), "SalesCollateral")
const CustomerPortalDashboard = lazyNamed(() => import("./pages/customer-portal/CustomerPortalDashboard"), "CustomerPortalDashboard")
const CustomerAccount = lazyNamed(() => import("./pages/customer-portal/CustomerAccount"), "CustomerAccount")
const CustomerInvoices = lazyNamed(() => import("./pages/customer-portal/CustomerInvoices"), "CustomerInvoices")
const CustomerSettings = lazyNamed(() => import("./pages/customer-portal/CustomerSettings"), "CustomerSettings")
const TaskBoard = lazyDefault(() => import("./pages/tasks/TaskBoard"))
const MatchingWorkspace = lazyDefault(() => import("./pages/deals/MatchingWorkspace"))
const DocumentWorkspace = lazyDefault(() => import("./pages/documents/DocumentWorkspace"))
// FP&A Module Pages
const ExecutiveDashboard = lazyNamed(() => import("./modules/fpa/pages/ExecutiveDashboard"), "ExecutiveDashboard")
const DemandForecasting = lazyNamed(() => import("./modules/fpa/pages/DemandForecasting"), "DemandForecasting")
const InventoryManagement = lazyNamed(() => import("./modules/fpa/pages/InventoryManagement"), "InventoryManagement")
const ProductionTracking = lazyNamed(() => import("./modules/fpa/pages/ProductionTracking"), "ProductionTracking")
const QualityControl = lazyNamed(() => import("./modules/fpa/pages/QualityControl"), "QualityControl")
const WorkingCapital = lazyNamed(() => import("./modules/fpa/pages/WorkingCapital"), "WorkingCapital")
const WhatIfAnalysis = lazyNamed(() => import("./modules/fpa/pages/WhatIfAnalysis"), "WhatIfAnalysis")
const FinancialReports = lazyNamed(() => import("./modules/fpa/pages/FinancialReports"), "FinancialReports")
const DataImport = lazyNamed(() => import("./modules/fpa/pages/DataImport"), "DataImport")
const AdminPanel = lazyNamed(() => import("./modules/fpa/pages/AdminPanel"), "AdminPanel")
// PMI Module Components
const PMIProjectList = lazyNamed(() => import("./modules/pmi/pages/PMIProjectList"), "PMIProjectList")
const PMIProjectDetail = lazyNamed(() => import("./modules/pmi/pages/PMIProjectDetail"), "PMIProjectDetail")
const PMIProjectCreate = lazyNamed(() => import("./modules/pmi/pages/PMIProjectCreate"), "PMIProjectCreate")

// Feature flag check for Master Admin Portal (enabled by default unless explicitly disabled)
const isMasterAdminEnabled = import.meta.env.VITE_ENABLE_MASTER_ADMIN !== 'false'
const enableTestRoutes = import.meta.env.VITE_ENABLE_TEST_ROUTES === 'true'

// Master Admin route wrapper - shows "Not Available" if feature disabled
const MasterAdminRoute = ({ children }: { children: React.ReactElement }) => {
  const { user, loading } = useCurrentUser()

  if (!isMasterAdminEnabled) {
    return (
      <FeatureNotAvailable
        featureName="Master Admin Portal"
        message="The Master Admin Portal is currently not available. This feature is being deployed in a future update."
      />
    )
  }

  if (loading) {
    return <RouteLoader />
  }

  if (!user) {
    return <Navigate to="/dashboard" replace />
  }

  if (user.role !== 'master_admin') {
    return (
      <FeatureNotAvailable
        featureName="Master Admin Portal"
        message="You need master admin permissions to access these tools. Please contact ApexDeliver support to upgrade your account."
      />
    )
  }

  return children
}


const FinancialDashboardRoute = () => {
  const { dealId } = useParams<{ dealId: string }>();
  if (!dealId) return <Navigate to="/deals" replace />;
  return <FinancialDashboard dealId={dealId} />;
}

const DocumentEditorRoute = () => {
  const { dealId, documentId } = useParams<{ dealId: string; documentId: string }>()

  if (!dealId || !documentId) {
    return <Navigate to="/deals" replace />
  }

  return <DocumentEditor documentId={documentId} dealId={dealId} />
}

export const AppRoutes = () => {
  usePageAnalytics()

  const getHostSuggestedBrand = (): "financeflo" | undefined => {
    if (typeof window === "undefined") {
      return undefined
    }
    const host = window.location.hostname.toLowerCase()
    return host.includes("financeflo") || host.includes("flo-finance") || host.includes("lovable.app")
      ? "financeflo"
      : undefined
  }

  const getQueryBrand = (): "financeflo" | "apexdeliver" | undefined => {
    if (typeof window === "undefined") {
      return undefined
    }
    const brandParam = new URLSearchParams(window.location.search).get("brand")?.toLowerCase()
    return brandParam === "financeflo" || brandParam === "apexdeliver" ? brandParam : undefined
  }

  const normalizedEnvBrand = (import.meta.env.VITE_MARKETING_BRAND ?? "")
    .toString()
    .trim()
    .toLowerCase()
  const allowedBrands: ReadonlySet<"apexdeliver" | "financeflo"> = new Set(["apexdeliver", "financeflo"])
  const envBrand = allowedBrands.has(normalizedEnvBrand as "apexdeliver" | "financeflo")
    ? (normalizedEnvBrand as "apexdeliver" | "financeflo")
    : undefined
  const queryBrand = getQueryBrand()
  const hostBrand = getHostSuggestedBrand()

  const marketingBrand = queryBrand ?? hostBrand ?? envBrand ?? "apexdeliver"
  const useFinanceFloMarketing = marketingBrand === "financeflo"

  const withRouteLoader = (node: ReactNode) => <Suspense fallback={<RouteLoader />}>{node}</Suspense>
  const marketingElement = (apexElement: ReactNode, financeFloElement: ReactNode) =>
    useFinanceFloMarketing ? financeFloElement : apexElement

  if (typeof window !== "undefined") {
    ;(window as typeof window & { __MARKETING_BRAND_ACTIVE__?: string }).__MARKETING_BRAND_ACTIVE__ =
      useFinanceFloMarketing ? "financeflo" : "apexdeliver"
  }

  return (
    <Routes>
      {/* Marketing Routes (No RootLayout - uses MarketingLayout) */}
      <Route
        index
        element={marketingElement(
          <EnhancedLandingPage />,
          withRouteLoader(<FinanceFloIndex />),
        )}
      />
      <Route
        path="pricing"
        element={marketingElement(<PricingPage />, withRouteLoader(<FinanceFloPricing />))}
      />
      <Route
        path="pricing/platform"
        element={<Suspense fallback={<RouteLoader />}><PlatformPricingPage /></Suspense>}
      />
      <Route
        path="pricing/community"
        element={<Suspense fallback={<RouteLoader />}><CommunityPricingPage /></Suspense>}
      />
      <Route
        path="pricing/services"
        element={<Suspense fallback={<RouteLoader />}><ServicesPricingPage /></Suspense>}
      />
      <Route
        path="contact"
        element={marketingElement(<ContactPage />, withRouteLoader(<FinanceFloContact />))}
      />
      <Route
        path="team"
        element={marketingElement(<TeamPage />, withRouteLoader(<FinanceFloTeam />))}
      />
      <Route
        path="blog"
        element={marketingElement(<BlogListingPage />, withRouteLoader(<FinanceFloBlog />))}
      />
      <Route
        path="blog/:slug"
        element={marketingElement(<BlogPostPage />, withRouteLoader(<FinanceFloBlogPost />))}
      />
      <Route path="case-studies" element={<Suspense fallback={<RouteLoader />}><FinanceFloCaseStudies /></Suspense>} />
      <Route path="calculator" element={<Suspense fallback={<RouteLoader />}><WorkingCapitalCalculatorPage /></Suspense>} />
      <Route path="assessment" element={<Suspense fallback={<RouteLoader />}><ReadinessAssessmentPage /></Suspense>} />
      <Route path="resources/roi-calculator" element={<Suspense fallback={<RouteLoader />}><ROICalculatorPage /></Suspense>} />
      <Route path="demo" element={<Suspense fallback={<RouteLoader />}><InteractiveDemoPage /></Suspense>} />
      <Route path="enterprise-roi" element={<Suspense fallback={<RouteLoader />}><EnterpriseROICalculatorPage /></Suspense>} />
      <Route path="ecommerce-application" element={<Suspense fallback={<RouteLoader />}><EcommerceApplicationPage /></Suspense>} />

      {/* FinanceFlo preview routes */}
      <Route path="financeflo" element={withRouteLoader(<FinanceFloIndex />)} />
      <Route path="financeflo/pricing" element={withRouteLoader(<FinanceFloPricing />)} />
      <Route path="financeflo/contact" element={withRouteLoader(<FinanceFloContact />)} />
      <Route path="financeflo/team" element={withRouteLoader(<FinanceFloTeam />)} />
      <Route path="financeflo/blog" element={withRouteLoader(<FinanceFloBlog />)} />
      <Route path="financeflo/blog/:slug" element={withRouteLoader(<FinanceFloBlogPost />)} />
      <Route path="financeflo/case-studies" element={withRouteLoader(<FinanceFloCaseStudies />)} />

      {/* Industries */}
      <Route path="industries/construction" element={<Suspense fallback={<RouteLoader />}><ConstructionIndustry /></Suspense>} />
      <Route path="industries/financial-services" element={<Suspense fallback={<RouteLoader />}><FinancialServicesIndustry /></Suspense>} />
      <Route path="industries/healthcare" element={<Suspense fallback={<RouteLoader />}><HealthcareIndustry /></Suspense>} />
      <Route path="industries/investment-banking" element={<Suspense fallback={<RouteLoader />}><InvestmentBankingIndustry /></Suspense>} />
      <Route path="industries/family-office" element={<Suspense fallback={<RouteLoader />}><FamilyOfficeIndustry /></Suspense>} />
      <Route path="industries/insurance" element={<Suspense fallback={<RouteLoader />}><InsuranceIndustry /></Suspense>} />
      <Route path="industries/capital-markets" element={<Suspense fallback={<RouteLoader />}><CapitalMarketsIndustry /></Suspense>} />
      <Route path="industries/professional-services" element={<Suspense fallback={<RouteLoader />}><ProfessionalServicesIndustry /></Suspense>} />
      <Route path="industries/subscription-business" element={<Suspense fallback={<RouteLoader />}><SubscriptionBusinessIndustry /></Suspense>} />
      <Route path="industries/ecommerce" element={<Suspense fallback={<RouteLoader />}><EcommerceIndustry /></Suspense>} />

      {/* ERP & Solutions */}
      <Route path="erp/sage-intacct" element={<Suspense fallback={<RouteLoader />}><SageIntacctERP /></Suspense>} />
      <Route path="erp/acumatica" element={<Suspense fallback={<RouteLoader />}><AcumaticaERP /></Suspense>} />
      <Route path="erp/odoo" element={<Suspense fallback={<RouteLoader />}><OdooERP /></Suspense>} />
      <Route path="erp/sage-x3" element={<Suspense fallback={<RouteLoader />}><SageX3ERP /></Suspense>} />

      <Route path="ai-enhancement/sage-intacct" element={<Suspense fallback={<RouteLoader />}><SageIntacctAI /></Suspense>} />
      <Route path="ai-enhancement/acumatica" element={<Suspense fallback={<RouteLoader />}><AcumaticaAI /></Suspense>} />
      <Route path="ai-enhancement/odoo" element={<Suspense fallback={<RouteLoader />}><OdooAI /></Suspense>} />
      <Route path="ai-enhancement/sage-x3" element={<Suspense fallback={<RouteLoader />}><SageX3AI /></Suspense>} />

      <Route path="implementation/sage-intacct" element={<Suspense fallback={<RouteLoader />}><SageIntacctImpl /></Suspense>} />
      <Route path="implementation/acumatica" element={<Suspense fallback={<RouteLoader />}><AcumaticaImpl /></Suspense>} />
      <Route path="implementation/odoo" element={<Suspense fallback={<RouteLoader />}><OdooImpl /></Suspense>} />
      <Route path="implementation/sage-x3" element={<Suspense fallback={<RouteLoader />}><SageX3Impl /></Suspense>} />

      {/* VSLs */}
      <Route path="vsl/construction/*" element={<Suspense fallback={<RouteLoader />}><ConstructionVSL /></Suspense>} />
      <Route path="vsl/healthcare/*" element={<Suspense fallback={<RouteLoader />}><HealthcareVSL /></Suspense>} />
      <Route path="vsl/manufacturing/*" element={<Suspense fallback={<RouteLoader />}><ManufacturingVSL /></Suspense>} />
      <Route path="vsl/ecommerce/*" element={<Suspense fallback={<RouteLoader />}><EcommerceVSL /></Suspense>} />

      {/* Legacy/SaaS Routes */}
      <Route path="features" element={<FeaturesPage />} />
      <Route path="about" element={<AboutPage />} />
      {/* <Route path="contact" element={<ContactPage />} /> */}
      {/* <Route path="team" element={<TeamPage />} /> */}
      <Route path="podcast" element={<PodcastPage />} />
      <Route path="security" element={<SecurityPage />} />
      {/* <Route path="blog" element={<BlogListingPage />} /> */}
      {/* <Route path="blog/:slug" element={<BlogPostPage />} /> */}
      <Route path="faq" element={<FAQPage />} />
      <Route path="capliquify-fpa" element={<CapLiquifyFPAPage />} />
      <Route path="4-stage-cycle" element={<FourStageCyclePage />} />
      <Route path="sales-promotion-pricing" element={<SalesPromotionPricingPage />} />
      <Route path="case-studies" element={<CaseStudiesPage />} />
      <Route path="book-trial" element={<BookTrial />} />
      <Route path="calculator" element={<CalculatorPage />} />
      <Route path="legal/terms" element={<TermsOfService />} />
      <Route path="legal/privacy" element={<PrivacyPolicy />} />
      <Route path="legal/cookies" element={<CookiePolicy />} />
      <Route path="compare/dealroom-alternative" element={<DealRoomAlternative />} />
      <Route path="compare/midaxo-alternative" element={<MidaxoAlternative />} />
      <Route path="solutions/cfo" element={<SolutionCFO />} />
      <Route path="solutions/deal-team" element={<SolutionDealTeam />} />

      {enableTestRoutes && (
        <>
          {/* <Route path="__tests__/admin/blog/new" element={<TestBlogAdminPage />} /> */}
          {/* <Route path="__tests__/admin/blog/:id/edit" element={<TestBlogAdminPage />} /> */}
        </>
      )}

      {/* Authentication Routes (uses RootLayout - sign-in/sign-up only) */}
      <Route element={<RootLayout />}>
        <Route path="sign-in/*" element={<SignInPage />} />
        <Route path="sign-up/*" element={<SignUpPage />} />
      </Route>

      {/* Protected Routes (ProtectedLayout + enterprise sidebar) */}
      <Route element={<ProtectedLayout />}>
        <Route path="dashboard" element={<DashboardPage />} />

        {/* Admin Routes */}
        <Route path="admin" element={<AdminDashboard />} />
        <Route path="admin/users" element={<UserManagement />} />
        <Route path="admin/organizations" element={<OrganizationManagement />} />
        <Route path="admin/system" element={<SystemHealth />} />
        <Route
          path="admin/blog/new"
          element={(
            <ProtectedRoute requiredRole={['admin', 'master_admin']}>
              <Suspense fallback={<RouteLoader />}>
                <BlogAdminEditor />
              </Suspense>
            </ProtectedRoute>
          )}
        />
        <Route
          path="admin/blog/:id/edit"
          element={(
            <ProtectedRoute requiredRole={['admin', 'master_admin']}>
              <Suspense fallback={<RouteLoader />}>
                <BlogAdminEditor />
              </Suspense>
            </ProtectedRoute>
          )}
        />

        {/* Master Admin Portal Routes (Feature-Flagged) */}
        <Route path="master-admin" element={<MasterAdminRoute><MasterAdminDashboard /></MasterAdminRoute>} />
        <Route path="master-admin/activity" element={<MasterAdminRoute><ActivityTracker /></MasterAdminRoute>} />
        <Route path="master-admin/prospects" element={<MasterAdminRoute><ProspectPipeline /></MasterAdminRoute>} />
        <Route path="master-admin/campaigns" element={<MasterAdminRoute><CampaignManager /></MasterAdminRoute>} />
        <Route path="master-admin/voice" element={<MasterAdminRoute><VoiceCampaign /></MasterAdminRoute>} />
        <Route path="master-admin/templates" element={<MasterAdminRoute><TemplateManager /></MasterAdminRoute>} />
        <Route path="master-admin/content" element={<MasterAdminRoute><ContentStudio /></MasterAdminRoute>} />
        <Route path="master-admin/leads" element={<MasterAdminRoute><LeadCapture /></MasterAdminRoute>} />
        <Route path="master-admin/collateral" element={<MasterAdminRoute><SalesCollateral /></MasterAdminRoute>} />

        {/* Deal Routes */}
        <Route path="deals" element={<DealPipeline />} />
        <Route path="deals/new" element={<NewDealPage />} />
        <Route path="deals/matching" element={<Suspense fallback={<RouteLoader />}><MatchingWorkspace /></Suspense>} />
        <Route path="deals/workspaces" element={<DealWorkspaceDirectory />} />
        <Route path="deals/workspaces/:workspaceId" element={<DealWorkspaceDirectory />} />
        <Route path="deals/:dealId" element={<DealDetails />} />
        <Route path="deals/:dealId/data-room" element={<DataRoom />} />
        <Route path="deals/:dealId/documents" element={<DocumentRoomPage />} />
        <Route path="deals/:dealId/documents/:documentId/editor" element={<DocumentEditorRoute />} />
        <Route path="deals/:dealId/valuation" element={<ValuationSuite />} />
        <Route path="deals/:dealId/financial" element={<FinancialDashboardRoute />} />

        {/* Task Management Routes */}
        <Route path="tasks" element={<Suspense fallback={<RouteLoader />}><TaskBoard /></Suspense>} />

        {/* Documents Workspace Routes */}
        <Route path="documents" element={<Suspense fallback={<RouteLoader />}><DocumentWorkspace /></Suspense>} />

        {/* Podcast Routes */}
        <Route path="podcast-studio" element={<Suspense fallback={<RouteLoader />}><PodcastStudio /></Suspense>} />

        {/* Event Routes */}
        <Route path="events" element={<Suspense fallback={<RouteLoader />}><EventDashboard /></Suspense>} />
        <Route path="events/new" element={<Suspense fallback={<RouteLoader />}><EventCreator /></Suspense>} />
        <Route path="events/:eventId" element={<Suspense fallback={<RouteLoader />}><EventDetails /></Suspense>} />

        {/* Community Routes */}
        <Route path="community" element={<Suspense fallback={<RouteLoader />}><CommunityFeed /></Suspense>} />

        {/* Billing & Subscription Routes */}
        <Route path="dashboard/billing" element={<BillingDashboard />} />

        {/* PMI Module Routes (Feature-Gated) */}
        <Route
          path="pmi/projects"
          element={
            <FeatureGate feature="pmi_module" requiredTier="professional">
              <PMIProjectList />
            </FeatureGate>
          }
        />
        <Route
          path="pmi/projects/new"
          element={
            <FeatureGate feature="pmi_module" requiredTier="professional">
              <PMIProjectCreate />
            </FeatureGate>
          }
        />
        <Route
          path="pmi/projects/:projectId"
          element={
            <FeatureGate feature="pmi_module" requiredTier="professional">
              <PMIProjectDetail />
            </FeatureGate>
          }
        />

        {/* FP&A Module Routes (Feature-Gated) */}
        <Route
          path="fpa"
          element={
            <FeatureGate feature="fpa_module" requiredTier="professional">
              <ExecutiveDashboard />
            </FeatureGate>
          }
        />
        <Route
          path="fpa/demand-forecasting"
          element={
            <FeatureGate feature="fpa_module" requiredTier="professional">
              <DemandForecasting />
            </FeatureGate>
          }
        />
        <Route
          path="fpa/inventory"
          element={
            <FeatureGate feature="fpa_module" requiredTier="professional">
              <InventoryManagement />
            </FeatureGate>
          }
        />
        <Route
          path="fpa/production"
          element={
            <FeatureGate feature="fpa_module" requiredTier="professional">
              <ProductionTracking />
            </FeatureGate>
          }
        />
        <Route
          path="fpa/quality"
          element={
            <FeatureGate feature="fpa_module" requiredTier="professional">
              <QualityControl />
            </FeatureGate>
          }
        />
        <Route
          path="fpa/working-capital"
          element={
            <FeatureGate feature="fpa_module" requiredTier="professional">
              <WorkingCapital />
            </FeatureGate>
          }
        />
        <Route
          path="fpa/what-if"
          element={
            <FeatureGate feature="fpa_module" requiredTier="professional">
              <WhatIfAnalysis />
            </FeatureGate>
          }
        />
        <Route
          path="fpa/reports"
          element={
            <FeatureGate feature="fpa_module" requiredTier="professional">
              <FinancialReports />
            </FeatureGate>
          }
        />
        <Route
          path="fpa/import"
          element={
            <FeatureGate feature="fpa_module" requiredTier="professional">
              <DataImport />
            </FeatureGate>
          }
        />
        <Route
          path="fpa/admin"
          element={
            <FeatureGate feature="fpa_module" requiredTier="professional">
              <AdminPanel />
            </FeatureGate>
          }
        />

        {/* Customer Portal Routes */}
        <Route path="customer-portal" element={<CustomerPortalDashboard />} />
        <Route path="customer-portal/account" element={<CustomerAccount />} />
        <Route path="customer-portal/invoices" element={<CustomerInvoices />} />
        <Route path="customer-portal/settings" element={<CustomerSettings />} />

        {/* Checkout Routes */}
        <Route path="checkout/success" element={<CheckoutSuccess />} />
        <Route path="checkout/cancel" element={<CheckoutCancel />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

const App = () => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Cache data for 5 minutes by default
            staleTime: 5 * 60 * 1000,
            // Keep unused data in cache for 10 minutes
            gcTime: 10 * 60 * 1000, // Previously cacheTime
            // Retry failed requests once
            retry: 1,
            // Don't refetch on window focus for better performance
            refetchOnWindowFocus: false,
            // Refetch on reconnect
            refetchOnReconnect: true,
          },
          mutations: {
            // Retry failed mutations once
            retry: 1,
          },
        },
      })
  )
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <AnalyticsProvider>
            <BrowserRouter>
              <ErrorBoundary>
                <Suspense fallback={<RouteLoader />}>
                  <AppRoutes />
                </Suspense>
              </ErrorBoundary>
            </BrowserRouter>
          </AnalyticsProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </HelmetProvider>
  )
}

export default App
// Render cache bust - fresh build without lucide-vendor chunk - 20251117154200

