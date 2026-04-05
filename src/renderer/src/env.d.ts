/// <reference types="vite/client" />

import type { PortviewAPI } from "../../preload/index";

declare global {
  interface Window {
    api: PortviewAPI;
  }
}
