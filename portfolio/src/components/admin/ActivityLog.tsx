import { motion } from "framer-motion";
import { Activity, User, LogIn, LogOut, Shield, AlertCircle, CheckCircle, Clock, Filter } from "lucide-react";
import { SystemLog } from "@/lib/adminService";
import { useState } from "react";

interface ActivityLogProps {
    logs: SystemLog[];
}

const ActivityLog = ({ logs }: ActivityLogProps) => {
    const [filter, setFilter] = useState<string>("all");

    const getIcon = (action: string) => {
        switch (action) {
            case 'login':
                return <LogIn className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />;
            case 'logout':
                return <LogOut className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />;
            case 'update':
            case 'create':
                return <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />;
            case 'delete':
                return <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />;
            case 'security':
                return <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />;
            default:
                return <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />;
        }
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            success: "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800",
            error: "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800",
            warning: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
        };
        return styles[status as keyof typeof styles] || "bg-secondary/50 text-foreground border-border/50";
    };

    const filteredLogs = filter === "all"
        ? logs
        : logs.filter(log => log.action === filter);

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-metallic">Activity Logs</h2>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">Monitor all system activities and user actions</p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground flex-shrink-0" />
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="flex-1 sm:flex-none px-3 sm:px-4 py-2 input-neon text-sm sm:text-base"
                    >
                        <option value="all">All Activities</option>
                        <option value="login">Login</option>
                        <option value="logout">Logout</option>
                        <option value="create">Create</option>
                        <option value="update">Update</option>
                        <option value="delete">Delete</option>
                        <option value="security">Security</option>
                    </select>
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block glass rounded-xl border border-border/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-secondary/50 border-b border-border/50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                                    Action
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                                    Details
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                                    IP Address
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                                    Timestamp
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30">
                            {filteredLogs.map((log, index) => (
                                <motion.tr
                                    key={log.id || index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ backgroundColor: "rgba(var(--primary-rgb), 0.05)" }}
                                    className="transition-colors"
                                >
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            {getIcon(log.action)}
                                            <span className="text-sm font-medium text-foreground capitalize">
                                                {log.action}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground text-xs font-bold">
                                                {log.user?.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="text-sm text-foreground font-medium">
                                                {log.user}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 max-w-xs">
                                        <span className="text-sm text-muted-foreground truncate block">
                                            {log.details}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <span className="text-sm text-muted-foreground font-mono">
                                            {log.ipAddress}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusBadge(log.status)}`}>
                                            {log.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-sm text-muted-foreground">
                                                {new Date(log.timestamp).toLocaleString()}
                                            </span>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredLogs.length === 0 && (
                    <div className="text-center py-12">
                        <Activity className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground/30 mx-auto mb-4" />
                        <p className="text-muted-foreground">No activity logs found</p>
                        <p className="text-sm text-muted-foreground/60 mt-2">
                            {filter !== "all" ? "Try changing the filter" : "Activity will appear here"}
                        </p>
                    </div>
                )}
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-3">
                {filteredLogs.map((log, index) => (
                    <motion.div
                        key={log.id || index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="glass rounded-xl p-4 border border-border/50 space-y-3"
                    >
                        {/* Header Row */}
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                {getIcon(log.action)}
                                <span className="text-sm sm:text-base font-semibold text-foreground capitalize truncate">
                                    {log.action}
                                </span>
                            </div>
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full border flex-shrink-0 ${getStatusBadge(log.status)}`}>
                                {log.status}
                            </span>
                        </div>

                        {/* User Info */}
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground text-xs font-bold">
                                {log.user?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">{log.user}</p>
                                <p className="text-xs text-muted-foreground font-mono">{log.ipAddress}</p>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="pt-2 border-t border-border/30">
                            <p className="text-xs sm:text-sm text-muted-foreground break-words">
                                {log.details}
                            </p>
                        </div>

                        {/* Timestamp */}
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>{new Date(log.timestamp).toLocaleString()}</span>
                        </div>
                    </motion.div>
                ))}

                {filteredLogs.length === 0 && (
                    <div className="text-center py-12 glass rounded-xl border border-border/50">
                        <Activity className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground/30 mx-auto mb-4" />
                        <p className="text-sm sm:text-base text-muted-foreground">No activity logs found</p>
                        <p className="text-xs sm:text-sm text-muted-foreground/60 mt-2 px-4">
                            {filter !== "all" ? "Try changing the filter" : "Activity will appear here"}
                        </p>
                    </div>
                )}
            </div>

            {/* Footer Stats */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm text-muted-foreground pt-2 border-t border-border/30">
                <span className="flex items-center gap-1">
                    Showing <span className="font-semibold text-primary">{filteredLogs.length}</span> of <span className="font-semibold">{logs.length}</span> logs
                </span>
                <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                    Last updated: {new Date().toLocaleTimeString()}
                </span>
            </div>
        </div>
    );
};

export default ActivityLog;