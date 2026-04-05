import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import type { AppTheme, PortEntry } from "../../../shared/types";

interface AppState {
  ports: PortEntry[];
  pinnedPorts: number[];
  searchQuery: string;
  stateFilter: string;
  sortColumn: keyof PortEntry | null;
  sortDirection: "asc" | "desc";
  isScanning: boolean;
  autoRefresh: boolean;
  refreshInterval: number;
  confirmBeforeKill: boolean;
  theme: AppTheme;
  error: string | null;
}

type Action =
  | { type: "SET_PORTS"; ports: PortEntry[] }
  | { type: "SET_SCANNING"; isScanning: boolean }
  | { type: "SET_ERROR"; error: string | null }
  | { type: "SET_SEARCH_QUERY"; query: string }
  | { type: "SET_STATE_FILTER"; filter: string }
  | { type: "SET_SORT"; column: keyof PortEntry }
  | { type: "TOGGLE_PIN"; port: number }
  | { type: "SET_PINNED_PORTS"; ports: number[] }
  | { type: "SET_AUTO_REFRESH"; enabled: boolean }
  | { type: "SET_REFRESH_INTERVAL"; interval: number }
  | { type: "SET_CONFIRM_BEFORE_KILL"; enabled: boolean }
  | { type: "SET_THEME"; theme: AppTheme };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "SET_PORTS":
      return { ...state, ports: action.ports, error: null };
    case "SET_SCANNING":
      return { ...state, isScanning: action.isScanning };
    case "SET_ERROR":
      return { ...state, error: action.error };
    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.query };
    case "SET_STATE_FILTER":
      return { ...state, stateFilter: action.filter };
    case "SET_SORT": {
      const sameColumn = state.sortColumn === action.column;
      return {
        ...state,
        sortColumn: action.column,
        sortDirection:
          sameColumn && state.sortDirection === "asc" ? "desc" : "asc",
      };
    }
    case "TOGGLE_PIN": {
      const pinned = state.pinnedPorts.includes(action.port)
        ? state.pinnedPorts.filter((p) => p !== action.port)
        : [...state.pinnedPorts, action.port];
      return { ...state, pinnedPorts: pinned };
    }
    case "SET_PINNED_PORTS":
      return { ...state, pinnedPorts: action.ports };
    case "SET_AUTO_REFRESH":
      return { ...state, autoRefresh: action.enabled };
    case "SET_REFRESH_INTERVAL":
      return { ...state, refreshInterval: action.interval };
    case "SET_CONFIRM_BEFORE_KILL":
      return { ...state, confirmBeforeKill: action.enabled };
    case "SET_THEME":
      return { ...state, theme: action.theme };
    default:
      return state;
  }
}

const initialState: AppState = {
  ports: [],
  pinnedPorts: [3000, 5173, 8000, 8080, 5432],
  searchQuery: "",
  stateFilter: "",
  sortColumn: "port",
  sortDirection: "asc",
  isScanning: false,
  autoRefresh: false,
  refreshInterval: 2000,
  confirmBeforeKill: true,
  theme: "dark",
  error: null,
};

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  scanPorts: () => Promise<void>;
  killPort: (pid: number) => Promise<{ success: boolean; error?: string }>;
  forceKillPort: (pid: number) => Promise<{ success: boolean; error?: string }>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [hasLoadedSettings, setHasLoadedSettings] = useState(false);

  const scanPorts = useCallback(async () => {
    dispatch({ type: "SET_SCANNING", isScanning: true });
    try {
      const result = await window.api.scanPorts();
      if (result.success) {
        dispatch({ type: "SET_PORTS", ports: result.entries });
      } else {
        dispatch({ type: "SET_ERROR", error: result.error || "Scan failed" });
      }
    } catch (e) {
      dispatch({
        type: "SET_ERROR",
        error: e instanceof Error ? e.message : "Scan failed",
      });
    } finally {
      dispatch({ type: "SET_SCANNING", isScanning: false });
    }
  }, []);

  const killPort = useCallback(async (pid: number) => {
    return window.api.killProcess(pid);
  }, []);

  const forceKillPort = useCallback(async (pid: number) => {
    return window.api.forceKillProcess(pid);
  }, []);

  // Load persisted settings and do initial scan
  useEffect(() => {
    window.api.getSettings().then((settings) => {
      dispatch({ type: "SET_PINNED_PORTS", ports: settings.pinnedPorts });
      dispatch({ type: "SET_AUTO_REFRESH", enabled: settings.autoRefresh });
      dispatch({
        type: "SET_REFRESH_INTERVAL",
        interval: settings.refreshInterval,
      });
      dispatch({
        type: "SET_CONFIRM_BEFORE_KILL",
        enabled: settings.confirmBeforeKill,
      });
      dispatch({ type: "SET_THEME", theme: settings.theme });
      setHasLoadedSettings(true);
    });
    scanPorts();
  }, [scanPorts]);

  // Persist pinned ports
  useEffect(() => {
    if (!hasLoadedSettings) return;
    window.api.setPinnedPorts(state.pinnedPorts);
  }, [hasLoadedSettings, state.pinnedPorts]);

  // Persist auto-refresh
  useEffect(() => {
    if (!hasLoadedSettings) return;
    window.api.setAutoRefresh(state.autoRefresh);
  }, [hasLoadedSettings, state.autoRefresh]);

  // Persist refresh interval
  useEffect(() => {
    if (!hasLoadedSettings) return;
    window.api.setRefreshInterval(state.refreshInterval);
  }, [hasLoadedSettings, state.refreshInterval]);

  useEffect(() => {
    if (!hasLoadedSettings) return;
    window.api.setConfirmBeforeKill(state.confirmBeforeKill);
  }, [hasLoadedSettings, state.confirmBeforeKill]);

  useEffect(() => {
    if (!hasLoadedSettings) return;
    window.api.setTheme(state.theme);
  }, [hasLoadedSettings, state.theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const root = document.documentElement;

    const applyTheme = () => {
      const isDark =
        state.theme === "dark" ||
        (state.theme === "system" && mediaQuery.matches);

      root.classList.toggle("dark", isDark);
      root.style.colorScheme = isDark ? "dark" : "light";
    };

    applyTheme();

    if (state.theme !== "system") {
      return;
    }

    mediaQuery.addEventListener("change", applyTheme);

    return () => {
      mediaQuery.removeEventListener("change", applyTheme);
    };
  }, [state.theme]);

  // Auto-refresh
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (state.autoRefresh) {
      intervalRef.current = setInterval(scanPorts, state.refreshInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.autoRefresh, state.refreshInterval, scanPorts]);

  return (
    <AppContext.Provider
      value={{ state, dispatch, scanPorts, killPort, forceKillPort }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
