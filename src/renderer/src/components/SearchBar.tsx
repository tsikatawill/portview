import { Search, X } from "lucide-react";
import { useMemo } from "react";
import { useApp } from "../context/AppContext";
import { getPortStateMeta } from "../lib/port-state";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export function SearchBar() {
  const { state, dispatch } = useApp();

  const availableStates = useMemo(() => {
    const states = new Set(
      state.ports.map((e) => e.state.toUpperCase()).filter(Boolean),
    );
    return Array.from(states).sort();
  }, [state.ports]);

  const hasFilters = state.searchQuery || state.stateFilter;

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
        <Input
          placeholder="Search by port, process, description, or PID..."
          className="pl-9"
          value={state.searchQuery}
          onChange={(e) =>
            dispatch({ type: "SET_SEARCH_QUERY", query: e.target.value })
          }
        />
      </div>

      <Select
        value={state.stateFilter}
        onValueChange={(v) =>
          dispatch({ type: "SET_STATE_FILTER", filter: v === "all" ? "" : v })
        }
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="All states" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All states</SelectItem>
          {availableStates.map((s) => (
            <SelectItem key={s} value={s}>
              {getPortStateMeta(s).label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            dispatch({ type: "SET_SEARCH_QUERY", query: "" });
            dispatch({ type: "SET_STATE_FILTER", filter: "" });
          }}
          title="Clear filters"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
