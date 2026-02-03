import { Quote } from "@/lib/adminService";

export const getQuotes = async (): Promise<Quote[]> => {
    const res = await fetch("http://localhost:5000/api/quotes");
    if (!res.ok) throw new Error("Failed to fetch quotes");
    const data = await res.json();
    return data || [];
};

export const saveQuotes = async (quotes: Quote[]) => {
    const res = await fetch("http://localhost:5000/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quotes),
    });
    if (!res.ok) throw new Error("Failed to save quotes");
    return res.json();
};
