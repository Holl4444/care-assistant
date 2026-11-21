import type { CareLogEntry, ProjectIdea } from "./types";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { detail?: string } | null;
    throw new Error(body?.detail || "The request failed");
  }
  return response.json() as Promise<T>;
}

export function listCareLogs(page = 1, pageSize = 20) {
  return request<{ items: CareLogEntry[]; hasMore: boolean }>(
    `/api/logs?page=${page}&pageSize=${pageSize}`,
  );
}

export function createCareLog(text: string, category: CareLogEntry["category"], url?: string) {
  return request<{ ok: boolean }>("/api/logs", {
    method: "POST",
    body: JSON.stringify({ text, category, url: url?.trim() || null }),
  });
}

export function updateCareLog(
  id: string,
  text: string,
  category: CareLogEntry["category"],
  url?: string,
) {
  return request<{ ok: boolean }>(`/api/logs/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify({ text, category, url: url?.trim() || null }),
  });
}

export function deleteCareLog(id: string) {
  return request<{ ok: boolean }>(`/api/logs/${encodeURIComponent(id)}`, { method: "DELETE" });
}

export function listProjects() {
  return request<ProjectIdea[]>("/api/projects");
}

export function createProject(title: string, description: string) {
  return request<{ ok: boolean }>("/api/projects", {
    method: "POST",
    body: JSON.stringify({ title, description }),
  });
}

export function updateProject(id: string, title: string, description: string) {
  return request<{ ok: boolean }>(`/api/projects/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify({ title, description }),
  });
}

export function deleteProject(id: string) {
  return request<{ ok: boolean }>(`/api/projects/${encodeURIComponent(id)}`, { method: "DELETE" });
}
