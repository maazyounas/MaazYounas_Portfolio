import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import {
    adminService,
    Project,
    Quote,
    Visitor,
    Analytics,
    HomePageData,
    AboutPageData,
    ContactPageData,
    GlobalSettings,
    SecuritySettings,
    SystemLog,
} from "@/lib/adminService";
import { SystemStatus, Notification } from "../types";

export const useAdminData = (isAuthenticated: boolean) => {
    const [loading, setLoading] = useState(true);

    // Data States
    const [projects, setProjects] = useState<Project[]>([]);
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [visitors, setVisitors] = useState<Visitor[]>([]);
    const [analytics, setAnalytics] = useState<Analytics>({
        totalViews: 0,
        uniqueVisitors: 0,
        projectViews: {},
        pageViews: {},
        bounceRate: 0,
        avgSessionDuration: 0,
        topReferrers: [],
        lastUpdated: new Date().toISOString(),
    });
    const [homeData, setHomeData] = useState<HomePageData | null>(null);
    const [aboutData, setAboutData] = useState<AboutPageData | null>(null);
    const [contactData, setContactData] = useState<ContactPageData | null>(null);
    const [globalSettings, setGlobalSettings] = useState<GlobalSettings | null>(null);
    const [securitySettings, setSecuritySettings] = useState<SecuritySettings | null>(null);
    const [activityLogs, setActivityLogs] = useState<SystemLog[]>([]);

    // UI States managed here for convenience
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: "1",
            type: "info",
            title: "System Update",
            message: "New version available",
            timestamp: new Date().toISOString(),
            read: false,
        },
        {
            id: "2",
            type: "warning",
            title: "High Memory Usage",
            message: "Memory usage is at 85%",
            timestamp: new Date().toISOString(),
            read: false,
        },
    ]);

    const [systemStatus] = useState<SystemStatus>({
        cpu: 45,
        memory: 65,
        storage: 78,
        uptime: "7d 14h",
        requests: 1245,
        activeUsers: 23,
        responseTime: 45,
        databaseSize: "1.2GB",
        lastBackup: "2h ago",
    });

    const loadData = useCallback(async () => {
        try {
            const [
                loadedProjects,
                loadedQuotes,
                loadedVisitors,
                loadedAnalytics,
                loadedHomeData,
                loadedAboutData,
                loadedContactData,
                loadedGlobalSettings,
                loadedSecuritySettings,
                loadedLogs,
            ] = await Promise.all([
                adminService.getProjects(),
                adminService.getQuotes(),
                adminService.getVisitors(),
                adminService.getAnalytics(),
                adminService.getHomePageData(),
                adminService.getAboutPageData(),
                adminService.getContactPageData(),
                adminService.getGlobalSettings(),
                adminService.getSecuritySettings(),
                adminService.getSystemLogs(),
            ]);

            setProjects(loadedProjects);
            setQuotes(loadedQuotes);
            setVisitors(loadedVisitors);
            setAnalytics(loadedAnalytics);
            setHomeData(loadedHomeData);
            setAboutData(loadedAboutData);
            setContactData(loadedContactData);
            setGlobalSettings(loadedGlobalSettings);
            setSecuritySettings(loadedSecuritySettings);
            setActivityLogs(loadedLogs.slice(0, 50));
            setLoading(false);
        } catch (error) {
            toast.error("Failed to load data");
            console.error(error);
            setLoading(false);
        }
    }, []);

    // Poll data when authenticated
    useEffect(() => {
        if (isAuthenticated) {
            loadData();
        }

        const interval = setInterval(() => {
            if (isAuthenticated) {
                loadData();
            }
        }, 30000);

        return () => clearInterval(interval);
    }, [isAuthenticated, loadData]);

    // Load security settings independently (needed for login check even if not authenticated)
    useEffect(() => {
        if (!isAuthenticated) {
            adminService
                .getSecuritySettings()
                .then(setSecuritySettings)
                .catch(console.error);
        }
    }, [isAuthenticated]);

    return {
        loading,
        data: {
            projects,
            quotes,
            visitors,
            analytics,
            homeData,
            aboutData,
            contactData,
            globalSettings,
            securitySettings,
            activityLogs,
            notifications,
            systemStatus,
        },
        actions: {
            refresh: loadData,
            setNotifications,
        },
    };
};
