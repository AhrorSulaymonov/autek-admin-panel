"use client";

import SimpleCrudPage from "@/components/simple-crud-page";

export default function ScreenDiagonalPage() {
  return (
    <SimpleCrudPage
      title="Screen Diagonal"
      description="Manage screen diagonal sizes"
      endpoint="/screen-diagonal"
      itemName="Screen Diagonal"
      fields={[
        {
          key: "screen_size",
          label: "Screen Size",
          type: "text",
          required: true,
          placeholder: "Enter screen size in inches (e.g., 6.1)",
          suffix: '"',
        },
      ]}
      displayFields={[
        {
          key: "screen_size",
          label: "Screen Size",
          suffix: '"',
        },
      ]}
    />
  );
}
