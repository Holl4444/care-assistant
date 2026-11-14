import type { Activity, Stage } from "./types";

const activitySeeds = [
  ["♫", "Music & sound", "Favourite songs", "Familiar music from his younger years, roughly 1965–1980"],
  ["♫", "Music & sound", "Favourite radio shows", "A familiar voice or programme he used to love"],
  ["◌", "Music & sound", "Birdsong", "Play softly and watch for a relaxed response"],
  ["◌", "Music & sound", "Sea or garden sounds", "Calm recordings of places that feel familiar"],
  ["▤", "Reading & talking", "Favourite authors", "Read aloud from a book he already knows"],
  ["▤", "Reading & talking", "Formula 1 updates", "Share news about one of his interests"],
  ["▤", "Reading & talking", "Local news", "Read a short article in a calm voice"],
  ["▤", "Reading & talking", "Old letters", "Read familiar letters or cards together"],
  ["▤", "Reading & talking", "Talk about his life", "Ask about his garden, motorbikes or other interests"],
  ["▧", "Photos", "Look through photos", "Spend a few quiet minutes looking together"],
  ["▧", "Photos", "Name people and places", "Use short sentences and a calm voice"],
  ["♡", "Touch & comfort", "Hand massage", "Use unscented or softly scented lotion"],
  ["♡", "Touch & comfort", "Gentle foot massage", "Only if this has always felt comfortable for him"],
  ["♡", "Touch & comfort", "Warm flannel", "Warm, not hot, on his face and hands"],
  ["♡", "Touch & comfort", "Brush hair or shave", "Offer familiar grooming he would have wanted"],
  ["✧", "Movement & comfort", "Move arms gently", "Slow passive movement within a comfortable range"],
  ["✧", "Movement & comfort", "Move legs gently", "Stop if he grimaces or tenses; never force a joint"],
  ["✧", "Movement & comfort", "Warmth before movement", "Try a warm towel or movement after a bath"],
  ["⌂", "Environment", "Open the curtains", "Let in daylight and say good morning using his name"],
  ["⌂", "Environment", "Show the garden", "Position the bed so he can see a window or garden"],
  ["⌂", "Environment", "Make the room calm", "Keep things organised and turn off unwatched TV"],
  ["↺", "Care", "Reposition and check", "Check for sore areas and reposition every two to three hours"],
] as const;

export const activities: Activity[] = activitySeeds
  .map(([icon, group, title, text]) => ({ icon, group, title, text }))
  .sort((a, b) => a.title.localeCompare(b.title));

export const stages: Stage[] = [
  { id: "morning", label: "Morning", icon: "☼", subtitle: "Start slowly and gently" },
  { id: "afternoon", label: "Afternoon", icon: "☀", subtitle: "A little comfort and movement" },
  { id: "evening", label: "Evening", icon: "☾", subtitle: "Settle into a calm night" },
];

export const tips = [
  "Keep the TV off when no one is watching it. Constant background noise can be unsettling.",
  "Talk through what you are doing as you do it. It keeps care from feeling like it is being done to him.",
  "Regular repositioning is important for pressure sores and comfort.",
  "Little and often is better than long sessions — even 5–10 minutes is enough.",
  "Watch for frowning, groaning or restlessness. Tools like the PAINAD scale can help you spot pain when he cannot communicate well.",
  "Warmth beforehand, such as after a bath or with a warm towel, often makes movement easier. Never force a joint.",
];

export const projects = [
  ["☼", "Create a comforting routine", "Choose one or two gentle activities for morning, afternoon and evening. Five to ten minutes is plenty, and the plan can change with Allan’s cues."],
  ["✦", "Build a familiar playlist", "Gather favourite songs and radio shows from his younger years, roughly 1965–1980."],
  ["▤", "Make a reminder board", "With Chris and/or Allan, collect names, family, carers, hobbies, favourite music, food and nicknames."],
  ["♡", "Keep a response log", "Note what brought a smile or a relaxed face, so the best things can be repeated."],
].sort((a, b) => (a[1] ?? "").localeCompare(b[1] ?? ""));

export const interests = [
  ["⚙", "Motorbikes", "Ask Allan about restoring classic Nortons, or share a familiar bike story or picture."],
  ["♫", "Music", "He likes Captain Beefheart, Joni Mitchell and classical music."],
  ["◉", "Radio", "Radio 4 and David Sedaris are familiar listening favourites."],
  ["▣", "Sport", "He mostly enjoys Formula 1 racing, and also likes snooker."],
  ["▤", "TV and films", "He enjoys Have I Got News for You, Red Dwarf, Mandy, Formula 1, Wallace and Gromit, and classic westerns."],
].sort((a, b) => (a[1] ?? "").localeCompare(b[1] ?? ""));

export function getDateKey(): string {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function emptyDay() {
  return { date: getDateKey(), plans: {}, completed: {} };
}
