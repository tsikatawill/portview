import { Loader2, RefreshCw } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Switch } from "./ui/switch";

export function RefreshControls() {
  const { state, dispatch, scanPorts } = useApp();

  return (
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        size="sm"
        onClick={scanPorts}
        disabled={state.isScanning}
      >
        {state.isScanning ? (
          <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
        ) : (
          <RefreshCw className="mr-1 h-3.5 w-3.5" />
        )}
        Refresh
      </Button>

      <div className="flex items-center gap-2">
        <Switch
          checked={state.autoRefresh}
          onCheckedChange={(checked) =>
            dispatch({ type: "SET_AUTO_REFRESH", enabled: checked })
          }
          id="auto-refresh"
        />
        <label htmlFor="auto-refresh" className="text-sm">
          Auto
        </label>
      </div>

      {state.autoRefresh && (
        <Select
          value={String(state.refreshInterval)}
          onValueChange={(v) =>
            dispatch({ type: "SET_REFRESH_INTERVAL", interval: parseInt(v) })
          }
        >
          <SelectTrigger className="w-[90px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1000">1s</SelectItem>
            <SelectItem value="2000">2s</SelectItem>
            <SelectItem value="5000">5s</SelectItem>
            <SelectItem value="10000">10s</SelectItem>
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
