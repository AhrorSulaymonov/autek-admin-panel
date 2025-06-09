"use client";

import SimpleCrudPage from "@/components/simple-crud-page";

export default function RamPage() {
  return (
    <SimpleCrudPage
      title="RAM"
      description="Manage RAM options in the system"
      endpoint="/ram"
      itemName="RAM"
      fields={[
        {
          key: "ram",
          label: "RAM Size (GB)",
          type: "number",
          required: true,
          placeholder: "Enter RAM size in GB (e.g., 4, 8, 16)",
        },
      ]}
      displayFields={[
        {
          key: "ram",
          label: "RAM Size",
          suffix: "GB",
        },
      ]}
    />
  );
}
