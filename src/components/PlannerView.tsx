import { useEffect, useState } from "react";
import { activities, stages } from "../data";
import type { DayState, StageId } from "../types";
import PrimaryButton from "./PrimaryButton";
import styles from "./PlannerView.module.css";

type Props = {
  activeStage: StageId;
  draftSelections: Partial<Record<StageId, string[]>>;
  day: DayState;
  onStageChange: (stage: StageId) => void;
  onSelectionChange: (selection: string[]) => void;
  onSave: () => void;
};

export default function PlannerView({
  activeStage,
  draftSelections,
  day,
  onStageChange,
  onSelectionChange,
  onSave,
}: Props) {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const updateVisibility = () => setShowBackToTop(window.scrollY > 300);
    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  const draftSelection = draftSelections[activeStage] || [];
  const hasChanges = stages.some((stage) => {
    const saved = day.plans[stage.id] || [];
    const draft = draftSelections[stage.id] || [];
    return (
      saved.length !== draft.length ||
      saved.some((title) => !draft.includes(title)) ||
      draft.some((title) => !saved.includes(title))
    );
  });
  return (
    <section className={`view active ${styles.planner}`} aria-labelledby="planner-title">
      <div className="page-heading">
        <p className="eyebrow">Build today’s plan</p>
        <h2 id="planner-title">Choose a few gentle activities</h2>
        <p className="muted">
          Select a few options for each part of the day, then save the whole plan once.
        </p>
      </div>
      <div className="stage-tabs">
        {stages.map((stage) => (
          <button
            key={stage.id}
            className={`stage-tab ${activeStage === stage.id ? "active" : ""}`}
            type="button"
            aria-pressed={activeStage === stage.id}
            onClick={() => onStageChange(stage.id)}
          >
            <span aria-hidden="true">{stage.icon}</span>
            <span>{stage.label}</span>
          </button>
        ))}
      </div>
      <div className="selection-status">{draftSelection.length} of 3 selected</div>
      <div className={`option-list ${styles.options}`}>
        {activities.map((activity) => {
          const selected = draftSelection.includes(activity.title);
          const nextSelection = selected
            ? draftSelection.filter((item) => item !== activity.title)
            : draftSelection.length < 3
              ? [...draftSelection, activity.title]
              : draftSelection;
          return (
            <button
              key={activity.title}
              className={`option-card ${selected ? "selected" : ""}`}
              type="button"
              aria-pressed={selected}
              onClick={() => onSelectionChange(nextSelection)}
            >
              <span className="activity-icon" aria-hidden="true">
                {activity.icon}
              </span>
              <span>
                <small className="activity-group">{activity.group}</small>
                <strong>{activity.title}</strong>
                <small>{activity.text}</small>
              </span>
              <span className="check-mark" aria-hidden="true">
                {selected ? "✓" : null}
              </span>
            </button>
          );
        })}
      </div>
      <div className={styles.saveAction}>
        <PrimaryButton disabled={!hasChanges} onClick={onSave}>
          Add to today’s activities
        </PrimaryButton>
      </div>
      {showBackToTop && (
        <button
          className={styles.floating}
          type="button"
          aria-label="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          ↑
        </button>
      )}
    </section>
  );
}
