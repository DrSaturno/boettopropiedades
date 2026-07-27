import Link from "next/link";

const SERVICES = [
  {
    title: "Venta",
    description:
      "Publicamos tu propiedad con la mejor exposición y te acompañamos hasta el cierre de la operación.",
    href: "/propiedades?operation=venta",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
  },
  {
    title: "Alquiler",
    description:
      "Encontrá el inmueble ideal para alquilar o publicá tu propiedad con garantía de gestión profesional.",
    href: "/propiedades?operation=alquiler",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
      </svg>
    ),
  },
  {
    title: "Tasaciones",
    description:
      "Conocé el valor real de tu propiedad con una tasación profesional, sin compromiso.",
    href: "/tasaciones",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export default function ServicesBlock() {
  return (
    <section className="py-24 bg-brand-cream">
      <div className="container-wide">
        <div className="text-center mb-16">
          <p className="text-brand-sage text-sm uppercase tracking-[0.3em] mb-3 font-medium">
            Nuestros servicios
          </p>
          <h2 className="text-3xl md:text-4xl font-serif font-medium text-brand-dark">
            ¿Qué estás buscando?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SERVICES.map((service) => (
            <Link
              key={service.title}
              href={service.href}
              className="group bg-brand-surface border border-brand-warm-gray/30 p-10 hover:border-brand-sage/50 transition-all duration-300"
            >
              <div className="text-brand-sage mb-6 group-hover:scale-110 transition-transform duration-300">
                {service.icon}
              </div>
              <h3 className="text-xl font-serif font-medium text-brand-dark mb-3">
                {service.title}
              </h3>
              <p className="text-sm text-brand-dark/60 leading-relaxed mb-6">
                {service.description}
              </p>
              <span className="text-sm font-medium text-brand-sage group-hover:text-brand-sage-dark transition-colors inline-flex items-center gap-2">
                Ver más
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
