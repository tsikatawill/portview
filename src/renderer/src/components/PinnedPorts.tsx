import { PinOff } from "lucide-react";
import { useMemo } from "react";
import { useApp } from "../context/AppContext";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export function PinnedPorts() {
  const { state, dispatch } = useApp();

  const pinnedWithStatus = useMemo(() => {
    return state.pinnedPorts.map((port) => {
      const activeEntry = state.ports.find((e) => e.port === port);
      return {
        port,
        inUse: !!activeEntry,
        processName: activeEntry?.processName,
        pid: activeEntry?.pid,
      };
    });
  }, [state.pinnedPorts, state.ports]);

  if (pinnedWithStatus.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {pinnedWithStatus.map(({ port, inUse, processName, pid }) => (
        <div
          key={port}
          className={`flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm ${
            inUse
              ? "border-destructive/50 bg-destructive/5"
              : "border-border bg-background"
          }`}
        >
          <span className="font-mono font-medium">{port}</span>
          {inUse ? (
            <Badge variant="destructive" className="text-xs">
              {processName} ({pid})
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-xs">
              available
            </Badge>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5"
            onClick={() => dispatch({ type: "TOGGLE_PIN", port })}
            title="Unpin"
          >
            <PinOff className="h-3 w-3" />
          </Button>
        </div>
      ))}
    </div>
  );
}
