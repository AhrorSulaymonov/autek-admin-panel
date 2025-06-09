"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Package,
  Tags,
  Users,
  Palette,
  Bookmark,
  HardDrive,
  Cpu,
  Monitor,
  Car,
  Navigation,
  Image as ImageIcon,
  LogOut,
} from "lucide-react";

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/products", label: "Products", icon: Package },
  { href: "/dashboard/categories", label: "Categories", icon: Tags },
  { href: "/dashboard/admins", label: "Admins", icon: Users },
  { href: "/dashboard/colors", label: "Colors", icon: Palette },
  { href: "/dashboard/brands", label: "Brands", icon: Bookmark },
  { href: "/dashboard/ram", label: "RAM", icon: Cpu },
  { href: "/dashboard/memory", label: "Memory", icon: HardDrive },
  { href: "/dashboard/screen-types", label: "Screen Types", icon: Monitor },
  {
    href: "/dashboard/screen-diagonal",
    label: "Screen Diagonal",
    icon: Monitor,
  },
  { href: "/dashboard/car-brands", label: "Car Brands", icon: Car },
  {
    href: "/dashboard/navigation-systems",
    label: "Navigation Systems",
    icon: Navigation,
  },
  {
    href: "/dashboard/product-images",
    label: "Product Images",
    icon: ImageIcon,
  },
];

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token) {
      router.push("/login");
      return;
    }

    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
      }
    }

    setMounted(true);
  }, [router]);

  if (!mounted) {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg flex flex-col">
          {/* Header */}
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold text-gray-900">Autek Admin</h1>
            {user && (
              <p className="text-sm text-gray-600 mt-1">
                Welcome, {user.first_name}
              </p>
            )}
      </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <div className="px-4 mb-4">
              <h2 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Menu
              </h2>
            </div>
            <div className="space-y-1 px-3">
              {menuItems.map((item) => {
                const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
                    key={item.href}
              href={item.href}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
                    {Icon && (
                      <Icon
                        className={`w-5 h-5 mr-3 ${
                          isActive ? "text-blue-700" : "text-gray-500"
                        }`}
                      />
                    )}
                    <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
            </div>
      </nav>

          {/* Footer */}
      <div className="p-4 border-t">
        <Button
              variant="outline"
              className="w-full flex items-center justify-center text-sm font-medium"
          onClick={handleLogout}
        >
              <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>

      {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
