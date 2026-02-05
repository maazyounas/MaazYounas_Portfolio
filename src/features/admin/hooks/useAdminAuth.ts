import { useState, useEffect, useCallback } from "react";
import { useIdleTimer } from "react-idle-timer";
import { toast } from "sonner";
import { adminService } from "../../../lib/adminService";

// Custom hook for session timeout
export const useSessionTimeout = (logoutCallback: () => void, idleTimeout = 5 * 60 * 1000) => {
    const onIdle = useCallback(() => {
        toast.warning("Session expired due to inactivity");
        logoutCallback();
    }, [logoutCallback]);

    useIdleTimer({
        onIdle,
        timeout: idleTimeout,
        debounce: 500,
    });
};

export const useAdminAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<{ username: string; role: string } | null>(null);
    const [loginAttempts, setLoginAttempts] = useState(0);
    const [lockUntil, setLockUntil] = useState<Date | null>(null);

    const logout = useCallback(async () => {
        try {
            await adminService.logSystemActivity({
                action: "logout",
                user: user?.username || "unknown",
                timestamp: new Date().toISOString(),
                details: "User logged out",
                ipAddress: "127.0.0.1",
                status: "success",
            });
        } catch (error) {
            console.error("Logout logging error:", error);
        }

        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem("admin_auth");
        localStorage.removeItem("admin_user");
        sessionStorage.removeItem("admin_session");
    }, [user]);

    // Set up session timeout (30 minutes total)
    useSessionTimeout(logout, 5 * 60 * 1000); // 5 minutes idle timeout

    // Check for timeout on mount
    useEffect(() => {
        const sessionStart = localStorage.getItem("admin_session_start");
        if (sessionStart) {
            const sessionAge = Date.now() - parseInt(sessionStart);
            if (sessionAge > 30 * 60 * 1000) { // 30 minutes total
                logout();
                toast.error("Session expired");
            }
        }
    }, [logout]);

    // Check saved auth state on mount
    useEffect(() => {
        const savedAuth = localStorage.getItem("admin_auth");
        const savedUser = localStorage.getItem("admin_user");
        const savedLock = localStorage.getItem("admin_lock_until");

        if (savedAuth === "true" && savedUser) {
            setIsAuthenticated(true);
            setUser(JSON.parse(savedUser));
            localStorage.setItem("admin_session_start", Date.now().toString());
        }

        if (savedLock) {
            const lockTime = new Date(savedLock);
            if (lockTime > new Date()) {
                setLockUntil(lockTime);
            }
        }
    }, []);

    const login = async (
        username: string,
        password: string,
    ): Promise<boolean> => {
        const now = new Date();

        if (lockUntil && now < lockUntil) {
            const timeLeft = Math.ceil((lockUntil.getTime() - now.getTime()) / 60000);
            toast.error(`Account locked. Try again in ${timeLeft} minutes.`);
            return false;
        }

        try {
            const settings = await adminService.getSecuritySettings();

            if (username === settings.adminUsername.trim() && password === settings.adminPassword.trim()) {
                setIsAuthenticated(true);
                const userData = { username, role: "admin" };
                setUser(userData);
                setLoginAttempts(0);
                setLockUntil(null);

                localStorage.setItem("admin_auth", "true");
                localStorage.setItem("admin_user", JSON.stringify(userData));
                localStorage.setItem("admin_session_start", Date.now().toString());
                sessionStorage.setItem("admin_session", Date.now().toString());
                localStorage.removeItem("admin_login_attempts");
                localStorage.removeItem("admin_lock_until");

                await adminService.logSystemActivity({
                    action: "login",
                    user: username,
                    timestamp: now.toISOString(),
                    details: "Successful login",
                    ipAddress: "127.0.0.1",
                    status: "success",
                });

                return true;
            }

            const newAttempts = loginAttempts + 1;
            setLoginAttempts(newAttempts);
            localStorage.setItem("admin_login_attempts", newAttempts.toString());

            if (newAttempts >= settings.maxLoginAttempts) {
                const lockTime = new Date(
                    now.getTime() + settings.lockoutDuration * 60000,
                );
                setLockUntil(lockTime);
                localStorage.setItem("admin_lock_until", lockTime.toISOString());
                toast.error(
                    `Too many failed attempts. Account locked for ${settings.lockoutDuration} minutes.`,
                );
            } else {
                toast.error(
                    `Invalid credentials. ${settings.maxLoginAttempts - newAttempts
                    } attempts remaining.`,
                );
            }

            return false;
        } catch (error) {
            console.error("Login error:", error);
            toast.error("An error occurred during login.");
            return false;
        }
    };

    return { isAuthenticated, user, login, logout, lockUntil };
};
