import Image from "next/image";
import type { ReactNode } from "react";

interface InteriorHeroProps {
  index: string;
  kicker: string;
  title: ReactNode;
  summary: string;
  image: string;
  imageAlt: string;
  caption: string;
  imagePosition?: "center" | "top" | "right";
}

export default function InteriorHero({
  index,
  kicker,
  title,
  summary,
  image,
  imageAlt,
  caption,
  imagePosition = "center",
}: InteriorHeroProps) {
  return (
    <section className="interior-hero">
      <div className="interior-hero__copy">
        <div className="interior-hero__meta" aria-hidden="true">
          <span>{index}</span>
          <i />
          <span>Boetto Propiedades</span>
        </div>

        <div className="interior-hero__heading">
          <p className="eyebrow">{kicker}</p>
          <h1>{title}</h1>
        </div>

        <p className="interior-hero__summary">{summary}</p>
      </div>

      <div className="interior-hero__visual">
        <Image
          src={image}
          alt={imageAlt}
          fill
          priority
          sizes="(max-width: 900px) 100vw, 46vw"
          className={`interior-hero__image interior-hero__image--${imagePosition}`}
        />
        <div className="interior-hero__veil" />
        <p className="interior-hero__caption">{caption}</p>
      </div>
    </section>
  );
}
