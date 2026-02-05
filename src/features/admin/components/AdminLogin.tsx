import { useState } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  ShieldCheck,
  ShieldAlert,
  User,
  Eye,
  EyeOff,
  RefreshCw,
  LogIn,
  Key,
} from "lucide-react";
import { toast } from "sonner";

interface AdminLoginProps {
  onLogin: (username: string, password: string) => Promise<boolean>;
  lockUntil: Date | null;
}

const AdminLogin = ({ onLogin, lockUntil }: AdminLoginProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    const success = await onLogin(username, password);
    setIsLoggingIn(false);
    if (success) {
      toast.success("Welcome back!");
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Login | Secure Portal</title>
      </Helmet>
      <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 left-5 sm:top-20 sm:left-20 w-48 h-48 sm:w-64 sm:h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="glass-neon rounded-2xl shadow-2xl p-6 sm:p-8 border border-border/50">
            <div className="flex justify-center mb-6 sm:mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="inline-flex items-center gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-full glass border border-primary/20"
              >
                <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-metallic">
                    Admin Portal
                  </h1>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Secure Access
                  </p>
                </div>
              </motion.div>
            </div>

            {lockUntil && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
              >
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <ShieldAlert className="w-5 h-5" />
                  <span className="font-semibold text-sm sm:text-base">
                    Account Locked
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-red-500 dark:text-red-300 mt-1">
                  Too many failed attempts. Try again at{" "}
                  {lockUntil.toLocaleTimeString()}
                </p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-foreground mb-2">
                  Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2.5 sm:py-3 input-neon text-foreground text-sm sm:text-base"
                    placeholder="Enter username"
                    disabled={!!lockUntil}
                    required
                  />
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-foreground mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 sm:py-3 input-neon text-foreground text-sm sm:text-base pr-12"
                    placeholder="Enter password"
                    disabled={!!lockUntil}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </button>
                </div>
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoggingIn || !!lockUntil}
                className="w-full px-4 py-2.5 sm:py-3 btn-neon text-primary-foreground font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                {isLoggingIn ? (
                  <>
                    <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 sm:w-5 sm:h-5" />
                    Sign In
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-6 sm:mt-8 pt-6 border-t border-border/30 text-center">
              <p className="text-xs sm:text-sm text-muted-foreground flex items-center justify-center gap-1">
                <Key className="w-3 h-3 sm:w-4 sm:h-4" />
                Secure • Encrypted • 30 min session
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default AdminLogin;
