# Proposal: Portview

## Summary

Portview is an Electron desktop app that helps developers see which processes are using local machine ports and lets them terminate those processes from a graphical interface. It is designed to reduce friction when dealing with port conflicts during local development, debugging, and testing.

The app should provide a fast, simple alternative to terminal commands like `lsof`, `netstat`, and `kill`, while still exposing enough detail for power users.

---

## Problem

Developers frequently run into port conflicts caused by local servers, background processes, containers, or orphaned tasks that continue listening on ports after a crash or restart. Resolving these issues usually requires terminal commands that are not always fast, memorable, or user-friendly.

Common pain points:

- Not knowing what process is occupying a port
- Needing to inspect PID, process name, and protocol manually
- Repeatedly using terminal commands to free ports
- Friction when switching between multiple projects and dev servers

---

## Proposed Solution

Build Portview as a desktop utility that continuously scans local machine ports, identifies the processes bound to them, and allows users to terminate those processes directly from the UI.

Portview should have:

- A main desktop app for full visibility and management
- A lightweight quick-access surface for fast inspection and termination without opening the full app. Both MAc and Windows

---

## Core User Value

Portview gives developers:

- Immediate visibility into active local ports
- Clear identification of what is running on each port
- One-click process termination
- Faster recovery from port conflicts
- A smoother local development workflow

---

## Target Users

Primary users:

- Software engineers
- Frontend/backend developers
- DevOps engineers
- QA engineers
- Technical power users working with local servers

Secondary users:

- Students learning local development workflows
- Designers or PMs running local preview environments

---

## Core Features

### 1. Active Port Discovery

Display all currently active local ports and update the list in near real time.

### 2. Process Identification

For each port, show:

- Port number
- Protocol
- Process name
- PID
- User
- Local address / binding info
- Connection state where available (for example: LISTENING, ESTABLISHED)

### 3. Kill Process

Allow the user to terminate the process using a selected port.

Include:

- Standard kill
- Force kill option
- Optional confirmation before termination

### 4. Search and Filtering

Allow users to quickly filter by:

- Port number
- Process name
- PID
- Status / state

### 5. Refresh / Live Monitoring

Support manual refresh and optional auto-refresh.

---

## Recommended Additional Features

### Pinned / Favorite Ports

Let users pin common development ports such as 3000, 5173, 8000, 8080, and 5432.

### Conflict Detection

Highlight common developer ports that are occupied and likely to cause startup failures.

### Smart Suggestions

Example:

- "Port 3000 is occupied by node (PID 1234). Kill it?"

### Kill History / Audit Trail

Track recently terminated processes for visibility and recovery context.

### Auto-Kill Rules

User-defined rules such as:

- Always prompt before killing database processes
- Auto-kill specific known dev servers on selected ports

### Notifications

Surface a lightweight alert when tracked ports become occupied or freed.

### CLI Companion

Optional CLI for scripting:

- `portview list`
- `portview kill 3000`

### Docker Awareness

Identify when a port belongs to a containerized service and optionally surface container metadata.

### Restart Action

For supported processes, allow a kill-and-restart workflow.

---

## macOS Quick Access / Widget Concept

A full native macOS home-style widget is likely not the best primary approach for an Electron app. The more practical solution is a **menu bar app**.

### Recommended Approach

Implement a macOS menu bar companion using Electron's tray support.

This would let users:

- See a compact list of active or pinned ports
- Preview the process using each port
- Kill a process directly from the menu bar
- Open the full Portview app only when deeper inspection is needed

---

## UX Surfaces

### Main App

A full desktop interface for:

- Viewing all active ports
- Inspecting process metadata
- Filtering and sorting
- Managing termination actions
- Viewing history and rules

### Menu Bar / Tray Surface

A compact quick-action interface for:

- Viewing pinned or recently used ports
- Seeing active conflicts
- Killing processes immediately
- Launching the main app

---

## Functional Requirements

- Detect active ports on the local machine
- Resolve each port to its owning process where OS permissions allow
- Support terminating a selected process
- Refresh results manually and optionally automatically
- Provide a compact quick-access mode from the macOS menu bar
- Handle insufficient permissions gracefully
- Clearly indicate destructive actions before execution when configured

---

## Non-Functional Requirements

- Fast startup
- Low idle resource usage
- Clear and minimal UI
- Reliable port/process detection
- Safe handling of kill actions
- Good support for common local development workflows

---

## Risks / Constraints

- Process and port detection vary by OS
- Some kill actions may require elevated permissions
- Electron can support tray/menu bar behavior, but native macOS widgets require separate native implementation
- Overly aggressive auto-kill behavior could be risky without safeguards

---

## Success Criteria

Portview is successful if users can:

- Identify what is running on a blocked port within seconds
- Kill the responsible process without using terminal commands
- Resolve common local port conflicts faster than with CLI tools alone
- Access common quick actions from the macOS menu bar without opening the full app

---

## Differentiation

Portview should aim to be better than raw terminal usage by focusing on:

- Speed
- Clarity
- Quick actions
- Smart suggestions
- Workflow-friendly UX for developers

---

---

## Recommended MVP

Phase 1 MVP:

- Detect active ports
- Show process name, PID, protocol, and status
- Search/filter ports
- Kill process
- Manual refresh + optional auto-refresh
- macOS menu bar quick-access view for pinned/conflicting ports

This delivers the core value quickly and leaves room for automation, Docker awareness, and advanced workflow features later.
