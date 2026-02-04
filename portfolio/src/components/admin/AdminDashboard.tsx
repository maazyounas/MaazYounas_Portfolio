import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Eye,
  Calendar,
  FolderKanban,
  Clock,
  TrendingUp,
  TrendingDown,
  Zap,
} from "lucide-react";
import {
  Analytics,
  Project,
  Quote,
} from "../../lib/adminService";

interface AdminDashboardProps {
  analytics: Analytics;
  projects: Project[];
  quotes: Quote[];
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
  isLoading = false,
}: AdminDashboardProps) => {
  const [growthRate] = useState(12); // Could be dynamic in future

  // Calculate metrics
  const activeProjects = projects.filter((p) => p.visible).length;
  const featuredProjects = projects.filter((p) => p.featured).length;
  const unreadQuotes = quotes.filter((q) => !q.read).length;

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
        </motion.div>

        {/* Unique Visitors - Removed */}
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
    </motion.div>
  );
};

export default AdminDashboard;