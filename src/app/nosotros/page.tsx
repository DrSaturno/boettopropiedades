import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import InteriorHero from "@/components/layout/InteriorHero";

export const metadata: Metadata = {
  title: "Nuestro estudio",
  description:
    "Conocé el enfoque y el equipo de Boetto Propiedades en Capital Federal.",
};

const principles = [
  {
    title: "Escuchar antes de buscar",
    text: "La operación empieza por entender tiempos, prioridades y la vida que cada persona quiere construir.",
  },
  {
    title: "Explicar sin ruido",
    text: "Ordenamos la información y señalamos lo importante para que cada decisión sea consciente y segura.",
  },
  {
    title: "Acompañar hasta el final",
    text: "Sostenemos el mismo nivel de atención desde la primera conversación hasta la firma y la entrega.",
  },
];

export default function NosotrosPage() {
  return (
    <div className="inner-page studio-page">
      <InteriorHero
        index="03"
        kicker="Nuestro estudio"
        title={
          <>
            Conocemos propiedades.
            <em>Entendemos personas.</em>
          </>
        }
        summary="Somos un estudio inmobiliario de Capital Federal. Combinamos conocimiento de mercado, sensibilidad por la arquitectura y un acompañamiento verdaderamente cercano."
        image="/images/boetto-team.png"
        imageAlt="Equipo de Boetto Propiedades en su estudio"
        caption="Criterio profesional · trato cercano"
        imagePosition="center"
      />

      <section className="studio-manifesto">
        <div className="section-shell studio-manifesto__layout">
          <p className="eyebrow">Nuestra manera de trabajar</p>
          <h2>
            No empezamos por los metros cuadrados. Empezamos por hacer las
            preguntas correctas.
          </h2>
          <div className="studio-manifesto__body">
            <p>
              Boetto nació con una convicción simple: una decisión inmobiliaria
              importante merece tiempo, contexto y una conversación honesta. Por
              eso trabajamos con una selección cuidada y no con inventarios
              interminables.
            </p>
            <p>
              Leemos cada propiedad por su arquitectura, su entorno y su valor
              futuro. Después traducimos esa información de forma clara, para que
              nuestros clientes puedan avanzar sin presión y con mejores razones.
            </p>
          </div>
        </div>
      </section>

      <section className="studio-principles">
        <div className="section-shell">
          <div className="studio-principles__heading">
            <p className="eyebrow">Lo que cuidamos</p>
            <h2>La confianza se construye en los detalles.</h2>
          </div>
          <div className="studio-principles__grid">
            {principles.map((principle) => (
              <article key={principle.title}>
                <i aria-hidden="true" />
                <h3>{principle.title}</h3>
                <p>{principle.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="studio-closing">
        <div className="section-shell studio-closing__panel">
          <Image
            src="/images/boetto-service-family-guidance.png"
            alt="Asesora de Boetto conversando con una pareja"
            fill
            sizes="(max-width: 900px) 100vw, 94vw"
            className="studio-closing__image"
          />
          <div className="studio-closing__veil" />
          <div className="studio-closing__copy">
            <p className="eyebrow eyebrow--light">La próxima conversación</p>
            <h2>Tu búsqueda merece una mirada atenta desde el inicio.</h2>
            <Link href="/contacto" className="outline-link outline-link--light">
              Conocernos
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
