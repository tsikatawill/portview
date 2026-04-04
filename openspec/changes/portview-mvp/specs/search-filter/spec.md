## ADDED Requirements

### Requirement: Filter by port number
The system SHALL allow users to filter the port list by port number (exact or partial match).

#### Scenario: Exact port match
- **WHEN** the user enters "3000" in the search field
- **THEN** only entries with port number 3000 are displayed

#### Scenario: Partial port match
- **WHEN** the user enters "80" in the search field
- **THEN** entries with ports containing "80" (80, 8080, 8000, 3080, etc.) are displayed

### Requirement: Filter by process name
The system SHALL allow users to filter the port list by process name (case-insensitive substring match).

#### Scenario: Process name filter
- **WHEN** the user enters "node" in the search field
- **THEN** entries where the process name contains "node" (case-insensitive) are displayed

### Requirement: Filter by PID
The system SHALL allow users to filter the port list by PID.

#### Scenario: PID filter
- **WHEN** the user enters a PID value in the search field
- **THEN** entries matching that PID are displayed

### Requirement: Filter by connection state
The system SHALL allow users to filter by connection state (e.g., LISTEN, ESTABLISHED).

#### Scenario: State filter
- **WHEN** the user selects a connection state filter
- **THEN** only entries with that connection state are displayed

### Requirement: Combined search
The search field SHALL match across port number, process name, and PID simultaneously.

#### Scenario: Unified search
- **WHEN** the user types a query in the search field
- **THEN** results include entries where the query matches port number, process name, OR PID

### Requirement: Clear filters
The system SHALL provide a way to clear all active filters and show the full port list.

#### Scenario: Clear all filters
- **WHEN** the user clears the search/filter
- **THEN** all port entries are displayed without filtering
