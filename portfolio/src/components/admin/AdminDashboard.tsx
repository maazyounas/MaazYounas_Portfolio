import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Mail,
  Eye,
  Calendar,
  User,
  FolderKanban,
  Clock,
  Globe,
  TrendingUp,
  TrendingDown,
  X,
  MapPin,
  Monitor,
  Smartphone,
  ArrowUpRight,
  Zap,
} from "lucide-react";
import {
  Analytics,
  Project,
  Quote,
  Visitor,
} from "../../lib/adminService";

interface AdminDashboardProps {
  analytics: Analytics;
  projects: Project[];
  quotes: Quote[];
  visitors: Visitor[];
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
  projects,
  quotes,
  visitors,
  isLoading = false,
}: AdminDashboardProps) => {
  const [showAllVisitors, setShowAllVisitors] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);
  const [growthRate] = useState(12); // Could be dynamic in future

  // Calculate metrics
  const activeProjects = projects.filter((p) => p.visible).length;
  const featuredProjects = projects.filter((p) => p.featured).length;
  const unreadQuotes = quotes.filter((q) => !q.read).length;
  const todayVisitors = visitors.filter(
    (v) => new Date(v.date).toDateString() === new Date().toDateString(),
  ).length;

  const getDeviceIcon = (userAgent?: string) => {
    if (userAgent?.toLowerCase().includes("mobile")) return <Smartphone className="w-3 h-3 sm:w-4 sm:h-4" />;
    return <Monitor className="w-3 h-3 sm:w-4 sm:h-4" />;
  };

  if (isLoading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
        <div className="h-96 bg-secondary/30 rounded-xl animate-pulse" />
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
            {new Date().toLocaleDateString([], {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </div>
      </div>

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

      {/* Recent Visitors */}
      <div className="glass rounded-xl p-4 sm:p-6 border border-border/50">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-metallic">Recent Visitors</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Showing {Math.min(visitors.length, 6)} of {visitors.length} total visits
            </p>
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
                    {visitor.email || "Anonymous Visitor"}
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
                <span className="hidden sm:inline">
                  {new Date(visitor.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="sm:hidden">
                  {new Date(visitor.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </motion.div>
          ))}
          {visitors.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <User className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm sm:text-base text-muted-foreground">No visitors yet</p>
              <p className="text-xs sm:text-sm text-muted-foreground/60 mt-1">
                Your portfolio hasn't received any visitors yet
              </p>
            </div>
          )}
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
                  <p className="text-xs sm:text-sm text-muted-foreground">Total: {visitors.length} visitors</p>
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
                            <p className="text-sm font-medium text-foreground truncate">
                              {visitor.email || "Anonymous Visitor"}
                            </p>
                            <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                {getDeviceIcon(visitor.userAgent)}
                                {visitor.userAgent?.includes("Mobile") ? "Mobile" : "Desktop"}
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
                          {new Date(visitor.date).toLocaleDateString()}
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
                  <p className="text-sm font-medium text-foreground break-all">
                    {selectedVisitor.email || "Anonymous"}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg glass border border-border/30">
                    <p className="text-xs text-muted-foreground mb-1">Country</p>
                    <p className="text-sm font-medium text-foreground">{selectedVisitor.country || "Unknown"}</p>
                  </div>
                  <div className="p-4 rounded-lg glass border border-border/30">
                    <p className="text-xs text-muted-foreground mb-1">Device</p>
                    <p className="text-sm font-medium text-foreground">
                      {selectedVisitor.userAgent?.includes("Mobile") ? "Mobile" : "Desktop"}
                      <span className="block text-[10px] text-muted-foreground truncate opacity-70">
                        {selectedVisitor.userAgent || "Unknown"}
                      </span>
                    </p>
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