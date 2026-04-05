import { describe, expect, it } from "vitest";
import { parseNetstatOutput } from "../windows";

const SAMPLE_NETSTAT_OUTPUT = `
Active Connections

  Proto  Local Address          Foreign Address        State           PID
  TCP    0.0.0.0:135            0.0.0.0:0              LISTENING       1128
  TCP    0.0.0.0:445            0.0.0.0:0              LISTENING       4
  TCP    127.0.0.1:3000         0.0.0.0:0              LISTENING       12345
  TCP    192.168.1.5:52000      93.184.216.34:443      ESTABLISHED     9876
  UDP    0.0.0.0:5353           *:*                                    5678
  UDP    0.0.0.0:5355           *:*                                    2222
`;

describe("parseNetstatOutput", () => {
  it("parses standard netstat output into PortEntry array", () => {
    const entries = parseNetstatOutput(SAMPLE_NETSTAT_OUTPUT);
    expect(entries).toHaveLength(6);
  });

  it("correctly parses a LISTENING TCP entry", () => {
    const entries = parseNetstatOutput(SAMPLE_NETSTAT_OUTPUT);
    const listen = entries.find((e) => e.port === 3000);
    expect(listen).toBeDefined();
    expect(listen!.protocol).toBe("TCP");
    expect(listen!.state).toBe("LISTENING");
    expect(listen!.pid).toBe(12345);
    expect(listen!.localAddress).toBe("127.0.0.1");
  });

  it("correctly parses an ESTABLISHED TCP entry", () => {
    const entries = parseNetstatOutput(SAMPLE_NETSTAT_OUTPUT);
    const established = entries.find((e) => e.state === "ESTABLISHED");
    expect(established).toBeDefined();
    expect(established!.port).toBe(52000);
    expect(established!.pid).toBe(9876);
  });

  it("correctly parses UDP entries", () => {
    const entries = parseNetstatOutput(SAMPLE_NETSTAT_OUTPUT);
    const udpEntries = entries.filter((e) => e.protocol === "UDP");
    expect(udpEntries).toHaveLength(2);
    expect(udpEntries[0].port).toBe(5353);
    expect(udpEntries[0].state).toBe("");
  });

  it("sets processName to unknown (resolved separately)", () => {
    const entries = parseNetstatOutput(SAMPLE_NETSTAT_OUTPUT);
    expect(entries.every((e) => e.processName === "unknown")).toBe(true);
  });

  it("returns empty array for empty output", () => {
    expect(parseNetstatOutput("")).toEqual([]);
  });

  it("returns empty array for header-only output", () => {
    const header = `
Active Connections

  Proto  Local Address          Foreign Address        State           PID
`;
    expect(parseNetstatOutput(header)).toEqual([]);
  });
});
