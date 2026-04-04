## ADDED Requirements

### Requirement: System tray icon
The system SHALL display an icon in the macOS menu bar or Windows system tray when the app is running.

#### Scenario: Tray icon visible
- **WHEN** the Portview app is running
- **THEN** a tray icon is visible in the system menu bar / notification area

### Requirement: Tray click shows port summary
The system SHALL show a compact list of active ports when the user clicks the tray icon.

#### Scenario: Click tray icon
- **WHEN** the user clicks the tray icon
- **THEN** a dropdown/popup displays pinned ports and any detected port conflicts with process names

### Requirement: Kill from tray
The system SHALL allow users to terminate a process directly from the tray menu.

#### Scenario: Kill from tray menu
- **WHEN** the user selects "Kill" on a port entry in the tray menu
- **THEN** the associated process is terminated (following the same kill logic as the main app)

### Requirement: Open main app from tray
The system SHALL allow users to open the full Portview window from the tray menu.

#### Scenario: Open main window
- **WHEN** the user selects "Open Portview" from the tray menu
- **THEN** the main application window is shown and focused

### Requirement: Tray data stays current
The tray menu SHALL reflect the latest port scan data.

#### Scenario: Data freshness
- **WHEN** the tray menu is opened
- **THEN** it displays data from the most recent port scan (triggered by auto-refresh or manual refresh)

### Requirement: Quit from tray
The system SHALL allow users to quit the application from the tray menu.

#### Scenario: Quit app
- **WHEN** the user selects "Quit" from the tray menu
- **THEN** the application exits completely
