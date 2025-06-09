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
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Upload, Star } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";

interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
  is_main: boolean;
  product?: { id: number; title: string };
}

interface Product {
  id: number;
  title: string;
}

const imageLoader = ({ src }: { src: string }) => {
  return src;
};

export default function ProductImagesPage() {
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<ProductImage | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    product_id: "",
    is_main: false,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchProductImages(selectedProduct);
    if (selectedProduct) {
      setFormData((prev) => ({ ...prev, product_id: selectedProduct }));
    }
  }, [selectedProduct]);

  const fetchProductImages = async (productId?: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!productId) {
        setProductImages([]);
        return;
      }
      console.log("Fetching images for product:", productId);
      const response = await fetch(
        `http://3.66.28.183:3333/api/product-image?productId=${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Response status:", response.status);
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        setError(errorData.message || "Failed to fetch product images");
        setProductImages([]);
        return;
      }
      const data = await response.json();
      console.log("Setting product images:", data);
      setProductImages(Array.isArray(data) ? data : []);
      console.log("Product images state updated");
    } catch (error) {
      console.error("Error fetching product images:", error);
      setProductImages([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://3.66.28.183:3333/api/product", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Failed to fetch products");
        setProducts([]);
        return;
      }
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.product_id || parseInt(formData.product_id) < 1) {
      setError("Please select a product");
      return;
    }

    if (!editingImage && !imageFile) {
      setError("Please select an image file");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();

      formDataToSend.append("product_id", formData.product_id);
      formDataToSend.append("is_main", formData.is_main.toString());

      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }

      const url = editingImage
        ? `http://3.66.28.183:3333/api/product-image/${editingImage.id}`
        : "http://3.66.28.183:3333/api/product-image";

      const response = await fetch(url, {
        method: editingImage ? "PATCH" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (response.ok) {
        setSuccess(
          editingImage
            ? "Product image updated successfully!"
            : "Product image uploaded successfully!"
        );
        setIsDialogOpen(false);
        resetForm();
        fetchProductImages(formData.product_id);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Operation failed");
      }
    } catch (error) {
      setError("Network error occurred");
    }
  };

  const handleEdit = (image: ProductImage) => {
    setEditingImage(image);
    setFormData({
      product_id: image.product_id.toString(),
      is_main: image.is_main,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://3.66.28.183:3333/api/product-image/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setSuccess("Product image deleted successfully!");
        fetchProductImages(selectedProduct);
      } else {
        setError("Failed to delete product image");
      }
    } catch (error) {
      setError("Network error occurred");
    }
  };

  const resetForm = () => {
    setFormData({
      product_id: selectedProduct || "",
      is_main: false,
    });
    setEditingImage(null);
    setImageFile(null);
  };

  const filteredImages = productImages.filter((image) => {
    if (!searchTerm) return true;
    return image.product?.title
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
  });

  console.log("Filtered images:", filteredImages);
  console.log("Selected product:", selectedProduct);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Images</h1>
          <p className="text-gray-600 mt-2">
            Manage product images and galleries
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} disabled={!selectedProduct}>
              <Plus className="mr-2 h-4 w-4" />
              Add Image
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingImage ? "Edit Product Image" : "Add New Product Image"}
              </DialogTitle>
              <DialogDescription>
                {editingImage
                  ? "Update product image information"
                  : "Upload a new product image"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="product_id">Product *</Label>
                <Select
                  value={formData.product_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, product_id: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem
                        key={product.id}
                        value={product.id.toString()}
                      >
                        {product.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {!editingImage && (
                <div className="space-y-2">
                  <Label htmlFor="image">Image File *</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setImageFile(e.target.files?.[0] || null)
                      }
                      required
                    />
                    <Upload className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_main"
                  checked={formData.is_main}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_main: checked as boolean })
                  }
                />
                <Label htmlFor="is_main">Set as main image</Label>
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
                  {editingImage ? "Update Image" : "Upload Image"}
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
          <CardTitle>Product Images List</CardTitle>
          <CardDescription>
            Manage product images and set main images
          </CardDescription>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
              <SelectTrigger className="max-w-xs">
                <SelectValue placeholder="Select a product to view images" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id.toString()}>
                    {product.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {!selectedProduct ? (
            <div className="text-center py-6 text-gray-500">
              Please select a product to view its images
            </div>
          ) : loading ? (
            <div>Loading product images...</div>
          ) : productImages.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              No images found for this product
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productImages.map((image) => (
                  <TableRow key={image.id}>
                    <TableCell>
                      <Image
                        loader={imageLoader}
                        src={image.image_url || "/placeholder.svg"}
                        alt="Product image"
                        width={60}
                        height={60}
                        className="rounded object-cover"
                        unoptimized
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {image.product?.title ||
                        `Product ID: ${image.product_id}`}
                    </TableCell>
                    <TableCell>
                      {image.is_main ? (
                        <Badge className="bg-yellow-100 text-yellow-800">
                          <Star className="w-3 h-3 mr-1" />
                          Main Image
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Gallery</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(image)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(image.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
