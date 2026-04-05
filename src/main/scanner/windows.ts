import { exec } from "child_process";
import { PortEntry } from "../../shared/types";

export function parseNetstatOutput(stdout: string): PortEntry[] {
  const lines = stdout.trim().split("\n");
  const entries: PortEntry[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // netstat -ano output format:
    //   Proto  Local Address          Foreign Address        State           PID
    //   TCP    0.0.0.0:135            0.0.0.0:0              LISTENING       1234
    //   UDP    0.0.0.0:5353           *:*                                    5678
    const parts = trimmed.split(/\s+/);
    if (parts.length < 4) continue;

    const proto = parts[0].toUpperCase();
    if (proto !== "TCP" && proto !== "UDP") continue;

    const localAddr = parts[1];
    const lastColon = localAddr.lastIndexOf(":");
    if (lastColon === -1) continue;

    const localAddress = localAddr.slice(0, lastColon);
    const port = parseInt(localAddr.slice(lastColon + 1), 10);
    if (isNaN(port)) continue;

    let state: string;
    let pid: number;

    if (proto === "UDP") {
      // UDP lines have no state column
      state = "";
      pid = parseInt(parts[parts.length - 1], 10);
    } else {
      state = parts[3] || "";
      pid = parseInt(parts[4] || parts[parts.length - 1], 10);
    }

    if (isNaN(pid)) continue;

    entries.push({
      port,
      protocol: proto as "TCP" | "UDP",
      processName: "unknown",
      pid,
      user: "unknown",
      localAddress,
      state,
    });
  }

  return entries;
}

export function scanWindows(): Promise<PortEntry[]> {
  return new Promise((resolve, reject) => {
    exec("netstat -ano", (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`netstat failed: ${stderr || error.message}`));
        return;
      }

      try {
        const entries = parseNetstatOutput(stdout);

        // Try to resolve process names via tasklist
        exec("tasklist /FO CSV /NH", (err, taskOutput) => {
          if (err || !taskOutput) {
            resolve(entries);
            return;
          }

          const pidToName = new Map<number, string>();
          for (const taskLine of taskOutput.trim().split("\n")) {
            const match = taskLine.match(/"([^"]+)","(\d+)"/);
            if (match) {
              pidToName.set(parseInt(match[2], 10), match[1]);
            }
          }

          for (const entry of entries) {
            const name = pidToName.get(entry.pid);
            if (name) entry.processName = name;
          }

          resolve(entries);
        });
      } catch (e) {
        reject(
          new Error(
            `Failed to parse netstat output: ${e instanceof Error ? e.message : String(e)}`,
          ),
        );
      }
    });
  });
}
