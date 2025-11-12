import { ReadableStream, TransformStream, WritableStream } from 'stream/web'

const globals = globalThis as Record<string, unknown>

if (!('TransformStream' in globals)) {
  ;(globals as any).TransformStream = TransformStream
}

if (!('ReadableStream' in globals)) {
  ;(globals as any).ReadableStream = ReadableStream
}

if (!('WritableStream' in globals)) {
  ;(globals as any).WritableStream = WritableStream
}
