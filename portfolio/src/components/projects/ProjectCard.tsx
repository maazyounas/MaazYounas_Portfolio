import { motion } from "framer-motion";
import { ExternalLink, Github, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TiltCard from "../ui/TiltCard";
import { adminService, Project } from "@/lib/adminService";

interface ProjectCardProps {
  project: Project;
  index: number;
  pinned?: boolean;
}

const ProjectCard = ({ project, index, pinned }: ProjectCardProps) => {
  const navigate = useNavigate();

  const handleView = () => {
    adminService.addProjectView(project.id);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger card click if clicking on action buttons
    if ((e.target as HTMLElement).closest(".action-button")) {
      return;
    }
    handleView();
    navigate(`/projects/${project.id}`);
  };

  const visibleTech = project.tech.slice(0, 3);
  const remainingTech = project.tech.length - 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        type: "spring",
        stiffness: 80,
      }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -8 }}
      className="h-full cursor-pointer group"
      onClick={handleCardClick}
    >
      <TiltCard>
        <div className="glass-neon rounded-2xl overflow-hidden card-hover h-full border border-border/50 hover:border-primary/50 transition-all duration-500 relative flex flex-col shadow-lg hover:shadow-2xl hover:shadow-primary/20">
          {/* Featured Badge */}
          {project.featured && (
            <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-20">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  delay: index * 0.1 + 0.3,
                  type: "spring",
                  stiffness: 200,
                }}
                className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-primary-foreground text-[10px] sm:text-xs font-semibold neon-glow-soft flex items-center gap-1"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground animate-pulse" />
                Featured
              </motion.div>
            </div>
          )}

          {/* Image Container */}
          <div className="relative h-44 sm:h-48 overflow-hidden flex-shrink-0 bg-secondary/30">
            <motion.img
              src={project.image}
              alt={project.title}
              whileHover={{ scale: 1.15 }}
className="w-full h-full object-cover sm:will-change-transform"

              transition={{ duration: 0.6, ease: "easeOut" }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

            {/* Hover Overlay with Action Buttons */}
            <motion.div
              className="
  action-button absolute inset-0 flex items-center justify-center gap-3
  bg-background/90 sm:backdrop-blur-md
"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              {project.showLink && project.link && (
                <motion.a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleView();
                  }}
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-gradient-to-r from-primary to-primary/90 text-primary-foreground neon-glow hover:neon-glow-strong transition-all duration-300 shadow-lg text-xs sm:text-sm font-medium"
                >
                  <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Live Demo</span>
                </motion.a>
              )}

              {project.showGithub && project.github && (
                <motion.a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleView();
                  }}
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg glass border border-border/50 text-foreground hover:border-primary/50 hover:bg-primary/10 hover:text-primary transition-all duration-300 shadow-lg text-xs sm:text-sm font-medium"
                >
                  <Github className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Code</span>
                </motion.a>
              )}
            </motion.div>

            {/* Corner Arrow Indicator */}
            <motion.div
              className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 sm:p-2 rounded-lg glass border border-border/30 opacity-0 group-hover:opacity-100 transition-all duration-300"
              whileHover={{ scale: 1.1, rotate: 45 }}
            >
              <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </motion.div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-5 lg:p-6 flex flex-col flex-1">
            {/* Title */}
            <div className="mb-3 sm:mb-4">
              <h3 className="text-lg sm:text-xl font-bold text-metallic group-hover:text-primary transition-colors duration-300 line-clamp-1 mb-1">
                {project.title}
              </h3>
              <div className="h-0.5 w-12 bg-gradient-to-r from-primary to-transparent rounded-full group-hover:w-20 transition-all duration-500" />
            </div>

            {/* Description - Fixed 3 lines */}
            <div className="mb-4 sm:mb-5 flex-1">
              <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed line-clamp-3 text-justify">
                {project.description}
              </p>
            </div>

            {/* Tech Stack - Single Line */}
            <div className="mt-auto pt-3 sm:pt-4 border-t border-border/30">
              <div className="flex items-center gap-1.5 sm:gap-2 overflow-hidden">
                {visibleTech.map((tech, techIndex) => (
                  <motion.span
                    key={tech}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.1 + techIndex * 0.05,
                    }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="px-2 sm:px-2.5 py-1 text-[10px] sm:text-xs rounded-full bg-secondary/50 border border-border/50 text-foreground hover:bg-primary/10 hover:border-primary/40 hover:text-primary transition-all duration-300 cursor-default whitespace-nowrap font-medium"
                  >
                    {tech}
                  </motion.span>
                ))}
                {remainingTech > 0 && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.1 + 0.2,
                    }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05 }}
                    className="px-2 sm:px-2.5 py-1 text-[10px] sm:text-xs rounded-full bg-primary/10 border border-primary/30 text-primary whitespace-nowrap font-semibold"
                  >
                    +{remainingTech}
                  </motion.span>
                )}
              </div>
            </div>
          </div>

          {/* Animated Border Glow */}
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `linear-gradient(135deg, transparent 0%, hsl(var(--primary)/0.1) 50%, transparent 100%)`,
            }}
          />

          {/* Bottom Accent Line */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      </TiltCard>
    </motion.div>
  );
};

export default ProjectCard;
