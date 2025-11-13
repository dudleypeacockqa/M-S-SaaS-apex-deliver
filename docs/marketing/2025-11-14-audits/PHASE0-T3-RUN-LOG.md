# Phase 0 - Task T3 Audit Run (2025-11-14)

**Status:** ⚠️ PARTIAL - Build + preview server succeeded, but Lighthouse/Axe headless browsers cannot load `http://127.0.0.1:4173` on this Windows host (Chrome returns `CHROME_INTERSTITIAL_ERROR` / `NO_FCP`, Axe/WebDriver throws `ERR_CONNECTION_REFUSED`). Evidence captured for troubleshooting; rerun required on Linux/mac per playbook.

## Execution Summary
1. Built frontend via `npm run build` and started `npm run preview:test` (PID 54828) with `VITE_CLERK_PUBLISHABLE_KEY` from `.env`.
2. Ran Lighthouse twice:
   - Attempt #1 (`--chrome-flags="--headless --no-sandbox --disable-dev-shm-usage"`) ➜ `CHROME_INTERSTITIAL_ERROR` (Chrome redirected to `chrome-error://chromewebdata`).
   - Attempt #2 (`--allow-insecure-localhost --ignore-certificate-errors --disable-web-security`) ➜ `NO_FCP` (Chrome never painted content). Both runs still emitted HTML/JSON reports at `docs/marketing/2025-11-14-audits/lighthouse-report.report.{html,json}`.
3. Ran Axe CLI with generous load delay ➜ `WebDriverError: net::ERR_CONNECTION_REFUSED` despite preview responding to `Invoke-WebRequest`.
4. Copied the combined shell transcript to `docs/marketing/2025-11-14-audits/audit-run.log` for reference.

## Observations
- Preview serves content successfully for regular browsers (`Invoke-WebRequest` → 200 OK) but headless Chrome (spawned by Lighthouse/Axe) cannot reach 127.0.0.1 inside this constrained Windows sandbox. Same failure previously noted in `PHASE0-FRONTEND-COVERAGE-ANALYSIS.md`.
- `scripts/run_local_audits.sh` fails earlier when run under WSL because `curl` inside WSL cannot hit the Windows-hosted preview server (port 4173).

## Next Steps
1. Re-run the audit script on a Linux or macOS runner where preview + headless Chrome share the same network namespace.
2. Once Lighthouse/Axe succeed, upload the fresh reports to `docs/marketing/2025-11-14-audits/` and reference them inside MARK-002.
3. Optionally add a Windows fallback path (use `curl.exe` + `Start-Process` preview) if we must support audits from this host.

## Artefacts
- `docs/marketing/2025-11-14-audits/lighthouse-report.report.html`
- `docs/marketing/2025-11-14-audits/lighthouse-report.report.json`
- `docs/marketing/2025-11-14-audits/audit-run.log`
- Command outputs embedded in this repo session (see tracker + workflow files)
## 2025-11-14T14:05Z Manual Audit Attempt
- Started static preview via `npx http-server dist -p 4173 -a 127.0.0.1` (Windows PowerShell).
- `npx lighthouse` produced reports but failed with `NO_FCP` + `EPERM` on cleanup; reports saved anyway under `lighthouse-report.{html,json}` for reference.
- `npx axe http://127.0.0.1:4173 --load-delay 5000 --timeout 60000` → 0 violations.
- Remaining action: rerun Lighthouse from Linux/mac (or adjust preview to include prerendered content) to obtain valid scores.
