import { useEffect, useState } from "react";
import type { ProjectIdea } from "../types";
import { createProject, deleteProject, listProjects, updateProject } from "../api";
import PrimaryButton from "./PrimaryButton";
import styles from "./ProjectsView.module.css";

export default function ProjectsView() {
  const [items, setItems] = useState<ProjectIdea[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function refresh() {
    try {
      setLoading(true);
      setItems(await listProjects());
      setError("");
    } catch {
      setError("Could not load project ideas");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function save() {
    if (!title.trim()) return;
    try {
      if (editingId) {
        await updateProject(editingId, title.trim(), description.trim());
        setEditingId(null);
      } else {
        await createProject(title.trim(), description.trim());
      }
      setTitle("");
      setDescription("");
      await refresh();
    } catch {
      setError("Could not save the project idea");
    }
  }

  async function remove(id: string, title: string) {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      await deleteProject(id);
      await refresh();
    } catch {
      setError("Could not delete the project idea");
    }
  }

  function edit(item: ProjectIdea) {
    setEditingId(item.id);
    setTitle(item.title);
    setDescription(item.description);
  }

  return (
    <section className={`view active ${styles.content}`} aria-labelledby="projects-title">
      <div className="page-heading">
        <p className="eyebrow">Things to make together</p>
        <h2 id="projects-title">Project ideas</h2>
        <p className="muted">
          Small projects can help everyone learn what feels familiar and comforting.
        </p>
      </div>
      <div className={styles.form}>
        <label className={styles.field}>
          <span>Project title</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Project title"
          />
        </label>
        <label className={styles.field}>
          <span>Description</span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Description"
            rows={3}
          />
        </label>
        <PrimaryButton onClick={save} disabled={!title.trim()}>
          {editingId ? "Save changes" : "Add project"}
        </PrimaryButton>
        {editingId && (
          <button
            className={styles.cancelButton}
            type="button"
            onClick={() => {
              setEditingId(null);
              setTitle("");
              setDescription("");
            }}
          >
            Cancel
          </button>
        )}
      </div>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
      {loading ? (
        <p className="muted">Loading ideas…</p>
      ) : (
        <div className="project-list">
          {items.map((item) => (
            <article className="project-item" key={item.id}>
              <span className="activity-icon" aria-hidden="true">
                ✦
              </span>
              <div>
                <h3>{item.title}</h3>
                {item.description && <p>{item.description}</p>}
                <div className={styles.actions}>
                  <button
                    type="button"
                    onClick={() => edit(item)}
                    aria-label={`Edit ${item.title}`}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(item.id, item.title)}
                    aria-label={`Delete ${item.title}`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
