## Context

Portview displays active ports with process name, PID, protocol, and state. Users frequently see unfamiliar process names (e.g., `logid`, `rapportd`, `postgres`) and must mentally map them to their purpose. The feature adds a zero-configuration description layer resolved at display time from a static lookup table.

## Goals / Non-Goals

**Goals:**
- Surface human-readable descriptions for well-known ports and process names
- Make descriptions searchable in the existing filter
- Show descriptions in all three display surfaces: table, pinned ports, tray
- Keep the implementation purely in the shared layer with no runtime cost

**Non-Goals:**
- Dynamic or user-editable descriptions
- Network lookups or OS-level service queries
- Changes to `PortEntry`, IPC contracts, or storage
- Descriptions for every possible process — best-effort coverage of common developer tools

## Decisions

**Static lookup in `src/shared/`**
A plain TypeScript module with two `Record` objects (port number → description, lowercase process name prefix → description) and a single exported function. No class, no state, no dependency. Alternatives considered: storing descriptions in electron-store (adds persistence complexity for zero benefit), fetching from an external API (network dependency, latency, offline risk). Static lookup is instant, offline-safe, and trivially testable.

**Port lookup takes priority over process name**
Port numbers are more semantically precise than process names (port 5432 is always PostgreSQL; `postgres` could be a CLI tool or test harness). Fallback to process name handles ports outside the well-known range. Alternatives considered: process name first (rejected — process names are less reliable identifiers).

**Case-insensitive prefix match on process names**
Process names vary by OS and version (e.g., `Google Chrome Helper`, `chrome`, `Chrome`). A lowercase prefix match handles common variants without an exhaustive list. Alternatives considered: exact match (too brittle), regex (overkill).

**Display-time resolution only**
`getPortDescription` is called at render time, not stored in state. This keeps `PortEntry` unchanged and avoids stale descriptions if the lookup table is updated. The performance cost is negligible (two hash lookups per port entry per render).

## Risks / Trade-offs

- **Coverage gaps** → Users will see empty descriptions for unknown processes. This is acceptable — empty is better than wrong.
- **Prefix matching false positives** → A process named `nodeJS-legacy` would match `node`. Acceptable trade-off given the developer-tool audience.
- **Tray label length** → Longer labels may truncate on some OS tray menus. Mitigated by falling back to process name if no description exists.

## Migration Plan

No migration required. Pure addition — no existing data or behavior changes.

## Open Questions

None.
