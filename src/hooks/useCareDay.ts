import { useEffect, useMemo, useState } from "react";
import { emptyDay, getDateKey, stages } from "../data";
import type { DayState, StageId } from "../types";

const STORAGE_KEY = "kindred-care-day";

function readDay(): DayState {
  try {
    const stored = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "null",
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

export function useCareDay(onFreshDay: (message: string) => void) {
  const [day, setDay] = useState<DayState>(readDay);
  const [activeStage, setActiveStage] = useState<StageId>("morning");
  const [draftSelections, setDraftSelections] = useState<Partial<Record<StageId, string[]>>>(
    () => ({
      morning: day.plans.morning || [],
      afternoon: day.plans.afternoon || [],
      evening: day.plans.evening || [],
    }),
  );

  useEffect(() => {
    const checkDate = () => {
      if (getDateKey() !== day.date) {
        const fresh = emptyDay();
        setDay(fresh);
        setDraftSelections({ morning: [], afternoon: [], evening: [] });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
        onFreshDay("A fresh day is ready");
      }
    };
    const onVisibilityChange = () => document.visibilityState === "visible" && checkDate();
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [day.date, onFreshDay]);

  function persist(next: DayState) {
    setDay(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function savePlan() {
    const completed = { ...day.completed };
    stages.forEach((stage) =>
      (day.plans[stage.id] || [])
        .filter((title) => !(draftSelections[stage.id] || []).includes(title))
        .forEach((title) => delete completed[`${stage.id}:${title}`]),
    );
    persist({ ...day, plans: draftSelections, completed });
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
  }

  const planned = useMemo(
    () => Object.values(day.plans).flatMap((items) => items ?? []),
    [day.plans],
  );
  const completedCount = useMemo(
    () =>
      stages.reduce(
        (total, stage) =>
          total +
          (day.plans[stage.id] || []).filter((title) => day.completed[`${stage.id}:${title}`])
            .length,
        0,
      ),
    [day],
  );

  return {
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
  };
}
