import { exec } from "child_process";
import { KillResult } from "../shared/types";

export function killProcess(pid: number): Promise<KillResult> {
  return new Promise((resolve) => {
    if (process.platform === "win32") {
      exec(`taskkill /PID ${pid}`, (error, _stdout, stderr) => {
        if (error) {
          resolve({ success: false, error: classifyError(stderr, pid) });
          return;
        }
        resolve({ success: true });
      });
    } else {
      try {
        process.kill(pid, "SIGTERM");
        resolve({ success: true });
      } catch (e) {
        resolve({
          success: false,
          error: classifyNodeError(e, pid),
        });
      }
    }
  });
}

export function forceKillProcess(pid: number): Promise<KillResult> {
  return new Promise((resolve) => {
    if (process.platform === "win32") {
      exec(`taskkill /PID ${pid} /F`, (error, _stdout, stderr) => {
        if (error) {
          resolve({ success: false, error: classifyError(stderr, pid) });
          return;
        }
        resolve({ success: true });
      });
    } else {
      try {
        process.kill(pid, "SIGKILL");
        resolve({ success: true });
      } catch (e) {
        resolve({
          success: false,
          error: classifyNodeError(e, pid),
        });
      }
    }
  });
}

function classifyNodeError(e: unknown, pid: number): string {
  if (e instanceof Error) {
    if ("code" in e) {
      const code = (e as NodeJS.ErrnoException).code;
      if (code === "EPERM") {
        return `Permission denied: cannot kill process ${pid}. Try running with elevated privileges.`;
      }
      if (code === "ESRCH") {
        return `Process ${pid} no longer exists.`;
      }
    }
    return e.message;
  }
  return String(e);
}

function classifyError(stderr: string, pid: number): string {
  const lower = stderr.toLowerCase();
  if (lower.includes("access is denied")) {
    return `Permission denied: cannot kill process ${pid}. Try running with elevated privileges.`;
  }
  if (lower.includes("not found")) {
    return `Process ${pid} no longer exists.`;
  }
  return stderr.trim() || `Failed to kill process ${pid}.`;
}
