import type { DayState, StageId } from "../types";
import PrimaryButton from "./PrimaryButton";
import Tracker from "./Tracker";
import styles from "./HomeView.module.css";

type Props = {
  greeting: string;
  planned: string[];
  completedCount: number;
  day: DayState;
  isOwner: boolean;
  onToggle: (stage: StageId, title: string, checked: boolean) => void;
  onRemove: (stage: StageId, title: string) => void;
  onPlan: () => void;
  onShare: () => void;
};

export default function HomeView({
  greeting,
  planned,
  completedCount,
  day,
  isOwner,
  onToggle,
  onRemove,
  onPlan,
  onShare,
}: Props) {
  const isMorning = greeting === "Good morning";
  const isEvening = greeting === "Good evening";

  return (
    <section className={`view active ${styles.home}`} aria-labelledby="home-title">
      {isOwner && (
        <button className={styles.ownerShare} type="button" onClick={onShare}>
          <span aria-hidden="true">↗</span>
          Share
        </button>
      )}
      <div className="welcome-card">
        <div>
          <h2 id="home-title">{greeting}</h2>
          <p className="muted">Thanks for looking after Dad today.</p>
        </div>
        <div className="sun-mark" aria-hidden="true">
          {isEvening ? (
            <svg viewBox="0 0 24 24" focusable="false">
              <path d="M20 15.2A8.5 8.5 0 0 1 8.8 4a8.5 8.5 0 1 0 11.2 11.2Z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" focusable="false">
              {isMorning ? (
                <>
                  <path d="M4 18h16" />
                  <path d="M6.5 18a5.5 5.5 0 0 1 11 0Z" />
                  <path d="M12 3v3M5.5 7l2 2M18.5 7l-2 2M2 12h3M19 12h3" />
                </>
              ) : (
                <>
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 1v3M12 20v3M1 12h3M20 12h3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M19.8 4.2l-2.1 2.1M6.3 17.7l-2.1 2.1" />
                </>
              )}
            </svg>
          )}
        </div>
      </div>
      <div className="section-heading">
        <div>
          <p className="eyebrow">Today</p>
          <h2>Today’s tracker</h2>
        </div>
        {planned.length > 0 && (
          <span className="count">
            {completedCount} of {planned.length} complete
          </span>
        )}
      </div>
      <div className="home-summary">
        {planned.length ? (
          <Tracker day={day} onToggle={onToggle} onRemove={onRemove} />
        ) : (
          <div className="empty-state">
            <span aria-hidden="true">☷</span>
            <p>Your activity list is empty. Choose a few gentle ideas for each part of the day.</p>
          </div>
        )}
      </div>
      <PrimaryButton onClick={onPlan}>
        Plan or change activities <span aria-hidden="true">→</span>
      </PrimaryButton>
      <section className="quick-note">
        <div className="note-icon" aria-hidden="true">
          ✦
        </div>
        <div>
          <h3>Follow his cues</h3>
          <p>
            If he turns away, tenses or seems distressed, stop and try something different later.
          </p>
        </div>
      </section>
    </section>
  );
}
