import { GlobalSettings } from "../lib/adminService";

export const getGlobalSettings = async (): Promise<GlobalSettings> => {
    const res = await fetch("http://localhost:5000/api/settings");
    if (!res.ok) throw new Error("Failed to fetch settings");
    const data = await res.json();

    if (!data) {
        return {
            primaryColor: "#000000",
            accentColor: "#3b82f6",
            enableDarkMode: true,
            siteTitle: "My Portfolio",
            metaDescription: "Portfolio",
            keywords: ["portfolio"],
            enableAnimations: true,
            language: "en",
            timezone: "UTC",
            dateFormat: "MM/DD/YYYY",
            enableMaintenance: false,
            maintenanceMessage: "Under Maintenance",
            cookieConsent: true,
            socialSharing: true,
            enableComments: false
        };
    }
    return data;
};

export const saveGlobalSettings = async (data: GlobalSettings) => {
    const res = await fetch("http://localhost:5000/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to save settings");
    return res.json();
};
