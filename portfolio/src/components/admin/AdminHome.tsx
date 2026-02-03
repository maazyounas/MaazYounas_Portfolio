import { useState } from "react";
import { motion } from "framer-motion";
import {
  Save,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Type,
  ChevronDown,
  ChevronUp,
  Copy,
  Image as ImageIcon,
  Link as LinkIcon,
  Star,
  Sparkles,
  Grid3x3,
  CheckCircle,
} from "lucide-react";
import { HomePageData, Quote, Project, adminService } from "@/lib/adminService";
import { toast } from "sonner";

interface AdminHomeProps {
  data: HomePageData;
  quotes: Quote[];
  projects: Project[];
  onUpdate: () => void;
}

const AdminHome = ({ data, quotes, projects, onUpdate }: AdminHomeProps) => {
  const [formData, setFormData] = useState<HomePageData>(data);
  const [newQuote, setNewQuote] = useState("");
  const [newButton, setNewButton] = useState({
    text: "",
    link: "",
    variant: "primary" as "primary" | "secondary" | "outline",
  });
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    hero: true,
    heroButtons: false,
    quotes: true,
    sections: true,
    featured: false,
    seo: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleSave = () => {
    adminService.saveHomePageData(formData);
    toast.success("Home page settings saved successfully!");
    onUpdate();
  };

  const handleReset = () => {
    setFormData(data);
    toast.info("Changes reset");
  };

  const handleAddQuote = () => {
    if (!newQuote.trim()) {
      toast.error("Please enter a quote");
      return;
    }

    const updatedQuotes = [
      ...quotes,
      {
        id: Date.now().toString(),
        text: newQuote,
        author: "Anonymous",
        category: "Motivation",
        visible: true,
        createdAt: new Date().toISOString(),
      },
    ];

    adminService.saveQuotes(updatedQuotes);
    setNewQuote("");
    toast.success("Quote added");
    onUpdate();
  };

  const handleDeleteQuote = (id: string) => {
    const updatedQuotes = quotes.filter((q) => q.id !== id);
    adminService.saveQuotes(updatedQuotes);
    toast.success("Quote deleted");
    onUpdate();
  };

  const toggleQuoteVisibility = (id: string) => {
    const updatedQuotes = quotes.map((q) =>
      q.id === id ? { ...q, visible: !q.visible } : q,
    );
    adminService.saveQuotes(updatedQuotes);
    toast.success("Quote visibility updated");
    onUpdate();
  };

  const addHeroButton = () => {
    if (!newButton.text.trim() || !newButton.link.trim()) {
      toast.error("Please fill in both button text and link");
      return;
    }

    // Validate link format
    const linkRegex = /^(#|http|https|mailto|tel):/;
    if (!linkRegex.test(newButton.link)) {
      toast.error(
        "Link must start with #, http://, https://, mailto:, or tel:",
      );
      return;
    }

    setFormData({
      ...formData,
      heroButtons: [...formData.heroButtons, { ...newButton }],
    });

    setNewButton({ text: "", link: "", variant: "primary" });
    toast.success("Hero button added");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
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
            Home Page Management
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Customize your home page hero section, content, and SEO
          </p>
        </div>
        <div className="flex items-center gap-3">
          
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
        <>
          {/* Main Content */}
          <div className="space-y-6">
            {/* Hero Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <button
                onClick={() => toggleSection("hero")}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Hero Section
                  </h3>
                </div>
                {expandedSections.hero ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>

              {expandedSections.hero && (
                <div className="px-6 pb-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Main Tagline
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                        ({formData.heroTagline.length}/70 characters)
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.heroTagline}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            heroTagline: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-xl font-bold"
                        placeholder="Your amazing tagline..."
                        maxLength={70}
                      />
                      <button
                        onClick={() => copyToClipboard(formData.heroTagline)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors"
                        title="Copy tagline"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                        ({formData.heroDescription.length}/160 characters)
                      </span>
                    </label>
                    <textarea
                      value={formData.heroDescription}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          heroDescription: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                      rows={3}
                      placeholder="A brief description of who you are and what you do..."
                      maxLength={160}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      This appears below your tagline. Keep it concise and
                      engaging.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Motivational Quotes */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <button
                onClick={() => toggleSection("quotes")}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                    <Type className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Motivational Quotes
                  </h3>
                </div>
                {expandedSections.quotes ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>

              {expandedSections.quotes && (
                <div className="px-6 pb-6 space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newQuote}
                      onChange={(e) => setNewQuote(e.target.value)}
                      placeholder="Enter a new motivational quote..."
                      className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      onKeyPress={(e) => e.key === "Enter" && handleAddQuote()}
                    />
                    <button
                      onClick={handleAddQuote}
                      className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> Add
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {quotes.map((quote) => (
                      <div
                        key={quote.id}
                        className="group p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                              "{quote.text}"
                            </p>
                            {quote.author && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                — {quote.author}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => toggleQuoteVisibility(quote.id)}
                              className={`p-1 rounded ${
                                quote.visible
                                  ? "text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20"
                                  : "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                              }`}
                              title={
                                quote.visible ? "Hide quote" : "Show quote"
                              }
                            >
                              {quote.visible ? (
                                <Eye className="w-4 h-4" />
                              ) : (
                                <EyeOff className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => copyToClipboard(quote.text)}
                              className="p-1 text-gray-400 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                              title="Copy quote"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteQuote(quote.id)}
                              className="p-1 text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                              title="Delete quote"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              quote.visible
                                ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                            }`}
                          >
                            {quote.visible ? "Visible" : "Hidden"}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(quote.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {quotes.length === 0 && (
                    <div className="text-center py-8">
                      <Type className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-500 dark:text-gray-400">
                        No quotes added yet
                      </p>
                      <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                        Add motivational quotes to inspire your visitors
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      
    </motion.div>
  );
};

export default AdminHome;
