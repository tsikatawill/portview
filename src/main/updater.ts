import {
  app,
  BrowserWindow,
  dialog,
  shell,
  type BrowserWindow as ElectronBrowserWindow,
} from "electron";
import type { AppUpdater, UpdateInfo } from "electron-updater";
import { IPC_CHANNELS } from "../shared/ipc";
import type { UpdateStatus } from "../shared/types";

const RELEASES_URL = "https://github.com/tsikatawill/portview/releases";

let currentStatus: UpdateStatus = {
  phase: "idle",
  message: "Automatic updates are ready",
};

let hasInitialized = false;
let checkInFlight: Promise<UpdateStatus> | null = null;
let lastManualCheck = false;
let showNoUpdateDialogForManualCheck = false;
let autoUpdaterInstance: AppUpdater | null = null;

function getApp() {
  return app;
}

function getDialog() {
  return dialog;
}

function getShell() {
  return shell;
}

function isPackagedApp() {
  return Boolean(getApp()?.isPackaged);
}

async function getAutoUpdater() {
  if (autoUpdaterInstance) {
    return autoUpdaterInstance;
  }

  const { autoUpdater } = await import("electron-updater");

  autoUpdaterInstance = autoUpdater;
  return autoUpdaterInstance;
}

function broadcastStatus() {
  for (const window of BrowserWindow.getAllWindows()) {
    window.webContents.send(IPC_CHANNELS.UPDATE_STATUS_CHANGED, currentStatus);
  }
}

function setStatus(status: UpdateStatus) {
  currentStatus = status;
  broadcastStatus();
}

function formatVersion(info: UpdateInfo) {
  return info.version ? `v${info.version}` : "a new version";
}

function getNoUpdateMessage() {
  return `You're on the latest version of Portview (${getApp().getVersion()}).`;
}

async function showDialogForManualResult(title: string, message: string) {
  await getDialog().showMessageBox({
    type: "info",
    title,
    message,
    buttons: ["OK"],
    defaultId: 0,
  });
}

async function promptToInstallUpdate(version?: string) {
  const autoUpdater = await getAutoUpdater();
  const result = await getDialog().showMessageBox({
    type: "info",
    title: "Update Ready",
    message: version
      ? `Portview ${version} has been downloaded and is ready to install.`
      : "A Portview update has been downloaded and is ready to install.",
    detail: "Restart the app now to finish installing the update.",
    buttons: ["Restart and Install", "Later"],
    defaultId: 0,
    cancelId: 1,
  });

  if (result.response === 0) {
    autoUpdater.quitAndInstall();
  }
}

function handleUnsupportedCheck(manual: boolean, showDialog: boolean) {
  const status: UpdateStatus = {
    phase: "unsupported",
    message: "Automatic updates are only available in packaged releases.",
  };

  setStatus(status);

  if (manual && showDialog) {
    void showDialogForManualResult("Updates Unavailable", status.message);
  }

  return status;
}

export function getUpdateStatus() {
  if (!isPackagedApp()) {
    return {
      phase: "unsupported",
      message: "Automatic updates are only available in packaged releases.",
    } satisfies UpdateStatus;
  }

  return currentStatus;
}

export function getAppInfo() {
  const app = getApp();

  return {
    version: app?.getVersion?.() ?? "0.0.0",
    isPackaged: Boolean(app?.isPackaged),
    releasesUrl: RELEASES_URL,
  };
}

export function initializeUpdater(
  getMainWindow: () => ElectronBrowserWindow | null,
) {
  if (hasInitialized || !isPackagedApp()) {
    return;
  }

  hasInitialized = true;
  setStatus({
    phase: "idle",
    message: "Automatic updates are ready",
  });

  void (async () => {
    const autoUpdater = await getAutoUpdater();

    autoUpdater.autoDownload = true;
    autoUpdater.autoInstallOnAppQuit = true;

    autoUpdater.on("checking-for-update", () => {
      setStatus({
        phase: "checking",
        message: "Checking for updates...",
        checkedAt: new Date().toISOString(),
      });
    });

    autoUpdater.on("update-available", (info) => {
      setStatus({
        phase: "downloading",
        version: info.version,
        message: `Downloading ${formatVersion(info)}...`,
        checkedAt: new Date().toISOString(),
      });
    });

    autoUpdater.on("download-progress", (progress) => {
      setStatus({
        phase: "downloading",
        progress: progress.percent,
        message: `Downloading update... ${Math.round(progress.percent)}%`,
        checkedAt: new Date().toISOString(),
      });
    });

    autoUpdater.on("update-not-available", async () => {
      setStatus({
        phase: "not-available",
        version: getApp().getVersion(),
        message: getNoUpdateMessage(),
        checkedAt: new Date().toISOString(),
      });

      if (showNoUpdateDialogForManualCheck) {
        await showDialogForManualResult(
          "Portview is Up to Date",
          getNoUpdateMessage(),
        );
      }
    });

    autoUpdater.on("update-downloaded", async (info) => {
      const version = formatVersion(info);

      setStatus({
        phase: "downloaded",
        version: info.version,
        message: `${version} is ready to install.`,
        checkedAt: new Date().toISOString(),
      });

      const mainWindow = getMainWindow();
      if (mainWindow && !mainWindow.isVisible()) {
        mainWindow.show();
        mainWindow.focus();
      }

      await promptToInstallUpdate(version);
    });

    autoUpdater.on("error", async (error) => {
      const message =
        error instanceof Error ? error.message : "Automatic updates failed.";

      setStatus({
        phase: "error",
        message,
        checkedAt: new Date().toISOString(),
      });

      if (lastManualCheck) {
        await getDialog()
          .showMessageBox({
            type: "error",
            title: "Update Check Failed",
            message: "Portview couldn't check for updates.",
            detail: message,
            buttons: ["Open Releases", "OK"],
            defaultId: 1,
            cancelId: 1,
          })
          .then((result) => {
            if (result.response === 0) {
              void getShell().openExternal(RELEASES_URL);
            }
          });
      }
    });

    setTimeout(() => {
      void checkForAppUpdates({ manual: false, showNoUpdateDialog: false });
    }, 5000);
  })();
}

export async function checkForAppUpdates(options?: {
  manual?: boolean;
  showNoUpdateDialog?: boolean;
}) {
  const manual = options?.manual ?? false;
  const showNoUpdateDialog = options?.showNoUpdateDialog ?? manual;

  lastManualCheck = manual;
  showNoUpdateDialogForManualCheck = showNoUpdateDialog;

  if (!isPackagedApp()) {
    return handleUnsupportedCheck(manual, showNoUpdateDialog);
  }

  if (checkInFlight) {
    return checkInFlight;
  }

  const autoUpdater = await getAutoUpdater();

  checkInFlight = autoUpdater
    .checkForUpdates()
    .then(() => currentStatus)
    .finally(() => {
      checkInFlight = null;
      lastManualCheck = false;
      showNoUpdateDialogForManualCheck = false;
    });

  return checkInFlight;
}

export async function installUpdateAndRestart() {
  if (currentStatus.phase !== "downloaded") {
    return;
  }

  const autoUpdater = await getAutoUpdater();
  autoUpdater.quitAndInstall();
}
