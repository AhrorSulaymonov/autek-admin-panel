"use client";

import SimpleCrudPage from "@/components/simple-crud-page";

export default function MemoryPage() {
  return (
    <SimpleCrudPage
      title="Memory Options"
      description="Manage storage memory options"
      endpoint="/memory"
      itemName="Memory"
      fields={[
        {
          key: "memory",
          label: "Memory Size (GB)",
          type: "number",
          required: true,
          placeholder: "Enter memory size in GB (e.g., 256, 512)",
        },
      ]}
      displayFields={[
        {
          key: "memory",
          label: "Memory Size",
          suffix: "GB",
        },
      ]}
    />
  );
}
