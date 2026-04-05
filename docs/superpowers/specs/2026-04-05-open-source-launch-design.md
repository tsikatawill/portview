---
date: 2026-04-05
topic: open-source-launch
status: approved
---

# Open Source Launch Design

## Scope

Prepare Portview for public open source contribution by adding the missing legal, documentation, contribution, quality enforcement, and distribution artifacts.

## Artifacts

### README.md
Project overview, features, screenshots placeholder, install instructions (download release vs. build from source), dev setup, and tech stack. First thing visitors see on GitHub.

### LICENSE
ISC license file. The `"license": "ISC"` in package.json is not legally sufficient on its own.

### CONTRIBUTING.md
- How to fork, branch, and open a PR
- Commit convention: conventional commits (feat/fix/chore/docs/refactor/test)
- **New features must include tests** — PRs without tests for new behavior will not be merged
- Run `npm test` before submitting
- Code style enforced by Prettier (`npm run format`)
- Branch naming: `feat/`, `fix/`, `chore/`

### Pre-push git hook (`.git/hooks/pre-push`)
Runs `npm test` before every push. Blocks the push if any test fails. Installed locally — contributors are instructed to install it in CONTRIBUTING.md.

### GitHub Actions CI (`.github/workflows/ci.yml`)
Runs on every push and PR to `main`. Steps: checkout → install → typecheck → test. Covers external contributors who won't have the local hook.

### electron-builder (packaging)
Added as a devDependency. Config in `package.json` under `"build"`:
- Mac: DMG (arm64 + x64 universal)
- Windows: NSIS installer (x64)
- `dist` script: `electron-vite build && electron-builder`

No code signing — Mac will show Gatekeeper warning, Windows SmartScreen warning. Both are bypassable. Revisit when adoption warrants a cert.

### GitHub Release Workflow (`.github/workflows/release.yml`)
Triggers on `v*` tags. Builds on `macos-latest` (for DMG) and `windows-latest` (for NSIS), then attaches artifacts to a GitHub Release.

## What's explicitly out of scope
- Code signing (Mac notarization, Windows Authenticode)
- Issue templates / CODE_OF_CONDUCT.md / SECURITY.md — nice-to-have, not blocking launch
- CLI companion, Docker awareness, kill history — future features per spec.md
