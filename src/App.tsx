import { useEffect, useState } from "react";
import type { View } from "./types";
import AboutView from "./components/AboutView";
import BottomNav from "./components/BottomNav";
import HomeView from "./components/HomeView";
import PlannerView from "./components/PlannerView";
import ProjectsView from "./components/ProjectsView";
import ShareView from "./components/ShareView";
import TipsView from "./components/TipsView";
import CareLogView from "./components/CareLogView";
import { useCareDay } from "./hooks/useCareDay";
import { usePwaInstall } from "./hooks/usePwaInstall";
import styles from "./App.module.css";

export default function App() {
  if (window.location.pathname.startsWith("/owner")) {
    localStorage.setItem("carekin-owner", "true");
  }
  const isOwner =
    window.location.pathname.startsWith("/owner") ||
    localStorage.getItem("carekin-owner") === "true";
  const [view, setView] = useState<View>("home");
  const [toast, setToast] = useState("");
  const {
    day,
    activeStage,
    setActiveStage,
    draftSelections,
    setDraftSelections,
    planned,
    completedCount,
    savePlan,
    toggleComplete,
    removeActivity,
  } = useCareDay(setToast);
  const { installEvent, clearInstallEvent } = usePwaInstall();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function selectView(nextView: View) {
    setView(nextView);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function savePlanWithToast() {
    savePlan();
    setToast("Today’s activities saved");
  }

  function toggleCompleteWithToast(
    stage: Parameters<typeof toggleComplete>[0],
    title: string,
    checked: boolean,
  ) {
    toggleComplete(stage, title, checked);
  }

  function removeActivityWithToast(stage: Parameters<typeof removeActivity>[0], title: string) {
    removeActivity(stage, title);
    setToast(`${title} removed from today`);
  }

  return (
    <div className={`app-shell ${styles.app}`}>
      <BottomNav view={view} onChange={selectView} isOwner={isOwner} />
      <header className="topbar">
        <div>
          <p className="eyebrow">Carekin</p>
          <h1>
            Allan’s care <span aria-hidden="true">♡</span>
          </h1>
        </div>
        {installEvent && (
          <button
            className="icon-button"
            type="button"
            aria-label="Install Carekin"
            onClick={async () => {
              await installEvent.prompt();
              clearInstallEvent();
            }}
          >
            ↓
          </button>
        )}
      </header>
      <main>
        {view === "home" && (
          <HomeView
            greeting={greeting}
            planned={planned}
            completedCount={completedCount}
            day={day}
            onToggle={toggleCompleteWithToast}
            onRemove={removeActivityWithToast}
            onPlan={() => selectView("planner")}
          />
        )}
        {view === "planner" && (
          <PlannerView
            activeStage={activeStage}
            draftSelections={draftSelections}
            day={day}
            onStageChange={setActiveStage}
            onSelectionChange={(selection) =>
              setDraftSelections((current) => ({ ...current, [activeStage]: selection }))
            }
            onSave={savePlanWithToast}
          />
        )}
        {view === "tips" && <TipsView />}
        {view === "projects" && <ProjectsView />}
        {view === "log" && <CareLogView />}
        {view === "about" && <AboutView />}
        {isOwner && view === "share" && <ShareView onMessage={setToast} />}
      </main>
      {toast && (
        <div className="toast show" role="status" aria-live="polite">
          {toast}
        </div>
      )}
    </div>
  );
}
