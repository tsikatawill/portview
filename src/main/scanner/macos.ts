import { execFile } from "child_process";
import { PortEntry } from "../../shared/types";

export function parseLsofOutput(stdout: string): PortEntry[] {
  const lines = stdout.trim().split("\n");
  const entries: PortEntry[] = [];

  // Skip header line
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    // lsof -iTCP -iUDP -nP output columns:
    // COMMAND  PID  USER  FD  TYPE  DEVICE  SIZE/OFF  NODE  NAME
    const parts = line.trim().split(/\s+/);
    if (parts.length < 9) continue;

    const processName = parts[0];
    const pid = parseInt(parts[1], 10);
    const user = parts[2];
    const protocol = parts[7] as "TCP" | "UDP";
    // NAME and optional (STATE) may be separate tokens
    const remaining = parts.slice(8).join(" ");

    if (protocol !== "TCP" && protocol !== "UDP") continue;
    if (isNaN(pid)) continue;

    // Remaining format: "host:port (STATE)" or "host:port->remote:port (STATE)" or just "host:port"
    const stateMatch = remaining.match(/\((\w+)\)$/);
    const state = stateMatch ? stateMatch[1] : "";
    const addressPart = stateMatch
      ? remaining.slice(0, remaining.lastIndexOf("(")).trim()
      : remaining;

    // Extract local address (before any ->)
    const localPart = addressPart.split("->")[0];
    const lastColon = localPart.lastIndexOf(":");
    if (lastColon === -1) continue;

    const localAddress = localPart.slice(0, lastColon);
    const port = parseInt(localPart.slice(lastColon + 1), 10);

    if (isNaN(port)) continue;

    entries.push({
      port,
      protocol,
      processName,
      pid,
      user,
      localAddress,
      state,
    });
  }

  return entries;
}

export function scanMacOS(): Promise<PortEntry[]> {
  return new Promise((resolve, reject) => {
    execFile("lsof", ["-iTCP", "-iUDP", "-nP"], (error, stdout, stderr) => {
      if (error) {
        // lsof returns exit code 1 if no results, which is fine
        if (error.code === 1 && !stderr) {
          resolve([]);
          return;
        }
        reject(new Error(`lsof failed: ${stderr || error.message}`));
        return;
      }

      try {
        resolve(parseLsofOutput(stdout));
      } catch (e) {
        reject(
          new Error(
            `Failed to parse lsof output: ${e instanceof Error ? e.message : String(e)}`,
          ),
        );
      }
    });
  });
}
