import {
  ArrowLeft,
  Check,
  Monitor,
  MoonStar,
  Palette,
  Shield,
  SunMedium,
  TimerReset,
} from "lucide-react";
import type { AppTheme } from "../../../shared/types";
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

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-br from-background via-background to-accent/40 p-6 shadow-sm">
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

      <div className="grid gap-6 lg:grid-cols-[1.35fr_0.95fr]">
        <section className="space-y-4 rounded-3xl border border-border/70 bg-card/80 p-6 shadow-sm backdrop-blur-sm">
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
                    <div className="flex gap-3">
                      <div
                        className={cn(
                          "mt-0.5 rounded-xl border p-2.5",
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

        <div className="space-y-6">
          <section className="space-y-4 rounded-3xl border border-border/70 bg-card/80 p-6 shadow-sm backdrop-blur-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Shield className="text-primary h-4 w-4" />
                <h3 className="text-lg font-semibold">Process Safety</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                Control how aggressively Portview handles process actions.
              </p>
            </div>

            <label className="flex items-start justify-between gap-4 rounded-2xl border border-border/70 bg-background/80 p-4">
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

          <section className="space-y-4 rounded-3xl border border-border/70 bg-card/80 p-6 shadow-sm backdrop-blur-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <TimerReset className="text-primary h-4 w-4" />
                <h3 className="text-lg font-semibold">Refresh Defaults</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                Keep the live scan behavior exactly where you want it.
              </p>
            </div>

            <label className="flex items-start justify-between gap-4 rounded-2xl border border-border/70 bg-background/80 p-4">
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
      </div>
    </div>
  );
}
