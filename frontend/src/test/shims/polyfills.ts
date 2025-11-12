import { ReadableStream, WritableStream, TransformStream } from 'node:stream/web'

const globalTarget = globalThis as Record<string, unknown>

if (typeof globalTarget.ReadableStream === 'undefined') {
  globalTarget.ReadableStream = ReadableStream
}

if (typeof globalTarget.WritableStream === 'undefined') {
  globalTarget.WritableStream = WritableStream
}

if (typeof globalTarget.TransformStream === 'undefined') {
  globalTarget.TransformStream = TransformStream
}

export {}

