import { tips } from "../data";
import styles from "./TipsView.module.css";

export default function TipsView() {
  return <section className={`view active ${styles.content}`} aria-labelledby="tips-title"><div className="page-heading"><p className="eyebrow">Keep nearby</p><h2 id="tips-title">Helpful reminders</h2><p className="muted">A calm, familiar environment can make care feel easier.</p></div><div className="tips-list">{tips.map((tip, index) => <article className="tip-item" key={tip}><span className="tip-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><p>{tip}</p></article>)}</div><div className="support-card"><p className="eyebrow">You don’t have to do this alone</p><h3>Ask for a helping hand</h3><p>In doubt, ask the GP, community nurse or a physiotherapist to show you the right technique. Parkinson’s rigidity and contractures need a tailored approach.</p></div></section>;
}
