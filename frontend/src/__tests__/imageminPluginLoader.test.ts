import { describe, expect, it, vi } from 'vitest'

import { resolveImageminPlugin } from '../../config/imageminPluginLoader'

const mockLogger = () => ({
  warn: vi.fn(),
})

describe('resolveImageminPlugin', () => {
  it('returns the plugin factory when vite-plugin-imagemin exports a function', () => {
    const factory = vi.fn()
    const loader = vi.fn(() => ({ default: factory }))
    const logger = mockLogger()

    const pluginFactory = resolveImageminPlugin(true, logger, loader)

    expect(loader).toHaveBeenCalled()
    expect(pluginFactory).toBe(factory)
    expect(logger.warn).not.toHaveBeenCalled()
  })

  it('returns null and warns when the plugin export is not callable', () => {
    const loader = vi.fn(() => ({ default: { not: 'callable' } }))
    const logger = mockLogger()

    const pluginFactory = resolveImageminPlugin(true, logger, loader)

    expect(pluginFactory).toBeNull()
    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining('did not export a plugin factory'),
    )
  })

  it('skips loading when optimization is disabled', () => {
    const loader = vi.fn(() => {
      throw new Error('should not run when disabled')
    })
    const logger = mockLogger()

    const pluginFactory = resolveImageminPlugin(false, logger, loader)

    expect(pluginFactory).toBeNull()
    expect(loader).not.toHaveBeenCalled()
    expect(logger.warn).not.toHaveBeenCalled()
  })

  it('warns and returns null when the loader throws', () => {
    const loader = vi.fn(() => {
      throw new Error('boom')
    })
    const logger = mockLogger()

    const pluginFactory = resolveImageminPlugin(true, logger, loader)

    expect(pluginFactory).toBeNull()
    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining('Failed to load vite-plugin-imagemin'),
    )
  })
})

