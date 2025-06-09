"use client";

import SimpleCrudPage from "@/components/simple-crud-page";

export default function ScreenTypesPage() {
  return (
    <SimpleCrudPage
      title="Screen Types"
      description="Manage screen type options"
      endpoint="/screen-type"
      itemName="Screen Type"
      fields={[
        {
          key: "title",
          label: "Screen Type",
          type: "text",
          required: true,
          placeholder: "e.g., AMOLED, LCD, IPS",
        },
      ]}
      displayFields={[{ key: "title", label: "Screen Type" }]}
    />
  );
}
