import { ArrowLeft, Settings2 } from "lucide-react";
import { useState } from "react";
import type { PortEntry } from "../../shared/types";
import { KillDialog } from "./components/KillDialog";
import { PinnedPorts } from "./components/PinnedPorts";
import { PortTable } from "./components/PortTable";
import { RefreshControls } from "./components/RefreshControls";
import { SearchBar } from "./components/SearchBar";
import { SettingsPage } from "./components/SettingsPage";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
import { AppProvider, useApp } from "./context/AppContext";

type AppView = "ports" | "settings";

function AppContent() {
  const { state } = useApp();
  const [killTarget, setKillTarget] = useState<PortEntry | null>(null);
  const [view, setView] = useState<AppView>("ports");

  function handleKillRequest(entry: PortEntry) {
    if (state.confirmBeforeKill) {
      setKillTarget(entry);
    } else {
      window.api.killProcess(entry.pid);
    }
  }

  return (
    <div className="from-background via-background to-accent/25 flex h-screen flex-col bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.08),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(34,197,94,0.08),_transparent_24%)]">
      <header className="drag-region border-border/70 bg-background/80 border-b px-4 py-3 backdrop-blur-sm">
        <div className="pointer-events-none block h-6 w-full select-none"></div>
        <div className="no-drag flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            {view === "settings" ? (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setView("ports")}
                title="Back to ports"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            ) : null}

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold tracking-tight">
                  {view === "ports" ? "Portview" : "Settings"}
                </h1>
                <Badge variant="outline" className="rounded-full px-2.5 py-0.5">
                  {state.theme}
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm">
                {view === "ports"
                  ? "Monitor port ownership and clear conflicts fast."
                  : "Personalize the workspace and desktop behavior."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {view === "ports" && <RefreshControls />}
            <Button
              variant={view === "settings" ? "secondary" : "outline"}
              size="icon-sm"
              onClick={() => setView("settings")}
              title="Open settings"
              aria-label="Open settings"
            >
              <Settings2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto px-4 py-3">
        {view === "ports" ? (
          <>
            <div className="mb-4 space-y-3">
              <SearchBar />
              <PinnedPorts />
            </div>

            {state.error && (
              <div className="bg-destructive/10 text-destructive mb-4 rounded-md p-3 text-sm">
                {state.error}
              </div>
            )}

            <PortTable onKillRequest={handleKillRequest} />
          </>
        ) : (
          <SettingsPage onBack={() => setView("ports")} />
        )}
      </div>

      <KillDialog
        entry={killTarget}
        open={!!killTarget}
        onClose={() => setKillTarget(null)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
