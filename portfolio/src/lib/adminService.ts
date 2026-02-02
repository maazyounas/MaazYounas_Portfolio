import * as homeApi from "@/api/homeApi";
import * as quoteApi from "@/api/quoteApi";
import * as aboutApi from "@/api/aboutApi";
import * as projectApi from "@/api/projectApi";
import * as contactApi from "@/api/contactApi";
import * as settingsApi from "@/api/settingsApi";

// --- Extended Interfaces ---

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tech: string[];
  link: string;
  github?: string;

  // 🔥 Admin controlled flags
  showLink: boolean;
  showGithub: boolean;

  featured?: boolean;
  visible?: boolean;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
  category?: string;
  liveDemo?: string;
  complexity?: "beginner" | "intermediate" | "advanced";
  views?: number;
  features?: string[];
  date?: string;
}

export interface Quote {
  id: string;
  text: string;
  author?: string;
  category?: string;
  visible: boolean;
  createdAt: string;
}

export interface Visitor {
  id: string;
  email: string;
  date: string;
  page: string;
  ipAddress?: string;
  userAgent?: string;
  country?: string;
  duration?: number;
  referrer?: string;
}

export interface Analytics {
  totalViews: number;
  uniqueVisitors: number;
  projectViews: { [key: string]: number };
  pageViews: { [key: string]: number };
  bounceRate: number;
  avgSessionDuration: number;
  topReferrers: string[];
  lastUpdated: string;
}

export interface HomePageData {
  heroTagline: string;
  heroDescription: string;
  showProjects: boolean;
  showServices: boolean;
  showTestimonials: boolean;
  heroBackgroundStyle: "default" | "minimal" | "gradient" | "particles";
  heroButtons: Array<{
    text: string;
    link: string;
    variant: "primary" | "secondary" | "outline";
  }>;
  featuredProjects: string[]; // Array of project IDs
  seoTitle: string;
  seoDescription: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  location?: string;
  skillsUsed: string[];
  current?: boolean;
}

export interface Skill {
  name: string;
  level: number; // 1-5
  category: string;
  icon?: string;
}

export interface AboutPageData {
  profileImage: string;

  bio: string;
  shortIntro: string;
  tagline: string;
  techStack: {
    name: string;
    icon: string;
  }[];

  experience: ExperienceItem[];
  skills: Skill[];
  education: Array<{
    degree: string;
    institution: string;
    period: string;
    description: string;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    date: string;
    credentialId?: string;
  }>;
}

export interface ContactPageData {
  email: string;
  phone: string;
  location: string;
  socialLinks: Record<string, string>;
  formEnabled: boolean;
  contactFormFields: Array<{
    id: string;
    label: string;
    type: "text" | "email" | "textarea" | "select";
    required: boolean;
    placeholder?: string;
    options?: string[];
  }>;
  autoReplyMessage: string;
  notificationEmails: string[];
}

export interface GlobalSettings {
  primaryColor: string;
  accentColor: string;
  enableDarkMode: boolean;
  siteTitle: string;
  metaDescription: string;
  keywords: string[];
  enableAnimations: boolean;
  language: string;
  timezone: string;
  dateFormat: string;
  enableMaintenance: boolean;
  maintenanceMessage: string;
  cookieConsent: boolean;
  analyticsCode?: string;
  socialSharing: boolean;
  enableComments: boolean;
}

export interface SecuritySettings {
  adminUsername: string;
  adminPassword: string;
  enable2FA: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
  lockoutDuration: number;
  lastLogin?: string;
  loginAttempts?: number;
  lockUntil?: string;
  securityAlerts?: SecurityAlert[];
  ipWhitelist?: string[];
  requireHTTPS?: boolean;
  backupEncryption?: boolean;
  auditLogRetention?: number;

  // Add this line:
  resumeUrl?: string;
}

export interface SecurityAlert {
  id: string;
  type: "login_attempt" | "config_change" | "backup_created" | "error";
  title: string;
  message: string;
  severity: "low" | "medium" | "high" | "critical";
  timestamp: string;
  resolved: boolean;
  actionTaken?: string;
}

export interface SystemLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details: string;
  ipAddress: string;
  userAgent?: string;
  status: "success" | "failure" | "warning";
}

export interface Backup {
  id: string;
  name: string;
  type: "full" | "partial" | "database";
  createdAt: string;
  size: string;
  status: "completed" | "failed" | "processing";
  downloadUrl?: string;
  note?: string;
  includes: string[]; // ['projects', 'settings', 'logs', etc.]
}

export interface Notification {
  id: string;
  type: "info" | "warning" | "error" | "success";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  action?: {
    label: string;
    url: string;
  };
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  createdAt: string;
  lastLogin: string;
  active: boolean;
  permissions: string[];
}

export interface SystemStatus {
  cpu: number;
  memory: number;
  storage: number;
  uptime: string;
  requests: number;
  activeUsers: number;
  responseTime: number;
  databaseSize: string;
  lastBackup: string;
}

const API_BASE = "http://localhost:5000/api/admin"; // adjust if using deployed URL

const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// --- Mock Data for Security/Logs (Keep as fallback or unimplemented) ---
// These could be moved to their own API later
let mockSecuritySettings: SecuritySettings = {
  adminUsername: "admin",
  adminPassword: "Admin@123",
  enable2FA: false,

  sessionTimeout: 30,

  maxLoginAttempts: 5,
  lockoutDuration: 15,

  lastLogin: new Date().toISOString(),
  loginAttempts: 0,
  lockUntil: undefined,

  securityAlerts: [],
  ipWhitelist: [],
  requireHTTPS: true,
  backupEncryption: true,
  auditLogRetention: 30,
};

export const adminService = {
  // Projects
  getProjects: projectApi.getProjects,
  getProject: projectApi.getProject,
  saveProjects: projectApi.saveProjects,
  addProject: projectApi.addProject,
  updateProject: projectApi.updateProject,
  deleteProject: projectApi.deleteProject,

  // Quotes
  getQuotes: quoteApi.getQuotes,
  saveQuotes: quoteApi.saveQuotes,

  addQuote: async (quote: Omit<Quote, "id">) => {
    // Implementation detail: we could push to backend directly
    // But the previous pattern was fetching all and updating locally or handling IDs
    // For consistent behavior, let's fetch, modify, save or ideally create a new backend endpoint for single add
    // Since backend route is bulk save, we fetch all first.
    const quotes = await quoteApi.getQuotes();
    const newQuote = { ...quote, id: generateId(), visible: true };
    quotes.push(newQuote as Quote);
    await quoteApi.saveQuotes(quotes);
    return newQuote;
  },

  // Upload resume
  uploadResume: async (formData: FormData) => {
    const res = await fetch("/api/admin/resume", {
      method: "POST",
      body: formData, // send FormData directly
    });
    if (!res.ok) throw new Error("Upload failed");
    return res.json();
  },


  // ✅ Fetch latest resume URL
  getResumeUrl: async (): Promise<string> => {
    const res = await fetch(`${API_BASE}/resume`);
    if (!res.ok) return "";
    const data = await res.json();
    return data.resumeUrl || "";
  },

  // Change admin password
  changeAdminPassword: async (newPassword: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/change-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newPassword }),
    });

    if (!res.ok) {
      throw new Error("Failed to change password");
    }
  },

  // Send password reset email
  sendPasswordResetEmail: async (email: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      throw new Error("Failed to send password reset email");
    }
  },

  addVisitor: async () => {
    return fetch("/api/visitor", { method: "POST" });
  },

  updateQuote: async (id: string, quote: Partial<Quote>) => {
    const quotes = await quoteApi.getQuotes();
    const updatedQuotes = quotes.map((q) =>
      q.id === id ? { ...q, ...quote } : q,
    );
    await quoteApi.saveQuotes(updatedQuotes);
    return updatedQuotes.find((q) => q.id === id);
  },

  deleteQuote: async (id: string) => {
    const quotes = await quoteApi.getQuotes();
    const updatedQuotes = quotes.filter((q) => q.id !== id);
    return quoteApi.saveQuotes(updatedQuotes).then(() => ({ success: true }));
  },

  // Home Page
  getHomePageData: homeApi.getHomePageData,
  saveHomePageData: homeApi.saveHomePageData,

  // About Page
  getAboutPageData: aboutApi.getAboutPageData,
  saveAboutPageData: aboutApi.saveAboutPageData,

  // Contact Page
  getContactPageData: contactApi.getContactPageData,
  saveContactPageData: contactApi.saveContactPageData,

  // Global Settings
  getGlobalSettings: settingsApi.getGlobalSettings,
  saveGlobalSettings: settingsApi.saveGlobalSettings,

  // Security
  getSecuritySettings: async (): Promise<SecuritySettings> => {
    return Promise.resolve({ ...mockSecuritySettings });
  },
  saveSecuritySettings: async (data: SecuritySettings) => {
    mockSecuritySettings = data;
    return Promise.resolve(data);
  },

  // System Logs
  getSystemLogs: async (): Promise<SystemLog[]> => {
    return Promise.resolve([]);
  },
  saveSystemLogs: async (logs: SystemLog[]) => {
    return Promise.resolve();
  },

  logSystemActivity: async (log: Omit<SystemLog, "id">) => {
    // Can add to a mock log array if needed
    return Promise.resolve({
      id: generateId(),
      ...log,
      timestamp: new Date().toISOString(),
    } as SystemLog);
  },

  // Backups
  getBackups: async (): Promise<Backup[]> => {
    return Promise.resolve([]);
  },
  saveBackups: async (backups: Backup[]) => {
    return Promise.resolve();
  },

  createBackup: async (
    type: Backup["type"] = "full",
    note?: string,
  ): Promise<Backup> => {
    return Promise.resolve({
      id: generateId(),
      name: `Backup-${new Date().toISOString().split("T")[0]}-${type}`,
      type,
      createdAt: new Date().toISOString(),
      size: "12 MB",
      status: "completed",
      includes: [],
      note,
    });
  },

  // Notifications
  getNotifications: async (): Promise<Notification[]> => {
    return Promise.resolve([]);
  },
  saveNotifications: async (notifications: Notification[]) => {
    return Promise.resolve();
  },

  addNotification: async (
    notification: Omit<Notification, "id" | "timestamp" | "read">,
  ) => {
    return Promise.resolve({
      id: generateId(),
      ...notification,
      timestamp: new Date().toISOString(),
      read: false,
    } as Notification);
  },

  markNotificationAsRead: async (id: string) => {
    return Promise.resolve();
  },

  // Users
  getUsers: async (): Promise<User[]> => {
    return Promise.resolve([
      {
        id: "admin",
        username: "admin",
        email: "admin@example.com",
        role: "admin",
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        active: true,
        permissions: ["all"],
      },
    ]);
  },
  saveUsers: async (users: User[]) => {
    return Promise.resolve();
  },

  // Security Alerts
  getSecurityAlerts: async (): Promise<SecurityAlert[]> => {
    return Promise.resolve(mockSecuritySettings.securityAlerts || []);
  },

  addSecurityAlert: async (
    alert: Omit<SecurityAlert, "id" | "timestamp" | "resolved">,
  ) => {
    return Promise.resolve({
      id: generateId(),
      ...alert,
      timestamp: new Date().toISOString(),
      resolved: false,
    } as SecurityAlert);
  },

  // System Status (Simulated)
  getSystemStatus: async (): Promise<SystemStatus> => {
    return Promise.resolve({
      cpu: Math.floor(Math.random() * 30) + 20,
      memory: Math.floor(Math.random() * 40) + 30,
      storage: Math.floor(Math.random() * 30) + 60,
      uptime: "7d 14h 32m",
      requests: 1245,
      activeUsers: 23,
      responseTime: Math.floor(Math.random() * 100) + 50,
      databaseSize: "45.2 MB",
      lastBackup: new Date(Date.now() - 86400000).toISOString(),
    });
  },

  // Data Export
  exportAllData: async () => {
    const [projects, quotes, settings] = await Promise.all([
      projectApi.getProjects(),
      quoteApi.getQuotes(),
      settingsApi.getGlobalSettings(),
    ]);

    return JSON.stringify(
      {
        projects,
        quotes,
        settings,
      },
      null,
      2,
    );
  },

  // Data Import
  importData: async (jsonData: string): Promise<boolean> => {
    try {
      const data = JSON.parse(jsonData);
      if (data.projects) await projectApi.saveProjects(data.projects);
      if (data.quotes) await quoteApi.saveQuotes(data.quotes);
      if (data.settings) await settingsApi.saveGlobalSettings(data.settings);
      return Promise.resolve(true);
    } catch (e) {
      console.error("Import failed", e);
      return Promise.resolve(false);
    }
  },

  // Reset to defaults
  resetToDefaults: async (section?: string) => {
    console.log("Resetting to defaults (mock data reset)");
    return Promise.resolve();
  },
};
