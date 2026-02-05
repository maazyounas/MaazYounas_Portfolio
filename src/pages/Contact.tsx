import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Layout from "../components/layout/Layout";
import {
  Mail,
  MapPin,
  Phone,
  Send,
  CheckCircle,
  Clock,
  Calendar,
  MessageCircle,
} from "lucide-react";
import { toast } from "sonner";
import { adminService, ContactPageData } from "../lib/adminService";

const Contact = () => {
  const [contactData, setContactData] = useState<ContactPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await adminService.getContactPageData();
        setContactData(data);
      } catch (error) {
        console.error("Failed to fetch contact page data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Skeleton loading state
  if (loading) {
    return (
      <Layout>
        <section className="py-12 px-2 sm:py-16 lg:py-20 min-h-screen relative overflow-hidden">
          {/* Animated Background Elements - Static */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-10 left-5 sm:top-20 sm:left-20 w-48 h-48 sm:w-72 sm:h-72 bg-primary/10 rounded-full blur-[80px] pointer-events-none"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
            className="absolute bottom-20 right-5 sm:bottom-40 sm:right-20 w-64 h-64 sm:w-96 sm:h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none"
          />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-7xl">
            {/* Header - Static */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12 sm:mb-16 lg:mb-20"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  duration: 0.5,
                  delay: 0.2,
                  type: "spring",
                  stiffness: 200
                }}
                className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full glass-neon mb-6 sm:mb-8 border border-primary/20"
              >
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                <span className="text-xs sm:text-sm font-medium text-foreground whitespace-nowrap">
                  Ready to Collaborate
                </span>
              </motion.div>
              <motion.h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-metallic-animated mb-4 sm:mb-6 break-words px-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                Let's Talk
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-sm sm:text-base lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4 break-words"
              >
                Have a project in mind or want to discuss opportunities? I'm
                always excited to hear about new ideas and collaborate on
                innovative projects.
              </motion.p>
            </motion.div>

            {/* Stats - Static */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16 max-w-4xl mx-auto"
            >
              {[
                { label: "Response Time", value: "< 24h", icon: Clock },
                { label: "Projects Completed", value: "50+", icon: CheckCircle },
                { label: "Meeting Availability", value: "Flexible", icon: Calendar },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                  className="text-center p-4 sm:p-6 rounded-2xl glass border border-border/50"
                >
                  <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary mx-auto mb-2 sm:mb-3" />
                  <div className="text-xl sm:text-2xl font-bold text-metallic mb-1 whitespace-nowrap">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground break-words">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 max-w-6xl mx-auto">
              {/* Contact Info - Skeleton */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="space-y-6 sm:space-y-8 w-full"
              >
                <div>
                  <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                    className="text-2xl sm:text-3xl font-bold text-metallic mb-4 sm:mb-6 break-words"
                  >
                    Get in Touch
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                    className="text-muted-foreground mb-6 sm:mb-8 text-sm sm:text-base lg:text-lg break-words leading-relaxed"
                  >
                    Feel free to reach out through any of these channels. I'm
                    always happy to discuss new projects, creative ideas, or
                    opportunities to be part of your vision.
                  </motion.p>
                </div>

                <div className="space-y-4 sm:space-y-6 w-full">
                  {/* Skeleton for contact info items */}
                  {[
                    { icon: Mail, label: "Email", color: "from-blue-500 to-cyan-500" },
                    { icon: Phone, label: "Phone", color: "from-green-500 to-emerald-500" },
                    { icon: MapPin, label: "Location", color: "from-orange-500 to-red-500" },
                  ].map((info, index) => (
                    <motion.div
                      key={info.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                      className="flex items-start gap-3 sm:gap-4 lg:gap-6 p-4 sm:p-5 lg:p-6 rounded-2xl glass border border-border/50 w-full"
                    >
                      <div className={`p-3 sm:p-4 rounded-xl bg-gradient-to-r ${info.color} text-white shadow-lg flex-shrink-0`}>
                        <info.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-2">
                        <h3 className="text-foreground font-semibold text-base sm:text-lg mb-1 break-words">
                          {info.label}
                        </h3>
                        <div className="h-6 w-40 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Contact Form - Skeleton */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="relative w-full"
              >
                <div className="relative lg:sticky lg:top-24">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9, duration: 0.5 }}
                    className="p-5 sm:p-6 lg:p-8 rounded-2xl glass-neon border border-border/50 w-full"
                  >
                    <h2 className="text-xl sm:text-2xl font-bold text-metallic mb-2 break-words">
                      Send a Message
                    </h2>
                    <div className="h-4 w-64 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-6 sm:mb-8"></div>

                    <div className="space-y-5 sm:space-y-6 w-full">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                        <div>
                          <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-2 sm:mb-3"></div>
                          <div className="w-full h-10 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                        </div>
                        <div>
                          <div className="h-4 w-28 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-2 sm:mb-3"></div>
                          <div className="w-full h-10 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                        </div>
                      </div>

                      <div>
                        <div className="h-4 w-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-2 sm:mb-3"></div>
                        <div className="w-full h-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                      </div>

                      <div className="w-full h-12 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse"></div>

                      <div className="h-3 w-72 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mx-auto"></div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  // Actual component with data
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.message.trim()
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setIsSubmitted(true);
      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", subject: "", message: "" });

    } catch (error) {
      toast.error("Failed to send message.");
    } finally {
      setIsSubmitting(false);
    }
  };


  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: contactData?.email || "loading...",
      description: "I'll respond within 24 hours",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Phone,
      label: "Phone",
      value: contactData?.phone || "loading...",
      description: "Mon - Fri, 9am - 5pm PST",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: MapPin,
      label: "Location",
      value: contactData?.location || "loading...",
      description: "Available for remote work worldwide",
      color: "from-orange-500 to-red-500",
    },
  ];

  const stats = [
    { label: "Response Time", value: "< 24h", icon: Clock },
    { label: "Projects Completed", value: "50+", icon: CheckCircle },
    { label: "Meeting Availability", value: "Flexible", icon: Calendar },
  ];

  return (
    <Layout>
      <section className="py-12 px-2 sm:py-16 lg:py-20 min-h-screen relative overflow-hidden">
        {/* Animated Background Elements */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-10 left-5 sm:top-20 sm:left-20 w-48 h-48 sm:w-72 sm:h-72 bg-primary/10 rounded-full blur-[80px] pointer-events-none"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-20 right-5 sm:bottom-40 sm:right-20 w-64 h-64 sm:w-96 sm:h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none"
        />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-7xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16 lg:mb-20"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                duration: 0.5,
                delay: 0.2,
                type: "spring",
                stiffness: 200
              }}
              className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full glass-neon mb-6 sm:mb-8 border border-primary/20"
            >
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              <span className="text-xs sm:text-sm font-medium text-foreground whitespace-nowrap">
                Ready to Collaborate
              </span>
            </motion.div>
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-metallic-animated mb-4 sm:mb-6 break-words px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              Let's Talk
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-sm sm:text-base lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4 break-words"
            >
              Have a project in mind or want to discuss opportunities? I'm
              always excited to hear about new ideas and collaborate on
              innovative projects.
            </motion.p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 25px hsl(var(--neon-red)/0.3)",
                }}
                className="text-center p-4 sm:p-6 rounded-2xl glass border border-border/50 hover:border-primary/30 transition-all duration-300 cursor-pointer"
              >
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.2 }}
                  transition={{ duration: 0.6 }}
                >
                  <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary mx-auto mb-2 sm:mb-3" />
                </motion.div>
                <div className="text-xl sm:text-2xl font-bold text-metallic mb-1 whitespace-nowrap">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground break-words">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 max-w-6xl mx-auto">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="space-y-6 sm:space-y-8 w-full"
            >
              <div>
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                  className="text-2xl sm:text-3xl font-bold text-metallic mb-4 sm:mb-6 break-words"
                >
                  Get in Touch
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="text-muted-foreground mb-6 sm:mb-8 text-sm sm:text-base lg:text-lg break-words leading-relaxed"
                >
                  Feel free to reach out through any of these channels. I'm
                  always happy to discuss new projects, creative ideas, or
                  opportunities to be part of your vision.
                </motion.p>
              </div>

              <div className="space-y-4 sm:space-y-6 w-full">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={info.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                    whileHover={{ scale: 1.02, x: 3 }}
                    className="flex items-start gap-3 sm:gap-4 lg:gap-6 p-4 sm:p-5 lg:p-6 rounded-2xl glass border border-border/50 hover:border-primary/30 transition-all duration-300 group cursor-pointer w-full"
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`p-3 sm:p-4 rounded-xl bg-gradient-to-r ${info.color} text-white shadow-lg flex-shrink-0`}
                    >
                      <info.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </motion.div>
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <h3 className="text-foreground font-semibold text-base sm:text-lg mb-1 break-words">
                        {info.label}
                      </h3>
                      <p className="text-metallic font-medium text-sm sm:text-base lg:text-xl mb-1 sm:mb-2 break-all">
                        {info.value}
                      </p>
                      <p className="text-muted-foreground text-xs sm:text-sm break-words">
                        {info.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="relative w-full"
            >
              <div className="relative lg:sticky lg:top-24">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9, duration: 0.5 }}
                  className="p-5 sm:p-6 lg:p-8 rounded-2xl glass-neon border border-border/50 w-full"
                >
                  <h2 className="text-xl sm:text-2xl font-bold text-metallic mb-2 break-words">
                    Send a Message
                  </h2>
                  <p className="text-muted-foreground mb-6 sm:mb-8 text-xs sm:text-sm break-words leading-relaxed">
                    {contactData?.formEnabled ?? true
                      ? "Fill out the form below and I'll get back to you as soon as possible."
                      : "The contact form is currently disabled. Please email me directly."}
                  </p>

                  {(contactData?.formEnabled ?? true) && (
                    <div className="space-y-5 sm:space-y-6 w-full">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.0 }}
                        >
                          <label
                            htmlFor="name"
                            className="block text-xs sm:text-sm font-medium text-foreground mb-2 sm:mb-3"
                          >
                            Your Name *
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full input-neon text-sm sm:text-base text-foreground placeholder:text-muted-foreground/60"
                            placeholder="Maaz Younas"
                          />
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.1 }}
                        >
                          <label
                            htmlFor="email"
                            className="block text-xs sm:text-sm font-medium text-foreground mb-2 sm:mb-3"
                          >
                            Email Address *
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full input-neon text-sm sm:text-base text-foreground placeholder:text-muted-foreground/60"
                            placeholder="maazyounas@gmail.com"
                          />
                        </motion.div>
                      </div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2 }}
                      >
                        <label
                          htmlFor="message"
                          className="block text-xs sm:text-sm font-medium text-foreground mb-2 sm:mb-3"
                        >
                          Message *
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          rows={6}
                          className="w-full input-neon text-sm sm:text-base text-foreground placeholder:text-muted-foreground/60 resize-none"
                          placeholder="Tell me about your project, timeline, and any specific requirements..."
                        />
                      </motion.div>

                      <motion.button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting || isSubmitted}
                        whileHover={{
                          scale: isSubmitting || isSubmitted ? 1 : 1.02,
                        }}
                        whileTap={{
                          scale: isSubmitting || isSubmitted ? 1 : 0.98,
                        }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.3 }}
                        className="w-full btn-neon flex items-center justify-center gap-2 sm:gap-3 text-primary-foreground text-base sm:text-lg font-medium py-3 sm:py-4 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                      >
                        {/* Animated background */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80"
                          initial={{ x: "-100%" }}
                          animate={{ x: isSubmitting ? "100%" : "-100%" }}
                          transition={{
                            duration: 2,
                            repeat: isSubmitting ? Infinity : 0,
                          }}
                        />

                        <span className="relative z-10 flex items-center gap-2 sm:gap-3">
                          {isSubmitting ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                                className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-primary-foreground border-t-transparent rounded-full"
                              />
                              <span className="whitespace-nowrap">Sending...</span>
                            </>
                          ) : isSubmitted ? (
                            <>
                              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                              <span className="whitespace-nowrap">Message Sent!</span>
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                              <span className="whitespace-nowrap">Send Message</span>
                            </>
                          )}
                        </span>
                      </motion.button>

                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.4 }}
                        className="text-xs text-muted-foreground text-center break-words leading-relaxed"
                      >
                        * Required fields. Your information is secure and will never be shared.
                      </motion.p>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;