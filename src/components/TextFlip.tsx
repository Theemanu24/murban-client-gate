import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const text = ["Murban", "Engineering"];

const TextFlip = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((state) => (state >= text.length - 1 ? 0 : state + 1));
    }, 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative flex items-center">
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ rotateX: 90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={{ rotateX: -90, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="block sm:inline bg-[radial-gradient(circle_at_left,_var(--tw-gradient-stops))] from-[#3744bf] to-[#8d2542] bg-clip-text text-transparent"
        >
          {text[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

export default TextFlip;

