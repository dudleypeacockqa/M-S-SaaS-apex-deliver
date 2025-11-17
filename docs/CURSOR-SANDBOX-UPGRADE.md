# Elevating the Codex CLI Sandbox

This project currently runs inside a `read-only` / `restricted network` sandbox. In that mode the agent cannot edit files, install packages, run tests, or talk to Render. Follow the steps below whenever you need to give the agent full development access.

## 1. Exit the Current Session
- In the Codex CLI, press `Ctrl + D` (or type `exit`) to terminate the existing session.
- Confirm you are back at your local shell prompt.

## 2. Start a New Session With Elevated Permissions
Run the Codex CLI with explicit flags for write + network access (adjust paths/IDs as needed):

```bash
codex workspace open \
  --sandbox-mode workspace-write \
  --network-access enabled \
  --approval-policy on-request \
  /mnt/c/Projects/ma-saas-platform/M-S-SaaS-apex-deliver
```

If you prefer a brand-new workspace session:

```bash
codex session start \
  --sandbox-mode workspace-write \
  --network-access enabled \
  --approval-policy on-request
```

## 3. Provide Secrets (If Needed)
- Export any required environment variables **after** the session starts (e.g., `export RENDER_API_KEY=...`).
- Alternatively, use `codex secrets set <NAME>` so subsequent sessions inherit the key.

## 4. Verify Permissions
Inside the new session, run:

```bash
codex env show
```

Ensure the output reports:
- `sandbox_mode: workspace-write` (or `danger-full-access`)
- `network_access: enabled`

## 5. Reconnect the Agent
- Re-invoke the agent (e.g., `codex agent start`) within the elevated session.
- The agent can now edit files, run `npm/pytest`, and deploy via `render` CLI.

> **Tip:** If you need to revert to the safer read-only mode later, simply close this session and start a new one without the extra flags.

