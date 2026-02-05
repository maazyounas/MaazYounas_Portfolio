import { motion } from "framer-motion";
import { Github, Linkedin, Facebook, Instagram, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const socialLinks = [
  { icon: Github, href: "https://github.com/maazyounas", label: "GitHub" },
  {
    icon: Linkedin,
    href: "https://www.linkedin.com/in/muhammad-maaz-younas-b760503a8/",
    label: "LinkedIn",
  },
  {
    icon: Facebook,
    href: "https://www.facebook.com/maazyounas77",
    label: "Facebook",
  },
  {
    icon: Instagram,
    href: "https://www.instagram.com/_maazyounas_",
    label: "Instagram",
  },
  { icon: Mail, href: "#", label: "Email" },
];

const links = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Projects", path: "/projects" },
  { name: "Contact", path: "/contact" },
];

const Footer = () => {
  return (
    <footer className="relative mt-0 bg-gradient-to-b from-background to-background/95 backdrop-blur-xl">
      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-16 lg:py-6 relative ">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-metallic-animated text-2xl font-bold mb-4"
            >
              Maaz Younas
            </motion.div>
            <p className="text-muted-foreground mb-6 max-w-md">
              Crafting digital experiences with passion and precision. Let's
              build something amazing together.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <h3 className="font-semibold text-lg mb-6 text-foreground">
              Quick Links
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {links.map((link) => (
                <motion.div
                  key={link.name}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    to={link.path}
                    className="text-muted-foreground hover:text-primary transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Social Links Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-1"
          >
            <h3 className="font-semibold text-lg mb-6 text-foreground">
              Let's Connect
            </h3>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((link, index) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{
                    y: -5,
                    scale: 1.1,
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 rounded-lg bg-secondary border border-border/50 text-foreground hover:text-primary hover:border-primary/50 transition-all duration-300 icon-glow"
                  aria-label={link.label}
                >
                  <link.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="pt-5 border-t border-border/30"
        >
          <div className="relative flex items-center justify-center gap-4 py-4">
            {/* Copyright - Absolutely centered */}
            <p className="text-muted-foreground text-sm text-center">
              © {new Date().getFullYear()}{" "}
              <span className="text-primary font-bold">Maaz Younas</span> All
              rights reserved
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
