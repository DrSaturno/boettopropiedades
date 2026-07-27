import Image from "next/image";
import Link from "next/link";
import { COMPANY_INFO, WHATSAPP_MESSAGE } from "@/lib/constants";
import { getWhatsAppUrl } from "@/lib/utils";

const navigation = [
  ["Propiedades", "/propiedades"],
  ["Tasaciones", "/tasaciones"],
  ["Nuestro estudio", "/nosotros"],
  ["Contacto", "/contacto"],
];

export default function Footer() {
  return (
    <footer className="footer-modern">
      <div className="footer-modern__grid">
        <div className="footer-modern__brand">
          <Link href="/" aria-label="Boetto Propiedades, inicio">
            <Image
              src="/logos/logo-white.svg"
              alt="Boetto Propiedades"
              width={160}
              height={40}
            />
          </Link>
          <p>
            Curaduria inmobiliaria
            <br />
            en Capital Federal.
          </p>
          <a
            href={`mailto:${COMPANY_INFO.email}`}
            className="footer-modern__contact-link"
          >
            {COMPANY_INFO.email}
          </a>
          <a
            href={`tel:${COMPANY_INFO.phone.replace(/\s/g, "")}`}
            className="footer-modern__contact-link"
          >
            {COMPANY_INFO.phone}
          </a>
        </div>

        <div className="footer-modern__nav">
          <p className="footer-label">Navegacion</p>
          <nav aria-label="Navegacion principal">
            {navigation.map(([label, href]) => (
              <Link href={href} key={href}>
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="footer-modern__office">
          <p className="footer-label">Estudio</p>
          <p>
            {COMPANY_INFO.address}
            <br />
            {COMPANY_INFO.hours}
          </p>
        </div>

        <div className="footer-modern__socials">
          <p className="footer-label">Seguinos</p>
          <a
            href={`https://www.instagram.com/${COMPANY_INFO.instagram}/`}
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram de Boetto Propiedades"
          >
            Instagram
          </a>
          <a
            href={getWhatsAppUrl(WHATSAPP_MESSAGE)}
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp de Boetto Propiedades"
          >
            WhatsApp
          </a>
        </div>
      </div>

      <div className="footer-modern__bottom">
        <span>© {new Date().getFullYear()} Boetto Propiedades</span>
        <span>Privacidad · Terminos</span>
        <span>Hecho con criterio en Capital Federal</span>
      </div>

      <div className="footer-modern__mega-text" aria-hidden="true">
        BOETTO
      </div>
    </footer>
  );
}
