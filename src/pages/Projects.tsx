import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import Layout from "../components/layout/Layout";
import ProjectCard from "../components/projects/ProjectCard";
import { FolderKanban, Filter, Grid3X3, List, Search, X } from "lucide-react";
import { adminService, Project } from "../lib/adminService";

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTech, setSelectedTech] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        const data: Project[] = await res.json();
        setProjects(data);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Extract all unique technologies from projects for filtering
  const allTechnologies = useMemo(() => {
    return Array.from(
      new Set(projects.flatMap((project) => project.tech)),
    ).sort();
  }, [projects]);

  // Filter projects based on selected technology and search query
  const filteredProjects = useMemo(() => {
    return [...projects]
      .filter((project) => {
        const matchesTech =
          selectedTech === "all" || project.tech.includes(selectedTech);
        const matchesSearch =
          project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTech && matchesSearch;
      })
      .sort((a, b) => {
        if (a.featured === b.featured) return 0;
        return a.featured ? -1 : 1; // featured first
      });
  }, [projects, selectedTech, searchQuery]);

  // Get technology counts for the filter buttons
  const techCounts = useMemo(() => {
    const counts: { [key: string]: number } = { all: projects.length };
    allTechnologies.forEach((tech) => {
      counts[tech] = projects.filter((project) =>
        project.tech.includes(tech),
      ).length;
    });
    return counts;
  }, [projects, allTechnologies]);

  const handleProjectView = (projectId: string) => {
    adminService.addProjectView(projectId);
  };

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const ProjectSkeleton = ({ viewMode }: { viewMode: "grid" | "list" }) => (
    <div
      className={`rounded-xl glass border border-border/50 p-4 animate-pulse ${
        viewMode === "grid" ? "h-[320px]" : "h-[140px]"
      }`}
    >
      <div className="w-full h-40 bg-muted rounded-lg mb-4" />
      <div className="space-y-2">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-full" />
        <div className="h-3 bg-muted rounded w-2/3" />
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Projects | Maaz Younas - Full Stack Developer</title>
        <meta
          name="description"
          content="Explore the portfolio projects of Maaz Younas - showcasing full stack development work, web applications, and innovative digital solutions."
        />
      </Helmet>
      <Layout>
        <section className="py-12 px-2 sm:py-16 lg:py-20 min-h-screen relative overflow-hidden">
          {/* Background Elements */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-10 sm:top-20 left-5 sm:left-10 w-48 h-48 sm:w-64 sm:h-64 bg-primary/5 rounded-full blur-[60px] sm:blur-[80px] pointer-events-none"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-64 h-64 sm:w-96 sm:h-96 bg-primary/10 rounded-full blur-[80px] sm:blur-[100px] pointer-events-none"
          />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-7xl">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12 sm:mb-16"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  duration: 0.5,
                  delay: 0.2,
                  type: "spring",
                  stiffness: 200,
                }}
                className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full glass-neon mb-6 sm:mb-8 border border-primary/20"
              >
                <FolderKanban className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                <span className="text-xs sm:text-sm font-medium text-foreground whitespace-nowrap">
                  Portfolio Showcase
                </span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-metallic-animated mb-4 sm:mb-6 break-words px-4"
              >
                My Projects
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4 break-words"
              >
                A curated collection of my work showcasing full-stack
                development, innovative solutions, and passion for creating
                exceptional digital experiences.
              </motion.p>
            </motion.div>

            {/* Stats Bar */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-8 sm:mb-12 max-w-4xl mx-auto"
            >
              {[
                { value: `${projects.length}+`, label: "Projects" },
                { value: `${allTechnologies.length}+`, label: "Technologies" },
                { value: "100%", label: "Client Satisfaction" },
                { value: "3+", label: "Years Experience" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  variants={itemVariants}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 0 20px rgba(239, 68, 68, 0.3)",
                  }}
                  className="text-center p-3 sm:p-4 rounded-xl glass border border-border/50 cursor-pointer"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      delay: 0.5 + index * 0.1,
                      type: "spring",
                      stiffness: 200,
                    }}
                    className="text-xl sm:text-2xl font-bold text-metallic mb-1 whitespace-nowrap"
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-xs sm:text-sm text-muted-foreground break-words">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Search and Filter Controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mb-8 sm:mb-12"
            >
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center mb-6 sm:mb-8">
                {/* Search Bar */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 sm:py-3 rounded-lg glass border border-border/50 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm sm:text-base"
                  />
                  {searchQuery && (
                    <motion.button
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                  )}
                </div>

                {/* Filter Toggle (Mobile) */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowFilters(!showFilters)}
                  className="sm:hidden flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg glass border border-border/50 text-sm font-medium"
                >
                  <Filter className="w-4 h-4" />
                  Filters {selectedTech !== "all" && `(${selectedTech})`}
                </motion.button>

                {/* View Mode Toggle (hidden on mobile) */}
                <div className="hidden sm:flex items-center gap-2 glass rounded-lg p-1 border border-border/50 w-fit mx-auto sm:mx-0">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      viewMode === "grid"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      viewMode === "list"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <List className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.button>
                </div>
              </div>

              {/* Technology Filters */}
              <AnimatePresence>
                {(showFilters || window.innerWidth >= 640) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-wrap gap-2 sm:gap-3 justify-center sm:justify-start">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setSelectedTech("all");
                          setShowFilters(false);
                        }}
                        className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 border whitespace-nowrap ${
                          selectedTech === "all"
                            ? "bg-primary text-primary-foreground border-primary neon-glow-soft"
                            : "bg-secondary text-foreground border-border/50 hover:border-primary/50"
                        }`}
                      >
                        All Projects ({techCounts.all})
                      </motion.button>

                      {allTechnologies.map((tech) => (
                        <motion.button
                          key={tech}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setSelectedTech(tech);
                            setShowFilters(false);
                          }}
                          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 border whitespace-nowrap ${
                            selectedTech === tech
                              ? "bg-primary text-primary-foreground border-primary neon-glow-soft"
                              : "bg-secondary text-foreground border-border/50 hover:border-primary/50"
                          }`}
                        >
                          {tech} ({techCounts[tech]})
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Results Count */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mb-6 sm:mb-8 text-center"
            >
              <p className="text-sm sm:text-base text-muted-foreground px-4 break-words">
                Showing {filteredProjects.length} of {projects.length} projects
                {selectedTech !== "all" && ` in ${selectedTech}`}
                {searchQuery && ` matching "${searchQuery}"`}
              </p>
            </motion.div>

            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="skeletons"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
                      : "grid grid-cols-1 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto"
                  }
                >
                  {Array.from({ length: 6 }).map((_, i) => (
                    <ProjectSkeleton key={i} viewMode={viewMode} />
                  ))}
                </motion.div>
              ) : filteredProjects.length > 0 ? (
                <motion.div
                  key={viewMode}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 auto-rows-fr"
                      : "grid grid-cols-1 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto"
                  }
                >
                  {filteredProjects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleProjectView(project.id)}
                    >
                      <ProjectCard project={project} index={index} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                // no projects found (same block you already have)

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12 sm:py-20 px-4"
                >
                  <motion.div
                    animate={{
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Filter className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground mx-auto mb-4" />
                  </motion.div>
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2 break-words">
                    No projects found
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto mb-4 break-words">
                    No projects match your current filters. Try adjusting your
                    search or filter criteria.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedTech("all");
                      setSearchQuery("");
                    }}
                    className="mt-2 sm:mt-4 px-6 py-2 btn-neon text-primary-foreground text-sm sm:text-base"
                  >
                    Clear Filters
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mt-12 sm:mt-16 lg:mt-20 p-6 sm:p-8 rounded-2xl glass-neon border border-border/50 max-w-2xl mx-auto"
            >
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
                className="text-xl sm:text-2xl font-bold text-metallic mb-3 sm:mb-4 break-words px-4"
              >
                Have a Project in Mind?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
                className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 px-4 break-words leading-relaxed"
              >
                I'm always excited to take on new challenges and bring
                innovative ideas to life. Let's discuss how we can work together
                on your next project.
              </motion.p>
              <motion.a
                href="/contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 btn-neon text-primary-foreground font-medium text-sm sm:text-base whitespace-nowrap"
              >
                Start a Project
              </motion.a>
            </motion.div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Projects;
