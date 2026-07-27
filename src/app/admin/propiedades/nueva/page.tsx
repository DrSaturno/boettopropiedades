"use client";

import PropertyForm from "@/components/admin/PropertyForm";

export default function NewPropertyPage() {
  return (
    <div>
      <h1 className="text-2xl font-serif font-medium text-brand-dark mb-8">Nueva propiedad</h1>
      <PropertyForm />
    </div>
  );
}
