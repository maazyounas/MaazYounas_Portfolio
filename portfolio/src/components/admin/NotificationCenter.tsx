import { motion } from "framer-motion";
import { Bell, X, CheckCircle, AlertCircle, XCircle, Info } from "lucide-react";

interface Notification {
    id: string;
    type: 'info' | 'warning' | 'error' | 'success';
    title: string;
    message: string;
    timestamp: string | Date;
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
    onClose
}: NotificationCenterProps) => {
    const getIcon = (type: Notification['type']) => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'warning':
                return <AlertCircle className="w-5 h-5 text-yellow-500" />;
            case 'error':
                return <XCircle className="w-5 h-5 text-red-500" />;
            default:
                return <Info className="w-5 h-5 text-blue-500" />;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`absolute right-0 top-12 w-96 ${darkMode ? 'bg-gray-800' : 'bg-white'
                } rounded-lg shadow-2xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'
                } z-50`}
        >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex items-center gap-2 mt-2">
                    <button
                        onClick={onMarkAllAsRead}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        Mark all as read
                    </button>
                    <span className="text-gray-400">•</span>
                    <button
                        onClick={onClearAll}
                        className="text-sm text-red-600 dark:text-red-400 hover:underline"
                    >
                        Clear all
                    </button>
                </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                    <div className="p-8 text-center">
                        <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-500 dark:text-gray-400">No notifications</p>
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors ${!notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                {getIcon(notification.type)}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                                            {notification.title}
                                        </h4>
                                        {!notification.read && (
                                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        {notification.message}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                                        {new Date(notification.timestamp).toLocaleTimeString()}
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
