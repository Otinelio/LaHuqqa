import React from "react";

export default function Carousel() {
  // Generate imports for all 13 images dynamically
  const images = Array.from({ length: 13 }, (_, i) => {
    return new URL(`../assets/img/carousel/img${i + 1}.jpg`, import.meta.url).href;
  });

  // Duplicate the array to create a seamless infinite loop
  const duplicatedImages = [...images, ...images];

  return (
    <div className="group relative w-full overflow-hidden bg-background py-10 flex">
      {/* Top and bottom gradient for aesthetic framing */}
      <div className="absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-background to-transparent md:w-32 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-background to-transparent md:w-32 pointer-events-none" />

      {/* First block */}
      <div className="flex min-w-full shrink-0 animate-marquee items-center gap-4 pr-4 group-hover:[animation-play-state:paused]">
        {images.map((src, i) => (
          <div
            key={`first-${i}`}
            className="relative h-64 w-80 shrink-0 overflow-hidden rounded-xl shadow-md transition-all duration-500 md:h-80 md:w-96"
          >
            <img
              src={src}
              alt="Lahuqqa Ambiance"
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
            />
          </div>
        ))}
      </div>

      {/* Second block (identical) */}
      <div className="flex min-w-full shrink-0 animate-marquee items-center gap-4 pr-4 group-hover:[animation-play-state:paused]" aria-hidden="true">
        {images.map((src, i) => (
          <div
            key={`second-${i}`}
            className="relative h-64 w-80 shrink-0 overflow-hidden rounded-xl shadow-md transition-all duration-500 md:h-80 md:w-96"
          >
            <img
              src={src}
              alt="Lahuqqa Ambiance"
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
