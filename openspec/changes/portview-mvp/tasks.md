## 1. Project Setup

- [x] 1.1 Initialize Electron project with TypeScript, React, and build tooling (electron-forge or electron-vite)
- [x] 1.2 Configure Tailwind CSS and Shadcn UI
- [x] 1.3 Set up Prettier with prettier-plugin-organize-imports and prettier-plugin-tailwindcss
- [x] 1.4 Set up Electron main/renderer process structure with IPC boilerplate
- [x] 1.5 Add electron-store dependency and configure for user preferences

## 2. Port Discovery (Core Backend)

- [x] 2.1 Define unified PortEntry data model (port, protocol, processName, pid, user, localAddress, state)
- [x] 2.2 Implement macOS port scanner using `lsof -iTCP -iUDP -nP` with stdout parsing
- [x] 2.3 Implement Windows port scanner using `netstat -ano` / `Get-NetTCPConnection` with stdout parsing
- [x] 2.4 Create platform-agnostic scanner interface that selects the correct implementation by OS
- [x] 2.5 Add error handling for command failures and parse errors
- [x] 2.6 Write tests for macOS parser with sample lsof output
- [x] 2.7 Write tests for Windows parser with sample netstat output

## 3. Process Termination (Core Backend)

- [x] 3.1 Implement standard kill (SIGTERM on macOS, taskkill on Windows) by PID
- [x] 3.2 Implement force kill (SIGKILL on macOS, taskkill /F on Windows) by PID
- [x] 3.3 Handle permission denied errors with descriptive messages
- [x] 3.4 Handle already-exited process gracefully
- [x] 3.5 Write tests for kill logic with mocked child_process

## 4. IPC Layer

- [x] 4.1 Define IPC channels: scan-ports, kill-process, force-kill-process
- [x] 4.2 Implement ipcMain handlers for scan and kill operations
- [x] 4.3 Create typed ipcRenderer invoke wrappers for the renderer process

## 5. Main App UI

- [x] 5.1 Build main window layout with header, search bar, pinned ports section, and port table
- [x] 5.2 Implement port table with columns: port, protocol, process name, PID, user, address, state
- [x] 5.3 Add column sorting (click header to toggle ascending/descending)
- [x] 5.4 Add row actions: kill button and pin/unpin toggle per row
- [x] 5.5 Build empty state display when no ports are active
- [x] 5.6 Add kill confirmation dialog (with option to disable)

## 6. Search and Filtering

- [x] 6.1 Implement unified search bar that filters by port number, process name, and PID
- [x] 6.2 Add connection state filter dropdown (LISTEN, ESTABLISHED, etc.)
- [x] 6.3 Add clear filters action

## 7. Live Monitoring

- [x] 7.1 Implement manual refresh button that triggers a port scan via IPC
- [x] 7.2 Implement auto-refresh toggle with configurable interval (default 2s)
- [x] 7.3 Add loading indicator during active scans
- [x] 7.4 Persist auto-refresh preference in electron-store

## 8. Pinned Ports

- [x] 8.1 Implement pinned ports state with default pins (3000, 5173, 8000, 8080, 5432)
- [x] 8.2 Build pinned ports UI section showing status (in-use with process name vs. available)
- [x] 8.3 Implement pin/unpin actions from both pinned section and port table rows
- [x] 8.4 Persist pinned ports in electron-store

## 9. Menu Bar / System Tray

- [x] 9.1 Create Electron Tray with app icon
- [x] 9.2 Build tray context menu showing pinned ports with status and conflict highlighting
- [x] 9.3 Add kill action to tray menu items
- [x] 9.4 Add "Open Portview" menu item to show/focus main window
- [x] 9.5 Add "Quit" menu item
- [x] 9.6 Keep tray menu data in sync with latest port scan results

## 10. Window Management and Persistence

- [x] 10.1 Save and restore window size and position using electron-store
- [x] 10.2 Handle close-to-tray behavior (app keeps running when window is closed)
