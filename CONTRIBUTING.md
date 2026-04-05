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
