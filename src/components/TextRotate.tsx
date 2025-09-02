import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const text = ["Murban", "Engineering"];

const TextRotate = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((state) => (state >= text.length - 1 ? 0 : state + 1));
    }, 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative flex w-[12ch] items-center justify-center overflow-hidden text-xs sm:text-base md:text-xl lg:text-2xl font-semibold">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ y: 20, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -20, opacity: 0, scale: 0.8 }}
          transition={{ ease: "easeInOut", delay: 0.2, duration: 0.5 }}
          whileHover={{ scale: 1.1 }}
          className="absolute w-full cursor-pointer bg-[radial-gradient(circle_at_left,_var(--tw-gradient-stops))] from-[#e5cf73] via-[#c56d09] to-[#faff00] bg-clip-text text-center text-transparent"
        >
          {text[index]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default TextRotate;

