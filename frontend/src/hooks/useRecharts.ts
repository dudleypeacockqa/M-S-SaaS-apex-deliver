import { useEffect, useState } from 'react'

type RechartsModule = typeof import('recharts')

let cachedModule: RechartsModule | null = null
let loadingPromise: Promise<RechartsModule> | null = null

const loadRecharts = () => {
  if (!loadingPromise) {
    loadingPromise = import('recharts').then((module) => {
      cachedModule = module
      return module
    })
  }
  return loadingPromise
}

export const useRecharts = (): RechartsModule | null => {
  const [module, setModule] = useState<RechartsModule | null>(cachedModule)

  useEffect(() => {
    if (!module) {
      let mounted = true
      loadRecharts().then((loaded) => {
        if (mounted) {
          setModule(loaded)
        }
      })
      return () => {
        mounted = false
      }
    }
    return undefined
  }, [module])

  return module
}
