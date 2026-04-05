import electron, {
  type BrowserWindow,
  type Tray as ElectronTray,
} from "electron";
import { join } from "path";
import { PortEntry } from "../shared/types";
import { killProcess } from "./kill";
import { scanPorts } from "./scanner";
import store from "./store";

const { app, Menu, nativeImage, Tray } = electron;

let tray: ElectronTray | null = null;
let latestEntries: PortEntry[] = [];

export function createTray(
  getMainWindow: () => BrowserWindow | null,
): ElectronTray {
  // Use a simple template icon for the tray
  const icon = nativeImage.createFromPath(
    join(process.resourcesPath, "tray-icon.png"),
  );
  const resized = icon.isEmpty()
    ? nativeImage.createEmpty()
    : icon.resize({ width: 16, height: 16 });

  tray = new Tray(resized);
  tray.setToolTip("Portview");

  updateTrayMenu(getMainWindow);

  return tray;
}

export function updateTrayEntries(
  entries: PortEntry[],
  getMainWindow: () => BrowserWindow | null,
) {
  latestEntries = entries;
  updateTrayMenu(getMainWindow);
}

function updateTrayMenu(getMainWindow: () => BrowserWindow | null) {
  if (!tray) return;

  const pinnedPorts: number[] = store.get("pinnedPorts");

  const pinnedItems = pinnedPorts.map((port) => {
    const entry = latestEntries.find((e) => e.port === port);
    if (entry) {
      return {
        label: `⚠ :${port} — ${entry.processName} (PID ${entry.pid})`,
        submenu: [
          {
            label: "Kill",
            click: async () => {
              await killProcess(entry.pid);
              const result = await scanPorts();
              if (result.success) {
                updateTrayEntries(result.entries, getMainWindow);
              }
            },
          },
        ],
      };
    }
    return {
      label: `✓ :${port} — available`,
      enabled: false,
    };
  });

  const menuTemplate: Electron.MenuItemConstructorOptions[] = [
    { label: "Pinned Ports", enabled: false },
    { type: "separator" },
    ...pinnedItems,
    { type: "separator" },
    {
      label: "Open Portview",
      click: () => {
        const win = getMainWindow();
        if (win) {
          win.show();
          win.focus();
        }
      },
    },
    {
      label: "Refresh",
      click: async () => {
        const result = await scanPorts();
        if (result.success) {
          updateTrayEntries(result.entries, getMainWindow);
        }
      },
    },
    { type: "separator" },
    {
      label: "Quit",
      click: () => {
        app.quit();
      },
    },
  ];

  const contextMenu = Menu.buildFromTemplate(menuTemplate);
  tray.setContextMenu(contextMenu);
}

export function destroyTray() {
  if (tray) {
    tray.destroy();
    tray = null;
  }
}
