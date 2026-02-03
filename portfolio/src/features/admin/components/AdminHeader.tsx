import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import {
    Menu,
    ChevronLeft,
    ChevronRight,
    Bell,
} from "lucide-react";
import SystemMonitor from "@/components/admin/SystemMonitor";
import NotificationCenter from "@/components/admin/NotificationCenter";
import { AdminTab, Notification, SystemStatus } from "../types";

interface AdminHeaderProps {
    activeTab: AdminTab;
    user: { username: string; role: string } | null;
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    setMobileSidebar: (open: boolean) => void;
    notifications: Notification[];
    markAllNotificationsAsRead: () => void;
    clearAllNotifications: () => void;
    systemStatus: SystemStatus;
    darkMode: boolean;
}

const AdminHeader = ({
    activeTab,
    user,
    sidebarOpen,
    setSidebarOpen,
    setMobileSidebar,
    notifications,
    markAllNotificationsAsRead,
    clearAllNotifications,
    systemStatus,
    darkMode,
}: AdminHeaderProps) => {
    const [showNotifications, setShowNotifications] = useState(false);

    return (
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
    );
};

export default AdminHeader;
