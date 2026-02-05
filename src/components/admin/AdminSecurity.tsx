import { useState } from "react";
import { motion } from "framer-motion";
import { Save, Eye, EyeOff, Key, Mail, Lock, RefreshCw, CheckCircle } from "lucide-react";
import { SecuritySettings, adminService } from "../../lib/adminService";
import { toast } from "sonner";

interface AdminSecurityProps {
  data: SecuritySettings;
  onUpdate: () => void;
}

const AdminSecurity = ({ data, onUpdate }: AdminSecurityProps) => {
  const [credentials, setCredentials] = useState({
    email: data.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [forgotCredentials, setForgotCredentials] = useState({
    email: "",
    resetCode: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
    forgotNew: false,
    forgotConfirm: false,
  });

  const [activeTab, setActiveTab] = useState<"change" | "forgot">("change");

  const handleSave = async () => {
    // Validate inputs
    if (!credentials.currentPassword || !credentials.newPassword || !credentials.confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (credentials.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    if (credentials.newPassword !== credentials.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await adminService.changeAdminPassword(
        credentials.newPassword
      );

      toast.success("Password updated successfully!", {
        description: "Your admin credentials have been updated.",
        icon: <CheckCircle className="w-5 h-5 text-green-500" />,
      });

      setCredentials({
        ...credentials,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      onUpdate();
    } catch (error: unknown) {
      toast.error("Failed to update password", {
        description: (error as Error).message || "Please check your current password and try again.",
      });
    }
  };

  const handleForgotPasswordRequest = async () => {
    if (!forgotCredentials.email) {
      toast.error("Please enter your email address");
      return;
    }

    try {
      await adminService.sendPasswordResetEmail(forgotCredentials.email);
      toast.success("Reset code sent!", {
        description: "Check your email for the password reset code.",
        icon: <Mail className="w-5 h-5 text-blue-500" />,
      });
    } catch (error: unknown) {
      toast.error("Failed to send reset code", {
        description: (error as Error).message || "Please check your email and try again.",
      });
    }
  };

  const handleForgotPasswordReset = async () => {
    if (!forgotCredentials.resetCode || !forgotCredentials.newPassword || !forgotCredentials.confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (forgotCredentials.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    if (forgotCredentials.newPassword !== forgotCredentials.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await adminService.resetPasswordWithCode(
        forgotCredentials.email,
        forgotCredentials.resetCode,
        forgotCredentials.newPassword
      );

      toast.success("Password reset successfully!", {
        description: "You can now log in with your new password.",
        icon: <CheckCircle className="w-5 h-5 text-green-500" />,
      });

      setForgotCredentials({
        email: "",
        resetCode: "",
        newPassword: "",
        confirmPassword: "",
      });

      setActiveTab("change");
      onUpdate();
    } catch (error: unknown) {
      toast.error("Failed to reset password", {
        description: (error as Error).message || "Invalid reset code or expired link.",
      });
    }
  };

  const toggleShowPassword = (field: keyof typeof showPasswords) => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field],
    });
  };

  const resetForm = () => {
    setCredentials({
      email: data.email || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    toast.info("Form reset", {
      description: "All fields have been cleared.",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="glass rounded-2xl border border-border/50 p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-6">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-metallic">
              Admin Credentials
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Manage your admin panel login credentials
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="glass rounded-2xl border border-border/50 overflow-hidden">
        <div className="flex border-b border-border/50">
          <button
            onClick={() => setActiveTab("change")}
            className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${activeTab === "change"
              ? "bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-500 border-b-2 border-blue-500"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
              }`}
          >
            <Key className="w-5 h-5 inline-block mr-2" />
            Change Password
          </button>
          <button
            onClick={() => setActiveTab("forgot")}
            className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${activeTab === "forgot"
              ? "bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-500 border-b-2 border-amber-500"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
              }`}
          >
            <Mail className="w-5 h-5 inline-block mr-2" />
            Forgot Password
          </button>
        </div>

        <div className="p-6">
          {/* Change Password Tab */}
          {activeTab === "change" && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Current Password */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-amber-400" />
                      <span>Current Password</span>
                    </div>
                  </label>
                  <div className="relative group">
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      value={credentials.currentPassword}
                      onChange={(e) =>
                        setCredentials({
                          ...credentials,
                          currentPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3.5 bg-secondary/30 border border-border/50 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all duration-200 pr-12"
                      placeholder="Enter your current password"
                    />
                    <button
                      onClick={() => toggleShowPassword("current")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-colors"
                      type="button"
                    >
                      {showPasswords.current ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Email (Read-only) */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-blue-400" />
                      <span>Admin Email</span>
                    </div>
                  </label>
                  <input
                    type="email"
                    value={credentials.email}
                    readOnly
                    className="w-full px-4 py-3.5 bg-secondary/30 border border-border/50 rounded-xl text-foreground/60 cursor-not-allowed"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Contact support to change your email address
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    <div className="flex items-center gap-2">
                      <Key className="w-4 h-4 text-green-400" />
                      <span>New Password</span>
                    </div>
                  </label>
                  <div className="relative group">
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      value={credentials.newPassword}
                      onChange={(e) =>
                        setCredentials({
                          ...credentials,
                          newPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3.5 bg-secondary/30 border border-border/50 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200 pr-12"
                      placeholder="Enter new password"
                    />
                    <button
                      onClick={() => toggleShowPassword("new")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-colors"
                      type="button"
                    >
                      {showPasswords.new ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                    <Key className="w-3 h-3" />
                    Must be at least 8 characters long
                  </p>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    <div className="flex items-center gap-2">
                      <Key className="w-4 h-4 text-green-400" />
                      <span>Confirm Password</span>
                    </div>
                  </label>
                  <div className="relative group">
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      value={credentials.confirmPassword}
                      onChange={(e) =>
                        setCredentials({
                          ...credentials,
                          confirmPassword: e.target.value,
                        })
                      }
                      className={`w-full px-4 py-3.5 bg-secondary/30 border ${credentials.confirmPassword && credentials.newPassword !== credentials.confirmPassword
                        ? "border-red-500 focus:border-red-500"
                        : "border-border/50 focus:border-green-500"
                        } rounded-xl focus:ring-2 focus:ring-green-500/20 transition-all duration-200 pr-12`}
                      placeholder="Confirm new password"
                    />
                    <button
                      onClick={() => toggleShowPassword("confirm")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-colors"
                      type="button"
                    >
                      {showPasswords.confirm ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {credentials.confirmPassword && credentials.newPassword !== credentials.confirmPassword && (
                    <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                      <EyeOff className="w-3 h-3" />
                      Passwords do not match
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  onClick={resetForm}
                  className="px-4 py-2.5 text-sm font-medium text-foreground/80 hover:text-foreground border border-border/50 hover:border-border rounded-xl hover:bg-secondary/50 transition-all duration-200 flex items-center gap-2 justify-center"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reset Form
                </button>
                <button
                  onClick={handleSave}
                  disabled={
                    !credentials.currentPassword ||
                    !credentials.newPassword ||
                    !credentials.confirmPassword ||
                    credentials.newPassword !== credentials.confirmPassword ||
                    credentials.newPassword.length < 8
                  }
                  className="px-4 py-2.5 text-sm font-medium bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 justify-center shadow-lg shadow-green-500/25 hover:shadow-green-500/40 flex-1"
                >
                  <Save className="w-4 h-4" />
                  Update Password
                </button>
              </div>
            </motion.div>
          )}

          {/* Forgot Password Tab */}
          {activeTab === "forgot" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Mail className="w-5 h-5 text-amber-500" />
                  <h3 className="text-lg font-semibold text-foreground">
                    Reset Your Password
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  Enter your email to receive a reset code, then use that code to set a new password.
                </p>

                {/* Step 1: Request Reset Code */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Your Email Address
                    </label>
                    <input
                      type="email"
                      value={forgotCredentials.email}
                      onChange={(e) =>
                        setForgotCredentials({
                          ...forgotCredentials,
                          email: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3.5 bg-secondary/30 border border-border/50 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all duration-200"
                      placeholder="admin@example.com"
                    />
                  </div>

                  <button
                    onClick={handleForgotPasswordRequest}
                    disabled={!forgotCredentials.email}
                    className="px-4 py-2.5 text-sm font-medium bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 w-full justify-center"
                  >
                    <Mail className="w-4 h-4" />
                    Send Reset Code
                  </button>
                </div>

                {/* Step 2: Reset with Code */}
                <div className="mt-8 pt-8 border-t border-border/30">
                  <h4 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
                    <Key className="w-4 h-4" />
                    Enter Reset Code & New Password
                  </h4>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-3">
                        Reset Code
                      </label>
                      <input
                        type="text"
                        value={forgotCredentials.resetCode}
                        onChange={(e) =>
                          setForgotCredentials({
                            ...forgotCredentials,
                            resetCode: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3.5 bg-secondary/30 border border-border/50 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 font-mono"
                        placeholder="Enter the 6-digit code from your email"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-3">
                          New Password
                        </label>
                        <div className="relative group">
                          <input
                            type={showPasswords.forgotNew ? "text" : "password"}
                            value={forgotCredentials.newPassword}
                            onChange={(e) =>
                              setForgotCredentials({
                                ...forgotCredentials,
                                newPassword: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3.5 bg-secondary/30 border border-border/50 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200 pr-12"
                            placeholder="Enter new password"
                          />
                          <button
                            onClick={() => toggleShowPassword("forgotNew")}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-colors"
                            type="button"
                          >
                            {showPasswords.forgotNew ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-3">
                          Confirm Password
                        </label>
                        <div className="relative group">
                          <input
                            type={showPasswords.forgotConfirm ? "text" : "password"}
                            value={forgotCredentials.confirmPassword}
                            onChange={(e) =>
                              setForgotCredentials({
                                ...forgotCredentials,
                                confirmPassword: e.target.value,
                              })
                            }
                            className={`w-full px-4 py-3.5 bg-secondary/30 border ${forgotCredentials.confirmPassword && forgotCredentials.newPassword !== forgotCredentials.confirmPassword
                              ? "border-red-500 focus:border-red-500"
                              : "border-border/50 focus:border-green-500"
                              } rounded-xl focus:ring-2 focus:ring-green-500/20 transition-all duration-200 pr-12`}
                            placeholder="Confirm new password"
                          />
                          <button
                            onClick={() => toggleShowPassword("forgotConfirm")}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-colors"
                            type="button"
                          >
                            {showPasswords.forgotConfirm ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleForgotPasswordReset}
                      disabled={
                        !forgotCredentials.resetCode ||
                        !forgotCredentials.newPassword ||
                        !forgotCredentials.confirmPassword ||
                        forgotCredentials.newPassword !== forgotCredentials.confirmPassword ||
                        forgotCredentials.newPassword.length < 8
                      }
                      className="px-4 py-2.5 text-sm font-medium bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 w-full justify-center mt-4"
                    >
                      <Save className="w-4 h-4" />
                      Reset Password
                    </button>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Remember your password?{" "}
                  <button
                    onClick={() => setActiveTab("change")}
                    className="text-blue-500 hover:text-blue-600 font-medium"
                  >
                    Go back to Change Password
                  </button>
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AdminSecurity;
