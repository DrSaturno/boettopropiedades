import Image from "next/image";
import type { ReactNode } from "react";

interface PageMastheadProps {
  title: ReactNode;
  summary: string;
  image: string;
  imageAlt: string;
  aside?: string;
  imagePosition?: "center" | "top" | "right";
  children?: ReactNode;
}

export default function PageMasthead({
  title,
  summary,
  image,
  imageAlt,
  aside,
  imagePosition = "center",
  children,
}: PageMastheadProps) {
  return (
    <section className="page-masthead">
      <div className="page-masthead__visual">
        <Image
          src={image}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          className={`page-masthead__image page-masthead__image--${imagePosition}`}
        />
        <div className="page-masthead__veil" />
      </div>

      <div className="page-masthead__content">
        <div className="page-masthead__copy">
          <h1>{title}</h1>
          <p>{summary}</p>
        </div>

        {children ? (
          <div className="page-masthead__actions">{children}</div>
        ) : null}
      </div>

      {aside ? (
        <p className="page-masthead__aside" aria-hidden="true">
          {aside}
        </p>
      ) : null}
    </section>
  );
}
