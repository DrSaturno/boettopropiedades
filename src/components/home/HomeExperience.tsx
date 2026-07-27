"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

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
    text: "Orientación, escala, accesos y valor futuro convierten una dirección en una decisión bien informada.",
  },
  {
    kicker: "Luego · La selección",
    title: (
      <>
        Pocas opciones.
        <em>Más criterio.</em>
      </>
    ),
    text: "Una selección breve y personal permite mirar mejor, comparar con calma y reconocer la propiedad correcta.",
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
  { place: "Zona Norte", context: "Córdoba Capital" },
  { place: "Nueva Córdoba", context: "Córdoba Capital" },
  { place: "Villa Allende", context: "Sierras Chicas, Córdoba" },
  { place: "La Rufina", context: "Zona Norte, Córdoba" },
  { place: "Manantiales", context: "Zona Sur, Córdoba" },
  { place: "Cerro de las Rosas", context: "Zona Norte, Córdoba" },
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
    title: "Búsqueda guiada",
    text: "Acompañamos decisiones residenciales con criterio de barrio, tipología, luz, expansión y valor futuro.",
  },
  {
    title: "Tasaciones precisas",
    text: "Lectura comparativa, sensibilidad comercial y estrategia de salida para propietarios que quieren posicionar bien su activo.",
  },
  {
    title: "Selección privada",
    text: "Combinamos propiedades publicadas con oportunidades que circulan de forma reservada y búsquedas a medida.",
  },
];

const districts = [
  {
    name: "Zona Norte",
    label: "Residencial y verde",
    stat: "Casas con lote, accesos rapidos y demanda sostenida.",
    insight: "Ideal para familias que priorizan expansion, privacidad y vida cotidiana mas serena.",
  },
  {
    name: "Nueva Cordoba",
    label: "Urbano y dinamico",
    stat: "Movimiento permanente, alquiler temporario y ritmo mas compacto.",
    insight: "Funciona bien para inversion, primeras compras y perfiles que quieren ciudad a pie.",
  },
  {
    name: "Villa Allende",
    label: "Paisaje y escala",
    stat: "Casas con caracter, barrios abiertos y relacion fuerte con el entorno.",
    insight: "Suele atraer busquedas que valoran diseño, aire libre y una vida menos congestionada.",
  },
];

const marketNotes = [
  "El valor de una propiedad se define tanto por su estado como por la calidad urbana y el desarrollo de su entorno.",
  "En el segmento premium, orientación, privacidad y arquitectura sostienen mejor el valor a largo plazo.",
  "Una buena búsqueda compara menos opciones, pero incorpora más información antes de decidir una visita.",
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
  const [district, setDistrict] = useState(0);
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

  const activeDistrict = districts[district];
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

          <p className="scroll-hero__vertical">Córdoba · Hogares con contexto · Desde 1987</p>

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

      <section className="agency-section agency-section--services">
        <div className="section-shell agency-grid">
          <div className="agency-grid__headline" data-reveal>
            <p className="eyebrow">Cómo trabaja el estudio</p>
            <h2>Información precisa para decidir con calma.</h2>
          </div>

          <div className="service-list">
            {services.map((service) => (
              <article key={service.title} className="service-card" data-reveal>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="agency-section agency-section--districts">
        <div className="section-shell district-layout">
          <div className="district-panel" data-reveal>
            <p className="eyebrow">Barrios en foco</p>
            <h2>Elegir zona sigue siendo la decisión grande.</h2>

            <div className="district-tabs" role="tablist" aria-label="Barrios destacados">
              {districts.map((item, index) => (
                <button
                  key={item.name}
                  type="button"
                  className={district === index ? "is-active" : ""}
                  onClick={() => setDistrict(index)}
                >
                  <span>{item.name}</span>
                  <small>{item.label}</small>
                </button>
              ))}
            </div>

            <div className="district-detail">
              <strong>{activeDistrict.name}</strong>
              <p>{activeDistrict.stat}</p>
              <span>{activeDistrict.insight}</span>
            </div>
          </div>

          <div className="market-panel" data-reveal>
            <p className="eyebrow">Lectura de mercado</p>
            <div className="market-panel__stack">
              {marketNotes.map((note, index) => (
                <article key={note} className="market-note">
                  <span>0{index + 1}</span>
                  <p>{note}</p>
                </article>
              ))}
            </div>
            <blockquote>
              “La decisión correcta aparece cuando la información y la forma de
              vivir empiezan a señalar el mismo lugar.”
            </blockquote>
          </div>
        </div>
      </section>

      <section className="agency-section agency-section--contact">
        <div className="section-shell closing-panel" data-reveal>
          <div>
            <p className="eyebrow">Proxima conversacion</p>
            <h2>Una búsqueda bien acompañada empieza mucho antes de una visita.</h2>
          </div>

          <div className="closing-panel__body">
            <p>
              Contanos qué querés cambiar, dónde imaginás tu próxima etapa y
              cuáles son tus prioridades. Nosotros convertimos esa intención en
              una búsqueda concreta.
            </p>
            <div className="closing-panel__actions">
              <Link href="/contacto" className="outline-link">
                Hablar con el equipo
                <ArrowIcon />
              </Link>
              <a href="mailto:hola@boettopropiedades.com.ar">
                hola@boettopropiedades.com.ar
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
