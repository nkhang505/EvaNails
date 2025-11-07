import { motion, useScroll, useTransform, useMotionTemplate } from "framer-motion";

const SECTION_HEIGHT = 1200;

export const CenterImage = () => {
  const { scrollY } = useScroll();

  const clip1 = useTransform(scrollY, [200, 600], [40, 0]);
  const clip2 = useTransform(scrollY, [200, 600], [60, 100]);

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
      className="sticky top-0 w-full h-screen sm:h-screen md:h-100 max-w-1/2"
      style={{
        clipPath,
        backgroundSize: "contain",        // Ensures the image covers the entire container
        backgroundPosition: "center",    // Centers the image in the container
        backgroundRepeat: "no-repeat",   // Prevents the image from repeating
        opacity,
        backgroundImage: 'url("salon.jpg")',
      }}
    ></motion.div>
  );
};