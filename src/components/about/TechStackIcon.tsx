import { motion } from "framer-motion";
import * as FaIcons from "react-icons/fa";
import * as SiIcons from "react-icons/si";
import * as DiIcons from "react-icons/di";
import * as TbIcons from "react-icons/tb";

const AllIcons = { ...FaIcons, ...SiIcons, ...DiIcons, ...TbIcons };

interface TechStackIconProps {
  name: string;
  icon: string; // now string, not LucideIcon
  index: number;
}

const getIconComponent = (iconName: string) => {
  return AllIcons[iconName as keyof typeof AllIcons]; // returns React component
};

const TechStackIcon = ({ name, icon, index }: TechStackIconProps) => {
  const IconComponent = getIconComponent(icon);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: index * 0.1,
      }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{
        y: -8,
        scale: 1.15,
        transition: { type: "spring", stiffness: 300 },
      }}
      className="group flex flex-col items-center gap-3 cursor-pointer"
    >
      <motion.div
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="p-4 rounded-xl glass border border-border/50 
                   group-hover:border-primary/50 transition-all duration-300 
                   group-hover:neon-glow-soft relative overflow-hidden"
      >
        {/* Shine */}
        <div
          className="absolute inset-0 bg-gradient-to-br 
                        from-primary/0 via-primary/5 to-primary/0 
                        opacity-0 group-hover:opacity-100 
                        transition-opacity duration-500"
        />

        {IconComponent ? (
          <IconComponent className="w-8 h-8 text-white group-hover:text-primary" />
        ) : (
          <span className="text-xs text-red-400">?</span>
        )}
      </motion.div>

      <motion.span
        initial={{ opacity: 0.7 }}
        whileHover={{ opacity: 1 }}
        className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300 font-medium"
      >
        {name}
      </motion.span>
    </motion.div>
  );
};

export default TechStackIcon;
