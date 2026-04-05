import type { AppTheme } from "../shared/types";
import Store from "electron-store";

interface StoreSchema {
  pinnedPorts: number[];
  autoRefresh: boolean;
  refreshInterval: number;
  confirmBeforeKill: boolean;
  theme: AppTheme;
  windowBounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
}

let store: Store<StoreSchema> | null = null;

function getStore() {
  if (store) {
    return store;
  }

  store = new Store<StoreSchema>({
    defaults: {
      pinnedPorts: [3000, 5173, 8000, 8080, 5432],
      autoRefresh: false,
      refreshInterval: 2000,
      confirmBeforeKill: true,
      theme: "dark",
      windowBounds: null,
    },
  });

  return store;
}

const storeApi = {
  get<K extends keyof StoreSchema>(key: K) {
    return getStore().get(key);
  },
  set<K extends keyof StoreSchema>(key: K, value: StoreSchema[K]) {
    getStore().set(key, value);
  },
};

export default storeApi;
