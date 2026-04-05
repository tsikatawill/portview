import { useMemo } from "react";
import {
  getPortDescription,
  getProcessCategory,
} from "../../../shared/port-descriptions";
import { PortEntry } from "../../../shared/types";

export function useFilteredPorts(
  ports: PortEntry[],
  searchQuery: string,
  stateFilter: string,
  sortColumn: keyof PortEntry | null,
  sortDirection: "asc" | "desc",
) {
  return useMemo(() => {
    let filtered = ports;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (entry) =>
          String(entry.port).includes(q) ||
          entry.processName.toLowerCase().includes(q) ||
          String(entry.pid).includes(q) ||
          getPortDescription(entry.port, entry.processName).toLowerCase().includes(q) ||
          (getProcessCategory(entry.processName)?.label.toLowerCase().includes(q) ?? false),
      );
    }

    if (stateFilter) {
      filtered = filtered.filter(
        (entry) => entry.state.toUpperCase() === stateFilter.toUpperCase(),
      );
    }

    if (sortColumn) {
      filtered = [...filtered].sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];
        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
        }
        const aStr = String(aVal).toLowerCase();
        const bStr = String(bVal).toLowerCase();
        const cmp = aStr.localeCompare(bStr);
        return sortDirection === "asc" ? cmp : -cmp;
      });
    }

    return filtered;
  }, [ports, searchQuery, stateFilter, sortColumn, sortDirection]);
}
