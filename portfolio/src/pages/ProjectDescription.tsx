import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import {
  ExternalLink,
  Github,
  Calendar,
  Code2,
  Sparkles,
  Eye,
  Share2,
  X,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { adminService, Project } from "@/lib/adminService";
import { toast } from "sonner";

const ProjectDescription = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const projects = await adminService.getProjects();
        setAllProjects(projects);
        const foundProject = projects.find((p) => p.id === id);

        if (foundProject) {
          setProject(foundProject);
          adminService.addProjectView(foundProject.id);
        } else {
          toast.error("Project not found");
          navigate("/projects");
        }
      } catch (error) {
        console.error("Failed to fetch project:", error);
        toast.error("Failed to load project");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, navigate]);

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const currentIndex = allProjects.findIndex((p) => p.id === id);
  const nextProject = allProjects[currentIndex + 1];
  const prevProject = allProjects[currentIndex - 1];

  // Skeleton loader
  if (loading) {
    return (
      <Layout>
        <section className="py-12 sm:py-16 lg:py-20 min-h-screen relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative z-10">

            {/* Featured Badge Skeleton */}
            <div className="flex justify-center mb-6">
              <div className="h-8 w-32 bg-gray-700/30 rounded-full animate-pulse"></div>
            </div>

            {/* Title Skeleton */}
            <div className="mb-8">
              <div className="h-12 bg-gray-700/30 rounded-xl animate-pulse mb-4"></div>
              <div className="h-8 bg-gray-700/30 rounded-xl animate-pulse w-3/4 mx-auto"></div>
            </div>

            {/* Image Skeleton */}
            <div className="mb-8 rounded-2xl overflow-hidden">
              <div className="aspect-video bg-gray-700/30 animate-pulse"></div>
            </div>

            {/* Description Skeleton */}
            <div className="mb-8">
              <div className="h-6 bg-gray-700/30 rounded-lg animate-pulse mb-4 w-1/3"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-700/30 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-700/30 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-700/30 rounded animate-pulse w-5/6"></div>
              </div>
            </div>

            {/* Category & Tech Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <div className="h-6 bg-gray-700/30 rounded-lg animate-pulse mb-4 w-1/2"></div>
                <div className="h-10 bg-gray-700/30 rounded-lg animate-pulse"></div>
              </div>
              <div>
                <div className="h-6 bg-gray-700/30 rounded-lg animate-pulse mb-4 w-1/2"></div>
                <div className="flex flex-wrap gap-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-8 w-20 bg-gray-700/30 rounded-full animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Buttons Skeleton */}
            <div className="flex justify-center gap-4 mb-12">
              <div className="h-12 w-40 bg-gray-700/30 rounded-lg animate-pulse"></div>
              <div className="h-12 w-40 bg-gray-700/30 rounded-lg animate-pulse"></div>
              <div className="h-12 w-40 bg-gray-700/30 rounded-lg animate-pulse"></div>
            </div>

            {/* Navigation Skeleton */}
            <div className="mt-12 pt-8 border-t border-border/30">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="h-12 w-full sm:w-48 bg-gray-700/30 rounded-xl animate-pulse"></div>
                <div className="h-12 w-full sm:w-48 bg-gray-700/30 rounded-xl animate-pulse"></div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>{project.title} | Project Details</title>
        <meta name="description" content={project.description} />
      </Helmet>
      <Layout>
        <section className="py-12 sm:py-16 lg:py-20 min-h-screen relative overflow-hidden">
          {/* Animated Background */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-10 left-5 sm:top-20 sm:left-20 w-48 h-48 sm:w-64 sm:h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none"
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-20 right-5 sm:bottom-40 sm:right-20 w-64 h-64 sm:w-96 sm:h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none"
          />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative z-10">            

            {/* Featured Badge - Centered */}
            {project.featured && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="flex justify-center mb-6"
              >
                <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-sm sm:text-base font-semibold neon-glow-soft">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                  Featured Project
                </div>
              </motion.div>
            )}

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-8"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-metallic-animated mb-4 break-words">
                {project.title}
              </h1>
              {project.tagline && (
                <p className="text-lg sm:text-xl text-foreground/70">{project.tagline}</p>
              )}
            </motion.div>

            {/* Main Image */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8 rounded-2xl overflow-hidden glass-neon border border-border/50 cursor-pointer group"
              onClick={() => setSelectedImage(project.image)}
            >
              <div className="relative aspect-video">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Eye className="w-6 h-6 text-white/80" />
                </div>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8"
            >
              <div className="prose prose-lg max-w-none text-center">
                <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">
                  {project.description}
                </p>
              </div>
            </motion.div>

            {/* Category & Technology */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8"
            >
              {/* Category */}
              <div className="glass-neon rounded-xl p-6 border border-border/50">
                <h3 className="text-xl font-bold text-metallic mb-4 flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-primary" />
                  Category
                </h3>
                <p className="text-foreground/80">{project.category}</p>
              </div>

              {/* Technology */}
              <div className="glass-neon rounded-xl p-6 border border-border/50">
                <h3 className="text-xl font-bold text-metallic mb-4">Technologies Used</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tech?.map((tech, index) => (
                    <motion.span
                      key={tech}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + index * 0.05 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className="px-3 py-1.5 text-sm rounded-full bg-secondary/50 border border-border/50 text-foreground hover:bg-primary/10 hover:border-primary/40 hover:text-primary transition-all duration-300 cursor-default"
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Buttons - Centered */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap justify-center gap-4 mb-12"
            >
              {project.showLink && project.link && (
                <motion.a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center gap-2 px-6 py-3 btn-neon text-primary-foreground text-base w-30"
                >
                  <ExternalLink className="w-5 h-5" />
                  Live Demo
                </motion.a>
              )}
              
              {project.showGithub && project.github && (
                <motion.a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center gap-2 px-6 py-3 btn-outline-neon text-base w-30"
                >
                  <Github className="w-5 h-5" />
                  View Code
                </motion.a>
              )}
              
              <motion.button
                onClick={handleShare}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center gap-2 px-6 py-3 glass border border-border/50 rounded-lg hover:border-primary/50 transition-colors text-base w-30"
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5 text-green-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Share2 className="w-5 h-5" />
                    Share
                  </>
                )}
              </motion.button>
            </motion.div>

            {/* Navigation to Other Projects */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-12 pt-8 border-t border-border/30"
            >
              <h3 className="text-xl font-bold text-metallic mb-6 text-center">
                More Projects
              </h3>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {prevProject ? (
                  <motion.button
                    onClick={() => navigate(`/projects/${prevProject.id}`)}
                    whileHover={{ scale: 1.02, x: -4 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 p-4 rounded-xl glass border border-border/50 hover:border-primary/50 transition-all w-full sm:w-auto group"
                  >
                    <ChevronLeft className="w-5 h-5 text-primary group-hover:-translate-x-1 transition-transform" />
                    <div className="text-left flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">Previous</p>
                      <p className="text-sm font-medium text-foreground truncate">{prevProject.title}</p>
                    </div>
                  </motion.button>
                ) : (
                  <div />
                )}

                {nextProject ? (
                  <motion.button
                    onClick={() => navigate(`/projects/${nextProject.id}`)}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 p-4 rounded-xl glass border border-border/50 hover:border-primary/50 transition-all w-full sm:w-auto group"
                  >
                    <div className="text-right flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">Next</p>
                      <p className="text-sm font-medium text-foreground truncate">{nextProject.title}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                ) : (
                  <div />
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Image Modal */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedImage(null)}
            >
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 p-2 rounded-full glass border border-border/50 hover:border-primary/50 transition-colors"
              >
                <X className="w-6 h-6" />
              </motion.button>
              <motion.img
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                src={selectedImage}
                alt="Project preview"
                className="max-w-full max-h-[90vh] object-contain rounded-xl"
                onClick={(e) => e.stopPropagation()}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </Layout>
    </>
  );
};

export default ProjectDescription;