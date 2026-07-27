"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PropertyForm from "@/components/admin/PropertyForm";

export default function EditPropertyPage() {
  const params = useParams();
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/propiedades/${params.id}`)
      .then((r) => r.json())
      .then((prop) => {
        let images: string[] = [];
        let amenities: string[] = [];
        try { images = JSON.parse(prop.images || "[]"); } catch { images = []; }
        try { amenities = JSON.parse(prop.amenities || "[]"); } catch { amenities = []; }

        setData({
          id: prop.id,
          title: prop.title || "",
          operation: prop.operation || "venta",
          propertyType: prop.propertyType || "casa",
          status: prop.status || "draft",
          featured: prop.featured || false,
          price: prop.price?.toString() || "",
          currency: prop.currency || "USD",
          expenses: prop.expenses?.toString() || "",
          address: prop.address || "",
          neighborhood: prop.neighborhood || "",
          city: prop.city || "",
          province: prop.province || "Córdoba",
          description: prop.description || "",
          totalArea: prop.totalArea?.toString() || "",
          coveredArea: prop.coveredArea?.toString() || "",
          rooms: prop.rooms?.toString() || "",
          bedrooms: prop.bedrooms?.toString() || "",
          bathrooms: prop.bathrooms?.toString() || "",
          garages: prop.garages?.toString() || "",
          age: prop.age != null ? prop.age.toString() : "",
          amenities,
          images,
          videoUrl: prop.videoUrl || "",
          externalUrl: prop.externalUrl || "",
          externalSource: prop.externalSource || "manual",
        });
        setLoading(false);
      });
  }, [params.id]);

  if (loading) return <p className="text-sm text-brand-medium-gray">Cargando...</p>;

  return (
    <div>
      <h1 className="text-2xl font-serif font-medium text-brand-dark mb-8">Editar propiedad</h1>
      {data && <PropertyForm initialData={data} isEditing />}
    </div>
  );
}
