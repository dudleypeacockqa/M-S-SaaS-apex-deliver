import { Suspense, lazy, type ComponentType, type LazyExoticComponent } from "react"
import { BrowserRouter, Navigate, Route, Routes, useParams } from "react-router-dom"
import { SignedIn, SignedOut } from "@clerk/clerk-react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import { ErrorBoundary } from "./components/common"
import { LoadingSpinner } from "./components/common/LoadingSpinner"
import { usePageAnalytics } from "./hooks/usePageAnalytics"

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

const RootLayout = lazyNamed(() => import("./layouts/RootLayout"), "RootLayout")
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
const PodcastStudio = lazyNamed(() => import("./pages/podcast/PodcastStudio"), "PodcastStudio")
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

const DashboardRoute = () => {
  return (
    <>
      <SignedIn>
        <DashboardPage />
      </SignedIn>
      <SignedOut>
        <Navigate to="/sign-in" replace />
      </SignedOut>
    </>
  )
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

      {/* Authentication Routes (uses RootLayout) */}
      <Route element={<RootLayout />}>
        <Route path="sign-in" element={<SignInPage />} />
        <Route path="sign-up" element={<SignUpPage />} />
        <Route path="dashboard" element={<DashboardRoute />} />

        {/* Admin Routes */}
        <Route path="admin" element={<SignedIn><AdminDashboard /></SignedIn>} />
        <Route path="admin/users" element={<SignedIn><UserManagement /></SignedIn>} />
        <Route path="admin/organizations" element={<SignedIn><OrganizationManagement /></SignedIn>} />
        <Route path="admin/system" element={<SignedIn><SystemHealth /></SignedIn>} />

        {/* Deal Routes */}
        <Route path="deals" element={<SignedIn><DealPipeline /></SignedIn>} />
        <Route path="deals/new" element={<SignedIn><NewDealPage /></SignedIn>} />
        <Route path="deals/:dealId" element={<SignedIn><DealDetails /></SignedIn>} />
        <Route path="deals/:dealId/data-room" element={<SignedIn><DataRoom /></SignedIn>} />
        <Route path="deals/:dealId/valuation" element={<SignedIn><ValuationSuite /></SignedIn>} />
        <Route path="deals/:dealId/financial" element={<SignedIn><FinancialDashboardRoute /></SignedIn>} />
        <Route path="deals/:dealId/documents/:documentId/editor" element={<SignedIn><DocumentEditorRoute /></SignedIn>} />

        {/* Podcast Routes */}
        <Route path="podcast-studio" element={<SignedIn><PodcastStudio /></SignedIn>} />

        {/* Billing & Subscription Routes */}
        <Route path="dashboard/billing" element={<SignedIn><BillingDashboard /></SignedIn>} />

        {/* Checkout Routes */}
        <Route path="checkout/success" element={<SignedIn><CheckoutSuccess /></SignedIn>} />
        <Route path="checkout/cancel" element={<CheckoutCancel />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

const queryClient = new QueryClient()

const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Suspense fallback={<RouteLoader />}>
            <AppRoutes />
          </Suspense>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
