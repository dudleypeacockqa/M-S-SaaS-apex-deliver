export default function isPotentialCustomElementName(name: string): boolean {
  return /^[a-z][.0-9_a-z]*-[.0-9_a-z-]*$/.test(name)
}
