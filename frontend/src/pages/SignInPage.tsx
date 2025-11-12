import { Link } from "react-router-dom"
import { SignIn, SignedIn, SignedOut } from "@clerk/clerk-react"

export const SignInPage: React.FC = () => {
  return (
    <section className="bg-gradient-to-b from-slate-50 via-white to-indigo-50 py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr,0.95fr]">
          <div className="space-y-6">
            <p className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-1 text-sm font-semibold text-indigo-800">
              <span className="h-2 w-2 rounded-full bg-indigo-500" aria-hidden="true" />
              Secure Tenant Portal
            </p>
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl">
                Sign in to ApexDeliver
              </h1>
              <p className="text-lg text-slate-600">
                Access the full suite of deal rooms, valuation models, and automated compliance workflows trusted by
                cross-border M&A teams.
              </p>
            </div>
            <ul className="space-y-3 text-slate-700">
              <li className="flex items-start gap-3">
                <span aria-hidden="true" className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-600" />
                Enterprise-grade security with per-file audit logs
              </li>
              <li className="flex items-start gap-3">
                <span aria-hidden="true" className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-600" />
                Billing dashboard with live storage & usage metrics
              </li>
              <li className="flex items-start gap-3">
                <span aria-hidden="true" className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-600" />
                Embedded FP&A, document automation, and podcast studio
              </li>
            </ul>
            <p className="text-sm text-slate-600">
              New here? <Link to="/sign-up" className="font-semibold text-indigo-600 hover:text-indigo-700">Start your free trial</Link>
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-200">
            <SignedOut>
              <SignIn
                routing="path"
                path="/sign-in"
                signUpUrl="/sign-up"
                afterSignInUrl="/dashboard"
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "shadow-none border-none", // Remove nested shadow while keeping spacing consistent
                  },
                }}
              />
            </SignedOut>

            <SignedIn>
              <div className="space-y-4 text-center">
                <p className="text-lg font-semibold text-emerald-700">You are already signed in.</p>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                >
                  Go to your dashboard
                </Link>
              </div>
            </SignedIn>
          </div>
        </div>
      </div>
    </section>
  )
}
