## ADDED Requirements

### Requirement: Pin a port
The system SHALL allow users to pin specific ports as favorites.

#### Scenario: Pin a port
- **WHEN** the user pins port 3000
- **THEN** port 3000 appears in the pinned ports section and persists across app restarts

### Requirement: Unpin a port
The system SHALL allow users to remove a port from their pinned list.

#### Scenario: Unpin a port
- **WHEN** the user unpins port 3000
- **THEN** port 3000 is removed from the pinned section

### Requirement: Default pinned ports
The system SHALL ship with a default set of commonly used development ports pre-pinned (3000, 5173, 8000, 8080, 5432).

#### Scenario: First launch defaults
- **WHEN** the user launches Portview for the first time
- **THEN** ports 3000, 5173, 8000, 8080, and 5432 are pre-pinned

### Requirement: Conflict detection on pinned ports
The system SHALL highlight pinned ports that are currently occupied by a process.

#### Scenario: Pinned port occupied
- **WHEN** a pinned port (e.g., 3000) has an active process bound to it
- **THEN** the pinned port entry is visually highlighted as "in use" with the process name shown

#### Scenario: Pinned port free
- **WHEN** a pinned port has no active process
- **THEN** the pinned port entry is shown as "available" without highlighting

### Requirement: Persist pinned ports
Pinned ports SHALL persist across application restarts.

#### Scenario: Restart persistence
- **WHEN** the user restarts the application
- **THEN** all previously pinned ports are still pinned
