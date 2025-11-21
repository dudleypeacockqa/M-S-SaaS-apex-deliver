import { createRequire } from 'node:module'
import type { PluginOption } from 'vite'

const require = createRequire(import.meta.url)

export type Logger = Pick<Console, 'warn'>
type SitemapModuleLoader = () => unknown

const defaultLoader: SitemapModuleLoader = () => require('vite-plugin-sitemap')

const safeWarn = (logger: Logger | undefined, message: string) => {
  try {
    logger?.warn?.(message)
  } catch {
    // Ignore logger failures – build should continue even if logging is unavailable.
  }
}

export const resolveSitemapPlugin = (
  logger: Logger = console,
  loader: SitemapModuleLoader = defaultLoader,
): ((options?: Record<string, unknown>) => PluginOption) | null => {
  try {
    const moduleExports = loader()
    const pluginFactory = (moduleExports as { default?: unknown })?.default ?? moduleExports

    if (typeof pluginFactory !== 'function') {
      safeWarn(logger, '[vite] vite-plugin-sitemap did not export a plugin factory. Sitemap generation will be skipped.')
      return null
    }

    return pluginFactory as (options?: Record<string, unknown>) => PluginOption
  } catch (error) {
    safeWarn(
      logger,
      `[vite] Failed to load vite-plugin-sitemap. Sitemap generation will be skipped. ${(error as Error).message}`,
    )
    return null
  }
}


