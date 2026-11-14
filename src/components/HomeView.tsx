import type { DayState, StageId } from "../types";
import Tracker from "./Tracker";
import styles from "./HomeView.module.css";

type Props = {
  greeting: string;
  planned: string[];
  completedCount: number;
  day: DayState;
  onToggle: (stage: StageId, title: string, checked: boolean) => void;
  onRemove: (stage: StageId, title: string) => void;
  onPlan: () => void;
};

export default function HomeView({ greeting, planned, completedCount, day, onToggle, onRemove, onPlan }: Props) {
  return <section className={`view active ${styles.home}`} aria-labelledby="home-title">
    <div className="welcome-card"><div><h2 id="home-title">{greeting}</h2><p className="muted">Thanks for looking after Dad today.</p></div><div className="sun-mark" aria-hidden="true">☼</div></div>
    <div className="section-heading"><div><p className="eyebrow">Today</p><h2>Today’s tracker</h2></div><span className="count">{planned.length ? `${completedCount} of ${planned.length} complete` : "Not planned yet"}</span></div>
    <div className="home-summary">{planned.length ? <Tracker day={day} onToggle={onToggle} onRemove={onRemove} /> : <div className="empty-state"><span aria-hidden="true">☷</span><p>Your activity list is empty. Choose a few gentle ideas for each part of the day.</p></div>}</div>
    <button className="primary-button wide-button" type="button" onClick={onPlan}>Plan or change activities <span aria-hidden="true">→</span></button>
    <section className="quick-note"><div className="note-icon" aria-hidden="true">✦</div><div><h3>Follow his cues</h3><p>If he turns away, tenses or seems distressed, stop and try something different later.</p></div></section>
  </section>;
}
