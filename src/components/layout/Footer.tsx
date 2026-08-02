import Image from "next/image";
import Link from "next/link";
import { COMPANY_INFO, WHATSAPP_MESSAGE } from "@/lib/constants";
import { getWhatsAppUrl } from "@/lib/utils";

const navigation = [
  ["Propiedades", "/propiedades"],
  ["Tasaciones", "/tasaciones"],
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
            Servicio inmobiliario
            <br />
            en Capital Federal.
          </p>
          <a
            href={`mailto:${COMPANY_INFO.email}`}
            className="footer-modern__contact-link footer-modern__row"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            {COMPANY_INFO.email}
          </a>
          <a
            href={`tel:${COMPANY_INFO.phoneHref}`}
            className="footer-modern__contact-link footer-modern__row"
          >
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            {COMPANY_INFO.phone}
          </a>
        </div>

        <div className="footer-modern__nav">
          <p className="footer-label">Navegación</p>
          <nav aria-label="Navegación principal">
            {navigation.map(([label, href]) => (
              <Link href={href} key={href}>
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="footer-modern__office">
          <p className="footer-label">Oficina</p>
          <div className="footer-modern__row">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            <p>{COMPANY_INFO.address}</p>
          </div>
          <div className="footer-modern__row">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <p>{COMPANY_INFO.hours}</p>
          </div>
        </div>

        <div className="footer-modern__socials">
          <p className="footer-label">Seguinos</p>
          <a
            href={`https://www.instagram.com/${COMPANY_INFO.instagram}/`}
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram de Boetto Propiedades"
            className="footer-modern__row"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            Instagram
          </a>
          <a
            href={getWhatsAppUrl(WHATSAPP_MESSAGE)}
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp de Boetto Propiedades"
            className="footer-modern__row"
          >
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            WhatsApp
          </a>
        </div>
      </div>

      <div className="footer-modern__bottom">
        <span>© {new Date().getFullYear()} Boetto Propiedades</span>
        <span>
          <a href="https://www.planetasaturno.com" target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "none" }} className="hover:text-white transition-colors">
            By <span style={{ filter: "grayscale(1) brightness(10)", margin: "0 2px", display: "inline-block" }}>🪐</span> DrSaturno
          </a>
        </span>
        <span>Privacidad · Términos</span>
      </div>
    </footer>
  );
}
