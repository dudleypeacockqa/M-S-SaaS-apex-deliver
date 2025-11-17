# CRITICAL VITE CONFIGURATION - DO NOT MODIFY

## ⚠️ WARNING: These configurations MUST NOT be changed

The following vite.config.ts settings are **CRITICAL** for production stability.
Changing them causes blank screens in production.

### REQUIRED Configuration

```typescript
// 1. ESM Alias (resolve.alias)
'lucide-react': path.resolve(__dirname, 'node_modules/lucide-react/dist/esm/lucide-react.js')

// 2. NO optimizeDeps.include for lucide-react
optimizeDeps: {
  // DO NOT add: include: ['lucide-react']
  exclude: ['**/*.test.tsx', '**/*.test.ts', '**/*.spec.tsx', '**/*.spec.ts'],
}

// 3. manualChunks MUST return undefined for lucide-react
if (id.includes('lucide-react')) {
  return undefined; // Keep in main bundle - DO NOT change to 'lucide-vendor'
}
```

### Why These Settings Are Critical

**Problem:** Creating a separate `lucide-vendor` chunk causes:
1. Async loading of icon library
2. Race condition where React components render before icons initialize
3. Error: `Cannot set properties of undefined (setting 'Activity')`
4. Blank white screen in production

**Solution:** Keep lucide-react in the main bundle:
- Icons initialize synchronously with the app
- No race conditions
- No blank screens

### Historical Context

This issue was debugged over multiple sessions on 2025-11-17.
The root cause is that lucide-react exports icons by setting properties on
an object during module initialization. If the module loads asynchronously
(via code splitting), components try to use icons before they're defined.

### DO NOT:
- ❌ Add `include: ['lucide-react']` to optimizeDeps
- ❌ Return 'lucide-vendor' from manualChunks for lucide-react
- ❌ Remove the ESM alias
- ❌ Remove the early icon import from main.tsx

### DO:
- ✅ Keep `return undefined` for lucide-react in manualChunks
- ✅ Keep the ESM alias forcing single resolution path
- ✅ Keep `import "./lib/icons"` at top of main.tsx
- ✅ Run verification script after build: `npm run verify:lucide`

## Verification

After any vite.config.ts changes, run:
```bash
npm run build
npm run verify:lucide
```

The verification script MUST pass with:
```
✅ Lucide bundle verification passed: no lucide-specific chunks detected
```

If you see lucide-vendor chunks, **revert your changes immediately**.

## Emergency Recovery

If production shows blank screens:
1. Check browser console for: "Cannot set properties of undefined"
2. Verify vite.config.ts has settings above
3. Redeploy with correct configuration
4. Hard refresh browsers (Ctrl+Shift+R)

## Last Updated
2025-11-17 - After resolving production blank screen issue
