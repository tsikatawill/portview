import { ScanResult } from "../../shared/types";
import { scanMacOS } from "./macos";
import { scanWindows } from "./windows";

export async function scanPorts(): Promise<ScanResult> {
  try {
    const entries =
      process.platform === "win32" ? await scanWindows() : await scanMacOS();

    return { success: true, entries };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("Port scan failed:", message);
    return { success: false, entries: [], error: message };
  }
}
