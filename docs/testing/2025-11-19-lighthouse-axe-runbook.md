# Lighthouse + Axe Runbook (2025-11-19)

Use this guide to gather the performance/accessibility evidence required by Wave 4 in `docs/FINAL-COMPLETION-PLAN.md`. It wraps the helper script `scripts/run-lighthouse-axe.mjs`, which generates HTML/JSON reports plus metadata under `docs/testing/lighthouse/<date>/`.

## Prerequisites
- Node.js 18+
- `npx lighthouse` and `npx axe` available (installed on demand via npx)
- Marketing preview running locally (`npm --prefix frontend run preview:test`) or a deployed URL

## Command
```bash
AUDIT_OUTPUT_DIR="docs/testing/lighthouse/2025-11-19" \
LIGHTHOUSE_AUDIT_URL="http://127.0.0.1:4173/" \
LIGHTHOUSE_AUDIT_LABEL="local-preview" \
node scripts/run-lighthouse-axe.mjs
```

### Parameters
| Env Var | Default | Description |
| --- | --- | --- |
| `LIGHTHOUSE_AUDIT_URL` | `http://127.0.0.1:4173/` | Target marketing URL (use production URL when Cloudflare allows it) |
| `LIGHTHOUSE_AUDIT_LABEL` | `local-preview` | Label appended to report filenames |
| `AUDIT_OUTPUT_DIR` | `docs/testing/lighthouse/<ISO-date>` | Override to store reruns in a custom folder |

## Outputs
After a successful run you should see:
```
docs/testing/lighthouse/2025-11-19/
├─ lighthouse-local-preview.html
├─ lighthouse-local-preview.json
├─ axe-local-preview.json
└─ metadata.json
```
`metadata.json` records the target URL, label, and relative paths so README/TODO links can reference the artefacts directly.

## Troubleshooting
- **Command not found**: ensure `npx` is available on PATH and PowerShell is not blocking scripts.
- **Cloudflare blocks prod URL**: fall back to the Vite preview tunnel or allowlist your IP, then set `LIGHTHOUSE_AUDIT_URL` to the accessible endpoint.
- **Timeouts**: adjust `axe` options inside `scripts/run-lighthouse-axe.mjs` (`--load-delay`, `--timeout`).

## Next Steps
1. Store the generated reports under `docs/testing/lighthouse/<date>/` and reference them from README + `docs/bmad/100-PERCENT-COMPLETION-STATUS.md` once reruns happen.
2. File remediation tickets for any sub-90 Lighthouse categories or axe violations and link them in TODO.md.
3. Re-run after marketing parity updates ship to confirm improvements.
