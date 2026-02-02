import { motion } from "framer-motion";
import { Cpu, HardDrive, Activity, TrendingUp, RefreshCw, Server, Database } from "lucide-react";

interface SystemStatus {
    cpu: number;
    memory: number;
    storage: number;
    uptime: string;
    requests: number;
    activeUsers: number;
}

interface SystemMonitorProps {
    status: SystemStatus;
    darkMode: boolean;
    detailed?: boolean;
    onRefresh?: () => void;
}

const SystemMonitor = ({ status, darkMode, detailed = false, onRefresh }: SystemMonitorProps) => {
    const getStatusColor = (value: number) => {
        if (value < 50) return "text-green-500";
        if (value < 80) return "text-yellow-500";
        return "text-red-500";
    };

    const getStatusBgColor = (value: number) => {
        if (value < 50) return "bg-green-500";
        if (value < 80) return "bg-yellow-500";
        return "bg-red-500";
    };

    if (detailed) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">System Monitor</h2>
                        <p className="text-gray-500 dark:text-gray-400">Real-time system performance metrics</p>
                    </div>
                    {onRefresh && (
                        <button
                            onClick={onRefresh}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Refresh
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* CPU Usage */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                    <Cpu className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">CPU Usage</p>
                                    <p className={`text-2xl font-bold ${getStatusColor(status.cpu)}`}>
                                        {Math.round(status.cpu)}%
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                                className={`h-2 rounded-full ${getStatusBgColor(status.cpu)}`}
                                style={{ width: `${status.cpu}%` }}
                            />
                        </div>
                    </div>

                    {/* Memory Usage */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                                    <HardDrive className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Memory</p>
                                    <p className={`text-2xl font-bold ${getStatusColor(status.memory)}`}>
                                        {Math.round(status.memory)}%
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                                className={`h-2 rounded-full ${getStatusBgColor(status.memory)}`}
                                style={{ width: `${status.memory}%` }}
                            />
                        </div>
                    </div>

                    {/* Storage */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                                    <Database className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Storage</p>
                                    <p className={`text-2xl font-bold ${getStatusColor(status.storage)}`}>
                                        {Math.round(status.storage)}%
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                                className={`h-2 rounded-full ${getStatusBgColor(status.storage)}`}
                                style={{ width: `${status.storage}%` }}
                            />
                        </div>
                    </div>

                    {/* Active Users */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
                                <Activity className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Active Users</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {status.activeUsers}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Requests */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                                <TrendingUp className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Total Requests</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {status.requests.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Uptime */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-lg bg-teal-100 dark:bg-teal-900/30">
                                <Server className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">System Uptime</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {status.uptime}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <div className={`hidden lg:flex items-center gap-4 px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                <div className="flex items-center gap-2">
                    <Cpu className={`w-4 h-4 ${getStatusColor(status.cpu)}`} />
                    <span className="text-sm font-medium">{Math.round(status.cpu)}%</span>
                </div>
                <div className="flex items-center gap-2">
                    <HardDrive className={`w-4 h-4 ${getStatusColor(status.memory)}`} />
                    <span className="text-sm font-medium">{Math.round(status.memory)}%</span>
                </div>
                <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium">{status.activeUsers}</span>
                </div>
            </div>
        </div>
    );
};

export default SystemMonitor;
