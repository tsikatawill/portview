## ADDED Requirements

### Requirement: Kill process by PID
The system SHALL terminate a process given its PID using a standard kill signal (SIGTERM on macOS, taskkill on Windows).

#### Scenario: Successful standard kill
- **WHEN** the user requests to kill a process and the process responds to SIGTERM
- **THEN** the process is terminated and the port entry is removed on the next scan

#### Scenario: Process does not terminate with standard kill
- **WHEN** the user requests a standard kill and the process does not terminate within a reasonable timeout
- **THEN** the system SHALL inform the user that the process did not respond and offer force kill

### Requirement: Force kill process
The system SHALL support force-killing a process (SIGKILL on macOS, taskkill /F on Windows).

#### Scenario: Successful force kill
- **WHEN** the user requests a force kill
- **THEN** the process is immediately terminated regardless of its state

### Requirement: Kill confirmation
The system SHALL optionally prompt the user for confirmation before terminating a process.

#### Scenario: Confirmation enabled
- **WHEN** the user clicks kill and confirmation is enabled
- **THEN** a confirmation dialog appears showing the process name, PID, and port before proceeding

#### Scenario: Confirmation disabled
- **WHEN** the user clicks kill and confirmation is disabled
- **THEN** the kill action executes immediately without a dialog

### Requirement: Handle permission errors on kill
The system SHALL handle cases where the user lacks permission to kill a process.

#### Scenario: Permission denied
- **WHEN** the kill command fails due to insufficient permissions
- **THEN** the system SHALL display a clear error message indicating permission was denied and SHALL NOT auto-escalate to elevated privileges

### Requirement: Handle non-existent process
The system SHALL handle cases where the target process no longer exists at kill time.

#### Scenario: Process already exited
- **WHEN** the user requests to kill a process that has already exited
- **THEN** the system SHALL inform the user that the process no longer exists and refresh the port list
