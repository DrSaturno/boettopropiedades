import { COMPANY_INFO } from "@/lib/constants";

export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: COMPANY_INFO.name,
    url: COMPANY_INFO.website,
    telephone: COMPANY_INFO.phoneHref,
    email: COMPANY_INFO.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: COMPANY_INFO.address,
      addressLocality: "Capital Federal",
      addressRegion: "Buenos Aires",
      addressCountry: "AR",
    },
    openingHours: "Mo-Fr 10:00-19:00",
    sameAs: [`https://instagram.com/${COMPANY_INFO.instagram}`],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

interface PropertyJsonLdProps {
  title: string;
  description?: string | null;
  price?: number | null;
  currency?: string;
  address?: string | null;
  city?: string | null;
  images?: string[];
  url: string;
}

export function PropertyJsonLd({ title, description, price, currency = "USD", address, city, images, url }: PropertyJsonLdProps) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: title,
    url,
  };

  if (description) data.description = description;
  if (images?.length) data.image = images;
  if (address || city) {
    data.address = {
      "@type": "PostalAddress",
      streetAddress: address || undefined,
      addressLocality: city || "Capital Federal",
      addressCountry: "AR",
    };
  }
  if (price) {
    data.offers = {
      "@type": "Offer",
      price,
      priceCurrency: currency,
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
