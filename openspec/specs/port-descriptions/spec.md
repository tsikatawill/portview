## ADDED Requirements

### Requirement: Description lookup by port number
The system SHALL resolve a human-readable description for a port entry by checking a static map of well-known port numbers first. The map SHALL include at minimum: 22 (SSH), 25 (SMTP), 53 (DNS), 80 (HTTP), 443 (HTTPS), 3000 (Dev Server), 3306 (MySQL), 5173 (Vite), 5432 (PostgreSQL), 6379 (Redis), 8080 (HTTP Alt), 8443 (HTTPS Alt), 27017 (MongoDB).

#### Scenario: Known port number
- **WHEN** `getPortDescription` is called with a port number present in the well-known ports map
- **THEN** the function SHALL return the corresponding description string

#### Scenario: Unknown port number with known process
- **WHEN** `getPortDescription` is called with an unknown port number but a process name matching a known prefix
- **THEN** the function SHALL return the process-based description

#### Scenario: Unknown port and unknown process
- **WHEN** `getPortDescription` is called with a port number and process name not in any map
- **THEN** the function SHALL return an empty string

### Requirement: Description lookup by process name
The system SHALL fall back to a static map of process name prefixes when no port-based description is found. The lookup SHALL be case-insensitive. The map SHALL include at minimum: firefox, chrome, safari, node, python, ruby, java, postgres, mysql, redis, mongo, nginx, apache, code (VS Code), electron, docker, logid (Logitech Daemon).

#### Scenario: Process name exact match
- **WHEN** `getPortDescription` is called with a process name that exactly matches a key in the process map (case-insensitive)
- **THEN** the function SHALL return the corresponding description

#### Scenario: Process name prefix match
- **WHEN** `getPortDescription` is called with a process name that starts with a known prefix (e.g., `Google Chrome Helper` matching `google chrome`)
- **THEN** the function SHALL return the corresponding description

### Requirement: Description column in port table
The port table SHALL display a "Description" column after the "Process" column showing the resolved description for each port entry. Entries with no description SHALL display an empty cell.

#### Scenario: Known port shown in table
- **WHEN** the port table renders an entry for port 5432
- **THEN** the Description cell SHALL display "PostgreSQL"

#### Scenario: Unknown port shown in table
- **WHEN** the port table renders an entry with no matching description
- **THEN** the Description cell SHALL be empty

### Requirement: Description shown in pinned ports
When a pinned port is in use, the system SHALL display its description (if available) as a secondary label alongside the process badge.

#### Scenario: In-use pinned port with known description
- **WHEN** a pinned port is active and has a resolvable description
- **THEN** the description SHALL appear as a muted secondary label next to the process badge

#### Scenario: In-use pinned port with no description
- **WHEN** a pinned port is active and has no resolvable description
- **THEN** no secondary label SHALL appear

### Requirement: Description shown in system tray
Tray menu items for active pinned ports SHALL include the description in the label when one is available.

#### Scenario: Tray label with description
- **WHEN** a pinned port is active and has a resolvable description
- **THEN** the tray menu item label SHALL include the description (e.g., `⚠ :5432 — PostgreSQL (PID 1234)`)

#### Scenario: Tray label without description
- **WHEN** a pinned port is active and has no resolvable description
- **THEN** the tray menu item label SHALL fall back to the process name

### Requirement: Descriptions are searchable
The search filter SHALL match port entries whose description contains the search query.

#### Scenario: Search by description term
- **WHEN** the user types "PostgreSQL" in the search bar
- **THEN** all port entries whose description contains "postgresql" (case-insensitive) SHALL be included in results

#### Scenario: Search placeholder reflects description
- **WHEN** the search bar is rendered
- **THEN** the placeholder text SHALL indicate that description is a searchable field
