import { AboutPageData } from "@/lib/adminService";

export const getAboutPageData = async (): Promise<AboutPageData> => {
    try {
        const res = await fetch("http://localhost:5000/api/about");
        if (!res.ok) throw new Error("Failed to fetch about data");
        const data = await res.json();

        if (!data) {
            return {
                profileImage: "/placeholder.svg",
                bio: "",
                shortIntro: "",
                tagline: "",
                techStack: [],
                experience: [],
                skills: [],
                education: [],
                certifications: []
            };
        }

        return data;
    } catch (error) {
        console.error("Error fetching about data:", error);
        throw error;
    }
};

export const saveAboutPageData = async (data: AboutPageData) => {
    const res = await fetch("http://localhost:5000/api/about", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to save about data");
    return res.json();
};
