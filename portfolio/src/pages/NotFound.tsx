import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ArrowLeft, AlertCircle, Search } from "lucide-react";
import ParticlesBackground from "../components/effects/ParticlesBackground";

const NotFound = () => {
  const location = useLocation();

  return (
    <div className="mt-5 min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      <ParticlesBackground />
      
      {/* Animated Background Elements */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-20 left-20 w-64 h-64 sm:w-96 sm:h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.15, 0.3, 0.15]
        }}
        transition={{ 
          duration: 10, 
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute bottom-20 right-20 w-80 h-80 sm:w-[500px] sm:h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" 
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center relative z-10 px-4 sm:px-6 max-w-3xl mx-auto"
      >
        {/* Error Badge */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            duration: 0.6, 
            type: "spring",
            stiffness: 200
          }}
          className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full glass-neon mb-6 sm:mb-8 border border-primary/20"
        >
          <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          <span className=" text-xs sm:text-sm font-medium text-foreground whitespace-nowrap">
            Error 404
          </span>
        </motion.div>

        {/* 404 Number */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            duration: 0.6, 
            type: "spring",
            stiffness: 100,
            delay: 0.2
          }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-7xl sm:text-8xl md:text-9xl lg:text-[180px] font-bold leading-none text-metallic-animated mb-2">
            404
          </h1>
          <motion.div
            animate={{ 
              scaleX: [0, 1, 1, 0],
              opacity: [0, 1, 1, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="h-1 w-32 sm:w-48 mx-auto bg-gradient-to-r from-transparent via-primary to-transparent"
          />
        </motion.div>
        
        {/* Main Heading */}
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-metallic mb-3 sm:mb-4 break-words"
        >
          Page Not Found
        </motion.h2>
        
        {/* Description */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 max-w-md mx-auto leading-relaxed break-words px-4"
        >
          Oops! The page you're looking for doesn't exist or has been moved. 
          Let's get you back on track.
        </motion.p>

        {/* Path Info */}
        {location.pathname !== "/" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mb-6 sm:mb-8 p-3 sm:p-4 rounded-lg glass border border-border/50 max-w-md mx-auto"
          >
            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm">
              <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <code className="text-primary font-mono break-all">
                {location.pathname}
              </code>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
        >
          <Link to="/" className="w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-neon flex items-center justify-center gap-2 text-primary-foreground w-full sm:w-auto px-6 sm:px-8 py-3 text-sm sm:text-base font-medium whitespace-nowrap"
            >
              <Home className="w-4 h-4 sm:w-5 sm:h-5" />
              Go Home
            </motion.button>
          </Link>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.history.back()}
            className="btn-outline-neon flex items-center justify-center gap-2 w-full sm:w-auto px-6 sm:px-8 py-3 text-sm sm:text-base font-medium whitespace-nowrap hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            Go Back
          </motion.button>
        </motion.div>

        {/* Helpful Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-border/30"
        >
          <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
            You might be interested in:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {[
              { name: "Projects", path: "/projects" },
              { name: "About", path: "/about" },
              { name: "Contact", path: "/contact" }
            ].map((link, index) => (
              <Link key={link.path} to={link.path}>
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="text-xs sm:text-sm text-primary hover:text-primary/80 transition-colors px-3 py-1.5 rounded-full glass border border-border/50 hover:border-primary/30 inline-block"
                >
                  {link.name}
                </motion.span>
              </Link>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;