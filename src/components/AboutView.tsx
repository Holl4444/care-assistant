import { interests } from "../data";
import styles from "./AboutView.module.css";

export default function AboutView() {
  return <section className={`view active ${styles.content}`} aria-labelledby="about-title"><div className="page-heading"><p className="eyebrow">A little more about him</p><h2 id="about-title">Did you know about Allan?</h2><p className="muted">Familiar interests can be a lovely way to start a conversation, even when Allan cannot reply.</p></div><div className="interest-list">{interests.map(([icon, title, text]) => <article className="interest-item" key={title}><span className="interest-icon" aria-hidden="true">{icon}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div><section className="quick-note"><div className="note-icon" aria-hidden="true">♡</div><div><h3>Keep discovering</h3><p>Add the small details that make Allan Allan — favourite places, people, foods, stories and nicknames.</p></div></section></section>;
}
