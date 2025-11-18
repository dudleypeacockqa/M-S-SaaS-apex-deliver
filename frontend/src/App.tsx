import { Suspense, lazy, useState, type ComponentType, type LazyExoticComponent } from "react"
import { BrowserRouter, Navigate, Route, Routes, useParams } from "react-router-dom"
import { RootLayout } from "./layouts/RootLayout"
import { ProtectedLayout } from "./layouts/ProtectedLayout"
import { SignedIn, SignedOut } from "@clerk/clerk-react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

// CACHE BUST: Force fresh Render build - 2025-11-17T16:10Z
import { ErrorBoundary } from "./components/common"
import { LoadingSpinner } from "./components/common/LoadingSpinner"
import { usePageAnalytics } from "./hooks/usePageAnalytics"
import { AnalyticsProvider } from "./components/marketing/AnalyticsProvider"
import { FeatureGate } from "./components/subscription/FeatureGate"

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

const RouteLoader = () => (
  <div
    className="flex min-h-[40vh] flex-col items-center justify-center gap-3 bg-gradient-to-br from-slate-50 via-white to-indigo-50"
    role="status"
    aria-live="polite"
  >
    <LoadingSpinner size="lg" />
    <span className="text-base font-medium text-slate-600">Preparing the ApexDeliver experience…</span>
  </div>
)

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
const DataRoom = lazyNamed(() => import("./pages/deals/DataRoom"), "DataRoom")
const ValuationSuite = lazyNamed(() => import("./pages/deals/valuation/ValuationSuite"), "ValuationSuite")
const FinancialDashboard = lazyDefault(() => import("./pages/deals/FinancialDashboard"))
const BillingDashboard = lazyNamed(() => import("./pages/dashboard/BillingDashboard"), "BillingDashboard")
const CheckoutSuccess = lazyNamed(() => import("./pages/checkout/CheckoutSuccess"), "CheckoutSuccess")
const CheckoutCancel = lazyNamed(() => import("./pages/checkout/CheckoutCancel"), "CheckoutCancel")
const EnhancedLandingPage = lazyNamed(() => import("./pages/marketing/EnhancedLandingPage"), "EnhancedLandingPage")
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
const CaseStudiesPage = lazyNamed(() => import("./pages/marketing/CaseStudiesPage"), "CaseStudiesPage");
const BookTrial = lazyNamed(() => import("./pages/marketing/BookTrial"), "BookTrial");
const TermsOfService = lazyNamed(() => import("./pages/marketing/legal/TermsOfService"), "TermsOfService")
const PrivacyPolicy = lazyNamed(() => import("./pages/marketing/legal/PrivacyPolicy"), "PrivacyPolicy")
const CookiePolicy = lazyNamed(() => import("./pages/marketing/legal/CookiePolicy"), "CookiePolicy")
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
// Temporarily disabled - missing blogService functions (createBlogPost, updateBlogPost, publishBlogPost, getBlogPost)
// const BlogAdminEditor = lazyNamed(() => import("./pages/admin/BlogAdminEditor"), "BlogAdminEditor")

// Feature flag check for Master Admin Portal (enabled by default unless explicitly disabled)
const isMasterAdminEnabled = import.meta.env.VITE_ENABLE_MASTER_ADMIN !== 'false'

// Master Admin route wrapper - shows "Not Available" if feature disabled
const MasterAdminRoute = ({ children }: { children: React.ReactElement }) => {
  if (!isMasterAdminEnabled) {
    return <FeatureNotAvailable featureName="Master Admin Portal" message="The Master Admin Portal is currently not available. This feature is being deployed in a future update." />
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

  return (
    <Routes>
      {/* Marketing Routes (No RootLayout - uses MarketingLayout) */}
      <Route index element={<EnhancedLandingPage />} />
      <Route path="pricing" element={<PricingPage />} />
      <Route path="features" element={<FeaturesPage />} />
      <Route path="about" element={<AboutPage />} />
      <Route path="contact" element={<ContactPage />} />
      <Route path="team" element={<TeamPage />} />
      <Route path="podcast" element={<PodcastPage />} />
      <Route path="security" element={<SecurityPage />} />
      <Route path="blog" element={<BlogListingPage />} />
      <Route path="blog/:slug" element={<BlogPostPage />} />
      <Route path="faq" element={<FAQPage />} />
      <Route path="capliquify-fpa" element={<CapLiquifyFPAPage />} />
      <Route path="4-stage-cycle" element={<FourStageCyclePage />} />
      <Route path="sales-promotion-pricing" element={<SalesPromotionPricingPage />} />
      <Route path="case-studies" element={<CaseStudiesPage />} />
      <Route path="book-trial" element={<BookTrial />} />
      <Route path="legal/terms" element={<TermsOfService />} />
      <Route path="legal/privacy" element={<PrivacyPolicy />} />
      <Route path="legal/cookies" element={<CookiePolicy />} />

      {/* Authentication Routes (uses RootLayout - sign-in/sign-up only) */}
      <Route element={<RootLayout />}>
        <Route path="sign-in/*" element={<SignInPage />} />
        <Route path="sign-up/*" element={<SignUpPage />} />
      </Route>

      {/* Protected Routes (uses ProtectedLayout with NavigationMenu) */}
      <Route element={<ProtectedLayout />}>
        <Route path="dashboard" element={<DashboardPage />} />

        {/* Admin Routes */}
        <Route path="admin" element={<AdminDashboard />} />
        <Route path="admin/users" element={<UserManagement />} />
        <Route path="admin/organizations" element={<OrganizationManagement />} />
        <Route path="admin/system" element={<SystemHealth />} />
        {/* Temporarily disabled - BlogAdminEditor needs blogService functions implemented */}
        {/* <Route path="admin/blog/new" element={<BlogAdminEditor />} /> */}
        {/* <Route path="admin/blog/:id/edit" element={<BlogAdminEditor />} /> */}

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
  )
}

export default App
// Render cache bust - fresh build without lucide-vendor chunk - 20251117154200
