import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ParticlesBackground from "../effects/ParticlesBackground";

interface LayoutProps {
  children: ReactNode;
  showFooter?: boolean;
  showParticles?: boolean;
}

const Layout = ({ children, showFooter = true, showParticles = true }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background relative">
      {showParticles && <ParticlesBackground />}
      
      {/* Background gradient overlay to ensure content readability */}
      <div className="fixed inset-0 bg-gradient-to-b from-background/80 via-background/40 to-background/80 pointer-events-none z-1" />
      
      <div className="relative z-10">
        <Navbar />
        <main className="pt-16">{children}</main>
        {showFooter && <Footer />}
      </div>
    </div>
  );
};

export default Layout;