## Context

This is a greenfield Electron desktop application. There is no existing codebase. The app needs to scan local ports, resolve owning processes, and present this data in a fast, developer-friendly UI with quick-action termination capabilities.

The primary platform is macOS, with Windows as a secondary target. Port/process discovery relies on OS-level commands that differ across platforms.

## Goals / Non-Goals

**Goals:**

- Deliver an MVP that covers port discovery, process termination, search/filter, live monitoring, menu bar tray, and pinned ports
- Fast startup and low idle resource usage
- Clean, minimal UI that surfaces the right information without clutter
- Cross-platform port scanning abstraction (macOS + Windows)

**Non-Goals:**

- Docker/container awareness (future phase)
- Auto-kill rules and automation (future phase)
- CLI companion tool (future phase)
- Kill history / audit trail (future phase)
- Restart-after-kill workflow (future phase)
- Linux support (future phase)
- Native macOS widget (not viable with Electron)

## Decisions

### 1. Electron with React renderer

**Choice**: Electron + React + TypeScript for the full stack.

**Why**: Electron provides native OS access (child_process for port scanning, Tray API for menu bar) while React offers a productive UI framework. TypeScript catches errors early in a project with OS-level interactions.

**Alternatives considered**:

- **Tauri**: Smaller binary, better performance, but Rust backend adds complexity for a tool that primarily shells out to OS commands. Electron's maturity and ecosystem win for MVP speed.
- **Native Swift (macOS only)**: Best performance but locks out Windows. Portview targets both platforms.

### 2. Port scanning via OS command parsing

**Choice**: Shell out to `lsof -iTCP -iUDP -nP` on macOS and `netstat -ano` / `Get-NetTCPConnection` on Windows. Parse stdout into a unified data model.

**Why**: These commands are available on all target systems without additional dependencies. No native addons needed.

**Alternatives considered**:

- **Native Node addon (e.g., binding to libproc)**: Better performance but adds build complexity, native compilation, and platform-specific C code.
- **`/proc/net/tcp` parsing (Linux)**: Not applicable to macOS/Windows targets.

### 3. Architecture: main process does scanning, renderer does UI

**Choice**: Port scanning and process termination run in the Electron main process. The renderer communicates via IPC (`ipcMain` / `ipcRenderer`).

**Why**: OS commands require Node.js `child_process` which is only available in the main process. IPC keeps a clean separation between data and presentation.

### 4. Menu bar tray as same Electron process

**Choice**: The tray/menu bar lives in the same Electron app process, not a separate binary.

**Why**: Simplifies distribution and state sharing. The tray shows a subset of the same port data. Electron's `Tray` API handles this natively.

### 5. State management with React context + useReducer

**Choice**: Use React Context with `useReducer` for app state (port list, filters, pinned ports, settings).

**Why**: The state shape is simple enough that a full state library (Redux, Zustand) adds unnecessary dependency. Context + reducer covers the needs cleanly.

**Alternatives considered**:

- **Zustand**: Good option but overkill for MVP state complexity.
- **Redux**: Too much boilerplate for this app's needs.

### 6. Persistence with electron-store

**Choice**: Use `electron-store` for persisting user preferences (pinned ports, auto-refresh settings, window position).

**Why**: Simple key-value JSON store that works well with Electron. No database needed for MVP.

### 7. UI framework: Tailwind CSS

**Choice**: Tailwind CSS for styling.

**Why**: Rapid prototyping, consistent design tokens, small bundle with purging. Avoids the overhead of a component library while keeping the UI clean.

## Component Library: Shadcn

**Choice**: Shadcn

**Why**: Popular, proven, wide array of components, works seamlessly with TailwindCSS

## Code formating: Prettier

## Prettier Plugins

**Choice** prettier-plugin-organize-imports, prettier-plugin-tailwindcss

## Risks / Trade-offs

- **OS command parsing is fragile** -> Mitigation: Write platform-specific parsers with comprehensive tests. Pin expected output formats and handle edge cases (truncated output, permission errors).
- **Elevated permissions for kill** -> Mitigation: Attempt standard kill first, surface clear error messages when permission is denied, offer force-kill as escalation. Do not auto-escalate to sudo.
- **Electron app size** -> Mitigation: Accept this trade-off for MVP. Evaluate Tauri migration if size becomes a user concern post-launch.
- **Auto-refresh performance** -> Mitigation: Default refresh interval of 2 seconds. Scanning is async and non-blocking. Allow users to adjust or disable auto-refresh.
- **Menu bar on Windows** -> Mitigation: Windows uses system tray (notification area) which Electron's Tray API supports natively. Behavior parity with macOS menu bar.
