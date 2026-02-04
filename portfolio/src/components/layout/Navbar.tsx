import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Home,
  User,
  FolderKanban,
  Mail,
  FileText,
  Download,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { adminService } from "../../lib/adminService"; 

const navLinks = [
  { path: "/", label: "Home", icon: Home },
  { path: "/about", label: "About", icon: User },
  { path: "/projects", label: "Projects", icon: FolderKanban },
  { path: "/contact", label: "Contact", icon: Mail },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
  const location = useLocation();
  const desktopMenuRef = useRef(null);
  const menuButtonRef = useRef(null);
  const [resumeUrl, setResumeUrl] = useState("/resume.pdf");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        desktopMenuRef.current &&
        !desktopMenuRef.current.contains(event.target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target)
      ) {
        setIsDesktopMenuOpen(false);
      }
    };

    if (isDesktopMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDesktopMenuOpen]);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed py-3 left-0 right-0 z-50 bg-gradient-to-b from-background to-background/95"
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 sm:gap-3 lg:gap-4 group"
          >
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center neon-glow-soft"
            >
              <span className="text-primary-foreground font-bold text-base sm:text-lg">
                M
              </span>
            </motion.div>

            <motion.span
              whileHover={{ scale: 1.05 }}
              className="text-metallic-animated font-bold text-lg sm:text-xl lg:text-2xl hidden sm:block"
            >
              {"<MaazYounas/>"}
            </motion.span>
          </Link>

          {/* Desktop Navigation - Hidden on larger screens, shown in menu */}
          <div className="hidden md:flex items-center gap-4">
            {/* Desktop Menu Button */}
            <motion.button
              ref={menuButtonRef}
              onClick={() => setIsDesktopMenuOpen(!isDesktopMenuOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg glass border border-border/50 text-foreground hover:text-primary hover:border-primary/50 transition-all duration-300 ${isDesktopMenuOpen ? "bg-primary/10 border-primary" : ""
                }`}
            >
              <Menu className="w-5 h-5 lg:w-6 lg:h-6" />
              <span className="hidden lg:inline text-sm font-medium">Menu</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${isDesktopMenuOpen ? "rotate-180" : ""
                  }`}
              />
            </motion.button>

            {/* Resume Button - Always visible - FIXED */}
            <motion.a
              href="/resume.pdf"
              download
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-neon-red to-neon-red-dark text-primary-foreground hover:text-white hover:shadow-lg hover:shadow-neon-red/30 transition-all duration-300 group icon-glow"
            >
              <FileText className="w-4 h-4 lg:w-5 lg:h-5" />
              <span className="text-sm lg:text-base font-medium">Resume</span>
              <Download className="w-4 h-4 lg:w-5 lg:h-5 group-hover:animate-bounce" />
            </motion.a>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            whileTap={{ scale: 0.9 }}
            className="md:hidden p-2 rounded-lg text-foreground hover:text-primary hover:bg-secondary/50 transition-colors"
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Desktop Menu Dropdown */}
      <AnimatePresence>
        {isDesktopMenuOpen && (
          <>
            {/* Backdrop blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={() => setIsDesktopMenuOpen(false)}
            />
            <motion.div
              ref={desktopMenuRef}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="hidden md:block absolute top-full lg:right-40 right-20 mt-2 w-48 rounded-lg bg-background/95 backdrop-blur-md border border-border/50 shadow-xl z-50 icon-glow"
            >
              {/* Header */}
              <div className="px-4 py-3 border-b border-border/30 bg-secondary/30">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">
                    Navigation
                  </span>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-2 space-y-1">
                {navLinks.map((link, index) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        to={link.path}
                        onClick={() => setIsDesktopMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group ${isActive
                            ? "bg-primary text-primary-foreground neon-glow-soft"
                            : "text-foreground hover:bg-secondary/50 hover:text-primary"
                          }`}
                      >
                        <link.icon className="w-5 h-5 flex-shrink-0" />
                        <span className="font-medium">{link.label}</span>
                        {isActive && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="ml-auto w-2 h-2 rounded-full bg-primary-foreground"
                          />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100vh" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t border-border/50 min-h-screen"
          >
            <div className="container mx-auto px-4 sm:px-6 py-4 space-y-2 max-h-[calc(100vh-4rem)] overflow-y-auto">
              {navLinks.map((link, index) => {
                const isActive = location.pathname === link.path;
                return (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-200 ${isActive
                          ? "btn-neon text-primary-foreground"
                          : "btn-outline-neon hover:bg-secondary/50"
                        }`}
                    >
                      <link.icon className="w-5 h-5 flex-shrink-0" />
                      <span className="font-medium">{link.label}</span>
                      {isActive && (
                        <motion.div
                          layoutId="mobileActiveIndicator"
                          className="ml-auto w-2 h-2 rounded-full bg-primary-foreground"
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}

              {/* Resume Button in Mobile Menu */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.1 }}
                className="pt-2 border-t border-border/30"
              >
                <a
                  href="/resume.pdf"
                  download
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-medium neon-glow-soft group"
                >
                  <FileText className="w-5 h-5" />
                  <span>Download Resume</span>
                  <Download className="w-5 h-5 group-hover:animate-bounce" />
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
