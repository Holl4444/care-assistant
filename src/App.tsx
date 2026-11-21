import { useEffect, useMemo, useState } from "react";
import { emptyDay, getDateKey, stages } from "./data";
import type { DayState, StageId, View } from "./types";
import AboutView from "./components/AboutView";
import BottomNav from "./components/BottomNav";
import HomeView from "./components/HomeView";
import PlannerView from "./components/PlannerView";
import ProjectsView from "./components/ProjectsView";
import ShareView from "./components/ShareView";
import TipsView from "./components/TipsView";
import styles from "./App.module.css";

type InstallEvent = Event & { prompt: () => Promise<void> };

function readDay(): DayState {
  try {
    const stored = JSON.parse(
      localStorage.getItem("kindred-care-day") || "null",
    ) as Partial<DayState> | null;
    return stored?.date === getDateKey()
      ? {
          date: stored.date,
          plans: stored.plans || {},
          completed: stored.completed || {},
        }
      : emptyDay();
  } catch {
    return emptyDay();
  }
}

export default function App() {
  const [view, setView] = useState<View>("home");
  const [day, setDay] = useState<DayState>(readDay);
  const [activeStage, setActiveStage] = useState<StageId>("morning");
  const [draftSelections, setDraftSelections] = useState<
    Partial<Record<StageId, string[]>>
  >(() => ({
    morning: day.plans.morning || [],
    afternoon: day.plans.afternoon || [],
    evening: day.plans.evening || [],
  }));
  const [toast, setToast] = useState("");
  const [installEvent, setInstallEvent] = useState<InstallEvent | null>(null);
  const planned = useMemo(
    () => Object.values(day.plans).flatMap((items) => items ?? []),
    [day.plans],
  );
  const completedCount = useMemo(
    () =>
      stages.reduce(
        (total, stage) =>
          total +
          (day.plans[stage.id] || []).filter(
            (title) => day.completed[`${stage.id}:${title}`],
          ).length,
        0,
      ),
    [day],
  );
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  useEffect(() => {
    const checkDate = () => {
      if (getDateKey() !== day.date) {
        const fresh = emptyDay();
        setDay(fresh);
        setDraftSelections({ morning: [], afternoon: [], evening: [] });
        localStorage.setItem("kindred-care-day", JSON.stringify(fresh));
        setToast("A fresh day is ready");
      }
    };
    const onVisibilityChange = () =>
      document.visibilityState === "visible" && checkDate();
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [day.date]);

  useEffect(() => {
    if (import.meta.env.DEV) {
      navigator.serviceWorker
        ?.getRegistrations()
        .then((registrations) =>
          registrations.forEach((registration) => registration.unregister()),
        );
      return;
    }
    navigator.serviceWorker?.register("/service-worker.js");
    const onInstall = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as InstallEvent);
    };
    window.addEventListener("beforeinstallprompt", onInstall);
    return () => window.removeEventListener("beforeinstallprompt", onInstall);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function persist(next: DayState) {
    setDay(next);
    localStorage.setItem("kindred-care-day", JSON.stringify(next));
  }

  function selectView(nextView: View) {
    setView(nextView);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function savePlan() {
    const completed = { ...day.completed };
    stages.forEach((stage) =>
      (day.plans[stage.id] || [])
        .filter((title) => !(draftSelections[stage.id] || []).includes(title))
        .forEach((title) => delete completed[`${stage.id}:${title}`]),
    );
    persist({ ...day, plans: draftSelections, completed });
    setToast("Today’s activities saved");
  }

  function toggleComplete(stage: StageId, title: string, checked: boolean) {
    persist({
      ...day,
      completed: { ...day.completed, [`${stage}:${title}`]: checked },
    });
  }

  function removeActivity(stage: StageId, title: string) {
    const completed = { ...day.completed };
    delete completed[`${stage}:${title}`];
    const plans = {
      ...day.plans,
      [stage]: (day.plans[stage] || []).filter((item) => item !== title),
    };
    setDraftSelections((current) => ({
      ...current,
      [stage]: (current[stage] || []).filter((item) => item !== title),
    }));
    persist({ ...day, plans, completed });
    setToast(`${title} removed from today`);
  }

  return (
    <div className={`app-shell ${styles.app}`}>
      <BottomNav view={view} onChange={selectView} />
      <header className="topbar">
        <div>
          <p className="eyebrow">Care assistant</p>
          <h1>
            Allan’s care <span aria-hidden="true">♡</span>
          </h1>
        </div>
        {installEvent && (
          <button
            className="icon-button"
            type="button"
            aria-label="Install Care assistant"
            onClick={async () => {
              await installEvent.prompt();
              setInstallEvent(null);
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
            onToggle={toggleComplete}
            onRemove={removeActivity}
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
              setDraftSelections((current) => ({
                ...current,
                [activeStage]: selection,
              }))
            }
            onSave={savePlan}
          />
        )}
        {view === "tips" && <TipsView />}
        {view === "projects" && <ProjectsView />}
        {view === "about" && <AboutView />}
        {view === "share" && <ShareView onMessage={setToast} />}
      </main>
      {toast && (
        <div className="toast show" role="status" aria-live="polite">
          {toast}
        </div>
      )}
    </div>
  );
}
