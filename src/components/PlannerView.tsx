import { activities, stages } from "../data";
import type { DayState, StageId } from "../types";
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
  const draftSelection = draftSelections[activeStage] || [];
  const hasSelections = Object.values(draftSelections).some(
    (selection) => (selection || []).length > 0,
  );
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
      <button
        className="primary-button wide-button"
        type="button"
        disabled={!hasSelections}
        onClick={onSave}
      >
        Add to today’s activities
      </button>
      <div className="planned-stages">
        {stages.map((stage) => {
          const items = day.plans[stage.id] || [];
          return (
            <section className="planned-stage" key={stage.id}>
              <div>
                <span className="stage-dot" aria-hidden="true">
                  {stage.icon}
                </span>
                <div>
                  <h3>{stage.label}</h3>
                  <p>
                    {items.length ? `${items.length} activities planned` : "Nothing chosen yet"}
                  </p>
                </div>
              </div>
              {items.length ? (
                <ul>
                  {items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          );
        })}
      </div>
    </section>
  );
}
