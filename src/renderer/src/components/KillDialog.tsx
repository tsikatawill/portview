import { AlertTriangle } from "lucide-react";
import { useMemo, useState } from "react";
import { getProcessCategory } from "../../../shared/port-descriptions";
import { PortEntry } from "../../../shared/types";
import { useApp } from "../context/AppContext";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

interface KillDialogProps {
  entry: PortEntry | null;
  open: boolean;
  onClose: () => void;
}

export function KillDialog({ entry, open, onClose }: KillDialogProps) {
  const { killPort, forceKillPort, scanPorts } = useApp();
  const [killing, setKilling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleKill(force: boolean) {
    if (!entry) return;
    setKilling(true);
    setError(null);

    const result = force
      ? await forceKillPort(entry.pid)
      : await killPort(entry.pid);

    if (result.success) {
      onClose();
      scanPorts();
    } else {
      setError(result.error || "Failed to kill process");
    }
    setKilling(false);
  }

  const isSystem = useMemo(
    () => entry && getProcessCategory(entry.processName)?.label === "System",
    [entry],
  );

  if (!entry) return null;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Kill Process</DialogTitle>
          <DialogDescription>
            Terminate <strong>{entry.processName}</strong> (PID {entry.pid}) on
            port {entry.port}?
          </DialogDescription>
        </DialogHeader>

        {isSystem && (
          <div className="flex items-start gap-2 rounded-md border border-amber-500/50 bg-amber-500/10 p-3 text-sm text-amber-600 dark:text-amber-300">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              This is a <strong>system process</strong>. Killing it may cause
              instability or break core OS functionality. Proceed with caution.
            </span>
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 text-destructive rounded-md p-3 text-sm">
            {error}
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={killing}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => handleKill(false)}
            disabled={killing}
          >
            {killing ? "Killing..." : "Kill"}
          </Button>
          <Button
            variant="destructive"
            onClick={() => handleKill(true)}
            disabled={killing}
          >
            Force Kill
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
