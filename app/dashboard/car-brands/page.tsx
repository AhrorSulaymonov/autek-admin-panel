"use client";

import SimpleCrudPage from "@/components/simple-crud-page";

export default function CarBrandsPage() {
  return (
    <SimpleCrudPage
      title="Car Brands"
      description="Manage car brand options"
      endpoint="/car-brand"
      itemName="Car Brand"
      fields={[
        {
          key: "title",
          label: "Brand Name",
          type: "text",
          required: true,
          placeholder: "e.g., Toyota, BMW, Mercedes",
        },
      ]}
      displayFields={[
        {
          key: "title",
          label: "Brand Name",
        },
      ]}
    />
  );
}
