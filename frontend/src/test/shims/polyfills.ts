// Browser-only polyfills for test environment (jsdom)
// Note: Node.js modules (node:module, stream/web) are NOT available in browser/jsdom

// Use native browser stream implementations (available in modern jsdom)
const ReadableCtor: typeof ReadableStream = globalThis.ReadableStream || (class ReadableStreamStub {} as any)
const WritableCtor: typeof WritableStream = globalThis.WritableStream || (class WritableStreamStub {} as any)
const TransformCtor: typeof TransformStream = globalThis.TransformStream || (class TransformStreamStub {} as any)

const globalTarget = globalThis as Record<string, unknown>
const windowTarget =
  typeof globalTarget.window === 'object' && globalTarget.window !== null
    ? (globalTarget.window as Record<string, unknown>)
    : globalTarget

if (typeof globalTarget.ReadableStream === 'undefined') {
  globalTarget.ReadableStream = ReadableCtor
}

if (typeof globalTarget.WritableStream === 'undefined') {
  globalTarget.WritableStream = WritableCtor
}

if (typeof globalTarget.TransformStream === 'undefined') {
  globalTarget.TransformStream = TransformCtor
}

if (typeof windowTarget.ReadableStream === 'undefined') {
  windowTarget.ReadableStream = ReadableCtor
}

if (typeof windowTarget.WritableStream === 'undefined') {
  windowTarget.WritableStream = WritableCtor
}

if (typeof windowTarget.TransformStream === 'undefined') {
  windowTarget.TransformStream = TransformCtor
}

export {}

