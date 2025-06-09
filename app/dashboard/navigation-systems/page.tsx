"use client";

import SimpleCrudPage from "@/components/simple-crud-page";

export default function NavigationSystemsPage() {
  return (
    <SimpleCrudPage
      title="Navigation Systems"
      description="Manage navigation system options"
      endpoint="/navigation-system"
      itemName="Navigation System"
      fields={[
        {
          key: "title",
          label: "Navigation System",
          type: "text",
          required: true,
          placeholder: "e.g., GPS, GLONASS, Beidou",
        },
        {
          key: "description",
          label: "Description",
          type: "textarea",
          required: true,
          placeholder: "System description...",
        },
      ]}
      displayFields={[
        {
          key: "title",
          label: "Navigation System",
        },
        {
          key: "description",
          label: "Description",
        },
      ]}
    />
  );
}
