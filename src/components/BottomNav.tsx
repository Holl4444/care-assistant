import type { View } from "../types";
import styles from "./BottomNav.module.css";

type Props = { view: View; onChange: (view: View) => void; isOwner: boolean };
const baseItems: Array<[View, string, string]> = [
  ["home", "⌂", "Home"],
  ["planner", "☷", "Plan"],
  ["log", "▣", "Care log"],
  ["tips", "♡", "Care tips"],
  ["projects", "✦", "Projects"],
  ["about", "i", "Allan"],
];

export default function BottomNav({ view, onChange, isOwner }: Props) {
  const items: Array<[View, string, string]> = isOwner
    ? [...baseItems, ["share", "↗", "Share"]]
    : baseItems;
  return (
    <nav className={`bottom-nav ${styles.navigation}`} aria-label="Main navigation">
      {items.map(([id, icon, label]) => (
        <button
          key={id}
          className={`nav-item ${view === id ? "active" : ""}`}
          type="button"
          aria-current={view === id ? "page" : undefined}
          onClick={() => onChange(id)}
        >
          <span className={id === "home" ? styles.homeIcon : styles.navIcon} aria-hidden="true">
            {id === "home" ? (
              <svg viewBox="0 0 24 24" focusable="false">
                <path d="M3 11.5 12 4l9 7.5M5.5 10v9h13v-9M9.5 19v-6h5v6" />
              </svg>
            ) : id === "log" ? (
              <svg viewBox="0 0 24 24" focusable="false">
                <path d="M4 5.5c3-1 6-.5 8 1.5v12c-2-2-5-2.5-8-1.5v-12Z" />
                <path d="M20 5.5c-3-1-6-.5-8 1.5v12c2-2 5-2.5 8-1.5v-12Z" />
              </svg>
            ) : (
              icon
            )}
          </span>
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
