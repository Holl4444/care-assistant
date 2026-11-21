export type View = "home" | "planner" | "tips" | "projects" | "log" | "about" | "share";
export type StageId = "morning" | "afternoon" | "evening";
export type Activity = { icon: string; group: string; title: string; text: string };
export type Stage = { id: StageId; label: string; icon: string; subtitle: string };
export type DayState = {
  date: string;
  plans: Partial<Record<StageId, string[]>>;
  completed: Record<string, boolean>;
};

export type CareCategory = "Music" | "Interests" | "Physical" | "Environment" | "Routines";

export type CareLogEntry = {
  id: string;
  text: string;
  category: CareCategory;
  url?: string | null;
  mentionCount: number;
  pinned: boolean;
  addedAt: string;
  updatedAt: string;
};

export type ProjectIdea = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};
