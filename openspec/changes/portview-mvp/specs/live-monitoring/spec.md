## ADDED Requirements

### Requirement: Manual refresh
The system SHALL allow users to manually trigger a port scan refresh.

#### Scenario: Manual refresh
- **WHEN** the user clicks the refresh button
- **THEN** the system performs a new port scan and updates the displayed list

### Requirement: Auto-refresh mode
The system SHALL support an auto-refresh mode that periodically re-scans ports at a configurable interval.

#### Scenario: Enable auto-refresh
- **WHEN** the user enables auto-refresh
- **THEN** the system scans ports at the configured interval (default: 2 seconds) and updates the display

#### Scenario: Disable auto-refresh
- **WHEN** the user disables auto-refresh
- **THEN** periodic scanning stops and the display remains static until manually refreshed

### Requirement: Configurable refresh interval
The system SHALL allow users to configure the auto-refresh interval.

#### Scenario: Change refresh interval
- **WHEN** the user changes the refresh interval to 5 seconds
- **THEN** auto-refresh scans occur every 5 seconds

### Requirement: Visual refresh indicator
The system SHALL indicate when a scan is in progress.

#### Scenario: Scan in progress
- **WHEN** a port scan is running (manual or auto)
- **THEN** a loading indicator is visible to the user

#### Scenario: Scan complete
- **WHEN** the scan finishes
- **THEN** the loading indicator is removed and the data is updated
