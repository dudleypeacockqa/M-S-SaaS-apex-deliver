// Lightweight fallback for environments where tailwind-merge isn't available.
export const twMerge = (...classes: Array<string | false | null | undefined>): string =>
  classes.filter(Boolean).join(' ')
