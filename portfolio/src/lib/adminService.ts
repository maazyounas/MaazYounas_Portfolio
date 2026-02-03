import * as homeApi from "../api/homeApi";
import * as quoteApi from "../api/quoteApi";
import * as aboutApi from "../api/aboutApi";
import * as projectApi from "../api/projectApi";
import * as contactApi from "../api/contactApi";
import * as settingsApi from "../api/settingsApi";
import axios from "axios";

// --- Extended Interfaces ---

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tech: string[];
  link: string;
  github?: string;
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
  tagline?: string;
}

export interface Quote {
  id: string;
  text: string;
  author?: string;
  category?: string;
  visible: boolean;
  createdAt: string;
  read?: boolean;
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

export interface Skill {
  name: string;
  level: number;
  category: string;
  icon?: string;
}

export interface AboutPageData {
  profileImage: string;
  shortIntro: string;
  tagline: string;
  bio?: string;
  techStack: {
    name: string;
    icon: string;
  }[];
  skills: Skill[];
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
  sessionTimeout: number;
  maxLoginAttempts: number;
  lockoutDuration: number;
  resumeUrl?: string;
  lastLogin?: string;
  loginAttempts?: number;
  lockUntil?: string;
  securityAlerts?: SecurityAlert[];
  ipWhitelist?: string[];
  requireHTTPS?: boolean;
  backupEncryption?: boolean;
  auditLogRetention?: number;
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

interface AdminDashboardProps {
  visitors: Visitor[];
  projects: Project[];
  quotes: Quote[];
  systemStatus?: SystemStatus;
}


const API_BASE = "http://localhost:5000/api/admin";

const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Fetch visitors from the public API
export const getVisitors = async (): Promise<Visitor[]> => {
  try {
    const res = await axios.get("http://localhost:5000/api/visitors");
    return res.data;
  } catch (error) {
    console.error("Failed to fetch visitors:", error);
    return [];
  }
};

export const adminService = {
  // Projects
  getProjects: projectApi.getProjects,
  getProject: projectApi.getProject,
  saveProjects: projectApi.saveProjects,
  addProject: projectApi.addProject,
  updateProject: projectApi.updateProject,
  deleteProject: projectApi.deleteProject,

  // Add project view tracking
  addProjectView: async (projectId: string): Promise<void> => {
    try {
      await fetch(`http://localhost:5000/api/projects/${projectId}/view`, {
        method: "POST",
      });
    } catch (error) {
      console.error("Failed to add project view:", error);
    }
  },

  // Quotes
  getQuotes: quoteApi.getQuotes,
  saveQuotes: quoteApi.saveQuotes,

  addQuote: async (quote: Omit<Quote, "id">): Promise<Quote> => {
    const quotes = await quoteApi.getQuotes();
    const newQuote = {
      ...quote,
      id: generateId(),
      visible: true,
      createdAt: new Date().toISOString()
    };
    quotes.push(newQuote as Quote);
    await quoteApi.saveQuotes(quotes);
    return newQuote as Quote;
  },

  updateQuote: async (id: string, quote: Partial<Quote>): Promise<Quote | undefined> => {
    const quotes = await quoteApi.getQuotes();
    const updatedQuotes = quotes.map((q) =>
      q.id === id ? { ...q, ...quote } : q,
    );
    await quoteApi.saveQuotes(updatedQuotes);
    return updatedQuotes.find((q) => q.id === id);
  },

  deleteQuote: async (id: string): Promise<{ success: boolean }> => {
    const quotes = await quoteApi.getQuotes();
    const updatedQuotes = quotes.filter((q) => q.id !== id);
    await quoteApi.saveQuotes(updatedQuotes);
    return { success: true };
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

  // Security Settings
  getSecuritySettings: async (): Promise<SecuritySettings> => {
    try {
      // Try to fetch from server first
      const response = await axios.get(`${API_BASE}/security-settings`);
      return response.data;
    } catch (error) {
      console.warn("Failed to fetch security settings, using defaults");
      // Return default settings
      return {
        adminUsername: "admin",
        adminPassword: "Admin@123",
        sessionTimeout: 30,
        maxLoginAttempts: 5,
        lockoutDuration: 15,
        resumeUrl: "",
      };
    }
  },

  saveSecuritySettings: async (data: SecuritySettings): Promise<SecuritySettings> => {
    try {
      const response = await axios.post(`${API_BASE}/security-settings`, data);
      return response.data;
    } catch (error) {
      console.error("Failed to save security settings:", error);
      throw error;
    }
  },

  // Resume Functions
  getResumeUrl: async (): Promise<string> => {
    try {
      const response = await axios.get(`${API_BASE}/resume-url`);
      return response.data.resumeUrl || "";
    } catch (error) {
      console.error("Error fetching resume URL:", error);
      return "";
    }
  },

  uploadResume: async (file: File): Promise<{ resumeUrl: string }> => {
    const formData = new FormData();
    formData.append("resume", file);

    const response = await axios.post(`${API_BASE}/upload-resume`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  // Password Management
  changeAdminPassword: async (newPassword: string): Promise<void> => {
    await axios.post(`${API_BASE}/change-password`, { newPassword });
  },

  sendPasswordResetEmail: async (email: string): Promise<void> => {
    await axios.post(`${API_BASE}/forgot-password`, { email });
  },

  // Visitors
  getVisitors: async (): Promise<Visitor[]> => {
    try {
      const response = await axios.get(`${API_BASE}/visitors`);
      return response.data;
    } catch (error) {
      console.error("Error fetching visitors:", error);
      return [];
    }
  },

  addVisitor: async (visitorData: Omit<Visitor, "id">): Promise<Visitor> => {
    const response = await axios.post(`${API_BASE}/visitors`, {
      ...visitorData,
      id: generateId(),
    });
    return response.data;
  },

  // Analytics
  getAnalytics: async (): Promise<Analytics> => {
    try {
      const response = await axios.get(`${API_BASE}/analytics`);
      return response.data;
    } catch (error) {
      console.error("Error fetching analytics:", error);
      return {
        totalViews: 0,
        uniqueVisitors: 0,
        projectViews: {},
        pageViews: {},
        bounceRate: 0,
        avgSessionDuration: 0,
        topReferrers: [],
        lastUpdated: new Date().toISOString(),
      };
    }
  },

  // System Logs
  getSystemLogs: async (): Promise<SystemLog[]> => {
    try {
      const response = await axios.get(`${API_BASE}/system-logs`);
      return response.data;
    } catch (error) {
      console.error("Error fetching system logs:", error);
      return [];
    }
  },

  logSystemActivity: async (log: Omit<SystemLog, "id">): Promise<SystemLog> => {
    try {
      const response = await axios.post(`${API_BASE}/system-logs`, {
        ...log,
        id: generateId(),
        timestamp: new Date().toISOString(),
      });
      return response.data;
    } catch (error) {
      console.error("Error logging system activity:", error);
      return {
        id: generateId(),
        ...log,
        timestamp: new Date().toISOString(),
      } as SystemLog;
    }
  },

  // System Status (Simulated)
  getSystemStatus: async (): Promise<SystemStatus> => {
    return {
      cpu: Math.floor(Math.random() * 30) + 20,
      memory: Math.floor(Math.random() * 40) + 30,
      storage: Math.floor(Math.random() * 30) + 60,
      uptime: "7d 14h 32m",
      requests: Math.floor(Math.random() * 1000) + 500,
      activeUsers: Math.floor(Math.random() * 20) + 5,
      responseTime: Math.floor(Math.random() * 100) + 50,
      databaseSize: "45.2 MB",
      lastBackup: new Date(Date.now() - 86400000).toISOString(),
    };
  },

  // Backups
  getBackups: async (): Promise<Backup[]> => {
    try {
      const response = await axios.get(`${API_BASE}/backups`);
      return response.data;
    } catch (error) {
      console.error("Error fetching backups:", error);
      return [];
    }
  },

  createBackup: async (
    type: Backup["type"] = "full",
    note?: string,
  ): Promise<Backup> => {
    const response = await axios.post(`${API_BASE}/backups`, {
      type,
      note,
      name: `Backup-${new Date().toISOString().split("T")[0]}-${type}`,
    });
    return response.data;
  },

  // Notifications
  getNotifications: async (): Promise<Notification[]> => {
    try {
      const response = await axios.get(`${API_BASE}/notifications`);
      return response.data;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return [];
    }
  },

  addNotification: async (
    notification: Omit<Notification, "id" | "timestamp" | "read">,
  ): Promise<Notification> => {
    const response = await axios.post(`${API_BASE}/notifications`, {
      ...notification,
      id: generateId(),
      timestamp: new Date().toISOString(),
      read: false,
    });
    return response.data;
  },

  markNotificationAsRead: async (id: string): Promise<void> => {
    await axios.patch(`${API_BASE}/notifications/${id}`, { read: true });
  },

  // Users
  getUsers: async (): Promise<User[]> => {
    try {
      const response = await axios.get(`${API_BASE}/users`);
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      return [
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
      ];
    }
  },

  // Data Export
  exportAllData: async (): Promise<string> => {
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
        exportDate: new Date().toISOString(),
      },
      null,
      2,
    );
  },

  // Data Import
  importData: async (jsonData: string): Promise<boolean> => {
    try {
      const data = JSON.parse(jsonData);

      const promises = [];
      if (data.projects) promises.push(projectApi.saveProjects(data.projects));
      if (data.quotes) promises.push(quoteApi.saveQuotes(data.quotes));
      if (data.settings) promises.push(settingsApi.saveGlobalSettings(data.settings));

      await Promise.all(promises);
      return true;
    } catch (error) {
      console.error("Import failed:", error);
      return false;
    }
  },

  // Reset to defaults
  resetToDefaults: async (section?: string): Promise<void> => {
    try {
      await axios.post(`${API_BASE}/reset`, { section });
    } catch (error) {
      console.error("Reset failed:", error);
    }
  },

  // Security Alerts
  addSecurityAlert: async (
    alert: Omit<SecurityAlert, "id" | "timestamp" | "resolved">,
  ): Promise<SecurityAlert> => {
    const response = await axios.post(`${API_BASE}/security-alerts`, {
      ...alert,
      id: generateId(),
      timestamp: new Date().toISOString(),
      resolved: false,
    });
    return response.data;
  },
};