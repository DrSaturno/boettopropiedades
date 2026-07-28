"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ContactForm from "@/components/forms/ContactForm";
import { COMPANY_INFO } from "@/lib/constants";

const heroChapters = [
  {
    key: "curaduria",
    title: (
      <>
        Una propiedad se elige
        <em>por como se vive.</em>
      </>
    ),
    text: "El recorrido acompana una idea simple: antes de mostrar opciones, entendemos la vida que queres construir.",
  },
  {
    key: "busqueda",
    title: (
      <>
        Empezamos por
        <em>tu forma de habitar.</em>
      </>
    ),
    text: "Rutinas, luz, tiempos, expansion y entorno. La busqueda empieza con preguntas precisas, no con una lista infinita.",
  },
  {
    key: "contexto",
    title: (
      <>
        Leemos el lugar
        <em>antes que los metros.</em>
      </>
    ),
    text: "Orientacion, accesos, arquitectura y valor futuro nos permiten seleccionar menos opciones y compararlas con mas criterio.",
  },
  {
    key: "formulario",
    title: (
      <>
        Empecemos por
        <em>lo que necesitas.</em>
      </>
    ),
    text: "Elegi una operacion, una zona y el tipo de propiedad. Nosotros hacemos el resto con criterio.",
    search: true,
  },
];

const mobileHeroQuery = "(max-width: 900px)";

const locationOptions = [
  { place: "Agronomia", context: "Capital Federal" },
  { place: "Almagro", context: "Capital Federal" },
  { place: "Balvanera", context: "Capital Federal" },
  { place: "Barracas", context: "Capital Federal" },
  { place: "Belgrano", context: "Capital Federal" },
  { place: "Boedo", context: "Capital Federal" },
  { place: "Caballito", context: "Capital Federal" },
  { place: "Chacarita", context: "Capital Federal" },
  { place: "Coghlan", context: "Capital Federal" },
  { place: "Colegiales", context: "Capital Federal" },
  { place: "Constitucion", context: "Capital Federal" },
  { place: "Flores", context: "Capital Federal" },
  { place: "Floresta", context: "Capital Federal" },
  { place: "La Boca", context: "Capital Federal" },
  { place: "La Paternal", context: "Capital Federal" },
  { place: "Liniers", context: "Capital Federal" },
  { place: "Mataderos", context: "Capital Federal" },
  { place: "Monserrat", context: "Capital Federal" },
  { place: "Monte Castro", context: "Capital Federal" },
  { place: "Nueva Pompeya", context: "Capital Federal" },
  { place: "Nuñez", context: "Capital Federal" },
  { place: "Palermo", context: "Capital Federal" },
  { place: "Parque Avellaneda", context: "Capital Federal" },
  { place: "Parque Chacabuco", context: "Capital Federal" },
  { place: "Parque Chas", context: "Capital Federal" },
  { place: "Parque Patricios", context: "Capital Federal" },
  { place: "Puerto Madero", context: "Capital Federal" },
  { place: "Recoleta", context: "Capital Federal" },
  { place: "Retiro", context: "Capital Federal" },
  { place: "Saavedra", context: "Capital Federal" },
  { place: "San Cristobal", context: "Capital Federal" },
  { place: "San Nicolas", context: "Capital Federal" },
  { place: "San Telmo", context: "Capital Federal" },
  { place: "Velez Sarsfield", context: "Capital Federal" },
  { place: "Versalles", context: "Capital Federal" },
  { place: "Villa Crespo", context: "Capital Federal" },
  { place: "Villa del Parque", context: "Capital Federal" },
  { place: "Villa Devoto", context: "Capital Federal" },
  { place: "Villa General Mitre", context: "Capital Federal" },
  { place: "Villa Lugano", context: "Capital Federal" },
  { place: "Villa Luro", context: "Capital Federal" },
  { place: "Villa Ortuzar", context: "Capital Federal" },
  { place: "Villa Pueyrredon", context: "Capital Federal" },
  { place: "Villa Real", context: "Capital Federal" },
  { place: "Villa Riachuelo", context: "Capital Federal" },
  { place: "Villa Santa Rita", context: "Capital Federal" },
  { place: "Villa Soldati", context: "Capital Federal" },
  { place: "Villa Urquiza", context: "Capital Federal" },
];

const propertyTypes = [
  "Casa",
  "Departamento",
  "PH",
  "Lote",
  "Local",
  "Oficina",
];

const services = [
  {
    title: "Busqueda guiada",
    text: "Traducimos prioridades reales, tiempos y estilo de vida en una seleccion breve, familiar y bien acompaniada.",
    image: "/images/boetto-service-family-guidance.png",
    alt: "Asesora inmobiliaria conversando con una pareja en un living luminoso",
  },
  {
    title: "Contexto y claridad",
    text: "Ordenamos zonas, tipologias y presupuesto para que cada decision se sienta cercana, posible y bien cuidada.",
    image: "/images/boetto-service-family-context.png",
    alt: "Familia recorriendo una casa calida junto a una asesora inmobiliaria",
  },
  {
    title: "Visitas con calma",
    text: "Seleccionamos propiedades para visitar con informacion precisa, sensibilidad humana y foco en lo que importa.",
    image: "/images/boetto-service-family-visit.png",
    alt: "Matrimonio y su hijo visitando una vivienda luminosa en Capital Federal",
  },
];

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 40 18" className="arrow">
      <path d="M1 9h36M30 2l7 7-7 7" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="search-icon">
      <circle cx="10.8" cy="10.8" r="6.8" />
      <path d="m16 16 5 5" />
    </svg>
  );
}

export default function HomeExperience() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);
  const [operation, setOperation] = useState("venta");
  const [videoReady, setVideoReady] = useState(false);
  const [activeChapter, setActiveChapter] = useState(0);
  const [isMobileHero, setIsMobileHero] = useState(false);
  const [locationQuery, setLocationQuery] = useState("");
  const [locationOpen, setLocationOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 }
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const media = window.matchMedia(mobileHeroQuery);
    const syncMobileHero = () => setIsMobileHero(media.matches);

    syncMobileHero();
    media.addEventListener("change", syncMobileHero);

    return () => media.removeEventListener("change", syncMobileHero);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    const hero = heroRef.current;

    if (!video || !hero) return;

    if (isMobileHero) {
      hero.style.setProperty("--video-progress", "0.2");
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      void video.play().catch(() => undefined);

      return () => {
        video.loop = false;
        video.pause();
      };
    }

    let rafId = 0;
    let targetProgress = 0;
    let displayedProgress = 0;
    let previousFrame = performance.now();
    let isRunning = false;
    let lastChapter = -1;

    const measureProgress = () => {
      const rect = hero.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      const total = Math.max(hero.offsetHeight - viewport, 1);
      const traveled = Math.min(Math.max(-rect.top, 0), total);
      targetProgress = traveled / total;
    };

    const paintFrame = (time: number) => {
      const delta = Math.min(time - previousFrame, 64);
      previousFrame = time;

      const response = 118;
      const blend = 1 - Math.exp(-delta / response);
      displayedProgress += (targetProgress - displayedProgress) * blend;

      if (Math.abs(targetProgress - displayedProgress) < 0.00035) {
        displayedProgress = targetProgress;
      }

      hero.style.setProperty("--video-progress", displayedProgress.toFixed(4));

      const nextChapter = Math.min(
        heroChapters.length - 1,
        Math.floor(displayedProgress * heroChapters.length)
      );

      if (nextChapter !== lastChapter) {
        lastChapter = nextChapter;
        setActiveChapter(nextChapter);
      }

      if (
        video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA &&
        video.duration &&
        Number.isFinite(video.duration)
      ) {
        const targetTime =
          displayedProgress * Math.max(video.duration - 0.06, 0);

        if (!video.seeking && Math.abs(video.currentTime - targetTime) > 0.024) {
          video.currentTime = targetTime;
        }
      }

      if (Math.abs(targetProgress - displayedProgress) > 0.00035) {
        rafId = window.requestAnimationFrame(paintFrame);
      } else {
        isRunning = false;
      }
    };

    const startAnimation = () => {
      measureProgress();

      if (!isRunning) {
        isRunning = true;
        previousFrame = performance.now();
        rafId = window.requestAnimationFrame(paintFrame);
      }
    };

    measureProgress();
    displayedProgress = targetProgress;
    startAnimation();
    window.addEventListener("scroll", startAnimation, { passive: true });
    window.addEventListener("resize", startAnimation);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", startAnimation);
      window.removeEventListener("resize", startAnimation);
    };
  }, [videoReady, isMobileHero]);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const params = new URLSearchParams({ operation });

    const city = form.get("city")?.toString().trim();
    const types = form.getAll("propertyType").map(String);

    if (city) params.set("city", city);
    if (types.length) params.set("propertyType", types.join(","));

    router.push(
      operation === "vender"
        ? `/tasaciones?${params.toString()}`
        : `/propiedades?${params.toString()}`
    );
  }

  const filteredLocations = locationQuery.trim()
    ? locationOptions.filter(({ place, context }) =>
        `${place} ${context}`
          .toLocaleLowerCase("es")
          .includes(locationQuery.toLocaleLowerCase("es"))
      )
    : locationOptions;

  function togglePropertyType(type: string) {
    setSelectedTypes((current) =>
      current.includes(type)
        ? current.filter((item) => item !== type)
        : [...current, type]
    );
  }

  return (
    <div className="agency-home">
      <section
        className="scroll-hero"
        ref={heroRef}
        aria-labelledby={isMobileHero ? "hero-search-title" : "hero-title"}
      >
        <div className="scroll-hero__sticky">
          <video
            ref={videoRef}
            className="scroll-hero__video"
            src="/video/boetto-luxury-tour.mp4"
            poster="/images/boetto-hero-aerial.png"
            autoPlay={isMobileHero}
            loop={isMobileHero}
            muted
            playsInline
            preload="auto"
            onLoadedData={() => setVideoReady(true)}
          />
          <div className="scroll-hero__shade" />
          <div className="scroll-hero__grain" />


          <div className="scroll-hero__chapters">
            {heroChapters.map((chapter, index) => {
              const isVisible = isMobileHero
                ? Boolean(chapter.search)
                : activeChapter === index;

              return (
                <article
                  className={`scroll-hero__chapter ${
                    isVisible ? "is-active" : ""
                  } ${chapter.search ? "scroll-hero__chapter--search" : ""}`}
                  key={chapter.key}
                  aria-hidden={!isVisible}
                >
                  {index === 0 ? (
                    <h1 id="hero-title">{chapter.title}</h1>
                  ) : (
                    <h2 id={chapter.search ? "hero-search-title" : undefined}>
                      {chapter.title}
                    </h2>
                  )}
                  <p className="scroll-hero__lead">{chapter.text}</p>
                  {chapter.search && (
                    <form className="hero-search" onSubmit={handleSearch} id="buscar">
                    <div className="hero-search__modes" aria-label="Tipo de operacion">
                      {[
                        ["venta", "Comprar"],
                        ["alquiler", "Alquilar"],
                        ["vender", "Vender"],
                      ].map(([value, label]) => (
                        <button
                          key={value}
                          type="button"
                          className={operation === value ? "is-active" : ""}
                          onClick={() => setOperation(value)}
                        >
                          {label}
                        </button>
                      ))}
                    </div>

                    <div className="hero-search__bar">
                      <div className="hero-search__location">
                        <label htmlFor="hero-location">Ubicacion</label>
                        <input
                          id="hero-location"
                          name="city"
                          type="text"
                          value={locationQuery}
                          placeholder="¿Donde queres mudarte?"
                          autoComplete="off"
                          onChange={(event) => {
                            setLocationQuery(event.target.value);
                            setLocationOpen(true);
                          }}
                          onFocus={() => setLocationOpen(true)}
                          onBlur={() => setLocationOpen(false)}
                        />

                        {locationOpen && (
                          <div className="hero-search__suggestions" role="listbox">
                            {filteredLocations.map((location) => (
                              <button
                                key={`${location.place}-${location.context}`}
                                type="button"
                                onMouseDown={(event) => event.preventDefault()}
                                onClick={() => {
                                  setLocationQuery(location.place);
                                  setLocationOpen(false);
                                }}
                              >
                                <strong>{location.place}</strong>
                                <span>{location.context}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <details className="hero-search__types">
                        <summary>
                          <span>Tipo de propiedad</span>
                          <strong>
                            {selectedTypes.length
                              ? `${selectedTypes.length} seleccionadas`
                              : "Todas las propiedades"}
                          </strong>
                          <i aria-hidden="true" />
                        </summary>
                        <div className="hero-search__type-menu">
                          {propertyTypes.map((type) => (
                            <label key={type}>
                              <input
                                type="checkbox"
                                name="propertyType"
                                value={type.toLocaleLowerCase("es")}
                                checked={selectedTypes.includes(type)}
                                onChange={() => togglePropertyType(type)}
                              />
                              <span>{type}</span>
                            </label>
                          ))}
                        </div>
                      </details>

                      <button
                        className="hero-search__submit"
                        type="submit"
                        aria-label="Buscar propiedades"
                      >
                        <SearchIcon />
                        <span>Buscar</span>
                      </button>
                    </div>
                    </form>
                  )}
                </article>
              );
            })}
          </div>

        </div>
      </section>

      <section
        className="agency-section--contact"
        data-header-boundary
      >
        <div className="section-shell closing-panel" data-reveal>
          <div className="closing-panel__copy">
            <div>
              <h2>Una busqueda bien acompañada empieza mucho antes de una visita.</h2>
            </div>

            <div className="closing-panel__body">
              <p>
                Contanos que queres cambiar, donde imaginas tu proxima etapa y
                cuales son tus prioridades. Nosotros convertimos esa intencion en
                una busqueda concreta.
              </p>
              <div className="closing-panel__actions">
                <Link href="/contacto" className="closing-panel__primary">
                  Coordinar proxima visita
                  <ArrowIcon />
                </Link>
                <a href={`mailto:${COMPANY_INFO.email}`}>{COMPANY_INFO.email}</a>
              </div>
            </div>
          </div>

          <div className="closing-panel__visual" aria-hidden="true">
            <div className="closing-panel__image">
              <Image
                src="/images/boetto-next-visit.png"
                alt=""
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="agency-section agency-section--services">
        <div className="section-shell agency-grid">
          <div className="agency-grid__headline" data-reveal>
            <h2>Informacion precisa para decidir con calma.</h2>
          </div>

          <div className="service-list">
            {services.map((service) => (
              <article key={service.title} className="service-card" data-reveal>
                <div className="service-card__media">
                  <Image
                    src={service.image}
                    alt={service.alt}
                    fill
                    sizes="(max-width: 900px) 100vw, 33vw"
                  />
                </div>
                <div className="service-card__copy">
                  <h3>{service.title}</h3>
                  <p>{service.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="agency-section agency-section--form" id="contacto">
        <div className="section-shell contact-layout">
          <div className="contact-layout__intro" data-reveal>
            <h2>Hablemos de tu proxima decision.</h2>
            <p>
              Dejanos tus datos y una breve idea de lo que necesitas. El equipo
              de Boetto te responde con una primera orientacion concreta.
            </p>
            <a href={`mailto:${COMPANY_INFO.email}`}>{COMPANY_INFO.email}</a>
          </div>
          <div className="contact-layout__form" data-reveal>
            <p className="contact-layout__form-label">
              Contanos que estas buscando
            </p>
            <ContactForm variant="editorial" />
          </div>
        </div>
      </section>
    </div>
  );
}
