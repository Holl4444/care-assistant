import type { View } from "../types";
import styles from "./BottomNav.module.css";

type Props = { view: View; onChange: (view: View) => void; isOwner: boolean };
const baseItems: Array<[View, string, string]> = [
  ["home", "⌂", "Home"],
  ["planner", "☷", "Plan"],
  ["log", "♡", "Care log"],
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
          onClick={() => onChange(id)}
        >
          <span aria-hidden="true">{icon}</span>
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
