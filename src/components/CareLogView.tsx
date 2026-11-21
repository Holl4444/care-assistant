import { useEffect, useRef, useState } from "react";
import type { CareCategory, CareLogEntry } from "../types";
import { createCareLog, deleteCareLog, listCareLogs, updateCareLog } from "../api";
import styles from "./CareLogView.module.css";

const categories: CareCategory[] = ["Music", "Interests", "Physical", "Environment", "Routines"];

export default function CareLogView() {
  const [items, setItems] = useState<CareLogEntry[]>([]);
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState<CareCategory>("Interests");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editCategory, setEditCategory] = useState<CareCategory>("Interests");
  const loadMoreRef = useRef<HTMLDivElement>(null);

  async function load(first = false) {
    try {
      setLoading(true);
      const nextPage = first ? 1 : page + 1;
      const result = await listCareLogs(nextPage, 20);
      setItems((current) => (first ? result.items : [...current, ...result.items]));
      setPage(nextPage);
      setHasMore(result.hasMore);
      setError("");
    } catch {
      setError("Could not load care-log entries");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load(true);
  }, []);

  useEffect(() => {
    if (!hasMore || !loadMoreRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !loading) void load();
      },
      { rootMargin: "300px" },
    );
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading, page]);

  async function add() {
    if (!text.trim()) return;
    try {
      await createCareLog(text.trim(), category, url);
      setText("");
      setUrl("");
      await load(true);
    } catch {
      setError("Could not save the care-log entry");
    }
  }

  function beginEdit(item: CareLogEntry) {
    setEditingId(item.id);
    setEditText(item.text);
    setEditUrl(item.url || "");
    setEditCategory(item.category);
  }

  async function saveEdit(id: string) {
    if (!editText.trim()) return;
    try {
      await updateCareLog(id, editText.trim(), editCategory, editUrl);
      setEditingId(null);
      await load(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not update the entry");
    }
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this care-log entry?")) return;
    try {
      await deleteCareLog(id);
      await load(true);
    } catch {
      setError("Could not delete the entry");
    }
  }

  return (
    <section className={`view active ${styles.content}`} aria-labelledby="log-title">
      <div className="page-heading">
        <p className="eyebrow">Shared discoveries</p>
        <h2 id="log-title">Care log</h2>
        <p className="muted">Add interests and activities that feel familiar or comforting.</p>
      </div>
      <div className={styles.composer}>
        <input
          aria-label="Care-log entry"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="What have you discovered?"
        />
        <input
          aria-label="Optional web link"
          type="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="Optional link (YouTube, website…)"
        />
        <div className={styles.selectWrap}>
          <select
            aria-label="Category"
            value={category}
            onChange={(event) => setCategory(event.target.value as CareCategory)}
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <button className="primary-button" type="button" onClick={add} disabled={!text.trim()}>
          Add to log<span aria-hidden="true">+</span>
        </button>
      </div>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
      <div className={styles.list}>
        {items.map((item) => (
          <article className={styles.entry} key={item.id}>
            {editingId === item.id ? (
              <div className={styles.edit}>
                <input
                  aria-label="Edit care-log entry"
                  value={editText}
                  onChange={(event) => setEditText(event.target.value)}
                />
                <input
                  aria-label="Edit optional web link"
                  type="url"
                  value={editUrl}
                  onChange={(event) => setEditUrl(event.target.value)}
                  placeholder="Optional link"
                />
                <div className={styles.selectWrap}>
                  <select
                    aria-label="Edit category"
                    value={editCategory}
                    onChange={(event) => setEditCategory(event.target.value as CareCategory)}
                  >
                    {categories.map((entry) => (
                      <option key={entry} value={entry}>
                        {entry}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.actions}>
                  <button type="button" onClick={() => saveEdit(item.id)}>
                    Save
                  </button>
                  <button type="button" onClick={() => setEditingId(null)}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className={styles.meta}>
                  <span>{item.category}</span>
                  {item.pinned && (
                    <span className={styles.pin}>Pinned · {item.mentionCount} mentions</span>
                  )}
                </div>
                <p>{item.text}</p>
                {item.url && (
                  <a
                    className={styles.link}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open link ↗
                  </a>
                )}
                <div className={styles.actions}>
                  <button type="button" onClick={() => beginEdit(item)}>
                    Edit
                  </button>
                  <button type="button" onClick={() => remove(item.id)}>
                    Delete
                  </button>
                </div>
              </>
            )}
          </article>
        ))}
      </div>
      {loading && <p className="muted">Loading…</p>}
      <div ref={loadMoreRef} />
      <button
        className={styles.floating}
        type="button"
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        ↑
      </button>
    </section>
  );
}
