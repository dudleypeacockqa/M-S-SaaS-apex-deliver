# Package-Lock.json Manifest Documentation

**Date**: 2025-11-12T18:23Z
**npm Version**: 11.6.2 (CLI v9+ compatible)
**Lock File Version**: 3 (npm v9+ format)

## Overview

The [frontend/package-lock.json](../frontend/package-lock.json) file serves as the authoritative manifest of all frontend dependencies, following the [npm CLI v9 package-lock.json specification](https://docs.npmjs.com/cli/v9/configuring-npm/package-lock-json).

## Manifest Details

### Lock File Version 3 Format

```json
{
  "name": "ma-saas-frontend",
  "version": "2.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": { ... }
}
```

**Key Properties:**
- `lockfileVersion: 3` - Modern npm v9+ format (backwards compatible with v7+)
- `requires: true` - Dependency resolution enforced
- Total packages: **679** (dependencies + devDependencies)

### Production Dependencies (13)

```json
"@clerk/clerk-react": "^5.53.3"
"@hello-pangea/dnd": "^18.0.1"
"@tanstack/react-query": "^5.90.5"
"axios": "^1.12.2"
"date-fns": "^3.6.0"
"lucide-react": "^0.552.0"
"react": "^19.1.1"
"react-dom": "^19.1.1"
"react-markdown": "^10.1.0"
"react-router-dom": "^7.9.4"
"serve": "^14.2.5"
"wouter": "^3.7.1"
"zustand": "^5.0.8"
```

### Development Dependencies (19)

```json
"@axe-core/cli": "^4.11.0"
"@eslint/js": "^9.36.0"
"@testing-library/jest-dom": "^6.6.3"
"@testing-library/react": "^16.3.0"
"@testing-library/user-event": "^14.6.1"
"@types/node": "^24.6.0"
"@types/react": "^19.1.16"
"@types/react-dom": "^19.1.9"
"@vitejs/plugin-react": "^5.0.4"
"@vitest/coverage-v8": "^4.0.4"
"autoprefixer": "^10.4.21"
"eslint": "^9.36.0"
"eslint-plugin-react-hooks": "^5.2.0"
"eslint-plugin-react-refresh": "^0.4.22"
"globals": "^16.4.0"
"jsdom": "^27.0.1"
"msw": "^2.12.1"
"postcss": "^8.5.6"
"tailwindcss": "^3.4.17"
"terser": "^5.44.0"
"typescript": "~5.9.3"
"typescript-eslint": "^8.45.0"
"vite": "^7.2.2"
"vite-plugin-imagemin": "^0.1.0"
"vitest": "^4.0.2"
"web-streams-polyfill": "^3.3.3"
```

## Security Audit

```bash
$ npm audit --audit-level=high
found 0 vulnerabilities
```

✅ **No high or critical vulnerabilities** (as of 2025-11-12T18:23Z)

## Installation Commands

### Clean Install (CI/CD, Production)
```bash
npm ci
```
Installs **exact versions** from package-lock.json, ignoring package.json semver ranges.

### Standard Install (Development)
```bash
npm install
```
Respects package.json semver ranges, may update package-lock.json if new versions satisfy ranges.

### Package-Lock Only Regeneration
```bash
npm install --package-lock-only
```
Updates package-lock.json without touching node_modules.

## Manifest Validation

The package-lock.json is validated on every install/CI run:

1. **Integrity Checks** - SHA-512 hashes verify package contents
2. **Dependency Resolution** - Transitive dependencies resolved deterministically
3. **Version Pinning** - Exact versions locked for reproducible builds

## npm v9+ Lock File Features

### Lock File Version 3 Benefits

1. **Hidden Lockfiles Support** - Better monorepo handling
2. **Improved Performance** - Faster installs via optimized resolution
3. **Better Peer Dependency Handling** - Clearer peer dependency conflicts
4. **Workspace Support** - First-class monorepo/workspace support

### Structure

```json
"node_modules/@clerk/clerk-react": {
  "version": "5.53.3",
  "resolved": "https://registry.npmjs.org/@clerk/clerk-react/-/clerk-react-5.53.3.tgz",
  "integrity": "sha512-...",
  "license": "MIT",
  "dependencies": { ... },
  "peerDependencies": { ... }
}
```

## Deployment

### Render Build Process

Render automatically uses `npm ci` for production builds:

1. Detects package-lock.json presence
2. Runs `npm ci` (not `npm install`)
3. Ensures exact version reproducibility
4. Fails if package-lock.json is out of sync with package.json

### Local Development

Developers should:
1. Always commit package-lock.json changes
2. Run `npm ci` after pulling to ensure exact versions
3. Never manually edit package-lock.json
4. Use `npm install <package>` to add new dependencies

## References

- **npm CLI v9 Documentation**: https://docs.npmjs.com/cli/v9/configuring-npm/package-lock-json
- **Lock File Version 3 Spec**: https://docs.npmjs.com/cli/v9/configuring-npm/package-lock-json#lockfileversion
- **npm ci Documentation**: https://docs.npmjs.com/cli/v9/commands/npm-ci

## Maintenance

**Last Regenerated**: 2025-11-12T18:22Z
**Last Audit**: 2025-11-12T18:23Z
**Next Audit**: Run `npm audit` monthly or after any dependency update

---

**Validation Status**: ✅ VALID
**Security Status**: ✅ NO VULNERABILITIES
**Total Packages**: 679
**Lock File Format**: v3 (npm v9+)
