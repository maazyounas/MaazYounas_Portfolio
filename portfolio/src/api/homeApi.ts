import { HomePageData } from "@/lib/adminService";

export const getHomePageData = async (): Promise<HomePageData> => {
    const res = await fetch("http://localhost:5000/api/home");
    if (!res.ok) throw new Error("Failed to fetch home page data");
    const data = await res.json();

    // Return default if null (no data yet)
    if (!data) {
        return {
            heroTagline: "Full Stack Developer",
            heroDescription: "Building digital experiences.",
            showProjects: true,
            showServices: true,
            showTestimonials: true,
            heroBackgroundStyle: "default",
            heroButtons: [],
            featuredProjects: [],
            seoTitle: "My Portfolio",
            seoDescription: "Welcome to my portfolio"
        };
    }
    return data;
};

export const saveHomePageData = async (data: HomePageData) => {
    const res = await fetch("http://localhost:5000/api/home", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to save home page data");
    return res.json();
};
