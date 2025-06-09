"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/lib/api";

interface Item {
  id: number;
  [key: string]: any;
}

interface RelatedItem {
  id: number;
  [key: string]: any;
}

interface SimpleCrudPageProps {
  title: string;
  description: string;
  endpoint: string;
  itemName: string;
  fields: {
    key: string;
    label: string;
    type: "text" | "number" | "textarea" | "select" | "checkbox";
    required?: boolean;
    placeholder?: string;
    suffix?: string;
    pattern?: string;
    inputMode?:
      | "text"
      | "decimal"
      | "numeric"
      | "tel"
      | "search"
      | "email"
      | "url";
    relatedEndpoint?: string;
    valueKey?: string;
    labelKey?: string;
  }[];
  displayFields: {
    key: string;
    label: string;
    suffix?: string;
    format?: (value: any) => string;
    valueKey?: string;
  }[];
}

export default function SimpleCrudPage({
  title,
  description,
  endpoint,
  itemName,
  fields,
  displayFields,
}: SimpleCrudPageProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState<any>({});
  const [relatedItems, setRelatedItems] = useState<{
    [key: string]: RelatedItem[];
  }>({});

  useEffect(() => {
    fetchItems();
    initializeFormData();

    const fetchAllRelatedItems = async () => {
      const relatedData: { [key: string]: RelatedItem[] } = {};
      for (const field of fields) {
        if (field.type === "select" && field.relatedEndpoint) {
          relatedData[field.key] = await fetchRelatedItems(
            field.relatedEndpoint
          );
        }
      }
      setRelatedItems(relatedData);
    };

    fetchAllRelatedItems();
  }, []);

  const initializeFormData = () => {
    const initialData: any = {};
    fields.forEach((field) => {
      initialData[field.key] = field.type === "number" ? 0 : "";
    });
    setFormData(initialData);
  };

  const fetchItems = async () => {
    try {
      console.log("Fetching items from:", endpoint);
      const response = await api.get(endpoint);
      console.log("API Response:", response.data);
      console.log("Setting items to:", response.data);
      setItems(response.data);
    } catch (error: any) {
      console.error(`Error fetching ${itemName}s:`, error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedItems = async (endpoint: string) => {
    try {
      const response = await api.get(endpoint);
      return response.data;
    } catch (error) {
      console.error(`Error fetching related items from ${endpoint}:`, error);
      return [];
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Convert number fields to actual numbers
    const processedData = { ...formData };
    fields.forEach((field) => {
      if (field.type === "number" && processedData[field.key]) {
        processedData[field.key] = Number(processedData[field.key]);
      }
    });

    try {
      if (editingItem) {
        await api.patch(`${endpoint}/${editingItem.id}`, processedData);
      } else {
        await api.post(endpoint, processedData);
      }
      setSuccess(
        editingItem
          ? `${itemName} updated successfully!`
          : `${itemName} created successfully!`
      );
      setFormData({});
      setEditingItem(null);
      setIsDialogOpen(false);
      fetchItems();
    } catch (error: any) {
      console.error(`Error saving ${itemName}:`, error);
      setError(
        error.response?.data?.message ||
          `Failed to save ${itemName}. Please check your input and try again.`
      );
    }
  };

  const handleEdit = (item: Item) => {
    setEditingItem(item);
    const newFormData: any = {};
    fields.forEach((field) => {
      newFormData[field.key] =
        item[field.key] ?? (field.type === "number" ? 0 : "");
    });
    setFormData(newFormData);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm(`Are you sure you want to delete this ${itemName}?`)) {
      try {
        await api.delete(`${endpoint}/${id}`);
        fetchItems();
      } catch (error) {
        console.error(`Error deleting ${itemName}:`, error);
      }
    }
  };

  const resetForm = () => {
    initializeFormData();
    setEditingItem(null);
  };

  const filteredItems = items.filter((item) => {
    console.log("Filtering item:", item);
    if (!searchTerm) return true; // If no search term, show all items

    const searchableFields = fields.filter(
      (f) => f.type === "text" || f.type === "textarea" || f.type === "number"
    );

    return searchableFields.some((field) =>
      String(item[field.key]).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  console.log("Filtered items:", filteredItems);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600 mt-2">{description}</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add {itemName}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? `Edit ${itemName}` : `Add New ${itemName}`}
              </DialogTitle>
              <DialogDescription>
                {editingItem
                  ? `Update ${itemName.toLowerCase()} information`
                  : `Create a new ${itemName.toLowerCase()}`}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {fields.map((field) => (
                <div key={field.key} className="space-y-2">
                  <Label htmlFor={field.key}>
                    {field.label} {field.required && "*"}
                  </Label>
                  {field.type === "textarea" ? (
                    <Textarea
                      id={field.key}
                      value={formData[field.key] || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [field.key]: e.target.value,
                        })
                      }
                      placeholder={field.placeholder}
                      required={field.required}
                    />
                  ) : field.type === "select" ? (
                    <Select
                      value={String(formData[field.key] || "")}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          [field.key]: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={field.placeholder} />
                      </SelectTrigger>
                      <SelectContent>
                        {relatedItems[field.key]?.map((item) => (
                          <SelectItem key={item.id} value={String(item.id)}>
                            {item[field.labelKey || "title"]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : field.type === "checkbox" ? (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={field.key}
                        checked={formData[field.key] || false}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            [field.key]: checked,
                          })
                        }
                      />
                    </div>
                  ) : (
                    <Input
                      id={field.key}
                      type={field.type}
                      value={
                        formData[field.key] ||
                        (field.type === "number" ? "0" : "")
                      }
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [field.key]:
                            field.type === "number"
                              ? Number(e.target.value)
                              : e.target.value,
                        })
                      }
                      placeholder={field.placeholder}
                      required={field.required}
                      min={field.type === "number" ? 0 : undefined}
                      step={field.type === "number" ? 1 : undefined}
                      pattern={field.pattern}
                      inputMode={field.inputMode}
                    />
                  )}
                </div>
              ))}

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingItem ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        <Input
          placeholder={`Search ${itemName.toLowerCase()}s...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  {displayFields.map((field) => (
                    <TableHead key={field.key}>{field.label}</TableHead>
                  ))}
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    {displayFields.map((field) => (
                      <TableCell key={field.key}>
                        {typeof item[field.key] === "number" ||
                        typeof item[field.key] === "string"
                          ? `${item[field.key]}${field.suffix || ""}`
                          : ""}
                      </TableCell>
                    ))}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
