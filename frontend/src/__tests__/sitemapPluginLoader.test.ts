import { describe, expect, it, vi } from 'vitest'

import { resolveSitemapPlugin } from '../../config/sitemapPluginLoader'

const mockLogger = () => ({
  warn: vi.fn(),
})

describe('resolveSitemapPlugin', () => {
  it('returns the plugin factory when vite-plugin-sitemap exports a function', () => {
    const factory = vi.fn()
    const loader = vi.fn(() => ({ default: factory }))
    const logger = mockLogger()

    const pluginFactory = resolveSitemapPlugin(logger, loader)

    expect(loader).toHaveBeenCalled()
    expect(pluginFactory).toBe(factory)
    expect(logger.warn).not.toHaveBeenCalled()
  })

  it('returns null and warns when the plugin export is not callable', () => {
    const loader = vi.fn(() => ({ default: { not: 'callable' } }))
    const logger = mockLogger()

    const pluginFactory = resolveSitemapPlugin(logger, loader)

    expect(pluginFactory).toBeNull()
    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining('did not export a plugin factory'),
    )
  })

  it('warns and returns null when the loader throws', () => {
    const loader = vi.fn(() => {
      throw new Error('boom')
    })
    const logger = mockLogger()

    const pluginFactory = resolveSitemapPlugin(logger, loader)

    expect(pluginFactory).toBeNull()
    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining('Failed to load vite-plugin-sitemap'),
    )
  })
})


