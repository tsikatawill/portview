import {
  ArrowLeft,
  Check,
  CloudDownload,
  Monitor,
  MoonStar,
  Palette,
  RotateCw,
  Shield,
  SunMedium,
  TimerReset,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { AppInfo } from "../../../preload/index";
import type { AppTheme, UpdateStatus } from "../../../shared/types";
import { useApp } from "../context/AppContext";
import { cn } from "../lib/utils";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Switch } from "./ui/switch";

interface SettingsPageProps {
  onBack: () => void;
}

const THEME_OPTIONS: {
  value: AppTheme;
  label: string;
  description: string;
  icon: typeof Monitor;
}[] = [
  {
    value: "system",
    label: "System",
    description: "Follow your device appearance automatically.",
    icon: Monitor,
  },
  {
    value: "light",
    label: "Light",
    description: "Keep the interface bright and airy all day.",
    icon: SunMedium,
  },
  {
    value: "dark",
    label: "Dark",
    description: "Use a dimmed workspace for low-glare scanning.",
    icon: MoonStar,
  },
];

export function SettingsPage({ onBack }: SettingsPageProps) {
  const { state, dispatch } = useApp();
  const [appInfo, setAppInfo] = useState<AppInfo | null>(null);
  const [updateStatus, setUpdateStatus] = useState<UpdateStatus>({
    phase: "idle",
    message: "Checking update status...",
  });
  const [isCheckingForUpdates, setIsCheckingForUpdates] = useState(false);

  useEffect(() => {
    let mounted = true;

    void window.api.getAppInfo().then((info) => {
      if (mounted) {
        setAppInfo(info);
      }
    });

    void window.api.getUpdateStatus().then((status) => {
      if (mounted) {
        setUpdateStatus(status);
      }
    });

    const unsubscribe = window.api.onUpdateStatusChange((status) => {
      if (mounted) {
        setUpdateStatus(status);
        if (status.phase !== "checking" && status.phase !== "downloading") {
          setIsCheckingForUpdates(false);
        }
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  async function handleCheckForUpdates() {
    setIsCheckingForUpdates(true);
    try {
      const status = await window.api.checkForUpdates();
      setUpdateStatus(status);
    } finally {
      setIsCheckingForUpdates(false);
    }
  }

  async function handleInstallUpdate() {
    await window.api.installUpdateAndRestart();
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="border-border/70 from-background via-background to-accent/40 relative overflow-hidden rounded-3xl border bg-gradient-to-br p-6 shadow-sm">
        <div className="absolute inset-y-0 right-0 w-56 bg-[radial-gradient(circle_at_top_right,_rgba(14,165,233,0.16),_transparent_58%),radial-gradient(circle_at_bottom_right,_rgba(234,179,8,0.12),_transparent_52%)]" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <Badge variant="outline" className="gap-1.5 rounded-full px-3 py-1">
              <Palette className="h-3.5 w-3.5" />
              Settings
            </Badge>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                Shape the Portview workspace
              </h2>
              <p className="text-muted-foreground max-w-2xl text-sm leading-6">
                Tune the theme and desktop behavior so conflict checks feel
                consistent with the way you like to work.
              </p>
            </div>
          </div>

          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
            Back to Ports
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="space-y-6 lg:flex-3/5">
          <section className="border-border/70 bg-card/80 space-y-4 rounded-3xl border p-6 shadow-sm backdrop-blur-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Palette className="text-primary h-4 w-4" />
                <h3 className="text-lg font-semibold">Theme</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                Choose how Portview should look across the whole app.
              </p>
            </div>

            <div className="grid gap-3">
              {THEME_OPTIONS.map((option) => {
                const Icon = option.icon;
                const selected = state.theme === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      dispatch({ type: "SET_THEME", theme: option.value })
                    }
                    className={cn(
                      "group relative overflow-hidden rounded-2xl border p-4 text-left transition-all",
                      "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none",
                      selected
                        ? "border-primary bg-primary/6 shadow-sm"
                        : "border-border/70 bg-background/80 hover:border-primary/30 hover:bg-accent/40",
                    )}
                  >
                    <div className="absolute inset-y-0 right-0 w-24 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.08),_transparent_70%)] opacity-0 transition-opacity group-hover:opacity-100" />
                    <div className="relative flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            "grid place-content-center rounded-xl border p-2.5",
                            selected
                              ? "border-primary/30 bg-primary/10 text-primary"
                              : "border-border/70 bg-background text-muted-foreground",
                          )}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{option.label}</span>
                            {selected && (
                              <Badge variant="outline" className="rounded-full">
                                Active
                              </Badge>
                            )}
                          </div>
                          <p className="text-muted-foreground text-sm leading-5">
                            {option.description}
                          </p>
                        </div>
                      </div>

                      <div
                        className={cn(
                          "flex h-6 w-6 items-center justify-center rounded-full border transition-colors",
                          selected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border/70 text-transparent",
                        )}
                      >
                        <Check className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="border-border/70 bg-card/80 space-y-4 rounded-3xl border p-6 shadow-sm backdrop-blur-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Shield className="text-primary h-4 w-4" />
                <h3 className="text-lg font-semibold">Process Safety</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                Control how aggressively Portview handles process actions.
              </p>
            </div>

            <label className="border-border/70 bg-background/80 flex items-start justify-between gap-4 rounded-2xl border p-4">
              <div className="space-y-1">
                <div className="font-medium">Confirm before kill</div>
                <p className="text-muted-foreground text-sm leading-5">
                  Show a confirmation dialog before terminating a process.
                </p>
              </div>
              <Switch
                checked={state.confirmBeforeKill}
                onCheckedChange={(checked) =>
                  dispatch({
                    type: "SET_CONFIRM_BEFORE_KILL",
                    enabled: checked,
                  })
                }
                aria-label="Confirm before kill"
              />
            </label>
          </section>

          <section className="border-border/70 bg-card/80 space-y-4 rounded-3xl border p-6 shadow-sm backdrop-blur-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <TimerReset className="text-primary h-4 w-4" />
                <h3 className="text-lg font-semibold">Refresh Defaults</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                Keep the live scan behavior exactly where you want it.
              </p>
            </div>

            <label className="border-border/70 bg-background/80 flex items-start justify-between gap-4 rounded-2xl border p-4">
              <div className="space-y-1">
                <div className="font-medium">Auto refresh</div>
                <p className="text-muted-foreground text-sm leading-5">
                  Continuously rescan ports while the app is open.
                </p>
              </div>
              <Switch
                checked={state.autoRefresh}
                onCheckedChange={(checked) =>
                  dispatch({ type: "SET_AUTO_REFRESH", enabled: checked })
                }
                aria-label="Auto refresh"
              />
            </label>

            <div className="space-y-2">
              <label className="text-sm font-medium">Refresh interval</label>
              <Select
                value={String(state.refreshInterval)}
                onValueChange={(value) =>
                  dispatch({
                    type: "SET_REFRESH_INTERVAL",
                    interval: parseInt(value, 10),
                  })
                }
                disabled={!state.autoRefresh}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose interval" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1000">Every 1 second</SelectItem>
                  <SelectItem value="2000">Every 2 seconds</SelectItem>
                  <SelectItem value="5000">Every 5 seconds</SelectItem>
                  <SelectItem value="10000">Every 10 seconds</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </section>
        </div>

        <div className="sticky top-0 space-y-6 lg:flex-2/5">
          <section className="border-border/70 bg-card/80 space-y-4 rounded-3xl border p-6 shadow-sm backdrop-blur-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CloudDownload className="text-primary h-4 w-4" />
                <h3 className="text-lg font-semibold">Updates</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                Check for new releases and install latest updates.
              </p>
            </div>

            <div className="border-border/70 bg-background/80 space-y-3 rounded-2xl border p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="font-medium">
                    Current version {appInfo ? `v${appInfo.version}` : ""}
                  </div>
                  <p className="text-muted-foreground text-sm leading-5">
                    {updateStatus.message}
                  </p>
                  {typeof updateStatus.progress === "number" && (
                    <p className="text-muted-foreground text-xs">
                      Download progress: {Math.round(updateStatus.progress)}%
                    </p>
                  )}
                  {!appInfo?.isPackaged && (
                    <p className="text-muted-foreground text-xs">
                      Dev builds can&apos;t self-update. Packaged releases will
                      use GitHub Releases instead.
                    </p>
                  )}
                </div>

                <Badge variant="outline" className="rounded-full capitalize">
                  {updateStatus.phase.replace("-", " ")}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={handleCheckForUpdates}
                  disabled={
                    isCheckingForUpdates || updateStatus.phase === "downloading"
                  }
                >
                  <RotateCw
                    className={cn(
                      "h-4 w-4",
                      isCheckingForUpdates && "animate-spin",
                    )}
                  />
                  Check now
                </Button>

                {updateStatus.phase === "downloaded" && (
                  <Button onClick={handleInstallUpdate}>
                    Restart to install
                  </Button>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
