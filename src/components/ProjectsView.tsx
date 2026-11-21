import { projects } from "../data";
import styles from "./ProjectsView.module.css";

export default function ProjectsView() {
  return (
    <section
      className={`view active ${styles.content}`}
      aria-labelledby="projects-title"
    >
      <div className="page-heading">
        <p className="eyebrow">Things to make together</p>
        <h2 id="projects-title">Project ideas</h2>
        <p className="muted">
          Small projects can help everyone learn what feels familiar and
          comforting.
        </p>
      </div>
      <div className="project-list">
        {projects.map(([icon, title, text]) => (
          <article className="project-item" key={title}>
            <span className="activity-icon" aria-hidden="true">
              {icon}
            </span>
            <div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
