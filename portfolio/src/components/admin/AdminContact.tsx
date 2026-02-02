import { useState } from "react";
import { motion } from "framer-motion";
import {
  Save,
  Plus,
  Trash2,
  Mail,
  Phone,
  MapPin,
  AlertCircle,
  Copy,
  Bell,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { ContactPageData, adminService } from "@/lib/adminService";
import { toast } from "sonner";

interface AdminContactProps {
  data: ContactPageData;
  onUpdate: () => void;
}

const AdminContact = ({ data, onUpdate }: AdminContactProps) => {
  const [formData, setFormData] = useState<ContactPageData>(data);
  const [newNotificationEmail, setNewNotificationEmail] = useState("");
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    contactInfo: true,
    socialLinks: true,
    formSettings: true,
    notificationEmails: false,
    formFields: true,
  });
  
  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleSave = () => {
    adminService.saveContactPageData(formData);
    toast.success("Contact settings saved successfully!");
    onUpdate();
  };

  const handleReset = () => {
    setFormData(data);
    toast.info("Changes reset");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const addNotificationEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(newNotificationEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (formData.notificationEmails.includes(newNotificationEmail)) {
      toast.warning("This email is already in the list");
      return;
    }

    setFormData({
      ...formData,
      notificationEmails: [
        ...formData.notificationEmails,
        newNotificationEmail,
      ],
    });

    setNewNotificationEmail("");
    toast.success("Notification email added");
  };

  const removeNotificationEmail = (email: string) => {
    setFormData({
      ...formData,
      notificationEmails: formData.notificationEmails.filter(
        (e) => e !== email,
      ),
    });
    toast.info("Notification email removed");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Contact Page Management
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Configure contact information, form settings, and notifications
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Reset
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Contact Information */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <button
            onClick={() => toggleSection("contactInfo")}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Contact Information
              </h3>
            </div>
            {expandedSections.contactInfo ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>

          {expandedSections.contactInfo && (
            <div className="px-6 pb-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" /> Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="contact@example.com"
                    />
                    <button
                      onClick={() => copyToClipboard(formData.email)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors"
                      title="Copy email"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" /> Phone Number
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" /> Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="San Francisco, CA"
                />
              </div>
            </div>
          )}
        </div>

        {/* Notification Emails */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <button
            onClick={() => toggleSection("notificationEmails")}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                <Bell className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Notification Emails
              </h3>
            </div>
            {expandedSections.notificationEmails ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>

          {expandedSections.notificationEmails && (
            <div className="px-6 pb-6 space-y-4">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={newNotificationEmail}
                  onChange={(e) => setNewNotificationEmail(e.target.value)}
                  placeholder="Enter email to receive notifications"
                  className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <button
                  onClick={addNotificationEmail}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>

              <div className="space-y-2">
                {formData.notificationEmails.map((email) => (
                  <div
                    key={email}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                        {email}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyToClipboard(email)}
                        className="p-1 text-gray-400 hover:text-green-500 transition-colors"
                        title="Copy email"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeNotificationEmail(email)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        title="Remove email"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {formData.notificationEmails.length === 0 && (
                  <div className="text-center py-6">
                    <Bell className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-500 dark:text-gray-400">
                      No notification emails configured
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                      Add emails to receive notifications when someone contacts
                      you
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                      Important
                    </p>
                    <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                      These emails will receive notifications for every form
                      submission. Make sure to use valid email addresses that
                      you regularly check.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AdminContact;
