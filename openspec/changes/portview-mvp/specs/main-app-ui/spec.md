## ADDED Requirements

### Requirement: Port table view
The main window SHALL display a table of all active ports with columns for: port number, protocol, process name, PID, user, local address, and state.

#### Scenario: Table with active ports
- **WHEN** ports are active on the system
- **THEN** the table displays one row per port entry with all columns populated

#### Scenario: Empty state
- **WHEN** no ports are active
- **THEN** the table displays an empty state message (e.g., "No active ports detected")

### Requirement: Sort by column
The system SHALL allow users to sort the port table by clicking column headers.

#### Scenario: Sort by port number
- **WHEN** the user clicks the "Port" column header
- **THEN** the table sorts by port number (ascending, then descending on subsequent clicks)

### Requirement: Row actions
Each row in the port table SHALL provide action buttons for killing the process and pinning the port.

#### Scenario: Kill button on row
- **WHEN** a port entry row is displayed
- **THEN** a kill button is available on that row

#### Scenario: Pin button on row
- **WHEN** a port entry row is displayed
- **THEN** a pin/unpin toggle is available on that row

### Requirement: Pinned ports section
The main window SHALL display a dedicated section showing pinned ports with their current status (in-use or available).

#### Scenario: Pinned section visible
- **WHEN** the user has pinned ports configured
- **THEN** a pinned ports section is visible above or alongside the main table

### Requirement: Search bar
The main window SHALL include a search bar for filtering the port list.

#### Scenario: Search bar present
- **WHEN** the main window is open
- **THEN** a search input field is visible and functional for filtering

### Requirement: Refresh controls
The main window SHALL include a manual refresh button and an auto-refresh toggle with interval configuration.

#### Scenario: Refresh controls visible
- **WHEN** the main window is open
- **THEN** a refresh button, auto-refresh toggle, and interval selector are visible

### Requirement: Window management
The app SHALL remember window size and position across restarts.

#### Scenario: Window state persistence
- **WHEN** the user resizes or moves the window and restarts the app
- **THEN** the window opens at the same size and position
