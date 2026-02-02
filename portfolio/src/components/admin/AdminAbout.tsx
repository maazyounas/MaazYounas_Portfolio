import { useState } from "react";
import {
  Save,
  Plus,
  Upload,
  X,
  ChevronDown,
  ChevronUp,
  Search,
} from "lucide-react";
import { AboutPageData, adminService } from "@/lib/adminService";
import { toast } from "sonner";
import * as FaIcons from "react-icons/fa";
import * as SiIcons from "react-icons/si";
import * as DiIcons from "react-icons/di";
import * as TbIcons from "react-icons/tb";

interface AdminAboutProps {
  data: AboutPageData;
  onUpdate: () => void;
}

interface TechItem {
  name: string;
  icon: string;
}

const AllIcons = {
  ...FaIcons,
  ...SiIcons,
  ...DiIcons,
  ...TbIcons,
};

const getIconComponent = (iconName: string) => {
  return AllIcons[iconName as keyof typeof AllIcons];
};

const AdminAbout = ({ data, onUpdate }: AdminAboutProps) => {
  // Initialize techStack
  const initialTechStack: TechItem[] = Array.isArray(data.techStack)
    ? data.techStack.map(tech => 
        typeof tech === 'string' 
          ? { name: tech, icon: 'FaCode' }
          : tech
      )
    : [];

  const [formData, setFormData] = useState<AboutPageData>({
    ...data,
    techStack: initialTechStack
  });
  
  const [newTech, setNewTech] = useState("");
  const [expandedSections, setExpandedSections] = useState({
    profile: true,
    tech: true,
  });
  
  // Icon selection states
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<string>("FaReact");
  const [iconQuery, setIconQuery] = useState("");

  // Get all React Icons
  const allIcons = Object.entries(AllIcons);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleSave = () => {
    adminService.saveAboutPageData(formData);
    toast.success("About page settings saved successfully");
    onUpdate();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setFormData({ ...formData, profileImage: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const addTech = () => {
    if (!newTech.trim()) {
      toast.error("Please enter a technology name");
      return;
    }

    if (!selectedIcon) {
      toast.error("Please select an icon");
      return;
    }

    const newTechItem: TechItem = {
      name: newTech,
      icon: selectedIcon
    };

    setFormData({
      ...formData,
      techStack: [...formData.techStack, newTechItem],
    });

    setNewTech("");
    setSelectedIcon("FaReact");
    setShowIconPicker(false);
    toast.success("Technology added");
  };

  const removeTech = (index: number) => {
    const updatedTechStack = [...formData.techStack];
    updatedTechStack.splice(index, 1);
    setFormData({
      ...formData,
      techStack: updatedTechStack,
    });
  };

  // Filter icons based on search query
  const filteredIcons = allIcons.filter(([iconName]) => 
    iconName.toLowerCase().includes(iconQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6 bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">
            About Page Management
          </h2>
          <p className="text-gray-400">
            Manage your profile and technologies
          </p>
        </div>
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Profile Information */}
        <div className="bg-gray-800 rounded-lg border border-gray-700">
          <div className="px-6 py-4 flex items-center justify-between bg-gray-800 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white">
              Profile Information
            </h3>
            <button onClick={() => toggleSection("profile")}>
              {expandedSections.profile ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>

          {expandedSections.profile && (
            <div className="px-6 pb-6 space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="w-40 h-40 rounded-lg overflow-hidden border-2 border-gray-700 bg-gray-900">
                    <img
                      src={formData.profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <label className="cursor-pointer mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors">
                    <Upload className="w-4 h-4" />
                    Upload Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    Max 5MB • PNG, JPG, WebP
                  </p>
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Tagline
                    </label>
                    <input
                      type="text"
                      value={formData.tagline}
                      onChange={(e) =>
                        setFormData({ ...formData, tagline: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                      placeholder="Your professional tagline"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData({ ...formData, bio: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                      rows={4}
                      placeholder="Professional biography"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tech Stack */}
        <div className="bg-gray-800 rounded-lg border border-gray-700">
          <div className="px-6 py-4 flex items-center justify-between bg-gray-800 border-b border-gray-700">
            <div>
              <h3 className="text-lg font-semibold text-white">
                Tech Stack
              </h3>
              <p className="text-sm text-gray-400">
                {formData.techStack.length} technologies
              </p>
            </div>
            <button onClick={() => toggleSection("tech")}>
              {expandedSections.tech ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>

          {expandedSections.tech && (
            <div className="px-6 pb-6 space-y-6">
              {/* Add New Tech Form */}
              <div className="space-y-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                <h4 className="font-medium text-white">Add Technology</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Technology Name
                    </label>
                    <input
                      type="text"
                      value={newTech}
                      onChange={(e) => setNewTech(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addTech()}
                      placeholder="e.g., React, Node.js"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Select Icon
                    </label>
                    <div className="relative">
                      <button
                        onClick={() => setShowIconPicker(!showIconPicker)}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white flex items-center justify-between hover:bg-gray-600 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {selectedIcon && (
                            <div className="text-blue-400">
                              {(() => {
                                const IconComponent = getIconComponent(selectedIcon);
                                return IconComponent ? <IconComponent className="w-5 h-5" /> : null;
                              })()}
                            </div>
                          )}
                          <span className="text-gray-300">
                            {selectedIcon || "Select icon..."}
                          </span>
                        </div>
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      </button>

                      {showIconPicker && (
                        <div className="absolute z-50 mt-2 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-2xl max-h-96 overflow-hidden">
                          <div className="p-3 border-b border-gray-700">
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                              <input
                                type="text"
                                value={iconQuery}
                                onChange={(e) => setIconQuery(e.target.value)}
                                placeholder="Search icons..."
                                className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                              />
                            </div>
                          </div>
                          
                          <div className="overflow-y-auto max-h-64">
                            <div className="grid grid-cols-8 gap-2 p-3">
                              {filteredIcons.slice(0, 96).map(([iconName, IconComponent]) => (
                                <button
                                  key={iconName}
                                  onClick={() => {
                                    setSelectedIcon(iconName);
                                    setShowIconPicker(false);
                                  }}
                                  className={`p-2 rounded flex items-center justify-center transition-colors ${
                                    selectedIcon === iconName
                                      ? "bg-blue-900/30 border border-blue-700"
                                      : "bg-gray-900 hover:bg-gray-700 border border-transparent"
                                  }`}
                                  title={iconName}
                                >
                                  <IconComponent className="w-4 h-4 text-gray-300" />
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={addTech}
                    disabled={!newTech.trim() || !selectedIcon}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Add Technology
                  </button>
                </div>
              </div>

              {/* Tech Stack Display */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium text-white">
                    Technologies ({formData.techStack.length})
                  </h4>
                  {formData.techStack.length > 0 && (
                    <span className="text-sm text-gray-400">
                      Click × to remove
                    </span>
                  )}
                </div>
                
                {formData.techStack.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {formData.techStack.map((tech, index) => {
                      const IconComponent = getIconComponent(tech.icon);
                      return (
                        <div
                          key={index}
                          className="p-3 rounded-lg bg-gray-900/50 border border-gray-700 hover:border-gray-600 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="text-blue-400">
                                {IconComponent && (
                                  <IconComponent className="w-5 h-5" />
                                )}
                              </div>
                              <div className="text-left">
                                <div className="font-medium text-white text-sm">
                                  {tech.name}
                                </div>
                                <div className="text-xs text-gray-500 font-mono">
                                  {tech.icon}
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => removeTech(index)}
                              className="text-gray-500 hover:text-red-400 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 border-2 border-dashed border-gray-700 rounded-lg bg-gray-900/30">
                    <div className="inline-flex p-4 rounded-full bg-gray-800 mb-4">
                      <div className="text-gray-500">?</div>
                    </div>
                    <h4 className="text-lg font-medium text-gray-300 mb-2">
                      No Technologies Added
                    </h4>
                    <p className="text-gray-500 max-w-sm mx-auto">
                      Add technologies to showcase your skills
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAbout;