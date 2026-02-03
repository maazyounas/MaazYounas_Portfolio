import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Code, Palette, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import CodeBubbles from "../effects/CodeBubbles";
import ParticlesBackground from "../effects/ParticlesBackground";
import QuoteRotator from "./QuoteRotator";
import { adminService, HomePageData } from "@/lib/adminService";

const HeroSection = () => {
  const [quotes, setQuotes] = useState<string[]>([]);
  const [homeData, setHomeData] = useState<HomePageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [adminQuotes, data] = await Promise.all([
          adminService.getQuotes(),
          adminService.getHomePageData(),
        ]);

        if (adminQuotes.length > 0) {
          setQuotes(adminQuotes.map((q) => q.text));
        }
        setHomeData(data);
      } catch (error) {
        console.error("Failed to fetch home page data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const displayQuotes =
    quotes.length > 0
      ? quotes
      : [
        "Transforming Ideas Into Digital Reality",
        "Building The Future With Clean Code",
        "Where Design Meets Functionality",
        "Crafting Exceptional User Experiences",
      ];

  // Skeleton loading state
  if (loading) {
    return (
      <section className="relative min-h-screen flex items-start sm:items-center justify-center overflow-hidden pt-16 sm:pt-0">
        {/* Background Effects - Static */}
        <CodeBubbles />
        <ParticlesBackground />

        <div className="container mx-auto px-5 sm:px-6 relative z-10 py-2 sm:py-20 lg:py-32">
          <div className="max-w-6xl mx-auto flex flex-col items-center text-center lg:items-start lg:text-left">
            {/* Badge - Skeleton */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full glass-neon mb-6 sm:mb-8 lg:mb-8"
            >
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
              <span className="text-xs sm:text-sm text-foreground">
                {/* Skeleton for heroTagline */}
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
              </span>
            </motion.div>

            {/* Main Heading / Quote Rotator - Skeleton */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-6 sm:mb-8 lg:mb-12 w-full"
            >
              <div className="min-h-[100px] sm:min-h-[80px] lg:min-h-[120px] flex items-center justify-center">
                <div className="h-12 sm:h-14 md:h-16 lg:h-20 w-full max-w-3xl bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
              </div>
            </motion.div>

            {/* Tagline - Skeleton */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-8 sm:mb-8 lg:mb-12 max-w-3xl mx-auto lg:mx-0 px-2 sm:px-0 space-y-3"
            >
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
              <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
              <div className="h-4 w-4/5 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
            </motion.div>

            {/* Skills Highlights - Only on mobile (Static) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-wrap justify-center gap-4 mb-8 lg:hidden w-full"
            >
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg glass-neon text-sm">
                <Code className="w-4 h-4 text-primary" />
                <span>Clean Code</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg glass-neon text-sm">
                <Palette className="w-4 h-4 text-primary" />
                <span>Modern Design</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg glass-neon text-sm">
                <Zap className="w-4 h-4 text-primary" />
                <span>Fast & Responsive</span>
              </div>
            </motion.div>

            {/* CTA Buttons - Skeleton */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-4 w-full sm:w-auto"
            >
              {/* Explore My Work Button - Skeleton */}
              <div className="w-full sm:w-auto">
                <div className="btn-neon flex items-center justify-center gap-2 text-primary-foreground w-full sm:w-auto px-8 py-3 text-base sm:text-base font-medium animate-pulse">
                  <div className="h-6 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
                </div>
              </div>

              {/* Start a Project Button - Skeleton */}
              <div className="w-full sm:w-auto">
                <div className="btn-outline-neon flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3 text-base sm:text-base font-medium animate-pulse">
                  <div className="h-6 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            </motion.div>

            {/* Scroll Indicator - Only on mobile (Static) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="flex flex-col items-center mt-6 lg:hidden"
            >
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-6 h-10 border-2 border-primary rounded-full flex justify-center"
              >
                <motion.div
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-1 h-3 bg-primary rounded-full mt-2"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  // Actual component with data
  return (
    <section className="relative min-h-screen flex items-start sm:items-center justify-center overflow-hidden pt-16 sm:pt-0">
      {/* Background Style */}
      <CodeBubbles />
      <ParticlesBackground />

      <div className="container mx-auto px-5 sm:px-6 relative z-10 py-2 sm:py-20 lg:py-32">
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center lg:items-start lg:text-left">
          {/* Badge - Adjusted margin for mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full glass-neon mb-6 sm:mb-8 lg:mb-8"
          >
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
            <span className="text-xs sm:text-sm text-foreground">
              {homeData?.heroTagline || "Full Stack Developer"}
            </span>
          </motion.div>

          {/* Main Heading / Quote Rotator - Improved mobile sizing */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6 sm:mb-8 lg:mb-12 w-full"
          >
            <QuoteRotator
              className="min-h-[100px] sm:min-h-[80px] lg:min-h-[120px]"
              textClassName="text-3xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-metallic-animated not-italic leading-tight tracking-tight"
              quotes={displayQuotes}
            />
          </motion.div>

          {/* Tagline - Improved mobile text sizing and spacing */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base sm:text-base md:text-lg text-muted-foreground mb-8 sm:mb-8 lg:mb-12 max-w-3xl mx-auto lg:mx-0 leading-relaxed sm:leading-relaxed px-2 sm:px-0"
          >
            {homeData?.heroDescription ||
              "I specialize in creating responsive, performant web applications that not only look beautiful but solve real-world problems. Let's build something amazing together."}
          </motion.p>

          {/* Skills Highlights - Only on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap justify-center gap-4 mb-8 lg:hidden w-full"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg glass-neon text-sm"
            >
              <Code className="w-4 h-4 text-primary" />
              <span>Clean Code</span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg glass-neon text-sm"
            >
              <Palette className="w-4 h-4 text-primary" />
              <span>Modern Design</span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg glass-neon text-sm"
            >
              <Zap className="w-4 h-4 text-primary" />
              <span>Fast & Responsive</span>
            </motion.div>
          </motion.div>

          {/* CTA Buttons - Improved mobile sizing and spacing */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-4 w-full sm:w-auto"
          >
            {homeData?.showProjects && (
              <Link to="/projects" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-neon flex items-center justify-center gap-2 text-primary-foreground w-full sm:w-auto px-8 py-3 text-base sm:text-base font-medium"
                >
                  Explore My Work
                  <ArrowRight className="w-4 h-4 sm:w-4 sm:h-4" />
                </motion.button>
              </Link>
            )}
            <Link to="/contact" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-outline-neon flex items-center hover:text-white justify-center gap-2 w-full sm:w-auto px-8 py-3 text-base sm:text-base font-medium"
              >
                Start a Project
              </motion.button>
            </Link>
          </motion.div>

          {/* Scroll Indicator - Only on mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-col items-center mt-6 lg:hidden"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-6 h-10 border-2 border-primary rounded-full flex justify-center"
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1 h-3 bg-primary rounded-full mt-2"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;