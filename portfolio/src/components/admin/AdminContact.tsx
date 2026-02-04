import { useState } from "react";
import { motion } from "framer-motion";
import {
  Save,
  Mail,
  Phone,
  MapPin,
  Copy,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Globe,
  MessageSquare,
  CheckCircle,
} from "lucide-react";
import { ContactPageData, adminService } from "../../lib/adminService";
import { toast } from "sonner";

interface AdminContactProps {
  data: ContactPageData;
  onUpdate: () => void;
}

const AdminContact = ({ data, onUpdate }: AdminContactProps) => {
  const [formData, setFormData] = useState<ContactPageData>(data);
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    contactInfo: true,
    socialLinks: true,
    formSettings: true,
  });
  
  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleSave = async () => {
    try {
      await adminService.saveContactPageData(formData);
      toast.success("Contact settings saved successfully!", {
        description: "Your contact information has been updated.",
        icon: <CheckCircle className="w-5 h-5 text-green-500" />,
      });
      onUpdate();
    } catch (error) {
      toast.error("Failed to save changes", {
        description: "Please try again.",
      });
    }
  };

  const handleReset = () => {
    setFormData(data);
    toast.info("Changes reset", {
      description: "All unsaved changes have been discarded.",
    });
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!", {
      description: `${label} has been copied.`,
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
              Contact Page Management
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Configure contact information and form settings
            </p>
          </div>
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <button
              onClick={handleReset}
              className="px-4 py-2.5 text-sm font-medium text-foreground/80 hover:text-foreground border border-border/50 hover:border-border rounded-xl hover:bg-secondary/50 transition-all duration-200 flex items-center gap-2 flex-1 lg:flex-none justify-center"
            >
              <RefreshCw className="w-4 h-4" />
              Reset
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2.5 text-sm font-medium bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 flex items-center gap-2 flex-1 lg:flex-none justify-center shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Information */}
        <motion.div
          whileHover={{ y: -2 }}
          className="glass rounded-2xl border border-border/50 overflow-hidden"
        >
          <button
            onClick={() => toggleSection("contactInfo")}
            className="w-full p-6 flex items-center justify-between hover:bg-secondary/30 transition-colors duration-200"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/20">
                <Mail className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-foreground">
                  Contact Information
                </h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Update your primary contact details
                </p>
              </div>
            </div>
            <div className="p-2 rounded-lg bg-secondary/50">
              {expandedSections.contactInfo ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </div>
          </button>

          {expandedSections.contactInfo && (
            <div className="p-6 pt-0 space-y-4">
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-blue-400" />
                      <span>Email Address</span>
                    </div>
                  </label>
                  <div className="relative group">
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-3.5 bg-secondary/30 border border-border/50 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-foreground placeholder:text-muted-foreground/50"
                      placeholder="contact@example.com"
                    />
                    <button
                      onClick={() => copyToClipboard(formData.email, "Email address")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      title="Copy email"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-green-400" />
                      <span>Phone Number</span>
                    </div>
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full px-4 py-3.5 bg-secondary/30 border border-border/50 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-foreground placeholder:text-muted-foreground/50"
                      placeholder="+1 (555) 123-4567"
                    />
                    <button
                      onClick={() => copyToClipboard(formData.phone, "Phone number")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      title="Copy phone number"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-red-400" />
                      <span>Location</span>
                    </div>
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      className="w-full px-4 py-3.5 bg-secondary/30 border border-border/50 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-foreground placeholder:text-muted-foreground/50"
                      placeholder="San Francisco, CA"
                    />
                    <button
                      onClick={() => copyToClipboard(formData.location, "Location")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      title="Copy location"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>

        {/* Preview Section */}
        <motion.div
          whileHover={{ y: -2 }}
          className="glass rounded-2xl border border-border/50 p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <MessageSquare className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Contact Preview</h3>
              <p className="text-sm text-muted-foreground">How your contact info will appear</p>
            </div>
          </div>

          <div className="space-y-6 p-6 bg-gradient-to-br from-secondary/30 to-transparent border border-border/30 rounded-xl">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-blue-500/10">
                  <Mail className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Email</p>
                  <p className="text-sm text-muted-foreground break-all">
                    {formData.email || "contact@example.com"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-green-500/10">
                  <Phone className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Phone</p>
                  <p className="text-sm text-muted-foreground">
                    {formData.phone || "+1 (555) 123-4567"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-red-500/10">
                  <MapPin className="w-4 h-4 text-red-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Location</p>
                  <p className="text-sm text-muted-foreground">
                    {formData.location || "San Francisco, CA"}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border/30">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-muted-foreground">Live preview updates as you type</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminContact;