import { motion } from "framer-motion";
import {
    Shield,
    LayoutDashboard,
    Home,
    User,
    FolderKanban,
    Mail,
    Lock,
    LogOut,
    Server,
    History,
    X,
    ChevronLeft,
} from "lucide-react";
import SearchBar from "../../../components/admin/SearchBar";
import { AdminTab } from "../types";

interface AdminSidebarProps {
    activeTab: AdminTab;
    setActiveTab: (tab: AdminTab) => void;
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    mobileSidebar: boolean;
    setMobileSidebar: (open: boolean) => void;
    projectCount: number;
    quoteCount: number;
    onLogout: () => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    darkMode: boolean;
}

const AdminSidebar = ({
    activeTab,
    setActiveTab,
    sidebarOpen,
    setSidebarOpen,
    mobileSidebar,
    setMobileSidebar,
    projectCount,
    quoteCount,
    onLogout,
    searchQuery,
    setSearchQuery,
    darkMode,
}: AdminSidebarProps) => {
    return (
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
                            badge: projectCount,
                        },
                        {
                            id: "contact",
                            icon: Mail,
                            label: "Contact",
                            badge: quoteCount,
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
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm sm:text-base"
                >
                    <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                    Sign Out
                </button>
            </div>
        </motion.aside>
    );
};

export default AdminSidebar;
