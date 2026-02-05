import { motion } from "framer-motion";
import { Bell, AlertCircle, X, Info, CheckCircle } from "lucide-react";

interface Notification {
  id: string;
  type: "info" | "warning" | "error";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface NotificationCenterProps {
  notifications: Notification[];
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  darkMode: boolean;
  onClose: () => void;
}

const NotificationCenter = ({
  notifications,
  onMarkAllAsRead,
  onClearAll,
  darkMode,
  onClose,
}: NotificationCenterProps) => {
  return (
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
};

export default NotificationCenter;