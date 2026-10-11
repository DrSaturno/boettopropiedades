"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ErrorNotice from "@/components/admin/ErrorNotice";
import PropertyForm from "@/components/admin/PropertyForm";
import { errorMessage, fetchJson } from "@/lib/admin-fetch";
import { parseJsonField } from "@/lib/utils";

type PropertyRecord = Record<string, string | number | boolean | null>;

const text = (value: PropertyRecord[string]) => (value == null ? "" : String(value));

export default function EditPropertyPage() {
  const params = useParams();
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchJson<PropertyRecord>(`/api/propiedades/${params.id}`)
      .then((prop) => {
        setData({
          id: prop.id,
          title: text(prop.title),
          operation: text(prop.operation) || "venta",
          propertyType: text(prop.propertyType) || "casa",
          status: text(prop.status) || "draft",
          featured: Boolean(prop.featured),
          price: text(prop.price),
          currency: text(prop.currency) || "USD",
          expenses: text(prop.expenses),
          address: text(prop.address),
          neighborhood: text(prop.neighborhood),
          city: text(prop.city),
          province: text(prop.province) || "Ciudad Autónoma de Buenos Aires",
          description: text(prop.description),
          totalArea: text(prop.totalArea),
          coveredArea: text(prop.coveredArea),
          rooms: text(prop.rooms),
          bedrooms: text(prop.bedrooms),
          bathrooms: text(prop.bathrooms),
          garages: text(prop.garages),
          age: text(prop.age),
          amenities: parseJsonField<string[]>(prop.amenities as string | null, []),
          images: parseJsonField<string[]>(prop.images as string | null, []),
          videoUrl: text(prop.videoUrl),
          externalUrl: text(prop.externalUrl),
          externalSource: text(prop.externalSource) || "manual",
        });
      })
      .catch((e) => setError(errorMessage(e)))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return <p className="text-sm text-brand-medium-gray">Cargando...</p>;

  return (
    <div>
      <h1 className="text-2xl font-serif font-medium text-brand-dark mb-8">Editar propiedad</h1>
      <ErrorNotice message={error} />
      {data && <PropertyForm initialData={data} isEditing />}
    </div>
  );
}
