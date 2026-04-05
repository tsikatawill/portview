import { describe, expect, it } from "vitest";
import { getPortDescription } from "../port-descriptions";

describe("getPortDescription", () => {
  it("returns description for a known port number", () => {
    expect(getPortDescription(5432, "someprocess")).toBe("PostgreSQL");
    expect(getPortDescription(6379, "someprocess")).toBe("Redis");
    expect(getPortDescription(443, "someprocess")).toBe("HTTPS");
    expect(getPortDescription(5173, "someprocess")).toBe("Vite");
  });

  it("returns process description when port is unknown", () => {
    expect(getPortDescription(49152, "node")).toBe("Node.js");
    expect(getPortDescription(49152, "firefox")).toBe("Firefox");
  });

  it("matches process name by prefix", () => {
    expect(getPortDescription(49152, "node server")).toBe("Node.js");
    expect(getPortDescription(49152, "Google Chrome Helper")).toBe("Chrome");
  });

  it("is case-insensitive for process name", () => {
    expect(getPortDescription(49152, "NODE")).toBe("Node.js");
    expect(getPortDescription(49152, "Firefox")).toBe("Firefox");
    expect(getPortDescription(49152, "POSTGRES")).toBe("PostgreSQL");
  });

  it("returns empty string for unknown port and unknown process", () => {
    expect(getPortDescription(49152, "someunknownprocess")).toBe("");
    expect(getPortDescription(99999, "")).toBe("");
  });

  it("port lookup takes priority over process name", () => {
    // port 5432 is PostgreSQL even if process name says something else
    expect(getPortDescription(5432, "node")).toBe("PostgreSQL");
  });
});
