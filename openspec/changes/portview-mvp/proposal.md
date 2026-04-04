## Why

Developers frequently hit port conflicts caused by local servers, background processes, containers, or orphaned tasks. Resolving these requires terminal commands (`lsof`, `netstat`, `kill`) that are slow, hard to remember, and error-prone. Portview provides a fast, visual alternative that lets developers identify and terminate port-holding processes in seconds.

## What Changes

- New Electron desktop application for port management
- Real-time scanning of active local ports with process metadata (PID, name, protocol, state, user)
- One-click and force-kill process termination from the UI
- Search and filtering by port number, process name, PID, and connection state
- Manual refresh and optional auto-refresh for live monitoring
- macOS menu bar tray companion for quick-access port inspection and kill actions
- Pinned/favorite ports for common development ports (3000, 5173, 8000, 8080, 5432)
- Conflict detection highlighting occupied developer ports

## Capabilities

### New Capabilities

- `port-discovery`: Scanning and listing active local ports with process metadata (PID, name, protocol, address, state, user)
- `process-termination`: Killing processes by PID with standard kill, force kill, and optional confirmation
- `search-filter`: Filtering and sorting the port list by port number, process name, PID, and state
- `live-monitoring`: Manual and auto-refresh of port data at configurable intervals
- `menu-bar-tray`: macOS/Windows system tray companion for quick port inspection and kill actions
- `pinned-ports`: User-configurable favorite ports with conflict detection for common dev ports
- `main-app-ui`: Primary Electron window with port table, detail views, and action controls

### Modified Capabilities

_(none - greenfield project)_

## Impact

- **New codebase**: Electron app with main process (Node.js port scanning) and renderer process (React UI)
- **OS dependencies**: Uses OS-level commands (`lsof` on macOS/Linux, `netstat`/`Get-NetTCPConnection` on Windows) for port discovery
- **Permissions**: Some kill operations may require elevated privileges; app must handle permission errors gracefully
- **System tray**: Uses Electron's `Tray` and `Menu` APIs for menu bar integration
- **Target platforms**: macOS primary, Windows secondary
