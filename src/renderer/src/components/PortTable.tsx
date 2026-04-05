import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Pin,
  PinOff,
  Skull,
} from "lucide-react";
import { getPortDescription } from "../../../shared/port-descriptions";
import { PortEntry } from "../../../shared/types";
import { useApp } from "../context/AppContext";
import { useFilteredPorts } from "../hooks/useFilteredPorts";
import { getPortStateMeta } from "../lib/port-state";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

interface PortTableProps {
  onKillRequest: (entry: PortEntry) => void;
}

const COLUMNS: { key: keyof PortEntry; label: string }[] = [
  { key: "port", label: "Port" },
  { key: "protocol", label: "Protocol" },
  { key: "processName", label: "Process" },
  { key: "pid", label: "PID" },
  { key: "user", label: "User" },
  { key: "localAddress", label: "Address" },
  { key: "state", label: "State" },
];

export function PortTable({ onKillRequest }: PortTableProps) {
  const { state, dispatch } = useApp();
  const filteredPorts = useFilteredPorts(
    state.ports,
    state.searchQuery,
    state.stateFilter,
    state.sortColumn,
    state.sortDirection,
  );

  function getSortIcon(column: keyof PortEntry) {
    if (state.sortColumn !== column) return <ArrowUpDown className="h-3 w-3" />;
    return state.sortDirection === "asc" ? (
      <ArrowUp className="h-3 w-3" />
    ) : (
      <ArrowDown className="h-3 w-3" />
    );
  }

  if (filteredPorts.length === 0) {
    return (
      <div className="text-muted-foreground flex flex-col items-center justify-center py-16">
        <p className="text-lg font-medium">No active ports detected</p>
        <p className="text-sm">
          {state.searchQuery || state.stateFilter
            ? "Try adjusting your search or filters"
            : "No processes are currently bound to any ports"}
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {COLUMNS.map((col) => (
            <TableHead
              key={col.key}
              className="cursor-pointer select-none"
              onClick={() => dispatch({ type: "SET_SORT", column: col.key })}
            >
              <div className="flex items-center gap-1">
                {col.label}
                {getSortIcon(col.key)}
              </div>
            </TableHead>
          ))}
          <TableHead>Description</TableHead>
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredPorts.map((entry, idx) => {
          const isPinned = state.pinnedPorts.includes(entry.port);
          const stateMeta = entry.state ? getPortStateMeta(entry.state) : null;
          return (
            <TableRow key={`${entry.pid}-${entry.port}-${idx}`}>
              <TableCell className="font-mono font-medium">
                {entry.port}
              </TableCell>
              <TableCell>
                <Badge variant="outline">{entry.protocol}</Badge>
              </TableCell>
              <TableCell className="max-w-[150px] truncate">
                {entry.processName}
              </TableCell>
              <TableCell className="font-mono">{entry.pid}</TableCell>
              <TableCell>{entry.user}</TableCell>
              <TableCell className="font-mono text-sm">
                {entry.localAddress}
              </TableCell>
              <TableCell>
                {stateMeta && (
                  <Badge variant={stateMeta.variant}>{stateMeta.label}</Badge>
                )}
              </TableCell>
              <TableCell className="text-muted-foreground max-w-[180px] truncate text-sm">
                {getPortDescription(entry.port, entry.processName)}
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() =>
                      dispatch({ type: "TOGGLE_PIN", port: entry.port })
                    }
                    title={isPinned ? "Unpin port" : "Pin port"}
                  >
                    {isPinned ? (
                      <PinOff className="h-3.5 w-3.5" />
                    ) : (
                      <Pin className="h-3.5 w-3.5" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive h-7 w-7"
                    onClick={() => onKillRequest(entry)}
                    title="Kill process"
                  >
                    <Skull className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
