import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface QuoteRotatorProps {
  className?: string;
  textClassName?: string;
  quotes: string[];
}

const QuoteRotator = ({
  className = "",
  textClassName = "",
  quotes = [],
}: QuoteRotatorProps) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (quotes.length <= 1) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % quotes.length);
    }, 4000); // Rotate every 4 seconds

    return () => clearInterval(interval);
  }, [quotes.length]);

  return (
    <div
      className={`relative flex items-center justify-center lg:justify-start overflow-hidden ${className}`}
    >
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
          className={`absolute w-full text-center lg:text-left break-words ${textClassName}`}
        >
          {quotes[index]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
};

export default QuoteRotator;
