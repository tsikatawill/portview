# Open Source Launch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add all missing artifacts to make Portview a well-formed open source project ready for public contributions and binary distribution.

**Architecture:** Static documents (README, LICENSE, CONTRIBUTING) are written directly. Quality enforcement uses a local pre-push git hook plus a GitHub Actions CI workflow. Packaging uses electron-builder, configured inside package.json, producing a Mac DMG and Windows NSIS installer via a `dist` npm script. A separate release workflow publishes binaries to GitHub Releases on version tags.

**Tech Stack:** electron-builder, GitHub Actions, Vitest, shell scripting

---

## File Map

| Action | Path | Purpose |
|--------|------|---------|
| Create | `README.md` | Project landing page |
| Create | `LICENSE` | ISC license text |
| Create | `CONTRIBUTING.md` | Contribution guidelines |
| Create | `.github/workflows/ci.yml` | Run tests on every push/PR |
| Create | `.github/workflows/release.yml` | Build and publish binaries on version tags |
| Create | `scripts/install-hooks.sh` | One-command local hook installer for contributors |
| Modify | `package.json` | Add electron-builder devDep, `build` config, `dist` script |

> Note: `.git/hooks/pre-push` is not tracked by git and cannot be committed. The `scripts/install-hooks.sh` script creates it. Contributors run this once after cloning.

---

### Task 1: LICENSE

**Files:**
- Create: `LICENSE`

- [ ] **Step 1: Create the LICENSE file**

```
ISC License

Copyright (c) 2026 William M. Tsikata

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
```

- [ ] **Step 2: Commit**

```bash
git add LICENSE
git commit -m "docs: add ISC license"
```

---

### Task 2: README

**Files:**
- Create: `README.md`

- [ ] **Step 1: Create README.md**

```markdown
# Portview

A desktop app for developers to see which processes are using local ports and kill them — without touching the terminal.

![Portview screenshot](docs/screenshot.png)

## Features

- Live port scanning (macOS via `lsof`, Windows via `netstat`)
- Kill and force-kill processes by port
- Search and filter by port number, process name, PID, or state
- Pinned ports for your most-used dev servers (3000, 5173, 8080, …)
- Auto-refresh at a configurable interval
- Menu bar / system tray for quick access without opening the full window
- Window size and position persistence

## Download

Grab the latest installer from [Releases](https://github.com/tsikatawill/portview/releases):

- **macOS** — `Portview-<version>-universal.dmg`
- **Windows** — `Portview-Setup-<version>.exe`

> macOS: right-click → Open to bypass Gatekeeper on first launch.  
> Windows: click "More info → Run anyway" to bypass SmartScreen.

## Building from source

**Prerequisites:** Node.js ≥ 20, npm

```bash
git clone https://github.com/tsikatawill/portview.git
cd portview
npm install
npm run dev          # start in dev mode
npm run build        # compile
npm run dist         # package installers (output: dist/)
```

## Running tests

```bash
npm test             # run all tests once
npm run test:watch   # watch mode
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[ISC](LICENSE) © William M. Tsikata
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add README"
```

---

### Task 3: CONTRIBUTING guide

**Files:**
- Create: `CONTRIBUTING.md`

- [ ] **Step 1: Create CONTRIBUTING.md**

```markdown
# Contributing to Portview

Thank you for your interest in contributing! Here's everything you need to get started.

## Prerequisites

- Node.js ≥ 20
- npm

## Setup

```bash
git clone https://github.com/tsikatawill/portview.git
cd portview
npm install
bash scripts/install-hooks.sh   # installs the pre-push test hook
```

## Workflow

1. Fork the repo and create a branch from `main`.
2. Branch naming: `feat/<topic>`, `fix/<topic>`, or `chore/<topic>`.
3. Make your changes.
4. Run the tests: `npm test`
5. Format your code: `npm run format`
6. Open a pull request against `main`.

## Tests are required for new features

Every pull request that adds new behavior **must include tests** covering that behavior. PRs without tests for new features will not be merged.

- Tests live alongside the code they cover, in `__tests__/` subdirectories.
- Use [Vitest](https://vitest.dev/). See `src/main/__tests__/` for examples.
- Run `npm test` before pushing — the pre-push hook does this automatically once installed.

## Commit style

Use [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | When to use |
|--------|-------------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `chore:` | Build, deps, tooling |
| `docs:` | Documentation only |
| `refactor:` | Code change with no behavior change |
| `test:` | Tests only |

## Code style

Prettier handles formatting. Run `npm run format` before committing, or configure your editor to format on save (`.prettierrc` is in the root).

## What's in scope

See [spec.md](spec.md) for the full product vision. Good first contributions:

- Bug fixes with a failing test that demonstrates the bug
- Tests for currently untested paths
- Windows-specific scanner improvements
- Performance improvements to the port scan

## Questions?

Open an issue — happy to discuss before you start a large change.
```

- [ ] **Step 2: Commit**

```bash
git add CONTRIBUTING.md
git commit -m "docs: add contribution guidelines"
```

---

### Task 4: Pre-push hook installer

**Files:**
- Create: `scripts/install-hooks.sh`

> `.git/hooks/pre-push` is not tracked by git. This script creates it. Contributors run it once after cloning (`bash scripts/install-hooks.sh`).

- [ ] **Step 1: Create scripts/install-hooks.sh**

```bash
#!/usr/bin/env bash
set -euo pipefail

HOOK=".git/hooks/pre-push"

cat > "$HOOK" << 'EOF'
#!/usr/bin/env bash
set -euo pipefail
echo "Running tests before push..."
npm test
EOF

chmod +x "$HOOK"
echo "pre-push hook installed at $HOOK"
```

- [ ] **Step 2: Make the installer executable**

```bash
chmod +x scripts/install-hooks.sh
```

- [ ] **Step 3: Run it to verify the hook is created and works**

```bash
bash scripts/install-hooks.sh
# Expected output: pre-push hook installed at .git/hooks/pre-push

cat .git/hooks/pre-push
# Expected: shows the hook script

npm test
# Expected: all tests pass (vitest run)
```

- [ ] **Step 4: Commit**

```bash
git add scripts/install-hooks.sh
git commit -m "chore: add pre-push hook installer script"
```

---

### Task 5: GitHub Actions CI

**Files:**
- Create: `.github/workflows/ci.yml`

- [ ] **Step 1: Create .github/workflows/ci.yml**

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    name: Typecheck & Test
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Typecheck
        run: npm run typecheck

      - name: Test
        run: npm test
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: add GitHub Actions workflow for typecheck and tests"
```

---

### Task 6: electron-builder packaging

**Files:**
- Modify: `package.json` (add devDependency, `dist` script, `build` config block)

- [ ] **Step 1: Install electron-builder**

```bash
npm install --save-dev electron-builder
```

Expected: `electron-builder` appears in `devDependencies` in `package.json`.

- [ ] **Step 2: Add dist script and build config to package.json**

Add `"dist"` to the `scripts` block:

```json
"dist": "electron-vite build && electron-builder"
```

Add a top-level `"build"` key to `package.json`:

```json
"build": {
  "appId": "com.tsikatawill.portview",
  "productName": "Portview",
  "directories": {
    "output": "dist"
  },
  "files": [
    "out/**/*"
  ],
  "mac": {
    "icon": "resources/app-icon.png",
    "target": [
      { "target": "dmg", "arch": ["universal"] }
    ]
  },
  "win": {
    "icon": "resources/app-icon.png",
    "target": [
      { "target": "nsis", "arch": ["x64"] }
    ]
  },
  "nsis": {
    "oneClick": false,
    "allowToChangeInstallationDirectory": true
  }
}
```

- [ ] **Step 3: Verify the build config is valid**

```bash
npm run build
# Expected: electron-vite builds to out/ with no errors
```

> Full `npm run dist` only works on the target platform (Mac for DMG, Windows for NSIS). That's handled by the release workflow in Task 7.

- [ ] **Step 4: Add dist/ to .gitignore**

Open `.gitignore` and add:

```
dist/
```

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json .gitignore
git commit -m "chore: add electron-builder packaging config for Mac DMG and Windows NSIS"
```

---

### Task 7: GitHub Release workflow

**Files:**
- Create: `.github/workflows/release.yml`

This workflow triggers when a `v*` tag is pushed (e.g. `v1.0.0`). It builds on both `macos-latest` and `windows-latest`, then attaches the artifacts to a GitHub Release.

- [ ] **Step 1: Create .github/workflows/release.yml**

```yaml
name: Release

on:
  push:
    tags:
      - "v*"

jobs:
  build:
    strategy:
      matrix:
        include:
          - os: macos-latest
            artifact_glob: "dist/*.dmg"
          - os: windows-latest
            artifact_glob: "dist/*.exe"

    runs-on: ${{ matrix.os }}

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build and package
        run: npm run dist
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Upload artifacts to release
        uses: softprops/action-gh-release@v2
        with:
          files: ${{ matrix.artifact_glob }}
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/release.yml
git commit -m "ci: add release workflow to publish Mac and Windows installers on version tags"
```

- [ ] **Step 3: Verify the full workflow manually (optional but recommended)**

To publish a release, push a version tag:

```bash
git tag v1.0.0
git push origin v1.0.0
```

GitHub Actions will run the release workflow and attach `Portview-1.0.0-universal.dmg` and `Portview Setup 1.0.0.exe` to the release.

---

## Self-Review Notes

- All 7 items from the design doc are covered by tasks 1–7.
- No TBDs or placeholders — every step has complete content.
- electron-builder `"files": ["out/**/*"]` matches the electron-vite output dir (`out/`).
- CI workflow runs on `ubuntu-latest` (sufficient for typecheck + vitest); release builds run on the target OS.
- `scripts/install-hooks.sh` referenced in CONTRIBUTING.md matches Task 4.
- `docs/screenshot.png` referenced in README.md does not exist yet — acceptable placeholder for now; contributors can add it.
