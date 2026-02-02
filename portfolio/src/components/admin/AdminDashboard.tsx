import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Mail,
  Eye,
  Calendar,
  User,
  FolderKanban,
  Activity,
  Clock,
  Globe,
  TrendingUp,
  TrendingDown,
  Cpu,
  HardDrive,
  Network,
  AlertTriangle,
  X,
  MapPin,
  Monitor,
  Smartphone,
  ArrowUpRight,
  Zap,
} from "lucide-react";
import {
  Analytics,
  Visitor,
  Project,
  Quote,
  SystemStatus,
} from "@/lib/adminService";

interface AdminDashboardProps {
  analytics: Analytics;
  visitors: Visitor[];
  projects: Project[];
  quotes: Quote[];
  systemStatus: SystemStatus;
  isLoading?: boolean;
}

// Skeleton Components
const StatCardSkeleton = () => (
  <div className="glass rounded-xl p-4 sm:p-6 border border-border/50 animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div className="w-12 h-12 bg-secondary/50 rounded-xl" />
      <div className="w-16 h-6 bg-secondary/50 rounded" />
    </div>
    <div className="w-20 h-4 bg-secondary/50 rounded mb-2" />
    <div className="w-24 h-8 bg-secondary/50 rounded" />
  </div>
);

const AdminDashboard = ({
  analytics,
  visitors,
  projects,
  quotes,
  systemStatus,
  isLoading = false,
}: AdminDashboardProps) => {
  const [showAllVisitors, setShowAllVisitors] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);

  // Calculate metrics
  const activeProjects = projects.filter((p) => p.visible).length;
  const featuredProjects = projects.filter((p) => p.featured).length;
  const unreadQuotes = quotes.filter((q) => !q.read).length;
  const todayVisitors = visitors.filter(
    (v) => new Date(v.date).toDateString() === new Date().toDateString(),
  ).length;
  const growthRate = 12;

  const getSystemHealthColor = (value: number) => {
    if (value < 50) return "text-green-500";
    if (value < 75) return "text-yellow-500";
    return "text-red-500";
  };

  const getSystemHealthBg = (value: number) => {
    if (value < 50) return "bg-green-500";
    if (value < 75) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getDeviceIcon = (device: string) => {
    if (device?.toLowerCase().includes("mobile")) return <Smartphone className="w-3 h-3 sm:w-4 sm:h-4" />;
    return <Monitor className="w-3 h-3 sm:w-4 sm:h-4" />;
  };

  if (isLoading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="h-20 bg-secondary/30 rounded-xl animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2 h-96 bg-secondary/30 rounded-xl animate-pulse" />
          <div className="h-96 bg-secondary/30 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4 sm:space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-metallic">Dashboard Overview</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Welcome back! Here's what's happening with your portfolio.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
          <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
          <span>
            {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
      </div>

      {/* System Alert */}
      <AnimatePresence>
        {(systemStatus.cpu > 80 || systemStatus.memory > 80) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
          >
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-semibold text-sm sm:text-base">System Alert</span>
            </div>
            <p className="text-xs sm:text-sm text-red-500 dark:text-red-300 mt-1">
              High resource usage detected. Consider optimizing your application.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {/* Total Views */}
        <motion.div
          whileHover={{ scale: 1.02, y: -4 }}
          className="glass rounded-xl p-4 sm:p-6 border border-border/50 cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 rounded-xl bg-blue-500/10">
              <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
            </div>
            <span className={`flex items-center ${growthRate >= 0 ? "text-green-500" : "text-red-500"} text-xs sm:text-sm font-medium px-2 py-1 rounded bg-secondary/50`}>
              {growthRate >= 0 ? <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" /> : <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />}
              {Math.abs(growthRate)}%
            </span>
          </div>
          <h3 className="text-muted-foreground text-xs sm:text-sm font-medium">Total Views</h3>
          <p className="text-2xl sm:text-3xl font-bold text-metallic mt-1 sm:mt-2">
            {analytics.totalViews.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <Zap className="w-3 h-3" />
            {todayVisitors} today
          </p>
        </motion.div>

        {/* Unique Visitors */}
        <motion.div
          whileHover={{ scale: 1.02, y: -4 }}
          className="glass rounded-xl p-4 sm:p-6 border border-border/50 cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 rounded-xl bg-purple-500/10">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />
            </div>
            <span className="text-xs sm:text-sm font-medium bg-green-500/10 text-green-500 px-2 py-1 rounded">
              +{(analytics.uniqueVisitors * 0.05).toFixed(0)}%
            </span>
          </div>
          <h3 className="text-muted-foreground text-xs sm:text-sm font-medium">Unique Visitors</h3>
          <p className="text-2xl sm:text-3xl font-bold text-metallic mt-1 sm:mt-2">
            {analytics.uniqueVisitors.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Monthly active</p>
        </motion.div>

        {/* Projects */}
        <motion.div
          whileHover={{ scale: 1.02, y: -4 }}
          className="glass rounded-xl p-4 sm:p-6 border border-border/50 cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 rounded-xl bg-green-500/10">
              <FolderKanban className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
            </div>
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
              {featuredProjects} featured
            </span>
          </div>
          <h3 className="text-muted-foreground text-xs sm:text-sm font-medium">Active Projects</h3>
          <p className="text-2xl sm:text-3xl font-bold text-metallic mt-1 sm:mt-2">{activeProjects}</p>
          <p className="text-xs text-muted-foreground mt-1">Out of {projects.length} total</p>
        </motion.div>

        {/* Contact Requests */}
        <motion.div
          whileHover={{ scale: 1.02, y: -4 }}
          className="glass rounded-xl p-4 sm:p-6 border border-border/50 cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 rounded-xl bg-orange-500/10">
              <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
            </div>
            {unreadQuotes > 0 && (
              <span className="text-xs sm:text-sm font-medium bg-red-500/10 text-red-500 px-2 py-1 rounded">
                {unreadQuotes} new
              </span>
            )}
          </div>
          <h3 className="text-muted-foreground text-xs sm:text-sm font-medium">Contact Requests</h3>
          <p className="text-2xl sm:text-3xl font-bold text-metallic mt-1 sm:mt-2">{quotes.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Total inquiries</p>
        </motion.div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Recent Visitors */}
        <div className="lg:col-span-2 glass rounded-xl p-4 sm:p-6 border border-border/50">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-metallic">Recent Visitors</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Last {Math.min(visitors.length, 10)} visits</p>
            </div>
            <button
              onClick={() => setShowAllVisitors(true)}
              className="text-xs sm:text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1"
            >
              View All
              <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {visitors.slice(0, 6).map((visitor, index) => (
              <motion.div
                key={visitor.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ x: 4, backgroundColor: "rgba(var(--primary-rgb), 0.05)" }}
                onClick={() => setSelectedVisitor(visitor)}
                className="flex items-center justify-between p-2 sm:p-3 rounded-lg glass border border-border/30 hover:border-primary/30 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <div className="p-1.5 sm:p-2 rounded-full bg-primary/10 text-primary flex-shrink-0">
                    <User className="w-3 h-3 sm:w-4 sm:h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-foreground truncate">
                      {visitor.email}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 sm:mt-1 flex-wrap">
                      <span className="text-[10px] sm:text-xs text-muted-foreground truncate">
                        {visitor.page}
                      </span>
                      {visitor.country && (
                        <>
                          <span className="text-muted-foreground/50 hidden sm:inline">•</span>
                          <span className="flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground">
                            <Globe className="w-2 h-2 sm:w-3 sm:h-3" />
                            {visitor.country}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs text-muted-foreground flex-shrink-0 ml-2">
                  <Calendar className="w-2 h-2 sm:w-3 sm:h-3" />
                  <span className="hidden sm:inline">{new Date(visitor.date).toLocaleDateString()}</span>
                  <span className="sm:hidden">{new Date(visitor.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
              </motion.div>
            ))}
            {visitors.length === 0 && (
              <div className="text-center py-8 sm:py-12">
                <User className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm sm:text-base text-muted-foreground">No visitors yet</p>
                <p className="text-xs sm:text-sm text-muted-foreground/60 mt-1">
                  Your portfolio hasn't received any visitors
                </p>
              </div>
            )}
          </div>
        </div>

        {/* System Status */}
        <div className="glass rounded-xl p-4 sm:p-6 border border-border/50">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-metallic">System Status</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Real-time metrics</p>
            </div>
            <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
          </div>

          <div className="space-y-4 sm:space-y-5">
            {[
              { label: "CPU Usage", value: systemStatus.cpu, icon: Cpu },
              { label: "Memory", value: systemStatus.memory, icon: HardDrive },
              { label: "Storage", value: systemStatus.storage, icon: HardDrive },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <item.icon className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                    <span className="text-xs sm:text-sm font-medium text-foreground">{item.label}</span>
                  </div>
                  <span className={`text-xs sm:text-sm font-bold ${getSystemHealthColor(item.value)}`}>
                    {item.value}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-secondary/50 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full ${getSystemHealthBg(item.value)}`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-border/30">
            <div>
              <div className="flex items-center gap-1 sm:gap-2 mb-1">
                <Network className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                <span className="text-xs sm:text-sm text-muted-foreground">Requests</span>
              </div>
              <p className="text-base sm:text-lg font-bold text-metallic">{systemStatus.requests}</p>
            </div>
            <div>
              <div className="flex items-center gap-1 sm:gap-2 mb-1">
                <Users className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                <span className="text-xs sm:text-sm text-muted-foreground">Active</span>
              </div>
              <p className="text-base sm:text-lg font-bold text-metallic">{systemStatus.activeUsers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* All Visitors Modal */}
      <AnimatePresence>
        {showAllVisitors && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAllVisitors(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-neon rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden border border-border/50"
            >
              <div className="p-4 sm:p-6 border-b border-border/30 flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur-sm">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-metallic">All Visitors</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">Total: {visitors.length}</p>
                </div>
                <button
                  onClick={() => setShowAllVisitors(false)}
                  className="p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(80vh-100px)]">
                <div className="space-y-2 sm:space-y-3">
                  {visitors.map((visitor, index) => (
                    <motion.div
                      key={visitor.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                      onClick={() => setSelectedVisitor(visitor)}
                      className="p-3 sm:p-4 rounded-lg glass border border-border/30 hover:border-primary/30 transition-all cursor-pointer"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="p-2 rounded-full bg-primary/10 text-primary flex-shrink-0">
                            <User className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{visitor.email}</p>
                            <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                {getDeviceIcon(visitor.device)}
                                {visitor.device || "Desktop"}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {visitor.country || "Unknown"}
                              </span>
                              <span>•</span>
                              <span>{visitor.page}</span>
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(visitor.date).toLocaleString()}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Visitor Details Modal */}
      <AnimatePresence>
        {selectedVisitor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedVisitor(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-neon rounded-xl max-w-lg w-full p-6 border border-border/50"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-metallic">Visitor Details</h3>
                <button
                  onClick={() => setSelectedVisitor(null)}
                  className="p-2 rounded-lg hover:bg-secondary/50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="p-4 rounded-lg glass border border-border/30">
                  <p className="text-xs text-muted-foreground mb-1">Email</p>
                  <p className="text-sm font-medium text-foreground break-all">{selectedVisitor.email}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg glass border border-border/30">
                    <p className="text-xs text-muted-foreground mb-1">Country</p>
                    <p className="text-sm font-medium text-foreground">{selectedVisitor.country || "Unknown"}</p>
                  </div>
                  <div className="p-4 rounded-lg glass border border-border/30">
                    <p className="text-xs text-muted-foreground mb-1">Device</p>
                    <p className="text-sm font-medium text-foreground">{selectedVisitor.device || "Desktop"}</p>
                  </div>
                </div>
                <div className="p-4 rounded-lg glass border border-border/30">
                  <p className="text-xs text-muted-foreground mb-1">Page Visited</p>
                  <p className="text-sm font-medium text-foreground break-all">{selectedVisitor.page}</p>
                </div>
                <div className="p-4 rounded-lg glass border border-border/30">
                  <p className="text-xs text-muted-foreground mb-1">Visit Time</p>
                  <p className="text-sm font-medium text-foreground">
                    {new Date(selectedVisitor.date).toLocaleString()}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminDashboard;