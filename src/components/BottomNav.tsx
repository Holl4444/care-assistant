import type { View } from "../types";
import styles from "./BottomNav.module.css";

type Props = { view: View; onChange: (view: View) => void };
const items: Array<[View, string, string]> = [["home", "⌂", "Home"], ["planner", "☷", "Plan"], ["tips", "♡", "Care tips"], ["projects", "✦", "Projects"], ["about", "i", "Allan"], ["share", "↗", "Share"]];

export default function BottomNav({ view, onChange }: Props) {
  return <nav className={`bottom-nav ${styles.navigation}`} aria-label="Main navigation">
    {items.map(([id, icon, label]) => <button key={id} className={`nav-item ${view === id ? "active" : ""}`} type="button" onClick={() => onChange(id)}><span aria-hidden="true">{icon}</span><span>{label}</span></button>)}
  </nav>;
}
