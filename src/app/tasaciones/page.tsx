import type { Metadata } from "next";
import PageMasthead from "@/components/layout/PageMasthead";
import TasacionForm from "@/components/forms/TasacionForm";
import { getWhatsAppUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Vender una propiedad",
  description:
    "Solicitá una tasación profesional para vender tu propiedad en Capital Federal con Boetto Propiedades.",
};

export default function TasacionesPage() {
  return (
    <div className="inner-page valuations-page">
      <PageMasthead
        title={
          <>
            Vender empieza
            <em>por conocer el valor.</em>
          </>
        }
        summary="Tasamos con información concreta, lectura de mercado y una estrategia pensada para presentar mejor cada propiedad."
        image="/images/boetto-next-visit.png"
        imageAlt="Asesora inmobiliaria conversando con propietarios en una casa contemporánea"
        aside="Vender · Tasar · Capital Federal"
        imagePosition="right"
      >
        <a href="#solicitar-tasacion" className="page-masthead__link">
          Cargar datos de la propiedad
          <span aria-hidden="true">↓</span>
        </a>
      </PageMasthead>

      <section className="valuation-request" id="solicitar-tasacion">
        <div className="section-shell valuation-request__layout">
          <div className="valuation-request__intro">
            <h2>Contanos qué propiedad querés vender.</h2>
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
