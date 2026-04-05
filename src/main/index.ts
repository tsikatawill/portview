import {
  app,
  BrowserWindow,
  type BrowserWindow as ElectronBrowserWindow,
  type Event as ElectronEvent,
  type HandlerDetails,
  ipcMain,
  nativeImage,
  shell,
} from "electron";
import { join } from "path";
import { IPC_CHANNELS } from "../shared/ipc";
import type { AppTheme } from "../shared/types";
import { forceKillProcess, killProcess } from "./kill";
import { scanPorts } from "./scanner";
import store from "./store";
import { createTray, updateTrayEntries } from "./tray";
import {
  checkForAppUpdates,
  getAppInfo,
  getUpdateStatus,
  initializeUpdater,
  installUpdateAndRestart,
} from "./updater";

const APP_NAME = "Portview";
const APP_ICON_PATH = join(process.resourcesPath, "app-icon.png");

function getAppIcon() {
  const icon = nativeImage.createFromPath(APP_ICON_PATH);
  return icon.isEmpty() ? undefined : icon;
}

let mainWindow: ElectronBrowserWindow | null = null;
let isQuitting = false;

function getMainWindow(): ElectronBrowserWindow | null {
  return mainWindow;
}

function createWindow(): ElectronBrowserWindow {
  const bounds = store.get("windowBounds");

  mainWindow = new BrowserWindow({
    width: bounds?.width ?? 1000,
    height: bounds?.height ?? 670,
    x: bounds?.x,
    y: bounds?.y,
    show: false,
    title: APP_NAME,
    titleBarStyle: "hiddenInset",
    trafficLightPosition: { x: 16, y: 16 },
    backgroundColor: "#0b1020",
    icon: getAppIcon(),
    webPreferences: {
      preload: join(__dirname, "../preload/index.mjs"),
      sandbox: false,
    },
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow!.show();
  });

  // Save window bounds on resize/move
  mainWindow.on("resize", saveWindowBounds);
  mainWindow.on("move", saveWindowBounds);

  // Close to tray instead of quitting
  mainWindow.on("close", (event: ElectronEvent) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow!.hide();
    }
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  mainWindow.webContents.setWindowOpenHandler((details: HandlerDetails) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  if (process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }

  return mainWindow;
}

function saveWindowBounds() {
  if (!mainWindow) return;
  const bounds = mainWindow.getBounds();
  store.set("windowBounds", bounds);
}

app.on("before-quit", () => {
  isQuitting = true;
});

app.whenReady().then(async () => {
  app.setName(APP_NAME);
  app.setAboutPanelOptions({
    applicationName: APP_NAME,
  });

  const appIcon = getAppIcon();
  if (process.platform === "darwin" && appIcon) {
    app.dock?.setIcon(appIcon);
  }

  // IPC handlers
  ipcMain.handle(IPC_CHANNELS.SCAN_PORTS, async () => {
    const result = await scanPorts();
    if (result.success) {
      updateTrayEntries(result.entries, getMainWindow);
    }
    return result;
  });
  ipcMain.handle(IPC_CHANNELS.KILL_PROCESS, (_event, pid: number) =>
    killProcess(pid),
  );
  ipcMain.handle(IPC_CHANNELS.FORCE_KILL_PROCESS, (_event, pid: number) =>
    forceKillProcess(pid),
  );

  ipcMain.handle(IPC_CHANNELS.GET_SETTINGS, () => ({
    pinnedPorts: store.get("pinnedPorts"),
    autoRefresh: store.get("autoRefresh"),
    refreshInterval: store.get("refreshInterval"),
    confirmBeforeKill: store.get("confirmBeforeKill"),
    theme: store.get("theme"),
  }));
  ipcMain.handle(IPC_CHANNELS.GET_APP_INFO, () => getAppInfo());
  ipcMain.handle(IPC_CHANNELS.GET_UPDATE_STATUS, () => getUpdateStatus());
  ipcMain.handle(IPC_CHANNELS.CHECK_FOR_UPDATES, () =>
    checkForAppUpdates({ manual: true, showNoUpdateDialog: false }),
  );
  ipcMain.handle(IPC_CHANNELS.INSTALL_UPDATE_AND_RESTART, () => {
    installUpdateAndRestart();
  });
  ipcMain.handle(IPC_CHANNELS.SET_PINNED_PORTS, (_event, ports: number[]) => {
    store.set("pinnedPorts", ports);
  });
  ipcMain.handle(IPC_CHANNELS.SET_AUTO_REFRESH, (_event, enabled: boolean) => {
    store.set("autoRefresh", enabled);
  });
  ipcMain.handle(
    IPC_CHANNELS.SET_REFRESH_INTERVAL,
    (_event, interval: number) => {
      store.set("refreshInterval", interval);
    },
  );
  ipcMain.handle(
    IPC_CHANNELS.SET_CONFIRM_BEFORE_KILL,
    (_event, enabled: boolean) => {
      store.set("confirmBeforeKill", enabled);
    },
  );
  ipcMain.handle(IPC_CHANNELS.SET_THEME, (_event, theme: AppTheme) => {
    store.set("theme", theme);
  });

  // Create tray
  createTray(getMainWindow);

  // Create window
  createWindow();
  initializeUpdater(getMainWindow);

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    } else if (mainWindow) {
      mainWindow.show();
    }
  });
});

app.on("window-all-closed", () => {
  // On macOS, keep running in tray
  if (process.platform !== "darwin") {
    // On other platforms, also keep running if tray is active
    // App quits via tray "Quit" menu item
  }
});
