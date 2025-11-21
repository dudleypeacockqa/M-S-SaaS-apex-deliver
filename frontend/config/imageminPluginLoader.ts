import { createRequire } from 'node:module'
import type { PluginOption } from 'vite'

const require = createRequire(import.meta.url)

export type Logger = Pick<Console, 'warn'>

export type ImageminPluginFactory = (...args: any[]) => PluginOption

type ImageminModuleLoader = () => unknown

const defaultLoader: ImageminModuleLoader = () => require('vite-plugin-imagemin')

const safeWarn = (logger: Logger | undefined, message: string) => {
  try {
    logger?.warn?.(message)
  } catch {
    // Ignore logger failures – build should continue even if logging is unavailable.
  }
}

export const resolveImageminPlugin = (
  shouldOptimizeImages: boolean,
  logger: Logger = console,
  loader: ImageminModuleLoader = defaultLoader,
): ImageminPluginFactory | null => {
  if (!shouldOptimizeImages) {
    return null
  }

  try {
    const moduleExports = loader()
    const pluginFactory = (moduleExports as { default?: unknown })?.default ?? moduleExports

    if (typeof pluginFactory !== 'function') {
      safeWarn(
        logger,
        '[vite] vite-plugin-imagemin did not export a plugin factory. Image minification will be skipped.',
      )
      return null
    }

    return pluginFactory as ImageminPluginFactory
  } catch (error) {
    safeWarn(
      logger,
      `[vite] Failed to load vite-plugin-imagemin. Image minification will be skipped. ${(error as Error).message}`,
    )
    return null
  }
}

