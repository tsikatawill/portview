## ADDED Requirements

### Requirement: Scan active local ports
The system SHALL scan all active TCP and UDP ports on the local machine and return a list of port entries.

#### Scenario: Successful port scan on macOS
- **WHEN** the app initiates a port scan on macOS
- **THEN** the system executes `lsof -iTCP -iUDP -nP` and parses the output into structured port entries

#### Scenario: Successful port scan on Windows
- **WHEN** the app initiates a port scan on Windows
- **THEN** the system executes the appropriate Windows command and parses the output into structured port entries

#### Scenario: No active ports
- **WHEN** no processes are bound to any ports
- **THEN** the system returns an empty list

### Requirement: Resolve process metadata per port
For each active port, the system SHALL resolve and return: port number, protocol (TCP/UDP), process name, PID, user, local address, and connection state (e.g., LISTEN, ESTABLISHED).

#### Scenario: Full metadata available
- **WHEN** a port is bound by a process with full OS visibility
- **THEN** the entry SHALL include port number, protocol, process name, PID, user, local address, and connection state

#### Scenario: Partial metadata due to permissions
- **WHEN** the OS restricts access to process details (e.g., another user's process)
- **THEN** the entry SHALL include available fields and mark restricted fields as "unknown"

### Requirement: Unified data model across platforms
The system SHALL normalize port scan results from different OS commands into a single unified data structure regardless of platform.

#### Scenario: Cross-platform consistency
- **WHEN** port data is returned from macOS or Windows scanning
- **THEN** the data model SHALL use the same fields and types on both platforms

### Requirement: Handle scan errors gracefully
The system SHALL handle errors during port scanning without crashing.

#### Scenario: Command execution failure
- **WHEN** the OS command fails to execute (e.g., command not found, timeout)
- **THEN** the system SHALL return an error state with a descriptive message and no port data

#### Scenario: Parse failure on unexpected output
- **WHEN** the OS command output cannot be parsed
- **THEN** the system SHALL log the raw output, return an error state, and not display corrupt data
