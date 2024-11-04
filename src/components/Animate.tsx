"use client";
import { motion } from "framer-motion";

const text = {
  initial: { y: "100%" },
  whileInView: (i: number) => ({
    y: 0,
    transition: {
      type: "tween",
      duration: 0.5,
      delay: 1 + i * 0.05,
      ease: [0, 0.55, 0.45, 1],
    },
  }),
};

export const AnimateTextByWord = ({ pharse }: { pharse: string }) => {
  return (
    <>
      {pharse.split(" ").map((item: string, i: number) => (
        <span className="overflow-hidden" key={i}>
          <motion.span
            variants={text}
            initial="initial"
            animate="whileInView"
            viewport={{ once: true }}
            custom={i}
            className="inline-flex whitespace-nowrap"
          >
            {item}
          </motion.span>
        </span>
      ))}
    </>
  );
};
