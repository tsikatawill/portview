import { contextBridge, ipcRenderer } from "electron";
import { IPC_CHANNELS } from "../shared/ipc";
import type {
  AppTheme,
  KillResult,
  ScanResult,
  UpdateStatus,
} from "../shared/types";

export interface AppSettings {
  pinnedPorts: number[];
  autoRefresh: boolean;
  refreshInterval: number;
  confirmBeforeKill: boolean;
  theme: AppTheme;
}

export interface AppInfo {
  version: string;
  isPackaged: boolean;
  releasesUrl: string;
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
  getAppInfo: (): Promise<AppInfo> =>
    ipcRenderer.invoke(IPC_CHANNELS.GET_APP_INFO),
  getUpdateStatus: (): Promise<UpdateStatus> =>
    ipcRenderer.invoke(IPC_CHANNELS.GET_UPDATE_STATUS),
  checkForUpdates: (): Promise<UpdateStatus> =>
    ipcRenderer.invoke(IPC_CHANNELS.CHECK_FOR_UPDATES),
  installUpdateAndRestart: (): Promise<void> =>
    ipcRenderer.invoke(IPC_CHANNELS.INSTALL_UPDATE_AND_RESTART),
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
  onUpdateStatusChange: (listener: (status: UpdateStatus) => void) => {
    const wrapped = (
      _event: Electron.IpcRendererEvent,
      status: UpdateStatus,
    ) => {
      listener(status);
    };
    ipcRenderer.on(IPC_CHANNELS.UPDATE_STATUS_CHANGED, wrapped);
    return () => {
      ipcRenderer.removeListener(IPC_CHANNELS.UPDATE_STATUS_CHANGED, wrapped);
    };
  },
};

contextBridge.exposeInMainWorld("api", api);

export type PortviewAPI = typeof api;
