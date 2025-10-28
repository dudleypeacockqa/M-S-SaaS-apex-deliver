import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { SignedIn, SignedOut } from "@clerk/clerk-react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import { ErrorBoundary } from "./components/common"
import { RootLayout } from "./layouts/RootLayout"
import { SignInPage } from "./pages/SignInPage"
import { SignUpPage } from "./pages/SignUpPage"
import { DashboardPage } from "./pages/DashboardPage"
import { AdminDashboard } from "./pages/admin/AdminDashboard"
import { UserManagement } from "./pages/admin/UserManagement"
import { OrganizationManagement } from "./pages/admin/OrganizationManagement"
import { SystemHealth } from "./pages/admin/SystemHealth"
import { DealPipeline } from "./pages/deals/DealPipeline"
import { NewDealPage } from "./pages/deals/NewDealPage"
import { DealDetails } from "./pages/deals/DealDetails"
import { DataRoom } from "./pages/deals/DataRoom"
import { ValuationSuite } from "./pages/deals/valuation/ValuationSuite"
import { PodcastStudio } from "./pages/podcast/PodcastStudio"

// Billing & Checkout Pages
import { BillingDashboard } from "./pages/dashboard/BillingDashboard"
import { CheckoutSuccess } from "./pages/checkout/CheckoutSuccess"
import { CheckoutCancel } from "./pages/checkout/CheckoutCancel"

// Marketing Pages
import { EnhancedLandingPage } from "./pages/marketing/EnhancedLandingPage"
import { PricingPage } from "./pages/marketing/PricingPage"
import { FeaturesPage } from "./pages/marketing/FeaturesPage"
import { AboutPage } from "./pages/marketing/AboutPage"
import { ContactPage } from "./pages/marketing/ContactPage"
import { TermsOfService } from "./pages/marketing/legal/TermsOfService"
import { PrivacyPolicy } from "./pages/marketing/legal/PrivacyPolicy"
import { CookiePolicy } from "./pages/marketing/legal/CookiePolicy"

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

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Marketing Routes (No RootLayout - uses MarketingLayout) */}
      <Route index element={<EnhancedLandingPage />} />
      <Route path="pricing" element={<PricingPage />} />
      <Route path="features" element={<FeaturesPage />} />
      <Route path="about" element={<AboutPage />} />
      <Route path="contact" element={<ContactPage />} />
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
          <AppRoutes />
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
