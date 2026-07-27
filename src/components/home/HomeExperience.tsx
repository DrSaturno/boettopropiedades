"use client";

import Image from "next/image";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ContactForm from "@/components/forms/ContactForm";
import { COMPANY_INFO } from "@/lib/constants";

const heroChapters = [
  {
    kicker: "Curaduría inmobiliaria",
    title: (
      <>
        Una propiedad se elige
        <em>por cómo se vive.</em>
      </>
    ),
    text: "El recorrido acompaña una idea simple: antes de mostrar opciones, entendemos la vida que querés construir.",
  },
  {
    kicker: "Primero · La búsqueda",
    title: (
      <>
        Empezamos por
        <em>tu forma de habitar.</em>
      </>
    ),
    text: "Rutinas, luz, tiempos, expansión y entorno. La búsqueda empieza con preguntas precisas, no con una lista infinita.",
  },
  {
    kicker: "Después · El contexto",
    title: (
      <>
        Leemos el lugar
        <em>antes que los metros.</em>
      </>
    ),
    text: "Orientación, accesos, arquitectura y valor futuro nos permiten seleccionar menos opciones y compararlas con más criterio.",
  },
  {
    kicker: "Finalmente · Tu búsqueda",
    title: (
      <>
        Empecemos por
        <em>lo que necesitás.</em>
      </>
    ),
    text: "Elegí una operación, una zona y el tipo de propiedad. Nosotros hacemos el resto con criterio.",
    search: true,
  },
];

const locationOptions = [
  { place: "Palermo", context: "Capital Federal" },
  { place: "Belgrano", context: "Capital Federal" },
  { place: "Recoleta", context: "Capital Federal" },
  { place: "Núñez", context: "Capital Federal" },
  { place: "Villa Urquiza", context: "Capital Federal" },
  { place: "Puerto Madero", context: "Capital Federal" },
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
    label: "Acompañamiento",
    title: "Búsqueda guiada",
    text: "Escuchamos primero. Después traducimos prioridades reales en una búsqueda breve, clara y acompañada.",
    image: "/images/boetto-team.png",
    alt: "Equipo de Boetto Propiedades en una reunión de trabajo",
  },
  {
    label: "Estrategia",
    title: "Tasaciones precisas",
    text: "Combinamos lectura comparativa, sensibilidad comercial y conocimiento de Capital Federal para posicionar cada activo.",
    image: "/images/boetto-courtyard.png",
    alt: "Arquitectura residencial contemporánea analizada por Boetto Propiedades",
  },
  {
    label: "Criterio",
    title: "Selección privada",
    text: "Sumamos propiedades publicadas, oportunidades reservadas y búsquedas a medida para mostrar solo lo que vale la pena visitar.",
    image: "/images/boetto-penthouse.png",
    alt: "Penthouse de arquitectura contemporánea seleccionado por Boetto Propiedades",
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
    const video = videoRef.current;
    const hero = heroRef.current;

    if (!video || !hero) return;

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

      // Time-based critical damping keeps the video attached to the gesture
      // without piling up abrupt media seeks on trackpads or touch screens.
      const response = window.innerWidth <= 900 ? 92 : 118;
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
  }, [videoReady]);

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
      <section className="scroll-hero" ref={heroRef} aria-labelledby="hero-title">
        <div className="scroll-hero__sticky">
          <video
            ref={videoRef}
            className="scroll-hero__video"
            src="/video/boetto-luxury-tour.mp4"
            poster="/images/boetto-hero-aerial.png"
            muted
            playsInline
            preload="auto"
            onLoadedData={() => setVideoReady(true)}
          />
          <div className="scroll-hero__shade" />
          <div className="scroll-hero__grain" />

          <div className="scroll-hero__meta">
            <span>Boetto Propiedades</span>
            <span>Una búsqueda guiada por criterio</span>
          </div>

          <p className="scroll-hero__vertical">Capital Federal · Hogares con contexto · Desde 1987</p>

          <div className="scroll-hero__chapters">
            {heroChapters.map((chapter, index) => (
              <article
                className={`scroll-hero__chapter ${
                  activeChapter === index ? "is-active" : ""
                } ${chapter.search ? "scroll-hero__chapter--search" : ""}`}
                key={chapter.kicker}
                aria-hidden={activeChapter !== index}
              >
                <p className="eyebrow eyebrow--light">{chapter.kicker}</p>
                {index === 0 ? (
                  <h1 id="hero-title">{chapter.title}</h1>
                ) : (
                  <h2>{chapter.title}</h2>
                )}
                <p className="scroll-hero__lead">{chapter.text}</p>
                {chapter.search && (
                  <form className="hero-search" onSubmit={handleSearch} id="buscar">
                    <div className="hero-search__modes" aria-label="Tipo de operación">
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
                        <label htmlFor="hero-location">Ubicación</label>
                        <input
                          id="hero-location"
                          name="city"
                          type="text"
                          value={locationQuery}
                          placeholder="¿Dónde querés mudarte?"
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
                            {filteredLocations.slice(0, 5).map((location) => (
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

                      <button className="hero-search__submit" type="submit" aria-label="Buscar propiedades">
                        <SearchIcon />
                        <span>Buscar</span>
                      </button>
                    </div>
                  </form>
                )}
              </article>
            ))}
          </div>

          <div className="scroll-hero__navigation" aria-label="Progreso del recorrido">
            <span aria-hidden="true">
              0{activeChapter + 1}
              <i>/</i>
              0{heroChapters.length}
            </span>
            <div className="scroll-hero__timeline" aria-hidden="true">
              <div>
                <i />
              </div>
            </div>
            <p>Deslizá para recorrer</p>
          </div>
        </div>
      </section>

      <section
        className="agency-section agency-section--contact"
        data-header-boundary
      >
        <div className="section-shell closing-panel" data-reveal>
          <div>
            <p className="eyebrow">Próxima conversación</p>
            <h2>Una búsqueda bien acompañada empieza mucho antes de una visita.</h2>
          </div>

          <div className="closing-panel__body">
            <p>
              Contanos qué querés cambiar, dónde imaginás tu próxima etapa y
              cuáles son tus prioridades. Nosotros convertimos esa intención en
              una búsqueda concreta.
            </p>
            <div className="closing-panel__actions">
              <a
                href={`mailto:${COMPANY_INFO.email}?subject=Quiero%20coordinar%20una%20próxima%20visita`}
                className="closing-panel__primary"
              >
                Coordinar próxima visita
                <ArrowIcon />
              </a>
              <a href={`mailto:${COMPANY_INFO.email}`}>
                {COMPANY_INFO.email}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="agency-section agency-section--services">
        <div className="section-shell agency-grid">
          <div className="agency-grid__headline" data-reveal>
            <p className="eyebrow">Cómo trabaja el estudio</p>
            <h2>Información precisa para decidir con calma.</h2>
          </div>

          <div className="service-list">
            {services.map((service, index) => (
              <article key={service.title} className="service-card" data-reveal>
                <div className="service-card__media">
                  <Image
                    src={service.image}
                    alt={service.alt}
                    fill
                    sizes="(max-width: 900px) 100vw, 33vw"
                  />
                  <span aria-hidden="true">0{index + 1}</span>
                </div>
                <div className="service-card__copy">
                  <p className="eyebrow">{service.label}</p>
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
            <p className="eyebrow eyebrow--light">Contacto</p>
            <h2>Hablemos de tu próxima decisión.</h2>
            <p>
              Dejanos tus datos y una breve idea de lo que necesitás. El equipo
              de Boetto te responde con una primera orientación concreta.
            </p>
            <a href={`mailto:${COMPANY_INFO.email}`}>
              {COMPANY_INFO.email}
            </a>
          </div>
          <div className="contact-layout__form" data-reveal>
            <p className="contact-layout__form-label">Contanos qué estás buscando</p>
            <ContactForm variant="editorial" />
          </div>
        </div>
      </section>
    </div>
  );
}
