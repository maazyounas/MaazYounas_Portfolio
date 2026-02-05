import { Project } from "../lib/adminService";

const API = import.meta.env.VITE_API_URL;

export const getProject = async (id: string): Promise<Project> => {
  const res = await fetch(`${API}/projects/${id}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch project: ${res.status}`);
  }
  return res.json();
};

export const getProjects = async (): Promise<Project[]> => {
  try {
    const res = await fetch(`${API}/projects`);
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Failed to fetch projects: ${res.status}`, errorText);
      throw new Error(`Failed to fetch projects: ${res.status}`);
    }
    return res.json();
  } catch (error: unknown) {
    console.error("Error in getProjects:", error);
    throw error;
  }
};

export const addProject = async (project: Omit<Project, "id">) => {
  const res = await fetch(`${API}/projects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(project),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText);
  }
  return res.json();
};

export const updateProject = async (id: string, project: Partial<Project>) => {
  const res = await fetch(`${API}/projects/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(project),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText);
  }
  return res.json();
};

export const deleteProject = async (id: string) => {
  const res = await fetch(`${API}/projects/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText);
  }
  return res.json();
};

export const saveProjects = async (projects: Project[]) => {
  const res = await fetch(`${API}/projects/bulk`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(projects),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText);
  }
  return res.json();
};
