import { describe, expect, it, vi } from "vitest";
import { forceKillProcess, killProcess } from "../kill";

describe("killProcess", () => {
  it("successfully kills a process with SIGTERM", async () => {
    const mockKill = vi
      .spyOn(process, "kill")
      .mockImplementation(() => true as never);
    const result = await killProcess(12345);
    expect(result.success).toBe(true);
    expect(mockKill).toHaveBeenCalledWith(12345, "SIGTERM");
    mockKill.mockRestore();
  });

  it("returns permission denied error for EPERM", async () => {
    const err = new Error("EPERM") as NodeJS.ErrnoException;
    err.code = "EPERM";
    const mockKill = vi.spyOn(process, "kill").mockImplementation(() => {
      throw err;
    });
    const result = await killProcess(12345);
    expect(result.success).toBe(false);
    expect(result.error).toContain("Permission denied");
    mockKill.mockRestore();
  });

  it("returns not found error for ESRCH", async () => {
    const err = new Error("ESRCH") as NodeJS.ErrnoException;
    err.code = "ESRCH";
    const mockKill = vi.spyOn(process, "kill").mockImplementation(() => {
      throw err;
    });
    const result = await killProcess(99999);
    expect(result.success).toBe(false);
    expect(result.error).toContain("no longer exists");
    mockKill.mockRestore();
  });
});

describe("forceKillProcess", () => {
  it("successfully force kills a process with SIGKILL", async () => {
    const mockKill = vi
      .spyOn(process, "kill")
      .mockImplementation(() => true as never);
    const result = await forceKillProcess(12345);
    expect(result.success).toBe(true);
    expect(mockKill).toHaveBeenCalledWith(12345, "SIGKILL");
    mockKill.mockRestore();
  });
});
