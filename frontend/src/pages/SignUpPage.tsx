import { SignUp } from "@clerk/clerk-react"

export const SignUpPage: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Start Your Free Trial
          </h1>
          <p className="text-gray-600">
            Create your account to book a requirements planning session
          </p>
        </div>
        
        <SignUp 
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-2xl",
            }
          }}
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          afterSignUpUrl="/book-trial"
          redirectUrl="/book-trial"
        />
      </div>
    </div>
  )
}
