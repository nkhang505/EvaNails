import { motion, useScroll, useTransform, useMotionTemplate } from "framer-motion";

const SECTION_HEIGHT = 1200;

export const CenterImage = () => {
  const { scrollY } = useScroll();

  const clip1 = useTransform(scrollY, [0, 1200], [40, 0]);
  const clip2 = useTransform(scrollY, [0, 1200], [60, 100]);

  const clipPath = useMotionTemplate`polygon(${clip1}% ${clip1}%, ${clip2}% ${clip1}%, ${clip2}% ${clip2}%, ${clip1}% ${clip2}%)`;

  const backgroundSize = useTransform(
    scrollY,
    [0, SECTION_HEIGHT + 500],
    ["170%", "100%"]
  );
  const opacity = useTransform(
    scrollY,
    [SECTION_HEIGHT, SECTION_HEIGHT + 500],
    [1, 0]
  );

  return (
    <motion.div
      className="sticky top-0 h-screen w-full"
      style={{
        clipPath,
        backgroundSize,
        opacity,
        backgroundImage:
          "url(\"salon.JPG\")",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    />
  );
};