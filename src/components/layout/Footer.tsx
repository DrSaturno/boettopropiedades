import Image from "next/image";
import Link from "next/link";
import { COMPANY_INFO } from "@/lib/constants";

const navigation = [
  ["Propiedades", "/propiedades"],
  ["Tasaciones", "/tasaciones"],
  ["Nuestro estudio", "/nosotros"],
  ["Contacto", "/contacto"],
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__top">
        <Link href="/" aria-label="Boetto Propiedades, inicio">
          <Image
            src="/logos/logo-white.svg"
            alt="Boetto Propiedades"
            width={260}
            height={64}
          />
        </Link>
        <p>
          Curaduría inmobiliaria
          <br />
          en Capital Federal.
        </p>
        <a href={`tel:${COMPANY_INFO.phone.replace(/\s/g, "")}`}>
          {COMPANY_INFO.phone}
        </a>
      </div>

      <div className="site-footer__grid">
        <div>
          <p className="footer-label">Visitanos</p>
          <p>
            {COMPANY_INFO.address}
            <br />
            {COMPANY_INFO.hours}
          </p>
        </div>
        <div>
          <p className="footer-label">Escribinos</p>
          <a href={`mailto:${COMPANY_INFO.email}`}>
            {COMPANY_INFO.email}
          </a>
        </div>
        <nav aria-label="Navegación secundaria">
          {navigation.map(([label, href]) => (
            <Link href={href} key={href}>
              {label}
            </Link>
          ))}
        </nav>
        <div>
          <p className="footer-label">Seguinos</p>
          <a href="https://instagram.com" target="_blank" rel="noreferrer">
            Instagram ↗
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer">
            LinkedIn ↗
          </a>
        </div>
      </div>

      <div className="site-footer__bottom">
        <span>© {new Date().getFullYear()} Boetto Propiedades</span>
        <span>Privacidad · Términos</span>
        <span>Hecho con criterio en Capital Federal</span>
      </div>
    </footer>
  );
}
