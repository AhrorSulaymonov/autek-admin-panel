"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/api";
import { Package, Tags, Users, Palette } from "lucide-react";

interface Stats {
  products: number;
  categories: number;
  admins: number;
  colors: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    products: 0,
    categories: 0,
    admins: 0,
    colors: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [products, categories, admins, colors] = await Promise.all([
          api.get("/product"),
          api.get("/category"),
          api.get("/admin"),
          api.get("/color"),
        ]);

        setStats({
          products: Array.isArray(products.data) ? products.data.length : 0,
          categories: Array.isArray(categories.data)
            ? categories.data.length
            : 0,
          admins: Array.isArray(admins.data) ? admins.data.length : 0,
          colors: Array.isArray(colors.data) ? colors.data.length : 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const stats_cards = [
    {
      title: "Total Products",
      value: stats.products,
      icon: Package,
      color: "text-blue-600",
    },
    {
      title: "Categories",
      value: stats.categories,
      icon: Tags,
      color: "text-green-600",
    },
    {
      title: "Admins",
      value: stats.admins,
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Colors",
      value: stats.colors,
      icon: Palette,
      color: "text-orange-600",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats_cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  {card.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
