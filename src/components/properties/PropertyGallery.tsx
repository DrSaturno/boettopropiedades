"use client";

import Image from "next/image";
import { useState } from "react";

interface Props {
  images: string[];
  title: string;
}

export default function PropertyGallery({ images, title }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const displayImages = images.length > 0
    ? images
    : ["https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80"];

  return (
    <div>
      <div className="relative aspect-[16/9] overflow-hidden bg-brand-cream mb-3">
        <Image
          key={activeIndex}
          src={displayImages[activeIndex]}
          alt={`${title} - Imagen ${activeIndex + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 66vw"
          className="object-cover transition-all duration-500"
          priority={activeIndex === 0}
        />
        {displayImages.length > 1 && (
          <>
            <button
              onClick={() => setActiveIndex((i) => (i === 0 ? displayImages.length - 1 : i - 1))}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors z-10"
              aria-label="Anterior"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button
              onClick={() => setActiveIndex((i) => (i === displayImages.length - 1 ? 0 : i + 1))}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors z-10"
              aria-label="Siguiente"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
            <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/50 text-white text-xs z-10">
              {activeIndex + 1} / {displayImages.length}
            </div>
          </>
        )}
      </div>

      {displayImages.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {displayImages.slice(0, 5).map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`relative aspect-[4/3] overflow-hidden transition-opacity ${
                i === activeIndex ? "ring-2 ring-brand-sage" : "opacity-60 hover:opacity-100"
              }`}
              aria-label={`${title} - Imagen ${i + 1}`}
            >
              <Image
                src={img}
                alt={`${title} - miniatura ${i + 1}`}
                fill
                sizes="(max-width: 768px) 20vw, 13vw"
                className="object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
