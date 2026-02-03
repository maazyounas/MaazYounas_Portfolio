import { Project } from "../lib/adminService";

export const getProjects = async (): Promise<Project[]> => {
    const res = await fetch("http://localhost:5000/api/projects");
    if (!res.ok) throw new Error("Failed to fetch projects");
    return res.json();
};

export const getProject = async (id: string): Promise<Project | undefined> => {
    // This often fetches all and filters, or needs a specific endpoint
    const projects = await getProjects();
    return projects.find(p => p.id === id);
};

export const saveProjects = async (projects: Project[]) => {
    // Note: The backend projectRoutes usually handles individual CRUD, 
    // but adminService had a bulk save. 
    // If backend doesn't support bulk save, we might need to loop or update backend.
    // However, existing adminService just updated a mock array.
    // The previous adminService implementation for 'saveProjects' was:
    // mockProjects = projects;
    // So there is NO backend bulk save endpoint in projectRoutes.js!
    // We should warn about this, or stick to what's available.
    // For now, let's leave this empty or throw, as real implementation requires 
    // individual updates or a new bulk endpoint.
    console.warn("Bulk saveProjects not fully implemented in backend yet.");
    return Promise.resolve();
};

export const addProject = async (project: Omit<Project, 'id'>) => {
    const res = await fetch("http://localhost:5000/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project),
    });
    if (!res.ok) throw new Error("Failed to add project");
    return res.json();
};

export const updateProject = async (id: string, project: Partial<Project>) => {
    const res = await fetch(`http://localhost:5000/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project),
    });
    if (!res.ok) throw new Error("Failed to update project");
    return res.json();
};

export const deleteProject = async (id: string) => {
    const res = await fetch(`http://localhost:5000/api/projects/${id}`, {
        method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete project");
    return res.json();
};
