import { describe, expect, it } from "vitest";
import { parseLsofOutput } from "../macos";

const SAMPLE_LSOF_OUTPUT = `COMMAND     PID   USER   FD   TYPE             DEVICE SIZE/OFF NODE NAME
node      12345  alice   22u  IPv6 0x1234567890abcdef      0t0  TCP *:3000 (LISTEN)
node      12345  alice   23u  IPv6 0x1234567890abcdef      0t0  TCP 127.0.0.1:3000->127.0.0.1:52341 (ESTABLISHED)
postgres  67890  bob     5u   IPv4 0xfedcba0987654321      0t0  TCP 127.0.0.1:5432 (LISTEN)
mDNSRespo   111  _mdns   8u   IPv4 0xaabbccdd11223344      0t0  UDP *:5353
chrome    99999  alice   45u  IPv4 0x1122334455667788      0t0  TCP 192.168.1.5:52000->93.184.216.34:443 (ESTABLISHED)`;

describe("parseLsofOutput", () => {
  it("parses standard lsof output into PortEntry array", () => {
    const entries = parseLsofOutput(SAMPLE_LSOF_OUTPUT);
    expect(entries).toHaveLength(5);
  });

  it("correctly parses a LISTEN TCP entry", () => {
    const entries = parseLsofOutput(SAMPLE_LSOF_OUTPUT);
    const listen = entries.find((e) => e.port === 3000 && e.state === "LISTEN");
    expect(listen).toBeDefined();
    expect(listen!.processName).toBe("node");
    expect(listen!.pid).toBe(12345);
    expect(listen!.user).toBe("alice");
    expect(listen!.protocol).toBe("TCP");
    expect(listen!.localAddress).toBe("*");
  });

  it("correctly parses an ESTABLISHED TCP entry", () => {
    const entries = parseLsofOutput(SAMPLE_LSOF_OUTPUT);
    const established = entries.find(
      (e) => e.port === 3000 && e.state === "ESTABLISHED",
    );
    expect(established).toBeDefined();
    expect(established!.localAddress).toBe("127.0.0.1");
  });

  it("correctly parses a UDP entry", () => {
    const entries = parseLsofOutput(SAMPLE_LSOF_OUTPUT);
    const udp = entries.find((e) => e.protocol === "UDP");
    expect(udp).toBeDefined();
    expect(udp!.port).toBe(5353);
    expect(udp!.processName).toBe("mDNSRespo");
    expect(udp!.state).toBe("");
  });

  it("returns empty array for empty output", () => {
    expect(parseLsofOutput("")).toEqual([]);
  });

  it("returns empty array for header-only output", () => {
    const header =
      "COMMAND     PID   USER   FD   TYPE             DEVICE SIZE/OFF NODE NAME";
    expect(parseLsofOutput(header)).toEqual([]);
  });
});
