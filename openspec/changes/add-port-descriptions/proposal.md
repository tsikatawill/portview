## Why

Users see port entries for processes like Firefox, PostgreSQL, or Logitech and have no context for what those ports are doing. Auto-generated descriptions based on well-known port numbers and process names reduce the cognitive load of identifying what's running — no user input required.

## What Changes

- A new pure lookup module `src/shared/port-descriptions.ts` maps well-known port numbers (~40) and process names to human-readable descriptions
- The port table gains a "Description" column showing the resolved label for each entry
- Pinned ports show the description when in use
- System tray labels include the description when available
- Search is extended to match against descriptions in addition to port, process, and PID
- Search bar placeholder updated to reflect the new searchable field

## Capabilities

### New Capabilities
- `port-descriptions`: Lookup and display of human-readable descriptions for ports and processes across the table, pinned ports, tray, and search

### Modified Capabilities

## Impact

- `src/shared/port-descriptions.ts` — new file
- `src/renderer/src/components/PortTable.tsx` — new column
- `src/renderer/src/components/PinnedPorts.tsx` — description label on in-use pins
- `src/main/tray.ts` — richer tray menu labels
- `src/renderer/src/hooks/useFilteredPorts.ts` — description included in search
- `src/renderer/src/components/SearchBar.tsx` — placeholder text update
- No changes to `PortEntry` type, scanners, IPC, or storage
