import { AnimatePresence, motion } from "framer-motion";

const PageAnimation = ({
  children,
  initial = { opacit: 0 },
  animate = { opacit: 1 },
  transition = { duration: 1 },
  keyValue,
  className,
}) => {
  return (
    <AnimatePresence>
      <motion.div
        key={keyValue}
        initial={initial}
        animate={animate}
        transition={transition}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageAnimation;
