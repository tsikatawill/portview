export type AppTheme = "system" | "light" | "dark";

export interface PortEntry {
  port: number;
  protocol: "TCP" | "UDP";
  processName: string;
  pid: number;
  user: string;
  localAddress: string;
  state: string;
}

export interface KillResult {
  success: boolean;
  error?: string;
}

export interface ScanResult {
  success: boolean;
  entries: PortEntry[];
  error?: string;
}
