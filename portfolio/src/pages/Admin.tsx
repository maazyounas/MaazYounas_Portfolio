import { useState, useEffect } from "react";
import { toast } from "sonner";
import { RefreshCw, Download } from "lucide-react";
import { Helmet } from "react-helmet-async";

// Modular Imports
import { useAdminAuth } from "@/features/admin/hooks/useAdminAuth";
import { useAdminData } from "@/features/admin/hooks/useAdminData";
import AdminLogin from "@/features/admin/components/AdminLogin";
import AdminLayout from "@/features/admin/components/AdminLayout";
import { AdminTab } from "@/features/admin/types";

// Tab Components
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminHome from "@/components/admin/AdminHome";
import AdminAbout from "@/components/admin/AdminAbout";
import AdminProjects from "@/components/admin/AdminProjects";
import AdminContact from "@/components/admin/AdminContact";
import AdminSecurity from "@/components/admin/AdminSecurity";
import ActivityLog from "@/components/admin/ActivityLog";

const Admin = () => {
  // Auth Hook
  const { isAuthenticated, user, login, logout, lockUntil } = useAdminAuth();

  // Data Hook
  const { loading, data, actions } = useAdminData(isAuthenticated);

  // Local State
  const [activeTab, setActiveTab] = useState<AdminTab>(() => {
    const saved = localStorage.getItem("admin_active_tab");
    return (saved as AdminTab) || "dashboard";
  });

  // Persistence
  useEffect(() => {
    localStorage.setItem("admin_active_tab", activeTab);
  }, [activeTab]);

  // Handlers
  const handleExportData = () => {
    const exportData = {
      projects: data.projects,
      quotes: data.quotes,
      visitors: data.visitors,
      analytics: data.analytics,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
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
    actions.setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const clearAllNotifications = () => {
    actions.setNotifications([]);
    toast.info("All notifications cleared");
  };

  // 1. Not Authenticated -> Show Login
  if (!isAuthenticated) {
    return <AdminLogin onLogin={login} lockUntil={lockUntil} />;
  }

  // 2. Authenticated -> Show Layout
  return (
    <AdminLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      user={user}
      notifications={data.notifications}
      markAllNotificationsAsRead={markAllNotificationsAsRead}
      clearAllNotifications={clearAllNotifications}
      systemStatus={data.systemStatus}
      projectCount={data.projects.length}
      quoteCount={data.quotes.length}
      onLogout={logout}
    >
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
                onClick={actions.refresh}
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

          {/* Main Content Area */}
          <div className="glass-neon rounded-2xl shadow-xl border border-border/50 p-4 sm:p-6">
            {activeTab === "dashboard" && (
              <AdminDashboard
                analytics={data.analytics}
                visitors={data.visitors}
                projects={data.projects}
                quotes={data.quotes}
              />
            )}
            {activeTab === "home" && data.homeData && (
              <AdminHome
                data={data.homeData}
                quotes={data.quotes}
                projects={data.projects}
                onUpdate={actions.refresh}
              />
            )}
            {activeTab === "about" && data.aboutData && (
              <AdminAbout data={data.aboutData} onUpdate={actions.refresh} />
            )}
            {activeTab === "projects" && (
              <AdminProjects
                projects={data.projects}
                onUpdate={actions.refresh}
              />
            )}
            {activeTab === "contact" && data.contactData && (
              <AdminContact
                data={data.contactData}
                onUpdate={actions.refresh}
              />
            )}
            {activeTab === "security" && data.securitySettings && (
              <AdminSecurity
                data={data.securitySettings}
                onUpdate={actions.refresh}
              />
            )}
            {/* System Monitor (Full View) or Logs */}
            {activeTab === "logs" && (
              <ActivityLog logs={data.activityLogs} />
            )}
            {activeTab === "system" && (
              <div className="p-4 text-center text-muted-foreground">
                <h3 className="text-lg font-semibold">System Diagnostics</h3>
                <p>System monitoring is active in the header.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Admin;