"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  FolderKanban,
  Calendar,
  DollarSign,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { StatusBadge, PriorityBadge } from "@/components/common";
import { formatCurrency, cn } from "@/lib/utils";
import type { StatusType, PriorityType } from "@/types";

interface Project {
  id: string;
  title: string;
  description: string;
  status: StatusType;
  priority: PriorityType;
  budget: number;
  spent: number;
  progress: number;
  startDate: Date;
  endDate: Date;
  tasksCount: number;
  completedTasks: number;
}

const mockProjects: Project[] = [
  {
    id: "1",
    title: "E-Ticaret Website Geliştirme",
    description: "Shopify entegrasyonlu yeni e-ticaret platformu",
    status: "active",
    priority: "high",
    budget: 50000,
    spent: 32000,
    progress: 65,
    startDate: new Date("2024-01-15"),
    endDate: new Date("2024-03-30"),
    tasksCount: 24,
    completedTasks: 16,
  },
  {
    id: "2",
    title: "Logo & Marka Kimliği",
    description: "Yeni marka için kurumsal kimlik tasarımı",
    status: "completed",
    priority: "medium",
    budget: 15000,
    spent: 14500,
    progress: 100,
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-02-15"),
    tasksCount: 8,
    completedTasks: 8,
  },
  {
    id: "3",
    title: "Mobil Uygulama UI/UX",
    description: "iOS ve Android için kullanıcı arayüzü tasarımı",
    status: "active",
    priority: "critical",
    budget: 75000,
    spent: 28000,
    progress: 40,
    startDate: new Date("2024-02-01"),
    endDate: new Date("2024-05-15"),
    tasksCount: 32,
    completedTasks: 12,
  },
  {
    id: "4",
    title: "SEO Optimizasyonu",
    description: "Website için kapsamlı SEO çalışması",
    status: "pending",
    priority: "low",
    budget: 8000,
    spent: 0,
    progress: 0,
    startDate: new Date("2024-03-01"),
    endDate: new Date("2024-04-15"),
    tasksCount: 12,
    completedTasks: 0,
  },
  {
    id: "5",
    title: "Sosyal Medya Kampanyası",
    description: "Q1 2024 dijital pazarlama kampanyası",
    status: "draft",
    priority: "medium",
    budget: 25000,
    spent: 0,
    progress: 0,
    startDate: new Date("2024-03-15"),
    endDate: new Date("2024-06-15"),
    tasksCount: 18,
    completedTasks: 0,
  },
];

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  const filteredProjects = mockProjects.filter((project) => {
    const matchesSearch = project.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || project.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || project.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projeler</h1>
          <p className="text-sm text-gray-500 mt-1">
            Tüm projelerinizi buradan yönetin
          </p>
        </div>
        <Button className="gap-2 bg-gradient-primary hover:opacity-90">
          <Plus className="h-4 w-4" />
          Yeni Proje
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Proje ara..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Durum" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm Durumlar</SelectItem>
            <SelectItem value="draft">Taslak</SelectItem>
            <SelectItem value="active">Aktif</SelectItem>
            <SelectItem value="pending">Beklemede</SelectItem>
            <SelectItem value="completed">Tamamlandı</SelectItem>
            <SelectItem value="cancelled">İptal</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Öncelik" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm Öncelikler</SelectItem>
            <SelectItem value="low">Düşük</SelectItem>
            <SelectItem value="medium">Orta</SelectItem>
            <SelectItem value="high">Yüksek</SelectItem>
            <SelectItem value="critical">Kritik</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filtreler
        </Button>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <Card
            key={project.id}
            className="group hover:shadow-card-hover transition-all duration-200"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg line-clamp-1">
                    {project.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {project.description}
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="gap-2">
                      <Eye className="h-4 w-4" />
                      Görüntüle
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2">
                      <Edit className="h-4 w-4" />
                      Düzenle
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="gap-2 text-red-600">
                      <Trash2 className="h-4 w-4" />
                      Sil
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <StatusBadge status={project.status} />
                <PriorityBadge priority={project.priority} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">İlerleme</span>
                  <span className="font-medium">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>

              {/* Budget */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-500">
                  <DollarSign className="h-4 w-4" />
                  <span>Bütçe</span>
                </div>
                <div className="text-right">
                  <span className="font-medium">
                    {formatCurrency(project.spent)}
                  </span>
                  <span className="text-gray-400">
                    {" "}
                    / {formatCurrency(project.budget)}
                  </span>
                </div>
              </div>

              {/* Tasks */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-500">
                  <FolderKanban className="h-4 w-4" />
                  <span>Görevler</span>
                </div>
                <span className="font-medium">
                  {project.completedTasks} / {project.tasksCount}
                </span>
              </div>

              {/* Dates */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>Bitiş</span>
                </div>
                <span className="font-medium">
                  {format(project.endDate, "d MMM yyyy", { locale: tr })}
                </span>
              </div>

              {/* View Button */}
              <Link href={`/projects/${project.id}`}>
                <Button variant="outline" className="w-full mt-2">
                  Detayları Gör
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FolderKanban className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Proje bulunamadı</h3>
          <p className="text-sm text-gray-500 mt-1">
            Arama kriterlerinize uygun proje bulunmuyor.
          </p>
          <Button className="mt-4 gap-2">
            <Plus className="h-4 w-4" />
            Yeni Proje Oluştur
          </Button>
        </div>
      )}
    </div>
  );
}

