export const IPC_CHANNELS = {
  SCAN_PORTS: "scan-ports",
  KILL_PROCESS: "kill-process",
  FORCE_KILL_PROCESS: "force-kill-process",
  GET_SETTINGS: "get-settings",
  SET_PINNED_PORTS: "set-pinned-ports",
  SET_AUTO_REFRESH: "set-auto-refresh",
  SET_REFRESH_INTERVAL: "set-refresh-interval",
  SET_CONFIRM_BEFORE_KILL: "set-confirm-before-kill",
  SET_THEME: "set-theme",
} as const;
