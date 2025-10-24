import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { SignedIn, SignedOut } from "@clerk/clerk-react"

import { RootLayout } from "./layouts/RootLayout"
import { HomePage } from "./pages/HomePage"
import { SignInPage } from "./pages/SignInPage"
import { SignUpPage } from "./pages/SignUpPage"
import { DashboardPage } from "./pages/DashboardPage"

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
      <Route element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="sign-in" element={<SignInPage />} />
        <Route path="sign-up" element={<SignUpPage />} />
        <Route path="dashboard" element={<DashboardRoute />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

const App = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
