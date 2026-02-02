import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { motion, Reorder } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  Star,
  Eye,
  Search,
  ExternalLink,
  Github,
  Grid3x3,
  Check,
  Hash,
  Move,
  FolderOpen,
  X,
  Save,
  Link as LinkIcon,
} from "lucide-react"; // Removed Pin icon
import { Project, adminService } from "@/lib/adminService";
import { toast } from "sonner";

interface AdminProjectsProps {
  projects: Project[];
  onUpdate: () => void;
}

interface FilterState {
  search: string;
  category: string;
  complexity: string;
  featured: string;
}

const AdminProjects = ({
  projects: initialProjects,
  onUpdate,
}: AdminProjectsProps) => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Partial<Project> | null>(null);
  const [newTech, setNewTech] = useState("");
  const [filterState, setFilterState] = useState<FilterState>({
    search: "",
    category: "all",
    complexity: "all",
    featured: "all",
  });
  const [isReordering, setIsReordering] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Memoized calculations
  const stats = useMemo(
    () => ({
      total: projects.length,
      visible: projects.filter((p) => p.visible).length,
      hidden: projects.filter((p) => !p.visible).length,
      featured: projects.filter((p) => p.featured).length,
    }),
    [projects],
  );

  const filteredProjects = useMemo(() => {
    return projects
      .filter((project) => {
        const matchesSearch =
          !filterState.search ||
          project.title
            .toLowerCase()
            .includes(filterState.search.toLowerCase()) ||
          project.description
            .toLowerCase()
            .includes(filterState.search.toLowerCase()) ||
          project.tech.some((tech) =>
            tech.toLowerCase().includes(filterState.search.toLowerCase()),
          );

        const matchesCategory =
          filterState.category === "all" ||
          project.category === filterState.category;
        const matchesComplexity =
          filterState.complexity === "all" ||
          project.complexity === filterState.complexity;
        const matchesFeatured =
          filterState.featured === "all" ||
          (filterState.featured === "featured" && project.featured) ||
          (filterState.featured === "normal" && !project.featured);

        return (
          matchesSearch &&
          matchesCategory &&
          matchesComplexity &&
          matchesFeatured
        );
      })
      .sort((a, b) => {
        // Sort by featured first, then by order
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return (a.order || 0) - (b.order || 0);
      });
  }, [projects, filterState]);

  // Effects
  useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects]);

  // Handlers with useCallback
  const handleDelete = useCallback(
    async (id: string) => {
      if (!window.confirm("Are you sure you want to delete this project?"))
        return;

      try {
        await adminService.deleteProject(id);

        // 🔥 remove instantly from admin UI
        setProjects((prev) => prev.filter((p) => p.id !== id));

        toast.success("Project deleted successfully");

        // 🔁 also refetch for safety
        onUpdate();
      } catch (err) {
        toast.error("Failed to delete project");
      }
    },
    [onUpdate],
  );

  const handleToggleFeatured = useCallback(
    async (project: Project) => {
      try {
        await adminService.updateProject(project.id, {
          featured: !project.featured,
        });

        // 🔥 update local state instantly
        setProjects((prev) =>
          prev.map((p) =>
            p.id === project.id ? { ...p, featured: !p.featured } : p,
          ),
        );

        toast.success(`Project ${project.featured ? "unfeatured" : "featured"}`);
        onUpdate(); // optional safety refetch
      } catch (err) {
        toast.error("Failed to toggle featured status");
      }
    },
    [onUpdate],
  );

  const handleSave = useCallback(async () => {
    if (!editItem) return;
    if (!editItem.title?.trim() || !editItem.description?.trim()) {
      return toast.error("Title and description are required");
    }

    try {
      if (editItem.id) {
        await adminService.updateProject(editItem.id, editItem);
      } else {
        await adminService.addProject(editItem as Project);
      }
      setModalOpen(false);
      setEditItem(null);
      toast.success(editItem.id ? "Project updated" : "Project added");
      onUpdate();
    } catch (error) {
      toast.error("Failed to save project");
      console.error(error);
    }
  }, [editItem, onUpdate]);

  const addTech = useCallback(() => {
    if (newTech.trim() && editItem) {
      setEditItem({
        ...editItem,
        tech: [...(editItem.tech || []), newTech.trim()],
      });
      setNewTech("");
    }
  }, [newTech, editItem]);

  const removeTech = useCallback(
    (techToRemove: string) => {
      if (editItem) {
        setEditItem({
          ...editItem,
          tech: (editItem.tech || []).filter((t) => t !== techToRemove),
        });
      }
    },
    [editItem],
  );

  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !editItem) return;

      if (!file.type.startsWith("image/"))
        return toast.error("Please select an image file");
      if (file.size > 5 * 1024 * 1024)
        return toast.error("Image size must be less than 5MB");

      const reader = new FileReader();
      reader.onload = (event) => {
        setEditItem({ ...editItem, image: event.target?.result as string });
        toast.success("Image uploaded successfully");
      };
      reader.readAsDataURL(file);
    },
    [editItem],
  );

  const handleReorder = useCallback((reorderedProjects: Project[]) => {
    const updatedProjects = reorderedProjects.map((project, index) => ({
      ...project,
      order: index,
    }));
    setProjects(updatedProjects);
  }, []);

  const saveOrder = useCallback(async () => {
    await Promise.all(
      projects.map((p, index) =>
        adminService.updateProject(p.id, { order: index }),
      ),
    );
    setIsReordering(false);
    toast.success("Project order saved");
    onUpdate();
  }, [projects, onUpdate]);

  // ProjectCard Component
  const ProjectCard = useCallback(
    ({ project }: { project: Project }) => (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ y: -2 }}
        className={`rounded-xl border transition-all duration-300 group ${
          project.visible
            ? "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
            : "border-gray-100 dark:border-gray-800 opacity-60"
        }`}
      >
        <div className="p-4 flex flex-col h-full">
          <div className="flex-shrink-0 mb-4">
            <div className="relative">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-40 rounded-lg object-cover"
                loading="lazy"
              />
              <div className="absolute top-2 right-2">
                {project.featured && (
                  <span className="px-2 py-1 bg-yellow-500 text-white text-xs rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3" /> Featured
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                  {project.title}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      project.complexity === "beginner"
                        ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                        : project.complexity === "intermediate"
                        ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
                        : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                    }`}
                  >
                    {project.complexity || "intermediate"}
                  </span>
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                    {project.category || "web"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleFeatured(project)}
                  className="p-2 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/20"
                  title={project.featured ? "Unfeature" : "Feature"}
                >
                  <Star
                    className={`w-4 h-4 ${
                      project.featured
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-gray-400"
                    }`}
                  />
                </button>
                <button
                  onClick={() => {
                    setEditItem(project);
                    setModalOpen(true);
                  }}
                  className="p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                  title="Edit project"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                  title="Delete project"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-1 mb-4">
              {project.tech.slice(0, 4).map((tech, idx) => (
                <span
                  key={`${tech}-${idx}`}
                  className="px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                >
                  {tech}
                </span>
              ))}
              {project.tech.length > 4 && (
                <span className="px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                  +{project.tech.length - 4}
                </span>
              )}
            </div>

            <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4">
                {project.link && project.showLink !== false && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="w-3 h-3" /> Demo
                  </a>
                )}
                {project.github && project.showGithub !== false && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 text-sm flex items-center gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Github className="w-3 h-3" /> Code
                  </a>
                )}
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {project.updatedAt
                  ? new Date(project.updatedAt).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    ),
    [handleToggleFeatured, handleDelete],
  );

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
            Projects Management
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Manage your portfolio projects ({projects.length} total)
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setEditItem({
                title: "",
                description: "",
                image: "",
                tech: [],
                link: "",
                github: "",
                featured: false,
                visible: true,
                category: "web",
                complexity: "intermediate",
                showGithub: true,
                showLink: true,
              });
              setModalOpen(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Project
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total
            </span>
          </div>
          <p className="text-2xl font-bold mt-2">{stats.total}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Visible
            </span>
          </div>
          <p className="text-2xl font-bold mt-2">{stats.visible}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Featured
            </span>
          </div>
          <p className="text-2xl font-bold mt-2">{stats.featured}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
          <div className="flex items-center gap-2">
            <Grid3x3 className="w-5 h-5 text-purple-500" />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Hidden
            </span>
          </div>
          <p className="text-2xl font-bold mt-2">{stats.hidden}</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search projects..."
                value={filterState.search}
                onChange={(e) =>
                  setFilterState({ ...filterState, search: e.target.value })
                }
                className="pl-10 pr-4 py-2 w-full md:w-64 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={filterState.category}
              onChange={(e) =>
                setFilterState({ ...filterState, category: e.target.value })
              }
              className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg text-sm"
            >
              <option value="all">All Categories</option>
              <option value="web">Web Development</option>
              <option value="mobile">Mobile App</option>
              <option value="design">UI/UX Design</option>
              <option value="other">Other</option>
            </select>
            <select
              value={filterState.complexity}
              onChange={(e) =>
                setFilterState({ ...filterState, complexity: e.target.value })
              }
              className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg text-sm"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            <select
              value={filterState.featured}
              onChange={(e) =>
                setFilterState({ ...filterState, featured: e.target.value })
              }
              className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg text-sm"
            >
              <option value="all">All Projects</option>
              <option value="featured">Featured Only</option>
              <option value="normal">Not Featured</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {isReordering ? (
        <Reorder.Group
          axis="y"
          values={filteredProjects}
          onReorder={handleReorder}
          className="space-y-4"
        >
          {filteredProjects.map((project) => (
            <Reorder.Item key={project.id} value={project} className="list-none">
              <div className="bg-white dark:bg-gray-800 rounded-xl border p-4 cursor-grab active:cursor-grabbing">
                <div className="flex items-center gap-4">
                  <Move className="w-5 h-5 text-gray-400" />
                  <div className="flex-1 flex items-center gap-4">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-bold">{project.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                        {project.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Position: {project.order + 1}
                  </div>
                </div>
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      ) : (
        <>
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <FolderOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No projects found</h3>
              <p className="text-gray-500 dark:text-gray-400">
                {filterState.search
                  ? "Try adjusting your search terms"
                  : "Get started by adding your first project"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </>
      )}

      {/* Edit/Add Modal */}
      {modalOpen && editItem && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b p-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">
                  {editItem.id ? "Edit Project" : "Add New Project"}
                </h3>
              </div>
              <button
                onClick={() => {
                  setModalOpen(false);
                  setEditItem(null);
                }}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    value={editItem.title || ""}
                    onChange={(e) =>
                      setEditItem({ ...editItem, title: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter project title..."
                  />
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editItem.featured || false}
                      onChange={(e) =>
                        setEditItem({ ...editItem, featured: e.target.checked })
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium">
                      Featured Project (Shows first in user interface)
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Description *
                </label>
                <textarea
                  value={editItem.description || ""}
                  onChange={(e) =>
                    setEditItem({ ...editItem, description: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                  placeholder="Describe your project..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Category
                  </label>
                  <select
                    value={editItem.category || "web"}
                    onChange={(e) =>
                      setEditItem({ ...editItem, category: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="web">Web Development</option>
                    <option value="mobile">Mobile App</option>
                    <option value="design">UI/UX Design</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Complexity Level
                  </label>
                  <select
                    value={editItem.complexity || "intermediate"}
                    onChange={(e) =>
                      setEditItem({
                        ...editItem,
                        complexity: e.target.value as
                          | "beginner"
                          | "intermediate"
                          | "advanced",
                      })
                    }
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Project Image
                </label>
                <div className="flex items-center gap-4">
                  {editItem.image && (
                    <img
                      src={editItem.image}
                      alt="Project"
                      className="w-24 h-24 rounded-lg object-cover border"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Upload Image
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium">
                      <ExternalLink className="w-4 h-4 inline mr-2" /> Live Demo
                      URL
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={editItem.showLink !== false}
                        onChange={(e) =>
                          setEditItem({
                            ...editItem,
                            showLink: e.target.checked,
                          })
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      Show on frontend
                    </label>
                  </div>
                  <input
                    type="url"
                    value={editItem.link || ""}
                    onChange={(e) =>
                      setEditItem({ ...editItem, link: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://demo.example.com"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium">
                      <Github className="w-4 h-4 inline mr-2" /> GitHub URL
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={editItem.showGithub !== false}
                        onChange={(e) =>
                          setEditItem({
                            ...editItem,
                            showGithub: e.target.checked,
                          })
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      Show on frontend
                    </label>
                  </div>
                  <input
                    type="url"
                    value={editItem.github || ""}
                    onChange={(e) =>
                      setEditItem({ ...editItem, github: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://github.com/username/project"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Technologies Used
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {(editItem.tech || []).map((tech) => (
                    <span
                      key={tech}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                    >
                      <Hash className="w-3 h-3" />
                      {tech}
                      <button
                        onClick={() => removeTech(tech)}
                        className="text-blue-500 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTech}
                    onChange={(e) => setNewTech(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addTech()}
                    className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Add technology..."
                  />
                  <button
                    onClick={addTech}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="sticky bottom-0 bg-white dark:bg-gray-800 pt-6 border-t">
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setModalOpen(false);
                      setEditItem(null);
                    }}
                    className="px-6 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {editItem.id ? "Update Project" : "Create Project"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default AdminProjects;