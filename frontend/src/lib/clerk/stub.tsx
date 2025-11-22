import type { ReactNode } from "react"

type AuthState = {
  isSignedIn: boolean
  isLoaded: boolean
  userId: string | null
  sessionId: string | null
  getToken: () => Promise<string | null>
  signOut: () => Promise<void>
}

const defaultAuthState: AuthState = {
  isSignedIn: false,
  isLoaded: true,
  userId: null,
  sessionId: null,
  getToken: async () => null,
  signOut: async () => undefined,
}

export const ClerkProvider = ({ children }: { children: ReactNode }) => <>{children}</>

export const SignedIn = ({ children }: { children?: ReactNode }) => <>{children}</>

export const SignedOut = ({ children }: { children?: ReactNode }) => null

export const SignIn = () => null

export const SignUp = () => null

export const SignInButton = ({ children }: { children?: ReactNode }) => (
  <button type="button" data-testid="sign-in-button">
    {children ?? "Sign in"}
  </button>
)

export const SignUpButton = ({ children }: { children?: ReactNode }) => (
  <button type="button" data-testid="sign-up-button">
    {children ?? "Sign up"}
  </button>
)

export const UserButton = () => null

export const useAuth = () => defaultAuthState

export const useUser = () => ({
  isSignedIn: false,
  isLoaded: true,
  user: null,
})

export const useOrganization = () => ({
  organization: null,
  isLoaded: true,
  membership: null,
})

export const useOrganizationList = () => ({
  isLoaded: true,
  organizationList: [],
})


