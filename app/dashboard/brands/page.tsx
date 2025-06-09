"use client";

import SimpleCrudPage from "@/components/simple-crud-page";

export default function BrandsPage() {
  return (
    <SimpleCrudPage
      title="Brands"
      description="Manage brands in the system"
      endpoint="/brend"
      itemName="Brand"
      fields={[
        {
          key: "title",
          label: "Brand Name",
          type: "text",
          required: true,
          placeholder: "Enter brand name",
        },
        {
          key: "description",
          label: "Description",
          type: "textarea",
          required: true,
          placeholder: "Enter brand description",
        },
      ]}
      displayFields={[
        {
          key: "title",
          label: "Brand Name",
        },
        {
          key: "description",
          label: "Description",
        },
      ]}
    />
  );
}
