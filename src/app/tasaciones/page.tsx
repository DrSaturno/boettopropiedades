import type { Metadata } from "next";
import InteriorHero from "@/components/layout/InteriorHero";
import TasacionForm from "@/components/forms/TasacionForm";
import { getWhatsAppUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Tasaciones",
  description:
    "Solicitá una tasación profesional de tu propiedad en Capital Federal con Boetto Propiedades.",
};

const process = [
  {
    title: "Leemos la propiedad",
    text: "Relevamos estado, tipología, orientación, calidad constructiva y los atributos que la vuelven singular.",
  },
  {
    title: "Estudiamos el contexto",
    text: "Contrastamos operaciones reales, oferta comparable y el momento particular de cada micromercado.",
  },
  {
    title: "Definimos una estrategia",
    text: "Entregamos una estimación fundada y una recomendación clara para vender o alquilar con criterio.",
  },
];

export default function TasacionesPage() {
  return (
    <div className="inner-page valuations-page">
      <InteriorHero
        index="02"
        kicker="Tasaciones"
        title={
          <>
            El valor real
            <em>necesita contexto.</em>
          </>
        }
        summary="Tasamos con información concreta, lectura de mercado y una mirada atenta sobre aquello que hace distinta a cada propiedad."
        image="/images/boetto-penthouse.png"
        imageAlt="Terraza contemporánea con vistas urbanas en Capital Federal"
        caption="Valoración · estrategia · decisión"
        imagePosition="top"
      />

      <section className="valuation-process">
        <div className="section-shell">
          <div className="interior-section-heading valuation-process__heading">
            <div>
              <p className="eyebrow">Cómo trabajamos</p>
              <h2>Una valuación precisa no sale de una fórmula automática.</h2>
            </div>
            <p>
              La cifra importa, pero también cómo se construye. Nuestro proceso
              ordena la información para que puedas decidir el próximo paso con
              claridad.
            </p>
          </div>

          <ol className="valuation-steps">
            {process.map((step, index) => (
              <li key={step.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="valuation-request" id="solicitar-tasacion">
        <div className="section-shell valuation-request__layout">
          <div className="valuation-request__intro">
            <p className="eyebrow eyebrow--light">Primera evaluación</p>
            <h2>Contanos qué propiedad querés tasar.</h2>
            <p>
              Con estos datos hacemos una primera lectura y nos comunicamos para
              coordinar el relevamiento. La consulta es sin costo ni compromiso.
            </p>
            <div className="valuation-request__facts">
              <span>Respuesta personalizada</span>
              <span>Análisis de mercado</span>
              <span>Recomendación de estrategia</span>
            </div>
            <a
              href={getWhatsAppUrl(
                "Hola, me gustaría solicitar una tasación de mi propiedad."
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="valuation-request__whatsapp"
            >
              Consultar por WhatsApp
              <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div className="valuation-request__form">
            <div className="valuation-request__form-heading">
              <span>Solicitud de tasación</span>
              <p>Todos los campos marcados son necesarios.</p>
            </div>
            <TasacionForm />
          </div>
        </div>
      </section>
    </div>
  );
}
