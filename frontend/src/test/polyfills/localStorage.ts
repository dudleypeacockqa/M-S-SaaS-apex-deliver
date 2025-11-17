type StorageLike = {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
  removeItem: (key: string) => void
  clear: () => void
  key: (index: number) => string | null
  readonly length: number
}

const createStorage = (): StorageLike => {
  const store = new Map<string, string>()
  return {
    getItem: (key: string) => (store.has(String(key)) ? store.get(String(key)) ?? null : null),
    setItem: (key: string, value: string) => {
      store.set(String(key), String(value))
    },
    removeItem: (key: string) => {
      store.delete(String(key))
    },
    clear: () => {
      store.clear()
    },
    key: (index: number) => Array.from(store.keys())[index] ?? null,
    get length() {
      return store.size
    },
  }
}

const ensureStorage = (target: Record<string, unknown>, property: 'localStorage' | 'sessionStorage') => {
  const current = target[property]
  if (!current || typeof (current as StorageLike).getItem !== 'function') {
    Object.defineProperty(target, property, {
      configurable: true,
      writable: true,
      value: createStorage(),
    })
  }
}

if (typeof globalThis.window === 'undefined') {
  ;(globalThis as Record<string, unknown>).window = globalThis
}

ensureStorage(globalThis as Record<string, unknown>, 'localStorage')
ensureStorage(globalThis as Record<string, unknown>, 'sessionStorage')

export {}
