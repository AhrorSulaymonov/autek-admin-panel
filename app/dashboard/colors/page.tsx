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
import { ColorPicker } from "@/components/ui/color-picker";

interface Color {
  id: number;
  title: string;
  hex: string;
  rgb: string;
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return null;
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  return `rgb(${r}, ${g}, ${b})`;
}

export default function ColorsPage() {
  const [colors, setColors] = useState<Color[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingColor, setEditingColor] = useState<Color | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    hex: "#000000",
    rgb: "rgb(0, 0, 0)",
  });

  useEffect(() => {
    fetchColors();
  }, []);

  const fetchColors = async () => {
    try {
      const response = await fetch("http://3.66.28.183:3333/api/color");
      const data = await response.json();
      setColors(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching colors:", error);
      setColors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");

      const url = editingColor
        ? `http://3.66.28.183:3333/api/color/${editingColor.id}`
        : "http://3.66.28.183:3333/api/color";

      const response = await fetch(url, {
        method: editingColor ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(
          editingColor
            ? "Color updated successfully!"
            : "Color created successfully!"
        );
        setIsDialogOpen(false);
        resetForm();
        fetchColors();
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Operation failed");
      }
    } catch (error) {
      setError("Network error occurred");
    }
  };

  const handleEdit = (color: Color) => {
    setEditingColor(color);
    setFormData({
      title: color.title,
      hex: color.hex,
      rgb: color.rgb,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this color?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://3.66.28.183:3333/api/color/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setSuccess("Color deleted successfully!");
        fetchColors();
      } else {
        setError("Failed to delete color");
      }
    } catch (error) {
      setError("Network error occurred");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      hex: "#000000",
      rgb: "rgb(0, 0, 0)",
    });
    setEditingColor(null);
  };

  const handleColorChange = (hex: string) => {
    const rgb = hexToRgb(hex);
    if (rgb) {
      setFormData({
        ...formData,
        hex,
        rgb,
      });
    }
  };

  const filteredColors = colors.filter((color) =>
    color.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Colors</h1>
          <p className="text-gray-600 mt-2">Manage product colors</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Color
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingColor ? "Edit Color" : "Add New Color"}
              </DialogTitle>
              <DialogDescription>
                {editingColor
                  ? "Update color information"
                  : "Create a new color option"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="title">Color Name *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g., Red, Blue, Green"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Color Picker *</Label>
                <div className="flex items-center space-x-4">
                  <ColorPicker
                    color={formData.hex}
                    onChange={handleColorChange}
                  />
                  <div className="space-y-2 flex-1">
                    <Input
                      value={formData.hex}
                      onChange={(e) => handleColorChange(e.target.value)}
                      placeholder="#FF0000"
                      className="font-mono"
                    />
                    <Input
                      value={formData.rgb}
                      readOnly
                      className="font-mono bg-muted"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingColor ? "Update Color" : "Create Color"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Colors List</CardTitle>
          <CardDescription>Manage available product colors</CardDescription>
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search colors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading colors...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredColors.map((color) => (
                <div
                  key={color.id}
                  className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className="w-16 h-16 rounded-lg border"
                      style={{ backgroundColor: color.hex }}
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-lg">{color.title}</h3>
                      <p className="text-sm text-gray-500 font-mono">
                        {color.hex}
                      </p>
                      <p className="text-sm text-gray-500 font-mono">
                        {color.rgb}
                      </p>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(color)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(color.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
