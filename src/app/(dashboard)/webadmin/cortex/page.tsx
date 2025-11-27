"use client";

import { useState } from "react";
import {
  Brain,
  Plus,
  Search,
  Settings,
  Zap,
  Activity,
  MoreHorizontal,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data
const cortexItems = [
  {
    id: 1,
    name: "AI Model Server",
    type: "ML Infrastructure",
    status: "active",
    lastSync: "2024-01-15",
    requests: 15420,
  },
  {
    id: 2,
    name: "Data Pipeline",
    type: "ETL Service",
    status: "active",
    lastSync: "2024-01-15",
    requests: 8750,
  },
  {
    id: 3,
    name: "Analytics Engine",
    type: "Processing",
    status: "maintenance",
    lastSync: "2024-01-14",
    requests: 3200,
  },
];

const statusColors = {
  active: "bg-green-100 text-green-800",
  maintenance: "bg-amber-100 text-amber-800",
  inactive: "bg-gray-100 text-gray-800",
};

export default function CortexPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Brain className="h-7 w-7 text-primary-600" />
            Cortex
          </h1>
          <p className="text-gray-500 mt-1">
            AI ve makine öğrenimi altyapısı yönetimi
          </p>
        </div>
        <Button className="bg-primary-600 hover:bg-primary-700">
          <Plus className="h-4 w-4 mr-2" />
          Yeni Servis Ekle
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100">
                <Zap className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">3</p>
                <p className="text-sm text-gray-500">Toplam Servis</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <Activity className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">2</p>
                <p className="text-sm text-gray-500">Aktif Servis</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <Brain className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">27,370</p>
                <p className="text-sm text-gray-500">Toplam İstek</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                <Settings className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">99.9%</p>
                <p className="text-sm text-gray-500">Uptime</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Servis ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Services List */}
      <div className="grid gap-4">
        {cortexItems.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-purple-500">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.type}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <Badge className={statusColors[item.status as keyof typeof statusColors]}>
                    {item.status === "active" ? "Aktif" : item.status === "maintenance" ? "Bakımda" : "Pasif"}
                  </Badge>
                  <div className="text-sm text-gray-500">
                    <span className="font-medium text-gray-900">{item.requests.toLocaleString()}</span> istek
                  </div>
                  <div className="text-sm text-gray-500">
                    Son: {item.lastSync}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white">
                      <DropdownMenuItem>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Detayları Görüntüle
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Settings className="h-4 w-4 mr-2" />
                        Ayarlar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Placeholder for future configuration */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-lg">Cortex Yapılandırması</CardTitle>
          <CardDescription>
            Bu bölüm daha sonra detaylı olarak yapılandırılacaktır.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-sm">
            AI modelleri, veri işleme pipeline&apos;ları ve analitik motorları bu sayfadan yönetilecektir.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}


