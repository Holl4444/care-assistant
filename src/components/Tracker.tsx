import type { DayState, StageId } from "../types";
import { stages } from "../data";
import styles from "./Tracker.module.css";

type Props = {
  day: DayState;
  onToggle: (stage: StageId, title: string, checked: boolean) => void;
  onRemove: (stage: StageId, title: string) => void;
};

export default function Tracker({ day, onToggle, onRemove }: Props) {
  return (
    <div className={`review-list ${styles.tracker}`}>
      {stages.map((stage) => {
        const items = day.plans[stage.id] || [];
        if (!items.length) return null;
        return (
          <section className="review-group" key={stage.id}>
            <div className="review-heading">
              <span aria-hidden="true">{stage.icon}</span>
              <div>
                <h3>{stage.label}</h3>
                <p>{stage.subtitle}</p>
              </div>
            </div>
            {items.map((title) => {
              const checked = Boolean(day.completed[`${stage.id}:${title}`]);
              return (
                <div
                  className={`check-row ${checked ? "checked" : ""}`}
                  key={title}
                >
                  <label className="check-label">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(event) =>
                        onToggle(stage.id, title, event.target.checked)
                      }
                    />
                    <span className="custom-check" aria-hidden="true">
                      ✓
                    </span>
                    <span>{title}</span>
                  </label>
                  <button
                    className="remove-activity"
                    type="button"
                    aria-label={`Remove ${title} from ${stage.label}`}
                    onClick={() => onRemove(stage.id, title)}
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </section>
        );
      })}
    </div>
  );
}
