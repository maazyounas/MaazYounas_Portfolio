import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  Shield,
  LayoutDashboard,
  Home,
  User,
  FolderKanban,
  Mail,
  Lock,
  LogOut,
  Menu,
  LogIn,
  Eye,
  EyeOff,
  Bell,
  Users,
  RefreshCw,
  ChevronRight,
  ChevronLeft,
  ShieldAlert,
  Key,
  HardDrive,
  Cpu,
  Network,
  History,
  ShieldCheck,
  DatabaseBackup,
  FileText,
  Download,
  Server,
  Clock,
  X,
  Moon,
  Sun,
  AlertCircle,
  CheckCircle,
  Info,
} from "lucide-react";
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
  Backup,
  Notification,
} from "@/lib/adminService";

// Components
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminHome from "@/components/admin/AdminHome";
import AdminAbout from "@/components/admin/AdminAbout";
import AdminProjects from "@/components/admin/AdminProjects";
import AdminContact from "@/components/admin/AdminContact";
import AdminSecurity from "@/components/admin/AdminSecurity";
import SystemMonitor from "@/components/admin/SystemMonitor";
import ActivityLog from "@/components/admin/ActivityLog";
import UserManagement from "@/components/admin/UserManagement";
import SearchBar from "@/components/admin/SearchBar";

interface SystemStatus {
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

type AdminTab =
  | "dashboard"
  | "home"
  | "about"
  | "projects"
  | "contact"
  | "settings"
  | "security"
  | "system"
  | "users"
  | "logs";


// Notification Center Component
const NotificationCenter = ({
  notifications,
  onMarkAllAsRead,
  onClearAll,
  darkMode,
  onClose,
}: {
  notifications: Notification[];
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  darkMode: boolean;
  onClose: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="absolute right-0 top-12 w-80 sm:w-96 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50"
  >
    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          Notifications
          <span className="ml-2 px-2 py-1 text-xs bg-primary text-primary-foreground rounded-full">
            {notifications.filter((n) => !n.read).length}
          </span>
        </h3>
        <div className="flex gap-2">
          <button
            onClick={onMarkAllAsRead}
            className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
          >
            Mark all read
          </button>
          <button
            onClick={onClearAll}
            className="text-xs px-3 py-1 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800 rounded"
          >
            Clear all
          </button>
        </div>
      </div>
    </div>
    <div className="max-h-96 overflow-y-auto">
      {notifications.length === 0 ? (
        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
          <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No notifications</p>
        </div>
      ) : (
        notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 ${!notification.read ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`p-2 rounded-full ${notification.type === "warning" ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400" : notification.type === "error" ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400" : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"}`}
              >
                {notification.type === "warning" ? (
                  <AlertCircle className="w-4 h-4" />
                ) : notification.type === "error" ? (
                  <X className="w-4 h-4" />
                ) : (
                  <Info className="w-4 h-4" />
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm text-gray-900 dark:text-white">
                  {notification.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {notification.message}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {new Date(notification.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  </motion.div>
);

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ username: string; role: string } | null>(
    null,
  );
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockUntil, setLockUntil] = useState<Date | null>(null);

  const logout = useCallback(async () => {
    try {
      await adminService.logSystemActivity({
        action: "logout",
        user: user?.username || "unknown",
        timestamp: new Date().toISOString(),
        details: "User logged out",
        ipAddress: "127.0.0.1",
        status: "success",
      });
    } catch (error) {
      console.error("Logout logging error:", error);
    }

    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("admin_auth");
    localStorage.removeItem("admin_user");
    localStorage.removeItem("admin_last_activity");
    sessionStorage.removeItem("admin_session");
  }, [user]);

  useEffect(() => {
    const savedAuth = localStorage.getItem("admin_auth");
    const savedUser = localStorage.getItem("admin_user");
    const savedLock = localStorage.getItem("admin_lock_until");
    const lastActivity = localStorage.getItem("admin_last_activity");
    const sessionId = sessionStorage.getItem("admin_session");

    // Check if tab was closed (no sessionId)
    if (savedAuth === "true" && !sessionId) {
      logout();
      toast.info("Session expired. Please login again.");
      return;
    }

    // Check session timeout (30 min)
    if (savedAuth === "true" && lastActivity) {
      const timeSinceActivity = Date.now() - parseInt(lastActivity);
      if (timeSinceActivity > SESSION_TIMEOUT) {
        logout();
        toast.error("Session expired due to inactivity");
        return;
      }
    }

    if (savedAuth === "true" && savedUser && sessionId) {
      setIsAuthenticated(true);
      setUser(JSON.parse(savedUser));
    }

    if (savedLock) {
      const lockTime = new Date(savedLock);
      if (lockTime > new Date()) {
        setLockUntil(lockTime);
      }
    }
  }, [logout]);

  // Activity tracker
  useEffect(() => {
    if (!isAuthenticated) return;

    const updateActivity = () => {
      localStorage.setItem("admin_last_activity", Date.now().toString());
    };

    // Update on user interaction
    const events = ["mousedown", "keydown", "scroll", "touchstart"];
    events.forEach((event) => window.addEventListener(event, updateActivity));

    // Check session timeout every minute
    const interval = setInterval(() => {
      const lastActivity = localStorage.getItem("admin_last_activity");
      if (lastActivity) {
        const timeSinceActivity = Date.now() - parseInt(lastActivity);
        if (timeSinceActivity > SESSION_TIMEOUT) {
          logout();
          toast.error("Session expired due to inactivity");
        }
      }
    }, 60000);

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, updateActivity),
      );
      clearInterval(interval);
    };
  }, [isAuthenticated, logout]);

  const login = async (
    username: string,
    password: string,
    twoFactorCode?: string,
  ): Promise<boolean> => {
    const now = new Date();

    if (lockUntil && now < lockUntil) {
      const timeLeft = Math.ceil((lockUntil.getTime() - now.getTime()) / 60000);
      toast.error(`Account locked. Try again in ${timeLeft} minutes.`);
      return false;
    }

    try {
      let fetched: SecuritySettings | null = null;

      try {
        fetched = await adminService.getSecuritySettings();
      } catch {
        console.warn("Failed to fetch security settings, using defaults");
      }

      const settings: SecuritySettings = {
        adminUsername: fetched?.adminUsername || "admin",
        adminPassword: fetched?.adminPassword || "Admin@123",
        enable2FA: fetched?.enable2FA ?? false,
        sessionTimeout: fetched?.sessionTimeout ?? 30,
        maxLoginAttempts: fetched?.maxLoginAttempts ?? 5,
        lockoutDuration: fetched?.lockoutDuration ?? 15,
      };

      const adminUsername = settings.adminUsername.trim();
      const adminPassword = settings.adminPassword.trim();

      if (username === adminUsername && password === adminPassword) {
        if (settings.enable2FA && !twoFactorCode) {
          toast.error("2FA Code required");
          return false;
        }

        if (settings.enable2FA && twoFactorCode) {
          if (!/^\d{6}$/.test(twoFactorCode)) {
            toast.error("Invalid 2FA code");
            return false;
          }
        }

        setIsAuthenticated(true);
        const userData = { username, role: "admin" };
        setUser(userData);
        setLoginAttempts(0);
        setLockUntil(null);

        localStorage.setItem("admin_auth", "true");
        localStorage.setItem("admin_user", JSON.stringify(userData));
        localStorage.setItem("admin_last_activity", Date.now().toString());
        sessionStorage.setItem("admin_session", Date.now().toString());
        localStorage.removeItem("admin_login_attempts");
        localStorage.removeItem("admin_lock_until");

        await adminService.logSystemActivity({
          action: "login",
          user: username,
          timestamp: now.toISOString(),
          details: "Successful login",
          ipAddress: "127.0.0.1",
          status: "success",
        });

        return true;
      }

      // ❗ use DB-configured limits
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      localStorage.setItem("admin_login_attempts", newAttempts.toString());

      if (newAttempts >= settings.maxLoginAttempts) {
        const lockTime = new Date(
          now.getTime() + settings.lockoutDuration * 60000,
        );
        setLockUntil(lockTime);
        localStorage.setItem("admin_lock_until", lockTime.toISOString());
        toast.error(
          `Too many failed attempts. Account locked for ${settings.lockoutDuration} minutes.`,
        );
      } else {
        toast.error(
          `Invalid credentials. ${settings.maxLoginAttempts - newAttempts
          } attempts remaining.`,
        );
      }

      return false;
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login.");
      return false;
    }
  };

  return { isAuthenticated, user, login, logout, lockUntil };
};

const Admin = () => {
  const { isAuthenticated, user, login, logout, lockUntil } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Persist active tab
  const [activeTab, setActiveTab] = useState<AdminTab>(() => {
    const saved = localStorage.getItem("admin_active_tab");
    return (saved as AdminTab) || "dashboard";
  });

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("admin_dark_mode");
    return saved ? JSON.parse(saved) : true;
  });
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
    {
      id: "3",
      type: "info",
      title: "Backup Completed",
      message: "System backup was successful",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: true,
    },
  ]);
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
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
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [activityLogs, setActivityLogs] = useState<SystemLog[]>([]);

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
  const [globalSettings, setGlobalSettings] = useState<GlobalSettings | null>(
    null,
  );
  const [securitySettings, setSecuritySettings] =
    useState<SecuritySettings | null>(null);
  const [backups, setBackups] = useState<Backup[]>([]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("admin_dark_mode", JSON.stringify(!darkMode));
  };

  // Apply dark mode to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Save active tab to localStorage
  useEffect(() => {
    localStorage.setItem("admin_active_tab", activeTab);
  }, [activeTab]);

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
  }, []); // Empty dependency array - function doesn't depend on any props/state

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }

    const interval = setInterval(() => {
      if (isAuthenticated) {
        loadData();
        updateSystemStatus();
      }
    }, 30000);

    const statusInterval = setInterval(updateSystemStatus, 5000);

    return () => {
      clearInterval(interval);
      clearInterval(statusInterval);
    };
  }, [isAuthenticated, loadData]);

  useEffect(() => {
    if (!isAuthenticated) {
      adminService
        .getSecuritySettings()
        .then(setSecuritySettings)
        .catch(console.error);
    }
  }, [isAuthenticated]);

  const updateSystemStatus = () => {
    setSystemStatus((prev) => ({
      ...prev,
      cpu: Math.min(100, Math.max(10, prev.cpu + (Math.random() * 10 - 5))),
      memory: Math.min(
        100,
        Math.max(20, prev.memory + (Math.random() * 6 - 3)),
      ),
      requests: prev.requests + Math.floor(Math.random() * 10),
      activeUsers: Math.max(
        1,
        prev.activeUsers + Math.floor(Math.random() * 3 - 1),
      ),
      responseTime: Math.max(10, prev.responseTime + (Math.random() * 10 - 5)),
      databaseSize: prev.databaseSize,
      lastBackup: prev.lastBackup,
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    const success = await login(username, password, twoFactorCode);
    setIsLoggingIn(false);
    if (success) {
      toast.success("Welcome back!");
    }
  };

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
  };

  const handleExportData = () => {
    const data = {
      projects,
      quotes,
      visitors,
      analytics,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `admin-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Data exported successfully");
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    toast.info("All notifications cleared");
  };

  const handleNotificationClick = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <>
        <Helmet>
          <title>Admin Login | Secure Portal</title>
        </Helmet>
        <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-10 left-5 sm:top-20 sm:left-20 w-48 h-48 sm:w-64 sm:h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none"
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            className="absolute bottom-20 right-5 sm:bottom-40 sm:right-20 w-64 h-64 sm:w-96 sm:h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md relative z-10"
          >
            <div className="glass-neon rounded-2xl shadow-2xl p-6 sm:p-8 border border-border/50">
              <div className="flex justify-center mb-6 sm:mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="inline-flex items-center gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-full glass border border-primary/20"
                >
                  <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-metallic">
                      Admin Portal
                    </h1>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Secure Access
                    </p>
                  </div>
                </motion.div>
              </div>

              {lockUntil && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                >
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                    <ShieldAlert className="w-5 h-5" />
                    <span className="font-semibold text-sm sm:text-base">
                      Account Locked
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-red-500 dark:text-red-300 mt-1">
                    Too many failed attempts. Try again at{" "}
                    {lockUntil.toLocaleTimeString()}
                  </p>
                </motion.div>
              )}

              <form onSubmit={handleLogin} className="space-y-5 sm:space-y-6">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-foreground mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-4 py-2.5 sm:py-3 input-neon text-foreground text-sm sm:text-base"
                      placeholder="Enter username"
                      disabled={!!lockUntil}
                      required
                    />
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-foreground mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-2.5 sm:py-3 input-neon text-foreground text-sm sm:text-base pr-12"
                      placeholder="Enter password"
                      disabled={!!lockUntil}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                      ) : (
                        <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {securitySettings?.enable2FA && (
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-foreground mb-2">
                      2FA Code
                    </label>
                    <input
                      type="text"
                      value={twoFactorCode}
                      onChange={(e) => setTwoFactorCode(e.target.value)}
                      className="w-full px-4 py-2.5 sm:py-3 input-neon text-foreground text-sm sm:text-base"
                      placeholder="Enter 6-digit code"
                      maxLength={6}
                    />
                  </div>
                )}

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isLoggingIn || !!lockUntil}
                  className="w-full px-4 py-2.5 sm:py-3 btn-neon text-primary-foreground font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  {isLoggingIn ? (
                    <>
                      <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 sm:w-5 sm:h-5" />
                      Sign In
                    </>
                  )}
                </motion.button>
              </form>

              <div className="mt-6 sm:mt-8 pt-6 border-t border-border/30 text-center">
                <p className="text-xs sm:text-sm text-muted-foreground flex items-center justify-center gap-1">
                  <Key className="w-3 h-3 sm:w-4 sm:h-4" />
                  Secure • Encrypted • 30 min session
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </>
    );
  }

  // Admin Dashboard
  return (
    <>
      <Helmet>
        <title>
          Admin Dashboard | {user?.username || "Administrator"} | {activeTab}
        </title>
      </Helmet>
      <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
        <div className="min-h-screen bg-background text-foreground flex overflow-hidden">
          {/* Mobile Overlay */}
          <AnimatePresence>
            {mobileSidebar && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                onClick={() => setMobileSidebar(false)}
              />
            )}
          </AnimatePresence>

          {/* Sidebar */}
          <motion.aside
            initial={false}
            animate={{
              x: mobileSidebar
                ? 0
                : window.innerWidth < 1024
                  ? -280
                  : sidebarOpen
                    ? 0
                    : -280,
            }}
            className="fixed lg:sticky lg:top-0 w-64 sm:w-72 h-screen glass border-r border-border/50 z-50 flex flex-col shadow-xl"
          >
            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
              <div className="flex items-center justify-between mb-6 sm:mb-8">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 rounded-xl bg-gradient-to-br from-primary to-primary/80">
                    <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <span className="text-base sm:text-lg font-bold text-metallic">
                      Admin
                    </span>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">
                      v2.1.0
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSidebarOpen(!sidebarOpen);
                    setMobileSidebar(false);
                  }}
                  className="p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5 lg:hidden" />
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 hidden lg:block" />
                </button>
              </div>

              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                darkMode={darkMode}
              />

              <nav className="mt-6 space-y-1">
                {[
                  {
                    id: "dashboard",
                    icon: LayoutDashboard,
                    label: "Dashboard",
                    badge: 3,
                  },
                  { id: "home", icon: Home, label: "Home Page" },
                  { id: "about", icon: User, label: "About Page" },
                  {
                    id: "projects",
                    icon: FolderKanban,
                    label: "Projects",
                    badge: projects.length,
                  },
                  { id: "users", icon: Users, label: "Users" },
                  {
                    id: "contact",
                    icon: Mail,
                    label: "Contact",
                    badge: quotes.length,
                  },
                  { id: "system", icon: Server, label: "System" },
                  { id: "logs", icon: History, label: "Logs" },
                  { id: "security", icon: Lock, label: "Security" },
                ].map((item) => (
                  <motion.button
                    key={item.id}
                    whileHover={{ x: 4 }}
                    onClick={() => {
                      setActiveTab(item.id as AdminTab);
                      setMobileSidebar(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all text-sm sm:text-base ${activeTab === item.id
                      ? "bg-primary text-primary-foreground neon-glow-soft"
                      : "text-foreground hover:bg-secondary/50"
                      }`}
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <item.icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full ${activeTab === item.id
                          ? "bg-primary-foreground/20"
                          : "bg-primary/10 text-primary"
                          }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </motion.button>
                ))}
              </nav>
            </div>

            <div className="mt-auto p-4 sm:p-6 border-t border-border/30 space-y-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm sm:text-base"
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                Sign Out
              </button>
            </div>
          </motion.aside>

          {/* Main Content */}
          <div className="flex-1 min-h-screen flex flex-col">
            {/* Top Bar */}
            <header className="h-16 bg-background border-b border-border flex items-center justify-between px-4 sm:px-6 sticky top-0 z-40 shadow-sm">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setMobileSidebar(true)}
                  className="p-2 rounded-lg hover:bg-secondary/50 lg:hidden"
                >
                  <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 rounded-lg hover:bg-secondary/50 hidden lg:block"
                >
                  {sidebarOpen ? (
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                  ) : (
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                  )}
                </button>
                <div className="hidden md:block">
                  <h2 className="text-lg font-semibold text-foreground capitalize">
                    {activeTab.replace(/([A-Z])/g, " $1")}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Last updated: {new Date().toLocaleTimeString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:gap-4">
                <div className="hidden sm:block">
                  <SystemMonitor status={systemStatus} darkMode={darkMode} />
                </div>

                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 rounded-lg hover:bg-secondary/50 relative"
                  >
                    <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
                    {notifications.filter((n) => !n.read).length > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-primary-foreground text-xs rounded-full flex items-center justify-center">
                        {notifications.filter((n) => !n.read).length}
                      </span>
                    )}
                  </button>

                  <AnimatePresence>
                    {showNotifications && (
                      <NotificationCenter
                        notifications={notifications}
                        onMarkAllAsRead={markAllNotificationsAsRead}
                        onClearAll={clearAllNotifications}
                        darkMode={darkMode}
                        onClose={() => setShowNotifications(false)}
                      />
                    )}
                  </AnimatePresence>
                </div>

                <div className="hidden md:flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Welcome,</span>
                  <span className="font-semibold text-foreground">
                    {user?.username}
                  </span>
                </div>
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-bold cursor-pointer">
                  {user?.username?.charAt(0).toUpperCase() || "A"}
                </div>
              </div>
            </header>

            {/* Content Area */}
            <main className="flex-1 p-3 sm:p-4 lg:p-6 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-2 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-sm sm:text-base text-muted-foreground">
                      Loading dashboard...
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 sm:space-y-6">
                  {/* Action Bar */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                    <div className="flex items-center gap-2">
                      <h1 className="text-xl sm:text-2xl font-bold text-metallic capitalize">
                        {activeTab.replace(/([A-Z])/g, " $1")}
                      </h1>
                      <span className="px-2 sm:px-3 py-1 bg-primary/10 text-primary text-xs sm:text-sm rounded-full">
                        Active
                      </span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                      <button
                        onClick={loadData}
                        className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg glass border border-border/50 hover:bg-secondary/50 transition-colors flex-1 sm:flex-none text-xs sm:text-sm"
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span className="hidden sm:inline">Refresh</span>
                      </button>
                      <button
                        onClick={handleExportData}
                        className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 btn-neon flex-1 sm:flex-none text-xs sm:text-sm"
                      >
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">Export</span>
                      </button>
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="glass-neon rounded-2xl shadow-xl border border-border/50 p-4 sm:p-6">
                    {activeTab === "dashboard" && (
                      <AdminDashboard
                        analytics={analytics}
                        visitors={visitors}
                        projects={projects}
                        quotes={quotes}
                        systemStatus={systemStatus}
                      />
                    )}
                    {activeTab === "home" && homeData && (
                      <AdminHome
                        data={homeData}
                        quotes={quotes}
                        projects={projects}
                        onUpdate={loadData}
                      />
                    )}
                    {activeTab === "about" && aboutData && (
                      <AdminAbout data={aboutData} onUpdate={loadData} />
                    )}
                    {activeTab === "projects" && (
                      <AdminProjects projects={projects} onUpdate={loadData} />
                    )}
                    {activeTab === "users" && (
                      <UserManagement onUpdate={loadData} />
                    )}
                    {activeTab === "contact" && contactData && (
                      <AdminContact data={contactData} onUpdate={loadData} />
                    )}
                    {activeTab === "system" && (
                      <SystemMonitor
                        status={systemStatus}
                        detailed
                        onRefresh={updateSystemStatus}
                        darkMode={darkMode}
                      />
                    )}
                    {activeTab === "logs" && (
                      <ActivityLog logs={activityLogs} />
                    )}
                    {activeTab === "security" && securitySettings && (
                      <AdminSecurity
                        data={securitySettings}
                        onUpdate={loadData}
                      />
                    )}
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default Admin;