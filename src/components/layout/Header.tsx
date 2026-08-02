"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const links = [
  { href: "/propiedades?operation=venta", label: "Comprar" },
  { href: "/propiedades?operation=alquiler", label: "Alquilar" },
  { href: "/tasaciones", label: "Vender" },
  { href: "/contacto", label: "Contacto" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (pathname !== "/") return;

    let rafId = 0;

    const updateHeader = () => {
      rafId = 0;
      const boundary = document.querySelector<HTMLElement>(
        "[data-header-boundary]"
      );
      const shouldMaterialize = boundary
        ? boundary.getBoundingClientRect().top <= 72
        : false;

      setScrolled((current) =>
        current === shouldMaterialize ? current : shouldMaterialize
      );
    };

    const requestUpdate = () => {
      if (!rafId) rafId = window.requestAnimationFrame(updateHeader);
    };

    requestUpdate();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const materialized = pathname !== "/" || scrolled;

  return (
    <header
      className={`site-header ${materialized ? "is-scrolled" : ""} ${
        open ? "is-menu-open" : ""
      }`}
    >
      <Link href="/" className="site-header__logo" aria-label="Boetto Propiedades, inicio">
        <Image
          className="site-header__logo-image site-header__logo-image--light"
          src="/logos/logo-white.svg"
          alt="Boetto Propiedades"
          fill
          sizes="(max-width: 900px) 146px, 164px"
          preload
        />
        <Image
          className="site-header__logo-image site-header__logo-image--dark"
          src="/logos/logo-black.svg"
          alt=""
          aria-hidden="true"
          fill
          sizes="(max-width: 900px) 146px, 164px"
          loading="eager"
        />
      </Link>

      <nav
        className={`site-nav ${open ? "is-open" : ""}`}
        aria-label="Navegación principal"
      >
        {links.map((link) => (
          <Link href={link.href} key={link.href} onClick={() => setOpen(false)}>
            {link.label}
          </Link>
        ))}
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
