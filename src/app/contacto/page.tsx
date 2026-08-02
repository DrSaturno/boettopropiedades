import type { Metadata } from "next";
import Image from "next/image";
import ContactForm from "@/components/forms/ContactForm";
import { COMPANY_INFO } from "@/lib/constants";
import { getWhatsAppUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Hablemos sobre tu próxima decisión inmobiliaria en Capital Federal.",
};

export default function ContactoPage() {
  return (
    <div className="inner-page contact-page">
      <section className="contact-masthead">
        <div className="contact-masthead__visual">
          <Image
            src="/images/boetto-courtyard.png"
            alt="Casa contemporánea iluminada al atardecer"
            fill
            priority
            sizes="100vw"
            className="contact-masthead__image"
          />
          <div className="contact-masthead__veil" />
        </div>

        <div className="contact-masthead__content">
          <p className="eyebrow eyebrow--light">Contacto</p>
          <h1>
            Hablemos.
            <em>Lo que sigue empieza por una conversación.</em>
          </h1>
          <p>
            Comprar, vender o tasar una propiedad empieza por ordenar el contexto.
            Contanos qué necesitás y te respondemos con una primera orientación
            concreta.
          </p>
          <a href="#consulta" className="contact-masthead__link">
            Iniciar una conversación
            <span aria-hidden="true">↓</span>
          </a>
        </div>

        <p className="contact-masthead__aside" aria-hidden="true">
          Servicio inmobiliario · Capital Federal
        </p>
      </section>

      <section className="contact-conversation" id="consulta">
        <div className="section-shell contact-conversation__layout">
          <div className="contact-conversation__intro">
            <p className="eyebrow">Primera conversación</p>
            <h2>Empecemos por tu contexto.</h2>
            <p>
              Dejanos tus datos y una breve idea de lo que estás buscando. Una
              persona del equipo va a leer tu consulta y responderte personalmente.
            </p>

            <div className="contact-conversation__channels">
              <a href={`tel:${COMPANY_INFO.phoneHref}`}>
                <span>Teléfono</span>
                <strong>{COMPANY_INFO.phone}</strong>
              </a>
              <a href={`mailto:${COMPANY_INFO.email}`}>
                <span>Email</span>
                <strong>{COMPANY_INFO.email}</strong>
              </a>
              <a
                href={getWhatsAppUrl(
                  "Hola, me comunico desde la web de Boetto Propiedades."
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>WhatsApp</span>
                <strong>Escribir ahora ↗</strong>
              </a>
            </div>
          </div>

          <div className="contact-conversation__form">
            <div className="contact-conversation__form-heading">
              <span>Tu consulta</span>
              <p>Respondemos de manera personal, sin mensajes automáticos.</p>
            </div>
            <ContactForm variant="dark" showLabels />
          </div>
        </div>
      </section>

      <section className="contact-details">
        <div className="section-shell contact-details__grid">
          <div>
            <span>Estudio</span>
            <p>{COMPANY_INFO.address}</p>
          </div>
          <div>
            <span>Horarios</span>
            <p>{COMPANY_INFO.hours}</p>
          </div>
          <div>
            <span>Instagram</span>
            <a
              href={`https://www.instagram.com/${COMPANY_INFO.instagram}/`}
              target="_blank"
              rel="noreferrer"
            >
              @{COMPANY_INFO.instagram} ↗
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
