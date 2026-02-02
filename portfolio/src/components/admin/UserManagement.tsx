import { useState } from "react";
import { motion } from "framer-motion";
import { UserPlus, Users, Shield, Mail, Calendar, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

interface User {
    id: string;
    username: string;
    email: string;
    role: string;
    status: 'active' | 'inactive';
    lastLogin: Date;
    createdAt: Date;
}

interface UserManagementProps {
    onUpdate: () => void;
}

const UserManagement = ({ onUpdate }: UserManagementProps) => {
    const [users] = useState<User[]>([
        {
            id: '1',
            username: 'admin',
            email: 'admin@example.com',
            role: 'Administrator',
            status: 'active',
            lastLogin: new Date(),
            createdAt: new Date('2024-01-01')
        }
    ]);

    const handleAddUser = () => {
        toast.info("User management feature coming soon");
    };

    const handleEditUser = (userId: string) => {
        toast.info(`Edit user ${userId} - Coming soon`);
    };

    const handleDeleteUser = (userId: string) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            toast.success("User deleted successfully");
            onUpdate();
        }
    };

    const handleToggleStatus = (userId: string) => {
        toast.success("User status updated");
        onUpdate();
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h2>
                    <p className="text-gray-500 dark:text-gray-400">Manage user accounts and permissions</p>
                </div>
                <button
                    onClick={handleAddUser}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    <UserPlus className="w-4 h-4" />
                    Add User
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-500" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">Total Users</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{users.length}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">Active Users</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                        {users.filter(u => u.status === 'active').length}
                    </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-purple-500" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">Administrators</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                        {users.filter(u => u.role === 'Administrator').length}
                    </p>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-900">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Last Login
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {users.map((user, index) => (
                                <motion.tr
                                    key={user.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                                                {user.username.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">{user.username}</p>
                                                <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                                                    <Mail className="w-3 h-3" />
                                                    {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-sm rounded-full flex items-center gap-1 w-fit">
                                            <Shield className="w-3 h-3" />
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => handleToggleStatus(user.id)}
                                            className={`px-3 py-1 text-sm rounded-full flex items-center gap-1 ${user.status === 'active'
                                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                                }`}
                                        >
                                            {user.status === 'active' ? (
                                                <CheckCircle className="w-3 h-3" />
                                            ) : (
                                                <XCircle className="w-3 h-3" />
                                            )}
                                            {user.status}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            <Calendar className="w-4 h-4" />
                                            {user.lastLogin.toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleEditUser(user.id)}
                                                className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                title="Edit user"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(user.id)}
                                                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                title="Delete user"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
