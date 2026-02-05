import { ContactPageData } from "../lib/adminService";

export const getContactPageData = async (): Promise<ContactPageData> => {
    try {
        const res = await fetch("/api/contact");
        if (!res.ok) throw new Error("Failed to fetch contact data");
        const data = await res.json();

        if (!data) {
            return {
                email: "contact@example.com",
                phone: "+1234567890",
                location: "Location",
                socialLinks: {},
                formEnabled: true,
                contactFormFields: [],
                notificationEmails: []
            };
        }
        return data;
    } catch (error) {
        console.error("Error fetching contact data:", error);
        throw error;
    }
};

export const saveContactPageData = async (data: ContactPageData) => {
    const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to save contact data");
    return res.json();
};
