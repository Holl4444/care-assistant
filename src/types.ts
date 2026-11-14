export type View = "home" | "planner" | "tips" | "projects" | "about";
export type StageId = "morning" | "afternoon" | "evening";
export type Activity = { icon: string; group: string; title: string; text: string };
export type Stage = { id: StageId; label: string; icon: string; subtitle: string };
export type DayState = { date: string; plans: Partial<Record<StageId, string[]>>; completed: Record<string, boolean> };
