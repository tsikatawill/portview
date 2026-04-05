import electron from "electron";
import { IPC_CHANNELS } from "../shared/ipc";
import type { AppTheme, KillResult, ScanResult } from "../shared/types";

const { contextBridge, ipcRenderer } = electron;

export interface AppSettings {
  pinnedPorts: number[];
  autoRefresh: boolean;
  refreshInterval: number;
  confirmBeforeKill: boolean;
  theme: AppTheme;
}

const api = {
  scanPorts: (): Promise<ScanResult> =>
    ipcRenderer.invoke(IPC_CHANNELS.SCAN_PORTS),
  killProcess: (pid: number): Promise<KillResult> =>
    ipcRenderer.invoke(IPC_CHANNELS.KILL_PROCESS, pid),
  forceKillProcess: (pid: number): Promise<KillResult> =>
    ipcRenderer.invoke(IPC_CHANNELS.FORCE_KILL_PROCESS, pid),
  getSettings: (): Promise<AppSettings> =>
    ipcRenderer.invoke(IPC_CHANNELS.GET_SETTINGS),
  setPinnedPorts: (ports: number[]): Promise<void> =>
    ipcRenderer.invoke(IPC_CHANNELS.SET_PINNED_PORTS, ports),
  setAutoRefresh: (enabled: boolean): Promise<void> =>
    ipcRenderer.invoke(IPC_CHANNELS.SET_AUTO_REFRESH, enabled),
  setRefreshInterval: (interval: number): Promise<void> =>
    ipcRenderer.invoke(IPC_CHANNELS.SET_REFRESH_INTERVAL, interval),
  setConfirmBeforeKill: (enabled: boolean): Promise<void> =>
    ipcRenderer.invoke(IPC_CHANNELS.SET_CONFIRM_BEFORE_KILL, enabled),
  setTheme: (theme: AppTheme): Promise<void> =>
    ipcRenderer.invoke(IPC_CHANNELS.SET_THEME, theme),
};

contextBridge.exposeInMainWorld("api", api);

export type PortviewAPI = typeof api;
