import Marquee from "react-fast-marquee";
import Image from "next/image";

interface SmoothMarqueeProps {
  children: React.ReactNode[];
  reverse?: boolean;
  pauseOnHover?: boolean;
  speed?: number; // pixels per second
}

export function SmoothMarquee({
  children,
  reverse = false,
  pauseOnHover = true,
  speed = 50,
}: SmoothMarqueeProps) {
  return (
    <div className="relative w-full overflow-hidden">
      <Marquee
        gradient={false} // disable gradient fade
        direction={reverse ? "right" : "left"}
        speed={speed}
        className="flex items-center"
      >
        {children.map((child, index) => (
          <div key={index} className="mx-2 flex-shrink-0">
            {child}
          </div>
        ))}
      </Marquee>
    </div>
  );
}
