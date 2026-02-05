import Layout from "../components/layout/Layout";
import HeroSection from "../components/home/HeroSection";
import { Helmet } from "react-helmet-async";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Maaz Younas | Full Stack Developer</title>
        <meta
          name="description"
          content="Portfolio of Maaz Younas - Full Stack Developer specializing in modern web technologies, creating elegant digital experiences."
        />
      </Helmet>
      <Layout>
        <HeroSection />
      </Layout>
    </>
  );
};

export default Index;
