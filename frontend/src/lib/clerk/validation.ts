const sanitizeKey = (key?: string | null) => key?.toString().trim() ?? ""

export const isClerkKeyValid = (key?: string | null): key is string => {
  const value = sanitizeKey(key)
  if (!value || value === "undefined") {
    return false
  }
  if (value.toLowerCase().includes("localpreview")) {
    return false
  }
  return true
}

export const getClerkPublishableKey = (): string | undefined => {
  const value = sanitizeKey(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY)
  return isClerkKeyValid(value) ? value : undefined
}


