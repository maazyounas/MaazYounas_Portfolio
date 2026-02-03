import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { AdminTab, Notification, SystemStatus } from "../types";

interface AdminLayoutProps {
    children: React.ReactNode;
    activeTab: AdminTab;
    setActiveTab: (tab: AdminTab) => void;
    user: { username: string; role: string } | null;
    notifications: Notification[];
    markAllNotificationsAsRead: () => void;
    clearAllNotifications: () => void;
    systemStatus: SystemStatus;
    projectCount: number;
    quoteCount: number;
    onLogout: () => void;
}

const AdminLayout = ({
    children,
    activeTab,
    setActiveTab,
    user,
    notifications,
    markAllNotificationsAsRead,
    clearAllNotifications,
    systemStatus,
    projectCount,
    quoteCount,
    onLogout,
}: AdminLayoutProps) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileSidebar, setMobileSidebar] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem("admin_dark_mode");
        return saved ? JSON.parse(saved) : true;
    });

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        localStorage.setItem("admin_dark_mode", JSON.stringify(!darkMode));
    };

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [darkMode]);

    return (
        <>
            <Helmet>
                <title>
                    Admin Dashboard | {user?.username || "Administrator"} | {activeTab}
                </title>
            </Helmet>
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

                <AdminSidebar
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    mobileSidebar={mobileSidebar}
                    setMobileSidebar={setMobileSidebar}
                    projectCount={projectCount}
                    quoteCount={quoteCount}
                    onLogout={onLogout}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    darkMode={darkMode}
                />

                {/* Main Content */}
                <div className="flex-1 min-h-screen flex flex-col">
                    <AdminHeader
                        activeTab={activeTab}
                        user={user}
                        sidebarOpen={sidebarOpen}
                        setSidebarOpen={setSidebarOpen}
                        setMobileSidebar={setMobileSidebar}
                        notifications={notifications}
                        markAllNotificationsAsRead={markAllNotificationsAsRead}
                        clearAllNotifications={clearAllNotifications}
                        systemStatus={systemStatus}
                        darkMode={darkMode}
                    />

                    <main className="flex-1 p-3 sm:p-4 lg:p-6 overflow-y-auto">
                        {children}
                    </main>
                </div>
            </div>
        </>
    );
};

export default AdminLayout;
