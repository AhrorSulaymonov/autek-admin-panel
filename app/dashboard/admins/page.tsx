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
import { Plus, Search, Edit, Trash2, Upload, Eye, EyeOff } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";

interface Admin {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  username?: string;
  email: string;
  is_creator: boolean;
  image_url?: string;
}

export default function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    is_creator: false,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/auth/login";
      return;
    }
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No authentication token found");
        setError("Please log in again");
        setAdmins([]);
        return;
      }

      const response = await fetch("http://3.120.39.1:3000/api/admin", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        console.error("Unauthorized access");
        localStorage.removeItem("token"); // Clear invalid token
        window.location.href = "/auth/login"; // Redirect to login
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Failed to fetch admins");
        setAdmins([]);
        return;
      }

      const data = await response.json();
      setAdmins(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching admins:", error);
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in again");
      window.location.href = "/auth/login";
      return;
    }

    if (!editingAdmin && formData.password !== formData.confirm_password) {
      setError("Passwords do not match");
      return;
    }

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("first_name", formData.first_name.trim());
      formDataToSend.append("last_name", formData.last_name.trim());
      formDataToSend.append("phone", formData.phone.trim());
      formDataToSend.append("email", formData.email.trim());
      formDataToSend.append("is_creator", formData.is_creator.toString());

      if (formData.username.trim()) {
        formDataToSend.append("username", formData.username.trim());
      }

      if (!editingAdmin) {
        formDataToSend.append("password", formData.password);
        formDataToSend.append("confirm_password", formData.confirm_password);
      }

      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }

      const url = editingAdmin
        ? `http://3.120.39.1:3000/api/admin/${editingAdmin.id}`
        : "http://3.120.39.1:3000/api/admin";

      const response = await fetch(url, {
        method: editingAdmin ? "PATCH" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/auth/login";
        return;
      }

      if (response.ok) {
        setSuccess(
          editingAdmin
            ? "Admin updated successfully!"
            : "Admin created successfully!"
        );
        setIsDialogOpen(false);
        resetForm();
        fetchAdmins();
      } else {
        const errorData = await response.json();
        if (errorData.message?.includes("Unique constraint failed")) {
          setError("An admin with this email already exists");
        } else {
          setError(errorData.message || "Operation failed");
        }
      }
    } catch (error) {
      console.error("Error creating/updating admin:", error);
      setError("Network error occurred");
    }
  };

  const handleEdit = (admin: Admin) => {
    setEditingAdmin(admin);
    setFormData({
      first_name: admin.first_name,
      last_name: admin.last_name,
      phone: admin.phone,
      username: admin.username || "",
      email: admin.email,
      password: "",
      confirm_password: "",
      is_creator: admin.is_creator,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this admin?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://3.120.39.1:3000/api/admin/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setSuccess("Admin deleted successfully!");
        fetchAdmins();
      } else {
        setError("Failed to delete admin");
      }
    } catch (error) {
      setError("Network error occurred");
    }
  };

  const resetForm = () => {
    setFormData({
      first_name: "",
      last_name: "",
      phone: "",
      username: "",
      email: "",
      password: "",
      confirm_password: "",
      is_creator: false,
    });
    setEditingAdmin(null);
    setImageFile(null);
  };

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Administrators</h1>
          <p className="text-gray-600 mt-2">Manage system administrators</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Admin
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingAdmin ? "Edit Administrator" : "Add New Administrator"}
              </DialogTitle>
              <DialogDescription>
                {editingAdmin
                  ? "Update administrator information"
                  : "Create a new system administrator"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name *</Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) =>
                      setFormData({ ...formData, first_name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name *</Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) =>
                      setFormData({ ...formData, last_name: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>

              {!editingAdmin && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm_password">Confirm Password *</Label>
                    <div className="relative">
                      <Input
                        id="confirm_password"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirm_password}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            confirm_password: e.target.value,
                          })
                        }
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="image">Profile Image</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  />
                  <Upload className="w-4 h-4 text-gray-400" />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_creator"
                  checked={formData.is_creator}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_creator: checked as boolean })
                  }
                />
                <Label htmlFor="is_creator">Creator privileges</Label>
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
                  {editingAdmin ? "Update Admin" : "Create Admin"}
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
          <CardTitle>Administrators List</CardTitle>
          <CardDescription>
            Manage system administrators and their permissions
          </CardDescription>
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search administrators..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading administrators...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Avatar</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAdmins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell>
                      {admin.image_url ? (
                        <Image
                          src={admin.image_url || "/placeholder.svg"}
                          alt={`${admin.first_name} ${admin.last_name}`}
                          width={40}
                          height={40}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {admin.first_name.charAt(0)}
                            {admin.last_name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      {admin.first_name} {admin.last_name}
                    </TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>{admin.phone}</TableCell>
                    <TableCell>{admin.username || "N/A"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={admin.is_creator ? "default" : "secondary"}
                      >
                        {admin.is_creator ? "Creator" : "Admin"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(admin)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(admin.id)}
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
