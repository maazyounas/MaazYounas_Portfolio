// api/visitorApi.ts
export interface Visitor {
  id: string;
  email?: string;
  page: string;
  country?: string;
  device?: string;
  date: string;
}

// Log a new visitor
export const logVisitor = async (url: string): Promise<void> => {
  const res = await fetch("http://localhost:5000/api/visitors/log", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  if (!res.ok) throw new Error("Failed to log visitor");
};

// Fetch all visitors (admin)
export const getVisitors = async (): Promise<Visitor[]> => {
  const res = await fetch("http://localhost:5000/api/visitors");
  if (!res.ok) throw new Error("Failed to fetch visitors");
  return res.json();
};
