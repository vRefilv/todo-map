import React from "react";
import { motion } from "framer-motion";

interface FadeJumpInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

const variants = {
  hidden: { opacity: 0, y: -100, scale: 0.9 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

const FadeJumpIn: React.FC<FadeJumpInProps> = ({
  children,
  className = "",
  delay = 0,
}) => {
  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -50% 0px" }}
      transition={{
        type: "spring",
        stiffness: 40,
        damping: 10,
        delay: delay / 1000,
      }}
    >
      {children}
    </motion.div>
  );
};

export default FadeJumpIn;
