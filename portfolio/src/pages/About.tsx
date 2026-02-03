import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import Layout from "../components/layout/Layout";
import TechStackIcon from "../components/about/TechStackIcon";
import {
  Code2,
  Database,
  UserCircle,
} from "lucide-react";
import { adminService, AboutPageData } from "../lib/adminService";

const About = () => {
  const [aboutData, setAboutData] = useState<AboutPageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await adminService.getAboutPageData();
        setAboutData(data);
      } catch (error) {
        console.error("Failed to fetch about page data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Skeleton loading state
  if (loading) {
    return (
      <>
        <Helmet>
          <title>About | Maaz Younas</title>
          <meta
            name="description"
            content="Learn more about Maaz Younas - Full Stack Developer"
          />
        </Helmet>
        <Layout>
          <section className="py-12 px-2 sm:py-16 lg:py-20 min-h-screen overflow-hidden">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                duration: 0.5,
                delay: 0.2,
                type: "spring",
                stiffness: 200,
              }}
              className="flex justify-center w-full mb-6 sm:mb-8"
            >
              <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full glass-neon border border-primary/20">
                <UserCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                <span className="text-xs sm:text-sm font-medium text-foreground whitespace-nowrap">
                  About Me
                </span>
              </div>
            </motion.div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
              <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
                {/* Image Section - Static structure with skeleton */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="flex justify-center w-full"
                >
                  <div className="relative w-full max-w-xs sm:max-w-sm">
                    {/* Neon rotating ring (outside image only) */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 22,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="absolute -inset-6 sm:-inset-7 rounded-full pointer-events-none"
                      style={{
                        background:
                          "conic-gradient(from 0deg, transparent, hsl(348 100% 50% / 0.5), transparent, hsl(348 100% 50% / 0.3), transparent)",
                        filter: "blur(10px)",
                        opacity: 0.85,
                      }}
                    />

                    {/* Skeleton for avatar */}
                    <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 mx-auto rounded-full overflow-hidden border border-primary/40 bg-gray-200 dark:bg-gray-800 z-10 animate-pulse">
                      <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
                    </div>

                    {/* Floating elements - Static */}
                    <motion.div
                      animate={{ y: [-10, 10, -10] }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 p-2 sm:p-3 rounded-lg glass-neon"
                    >
                      <Code2 className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </motion.div>
                    <motion.div
                      animate={{ y: [10, -10, 10] }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 p-2 sm:p-3 rounded-lg glass-neon"
                    >
                      <Database className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </motion.div>
                  </div>
                </motion.div>

                {/* Content Section - Static structure with skeleton for dynamic parts */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="w-full"
                >
                  {/* Static Title */}
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-metallic-animated mb-4 sm:mb-6 break-words">
                    About Me
                  </h1>

                  {/* Skeleton for tagline */}
                  <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse mb-3 sm:mb-4"></div>

                  {/* Skeleton for bio */}
                  <div className="space-y-3 sm:space-y-4">
                    <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                    <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                    <div className="h-4 w-4/5 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                    <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                  </div>

                  {/* Stats - Static (since they're hardcoded in the actual component) */}
                  <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6 mt-6 sm:mt-8">
                    {[
                      { value: "5+", label: "Years Experience" },
                      { value: "50+", label: "Projects Completed" },
                      { value: "30+", label: "Happy Clients" },
                    ].map((stat, index) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="text-center p-3 sm:p-4 rounded-lg glass border border-border/50"
                      >
                        <div className="text-2xl sm:text-3xl font-bold text-primary whitespace-nowrap">
                          {stat.value}
                        </div>
                        <div className="text-xs sm:text-sm text-muted-foreground mt-1 break-words">
                          {stat.label}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Tech Stack Section - Static structure with skeleton */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="mt-16 sm:mt-20 lg:mt-24 w-full"
              >
                <h2 className="text-2xl sm:text-3xl font-bold text-metallic text-center mb-8 sm:mb-12 break-words px-4">
                  Tech Stack
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 lg:gap-8 w-full">
                  {/* Skeleton for tech stack icons */}
                  {[...Array(6)].map((_, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse flex items-center justify-center mb-2"></div>
                      <div className="h-4 w-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>
        </Layout>
      </>
    );
  }

  // Actual component with data
  return (
    <>
      <Helmet>
        <title>About | Maaz Younas</title>
        <meta
          name="description"
          content={
            aboutData?.shortIntro ||
            "Learn more about Maaz Younas - Full Stack Developer"
          }
        />
      </Helmet>
      <Layout>
        <section className="py-8 px-2 sm:py-16 lg:py-20 min-h-screen overflow-hidden">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.2,
              type: "spring",
              stiffness: 200,
            }}
            className="flex justify-center w-full mb-6 sm:mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full glass-neon border border-primary/20">
              <UserCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              <span className="text-xs sm:text-sm font-medium text-foreground whitespace-nowrap">
                Who I Am
              </span>
            </div>
          </motion.div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
              {/* Image Section */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="flex justify-center w-full"
              >
                <div className="relative w-full max-w-xs sm:max-w-sm">
                  {/* Neon rotating ring (outside image only) */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 22,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute -inset-6 sm:-inset-7 rounded-full pointer-events-none"
                    style={{
                      background:
                        "conic-gradient(from 0deg, transparent, hsl(348 100% 50% / 0.5), transparent, hsl(348 100% 50% / 0.3), transparent)",
                      filter: "blur(10px)",
                      opacity: 0.85,
                    }}
                  />

                  {/* Sharp avatar frame */}
                  <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 mx-auto rounded-full overflow-hidden border border-primary/40 shadow-hsl(348 100% 50% / 0.3) bg-background z-10">
                    <img
                      src={aboutData?.profileImage || "/placeholder-avatar.png"}
                      alt="Maaz Younas"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
                  </div>

                  {/* Floating elements */}
                  <motion.div
                    animate={{ y: [-10, 10, -10] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 p-2 sm:p-3 rounded-lg glass-neon"
                  >
                    <Code2 className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </motion.div>
                  <motion.div
                    animate={{ y: [10, -10, 10] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 p-2 sm:p-3 rounded-lg glass-neon"
                  >
                    <Database className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </motion.div>
                </div>
              </motion.div>

              {/* Content Section */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="w-full"
              >
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-metallic-animated mb-4 sm:mb-6 break-words">
                  About Me
                </h1>
                <h2 className="text-lg sm:text-xl text-primary mb-3 sm:mb-4 font-medium break-words">
                  {aboutData?.tagline || "Full Stack Developer"}
                </h2>
                <div
                  className="
  space-y-3 sm:space-y-4
  text-sm sm:text-base
  text-foreground/80
  whitespace-pre-wrap break-words leading-relaxed
  text-justify
"
                >
                  {aboutData?.bio || "Passionate developer creating amazing web experiences."}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6 mt-6 sm:mt-8">
                  {[
                    { value: "5+", label: "Years Experience" },
                    { value: "50+", label: "Projects Completed" },
                    { value: "30+", label: "Happy Clients" },
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="text-center p-3 sm:p-4 rounded-lg glass border border-border/50"
                    >
                      <div className="text-2xl sm:text-3xl font-bold text-primary whitespace-nowrap">
                        {stat.value}
                      </div>
                      <div className="text-xs sm:text-sm text-muted-foreground mt-1 break-words">
                        {stat.label}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Tech Stack Section */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="mt-16 sm:mt-20 lg:mt-24 w-full"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-metallic text-center mb-8 sm:mb-12 break-words px-4">
                Tech Stack
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 lg:gap-8 w-full">
                {aboutData?.techStack?.map((tech, index) => (
                  <TechStackIcon
                    key={tech.name}
                    name={tech.name}
                    icon={tech.icon} // string like "FaReact"
                    index={index}
                  />

                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default About;
