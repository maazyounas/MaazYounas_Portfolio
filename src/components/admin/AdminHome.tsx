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
  RefreshCw,
} from "lucide-react";
import { HomePageData, Quote, Project, adminService } from "../../lib/adminService";
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
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    hero: true,
    quotes: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleSave = async () => {
    try {
      await adminService.saveHomePageData(formData);
      toast.success("Home page settings saved successfully!", {
        description: "Your changes have been published.",
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
    toast.info("Changes reset to original", {
      description: "All unsaved changes have been discarded.",
    });
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
    toast.success("Quote added successfully", {
      description: "Your motivational quote has been published.",
    });
    onUpdate();
  };

  const handleDeleteQuote = (id: string) => {
    const updatedQuotes = quotes.filter((q) => q.id !== id);
    adminService.saveQuotes(updatedQuotes);
    toast.success("Quote deleted", {
      description: "The quote has been removed.",
    });
    onUpdate();
  };

  const toggleQuoteVisibility = (id: string) => {
    const updatedQuotes = quotes.map((q) =>
      q.id === id ? { ...q, visible: !q.visible } : q,
    );
    adminService.saveQuotes(updatedQuotes);
    toast.success(
      updatedQuotes.find(q => q.id === id)?.visible 
        ? "Quote is now visible" 
        : "Quote is now hidden",
      {
        description: "The quote visibility has been updated.",
      }
    );
    onUpdate();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!", {
      description: "Text has been copied to your clipboard.",
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
              Home Page Management
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Customize your home page hero section and motivational quotes
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
        {/* Hero Section */}
        <motion.div
          whileHover={{ y: -2 }}
          className="glass rounded-2xl border border-border/50 overflow-hidden"
        >
          <button
            onClick={() => toggleSection("hero")}
            className="w-full p-6 flex items-center justify-between hover:bg-secondary/30 transition-colors duration-200"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/20">
                <Sparkles className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-foreground">
                  Hero Section
                </h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Customize your main headline and description
                </p>
              </div>
            </div>
            <div className="p-2 rounded-lg bg-secondary/50">
              {expandedSections.hero ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </div>
          </button>

          {expandedSections.hero && (
            <div className="p-6 pt-0 space-y-4">
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    <div className="flex items-center justify-between">
                      <span>Main Tagline</span>
                      <span className="text-xs font-mono bg-secondary/50 px-2 py-1 rounded">
                        {formData.heroTagline.length}/70
                      </span>
                    </div>
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      value={formData.heroTagline}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          heroTagline: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3.5 bg-secondary/30 border border-border/50 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-lg font-semibold text-foreground placeholder:text-muted-foreground/50"
                      placeholder="Your amazing tagline..."
                      maxLength={70}
                    />
                    <button
                      onClick={() => copyToClipboard(formData.heroTagline)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      title="Copy tagline"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    <div className="flex items-center justify-between">
                      <span>Description</span>
                      <span className="text-xs font-mono bg-secondary/50 px-2 py-1 rounded">
                        {formData.heroDescription.length}/160
                      </span>
                    </div>
                  </label>
                  <div className="relative group">
                    <textarea
                      value={formData.heroDescription}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          heroDescription: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3.5 bg-secondary/30 border border-border/50 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 resize-none text-foreground placeholder:text-muted-foreground/50"
                      rows={4}
                      placeholder="A brief description of who you are and what you do..."
                      maxLength={160}
                    />
                    <button
                      onClick={() => copyToClipboard(formData.heroDescription)}
                      className="absolute right-3 top-3 p-2 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      title="Copy description"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3 flex items-center gap-2">
                    <Sparkles className="w-3 h-3" />
                    This appears below your tagline. Keep it concise and engaging.
                  </p>
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>

        {/* Motivational Quotes */}
        <motion.div
          whileHover={{ y: -2 }}
          className="glass rounded-2xl border border-border/50 overflow-hidden"
        >
          <button
            onClick={() => toggleSection("quotes")}
            className="w-full p-6 flex items-center justify-between hover:bg-secondary/30 transition-colors duration-200"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/20">
                <Type className="w-5 h-5 text-amber-400" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-foreground">
                  Motivational Quotes
                </h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {quotes.length} quotes • {quotes.filter(q => q.visible).length} visible
                </p>
              </div>
            </div>
            <div className="p-2 rounded-lg bg-secondary/50">
              {expandedSections.quotes ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </div>
          </button>

          {expandedSections.quotes && (
            <div className="p-6 pt-0 space-y-4">
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="flex gap-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={newQuote}
                      onChange={(e) => setNewQuote(e.target.value)}
                      placeholder="Enter a new motivational quote..."
                      className="w-full px-4 py-3 bg-secondary/30 border border-border/50 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all duration-200 text-foreground placeholder:text-muted-foreground/50"
                      onKeyPress={(e) => e.key === "Enter" && handleAddQuote()}
                    />
                  </div>
                  <button
                    onClick={handleAddQuote}
                    className="px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-200 flex items-center gap-2 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40"
                  >
                    <Plus className="w-4 h-4" />
                    Add Quote
                  </button>
                </div>

                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {quotes.map((quote) => (
                    <motion.div
                      key={quote.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.01 }}
                      className="group p-4 rounded-xl border border-border/50 hover:border-amber-500/30 hover:bg-gradient-to-r hover:from-amber-500/5 hover:to-transparent transition-all duration-200"
                    >
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`p-1 rounded-full ${quote.visible ? 'bg-green-500/20' : 'bg-gray-500/20'}`}>
                              {quote.visible ? (
                                <Eye className="w-3 h-3 text-green-400" />
                              ) : (
                                <EyeOff className="w-3 h-3 text-gray-400" />
                              )}
                            </div>
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${quote.visible ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-500'}`}>
                              {quote.visible ? 'Visible' : 'Hidden'}
                            </span>
                          </div>
                          <p className="text-sm text-foreground/90 italic leading-relaxed">
                            "{quote.text}"
                          </p>
                          {quote.author && (
                            <p className="text-xs text-muted-foreground mt-3">
                              — {quote.author}
                            </p>
                          )}
                          <div className="flex items-center gap-3 mt-4">
                            <span className="text-xs text-muted-foreground">
                              {new Date(quote.createdAt).toLocaleDateString()}
                            </span>
                            <span className="text-xs px-2 py-1 bg-secondary/50 rounded">
                              {quote.category}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => copyToClipboard(quote.text)}
                            className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-colors"
                            title="Copy quote"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => toggleQuoteVisibility(quote.id)}
                            className="p-2 text-muted-foreground hover:text-amber-500 hover:bg-secondary/50 rounded-lg transition-colors"
                            title={quote.visible ? "Hide quote" : "Show quote"}
                          >
                            {quote.visible ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteQuote(quote.id)}
                            className="p-2 text-muted-foreground hover:text-red-500 hover:bg-secondary/50 rounded-lg transition-colors"
                            title="Delete quote"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {quotes.length === 0 && (
                  <div className="text-center py-8">
                    <Type className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground">No quotes added yet</p>
                    <p className="text-sm text-muted-foreground/60 mt-1">
                      Add motivational quotes to inspire your visitors
                    </p>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminHome;