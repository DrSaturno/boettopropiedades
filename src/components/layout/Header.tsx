"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const links = [
  { href: "/propiedades?operation=venta", label: "Comprar" },
  { href: "/propiedades?operation=alquiler", label: "Alquilar" },
  { href: "/tasaciones", label: "Vender" },
];

const moreLinks = [
  { href: "/propiedades", label: "Propiedades" },
  { href: "/nosotros", label: "Nuestro estudio" },
  { href: "/contacto", label: "Contacto" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`site-header ${scrolled ? "is-scrolled" : ""} ${
        open ? "is-menu-open" : ""
      }`}
    >
      <Link href="/" className="site-header__logo" aria-label="Boetto Propiedades, inicio">
        <Image
          src="/logos/logo-white.svg"
          alt="Boetto Propiedades"
          width={220}
          height={52}
          preload
        />
      </Link>

      <nav
        className={`site-nav ${open ? "is-open" : ""}`}
        aria-label="Navegación principal"
        onMouseLeave={() => setMoreOpen(false)}
      >
        {links.map((link) => (
          <Link href={link.href} key={link.href} onClick={() => setOpen(false)}>
            {link.label}
          </Link>
        ))}

        <div className={`site-nav__more ${moreOpen ? "is-open" : ""}`}>
          <button
            type="button"
            aria-expanded={moreOpen}
            onClick={() => setMoreOpen((current) => !current)}
          >
            Más
            <i aria-hidden="true" />
          </button>
          <div className="site-nav__submenu">
            {moreLinks.map((link) => (
              <Link
                href={link.href}
                key={link.href}
                onClick={() => {
                  setMoreOpen(false);
                  setOpen(false);
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <Link href="/propiedades" className="site-header__inquiry">
        Buscar propiedades
      </Link>

      <button
        type="button"
        className={`menu-button ${open ? "is-open" : ""}`}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
      >
        <i />
        <i />
      </button>
    </header>
  );
}
