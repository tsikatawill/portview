import { useState } from "react";
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
