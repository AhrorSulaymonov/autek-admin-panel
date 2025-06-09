"use client";

import SimpleCrudPage from "@/components/simple-crud-page";

export default function ProductsPage() {
  return (
    <SimpleCrudPage
      title="Products"
      description="Manage products"
      endpoint="/product"
      itemName="Product"
      fields={[
        {
          key: "title",
          label: "Product Name",
          type: "text",
          required: true,
          placeholder: "Enter product name",
        },
        {
          key: "description",
          label: "Description",
          type: "textarea",
          required: true,
          placeholder: "Enter product description",
        },
        {
          key: "old_price",
          label: "Old Price",
          type: "text",
          required: true,
          placeholder: "e.g., 199.99",
          pattern: "^\\d+(\\.\\d{0,2})?$",
          inputMode: "decimal",
        },
        {
          key: "price",
          label: "Price",
          type: "text",
          required: true,
          placeholder: "e.g., 149.99",
          pattern: "^\\d+(\\.\\d{0,2})?$",
          inputMode: "decimal",
        },
        {
          key: "uzum_link",
          label: "Uzum Link",
          type: "text",
          required: true,
          placeholder: "Enter Uzum marketplace link",
        },
        {
          key: "category_id",
          label: "Category",
          type: "select",
          required: true,
          placeholder: "Select category",
          relatedEndpoint: "/category",
          valueKey: "id",
          labelKey: "title",
        },
        {
          key: "screen_diagonal_id",
          label: "Screen Diagonal",
          type: "select",
          required: false,
          placeholder: "Select screen diagonal",
          relatedEndpoint: "/screen-diagonal",
          valueKey: "id",
          labelKey: "screen_size",
        },
        {
          key: "brand_id",
          label: "Brand",
          type: "select",
          required: false,
          placeholder: "Select brand",
          relatedEndpoint: "/brand",
          valueKey: "id",
          labelKey: "title",
        },
        {
          key: "color_id",
          label: "Color",
          type: "select",
          required: false,
          placeholder: "Select color",
          relatedEndpoint: "/color",
          valueKey: "id",
          labelKey: "title",
        },
        {
          key: "memory_id",
          label: "Memory",
          type: "select",
          required: false,
          placeholder: "Select memory",
          relatedEndpoint: "/memory",
          valueKey: "id",
          labelKey: "size",
        },
        {
          key: "car_brand_id",
          label: "Car Brand",
          type: "select",
          required: false,
          placeholder: "Select car brand",
          relatedEndpoint: "/car-brand",
          valueKey: "id",
          labelKey: "title",
        },
        {
          key: "navigation_system_id",
          label: "Navigation System",
          type: "select",
          required: false,
          placeholder: "Select navigation system",
          relatedEndpoint: "/navigation-system",
          valueKey: "id",
          labelKey: "title",
        },
        {
          key: "ram_id",
          label: "RAM",
          type: "select",
          required: false,
          placeholder: "Select RAM",
          relatedEndpoint: "/ram",
          valueKey: "id",
          labelKey: "size",
        },
        {
          key: "screen_type_id",
          label: "Screen Type",
          type: "select",
          required: false,
          placeholder: "Select screen type",
          relatedEndpoint: "/screen-type",
          valueKey: "id",
          labelKey: "title",
        },
        {
          key: "wifi",
          label: "WiFi",
          type: "checkbox",
          required: false,
        },
        {
          key: "bluetooth",
          label: "Bluetooth",
          type: "checkbox",
          required: false,
        },
        {
          key: "remote_control",
          label: "Remote Control",
          type: "checkbox",
          required: false,
        },
      ]}
      displayFields={[
        { key: "title", label: "Product Name" },
        {
          key: "old_price",
          label: "Old Price",
          format: (value) => `$${Number(value).toFixed(2)}`,
        },
        {
          key: "price",
          label: "Price",
          format: (value) => `$${Number(value).toFixed(2)}`,
        },
        { key: "category", label: "Category", valueKey: "title" },
        { key: "brand", label: "Brand", valueKey: "title" },
      ]}
    />
  );
}
