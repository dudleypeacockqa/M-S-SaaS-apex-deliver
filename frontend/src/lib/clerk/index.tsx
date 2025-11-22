import type { ComponentProps, ReactNode } from "react"
import {
  ClerkProvider as RealClerkProvider,
  SignIn as RealSignIn,
  SignInButton as RealSignInButton,
  SignUp as RealSignUp,
  SignedIn as RealSignedIn,
  SignedOut as RealSignedOut,
  SignUpButton as RealSignUpButton,
  UserButton as RealUserButton,
  useAuth as realUseAuth,
  useOrganization as realUseOrganization,
  useOrganizationList as realUseOrganizationList,
  useUser as realUseUser,
} from "@clerk/clerk-react"
import * as ClerkStub from "./stub"
import { getClerkPublishableKey, isClerkKeyValid } from "./validation"

export const clerkPublishableKey = getClerkPublishableKey()
export const isClerkEnabled = isClerkKeyValid(clerkPublishableKey)

type ProviderProps = {
  children: ReactNode
} & Omit<ComponentProps<typeof RealClerkProvider>, "publishableKey">

export const ClerkProvider = ({ children, ...rest }: ProviderProps) =>
  isClerkEnabled ? (
    <RealClerkProvider publishableKey={clerkPublishableKey!} {...rest}>
      {children}
    </RealClerkProvider>
  ) : (
    <ClerkStub.ClerkProvider>{children}</ClerkStub.ClerkProvider>
  )

export const SignedIn = isClerkEnabled ? RealSignedIn : ClerkStub.SignedIn
export const SignedOut = isClerkEnabled ? RealSignedOut : ClerkStub.SignedOut
export const SignIn = isClerkEnabled ? RealSignIn : ClerkStub.SignIn
export const SignUp = isClerkEnabled ? RealSignUp : ClerkStub.SignUp
export const SignInButton = isClerkEnabled ? RealSignInButton : ClerkStub.SignInButton
export const SignUpButton = isClerkEnabled ? RealSignUpButton : ClerkStub.SignUpButton
export const UserButton = isClerkEnabled ? RealUserButton : ClerkStub.UserButton

export const useAuth = isClerkEnabled ? realUseAuth : ClerkStub.useAuth
export const useUser = isClerkEnabled ? realUseUser : ClerkStub.useUser
export const useOrganization = isClerkEnabled ? realUseOrganization : ClerkStub.useOrganization
export const useOrganizationList = isClerkEnabled
  ? realUseOrganizationList
  : ClerkStub.useOrganizationList


