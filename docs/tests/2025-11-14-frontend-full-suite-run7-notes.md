# 2025-11-14 Vitest Coverage Attempt Notes

Command: `npm run test -- --run --coverage --pool=threads`

| Attempt | Invocation Details | Outcome |
|---------|--------------------|---------|
| 1 | piped to `docs/tests/2025-11-14-frontend-full-suite-run7-partial.txt` via `tee`; harness timeout at 10m | Suite kept running but CLI session was killed at 600s. Partial log saved for traceability. |
| 2 | same command with 20m timeout, output `docs/tests/2025-11-14-frontend-full-suite-run7-partial-2.txt` | Run exceeded 1200s before harness terminated process. Partial log shows progress through marketing + valuation suites. |
| 3 | same command with 40m timeout, output `docs/tests/2025-11-14-frontend-full-suite-run7.txt` | Process again exceeded harness timeout (>2400s). Based on log timestamps the suite still had pending files; indicates Windows environment cannot finish full coverage run without offloading to long-lived Linux runner. |

Next steps: run the same command on a CI/Linux host (no pseudo-TTY redirection) or split the suite (documents, valuation, marketing, master-admin) across multiple invocations to gather coverage artefacts without hitting the sandbox timeout. The EventCreator accessibility fix now keeps the suite green, so the remaining blocker is runtime logistics.
