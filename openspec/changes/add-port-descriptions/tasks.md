## 1. Lookup Module

- [x] 1.1 Create `src/shared/port-descriptions.ts` with `WELL_KNOWN_PORTS` record (22=SSH, 25=SMTP, 53=DNS, 80=HTTP, 443=HTTPS, 3000=Dev Server, 3306=MySQL, 5173=Vite, 5432=PostgreSQL, 6379=Redis, 8080=HTTP Alt, 8443=HTTPS Alt, 27017=MongoDB, and ~25 more common developer ports)
- [x] 1.2 Add `PROCESS_DESCRIPTIONS` record with lowercase prefix keys (firefox, chrome, safari, node, python, ruby, java, postgres, mysql, redis, mongo, nginx, apache, code, electron, docker, logid, and others)
- [x] 1.3 Implement and export `getPortDescription(port: number, processName: string): string` — port map first, then case-insensitive prefix match on process name, empty string fallback
- [x] 1.4 Write unit tests for `getPortDescription` covering: known port, unknown port + known process, prefix match, case-insensitive match, unknown port + unknown process (empty string)

## 2. Port Table

- [x] 2.1 In `src/renderer/src/components/PortTable.tsx`, import `getPortDescription` from `../../shared/port-descriptions`
- [x] 2.2 Add `<TableHead>Description</TableHead>` after the Process column header (non-sortable)
- [x] 2.3 Add `<TableCell className="text-muted-foreground text-sm max-w-[180px] truncate">{getPortDescription(entry.port, entry.processName)}</TableCell>` in each row after the process cell

## 3. Pinned Ports

- [x] 3.1 In `src/renderer/src/components/PinnedPorts.tsx`, import `getPortDescription`
- [x] 3.2 When a pin is `inUse`, compute `const desc = getPortDescription(port, entry.processName)` and render it as a `<span className="text-muted-foreground text-xs">` next to the process badge when non-empty

## 4. System Tray

- [x] 4.1 In `src/main/tray.ts`, import `getPortDescription` from `../shared/port-descriptions`
- [x] 4.2 Update the tray menu item label for active pinned ports: when description is available use `⚠ :${port} — ${desc} (PID ${pid})`, otherwise fall back to existing `⚠ :${port} ${processName} (PID ${pid})` format

## 5. Search

- [x] 5.1 In `src/renderer/src/hooks/useFilteredPorts.ts`, import `getPortDescription`
- [x] 5.2 Add `getPortDescription(entry.port, entry.processName).toLowerCase().includes(q)` to the existing filter condition
- [x] 5.3 In `src/renderer/src/components/SearchBar.tsx`, update placeholder to `"Search by port, process, description, or PID..."`

## 6. Verification

- [x] 6.1 Run `npm test` — all existing tests plus new description unit tests pass
- [ ] 6.2 Run `npm run dev` and confirm Description column appears with correct labels for known ports/processes
- [ ] 6.3 Pin port 5432, start PostgreSQL, verify description shows in pinned section
- [ ] 6.4 Type "PostgreSQL" in the search bar and verify matching entries appear
- [ ] 6.5 Check system tray menu shows descriptions for active pinned ports
