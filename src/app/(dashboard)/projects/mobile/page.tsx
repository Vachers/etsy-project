"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Smartphone,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  ExternalLink,
  Apple,
  Play,
  Calendar,
  Download,
  Edit,
  Trash2,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data
const mobileProjects = [
  {
    id: "mobile-1",
    name: "E-Ticaret App",
    description: "iOS ve Android alışveriş uygulaması",
    status: "active",
    progress: 85,
    platforms: ["ios", "android"],
    downloads: 15420,
    lastUpdate: "2024-01-15",
  },
  {
    id: "mobile-2",
    name: "Fitness Tracker",
    description: "Sağlık ve fitness takip uygulaması",
    status: "development",
    progress: 60,
    platforms: ["ios", "android"],
    downloads: 0,
    lastUpdate: "2024-01-14",
  },
  {
    id: "mobile-3",
    name: "Kurumsal Portal",
    description: "Şirket içi iletişim uygulaması",
    status: "active",
    progress: 100,
    platforms: ["ios"],
    downloads: 850,
    lastUpdate: "2024-01-13",
  },
  {
    id: "mobile-4",
    name: "Delivery App",
    description: "Teslimat takip uygulaması",
    status: "planning",
    progress: 20,
    platforms: ["android"],
    downloads: 0,
    lastUpdate: "2024-01-12",
  },
];

const statusConfig = {
  active: { label: "Yayında", color: "bg-green-100 text-green-800" },
  development: { label: "Geliştirme", color: "bg-blue-100 text-blue-800" },
  planning: { label: "Planlama", color: "bg-amber-100 text-amber-800" },
  paused: { label: "Durduruldu", color: "bg-gray-100 text-gray-800" },
};

export default function MobileProjectsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [projects, setProjects] = useState(mobileProjects);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    status: "planning",
    ios: false,
    android: false,
  });

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateProject = () => {
    if (!newProject.name) return;

    const platforms: string[] = [];
    if (newProject.ios) platforms.push("ios");
    if (newProject.android) platforms.push("android");

    const project = {
      id: `mobile-${Date.now()}`,
      name: newProject.name,
      description: newProject.description,
      status: newProject.status,
      progress: 0,
      platforms,
      downloads: 0,
      lastUpdate: new Date().toISOString().split("T")[0],
    };

    setProjects([...projects, project]);
    setIsDialogOpen(false);
    setNewProject({ name: "", description: "", status: "planning", ios: false, android: false });
  };

  const handleProjectClick = (projectId: string) => {
    router.push(`/projects/${projectId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Smartphone className="h-7 w-7 text-primary-600" />
            Mobil Projeler
          </h1>
          <p className="text-gray-500 mt-1">
            iOS ve Android uygulamalarınızı yönetin
          </p>
        </div>
        <Button 
          className="bg-primary-600 hover:bg-primary-700"
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Yeni Mobil Proje
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-gray-50 to-white">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-900">{projects.length}</div>
            <p className="text-sm text-gray-500">Toplam Proje</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-white border-green-100">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {projects.filter((p) => p.status === "active").length}
            </div>
            <p className="text-sm text-gray-500">Yayında</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {projects.reduce((sum, p) => sum + p.downloads, 0).toLocaleString()}
            </div>
            <p className="text-sm text-gray-500">Toplam İndirme</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-100">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {projects.filter((p) => p.platforms.includes("ios")).length}
            </div>
            <p className="text-sm text-gray-500">iOS App</p>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Proje ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="shrink-0">
          <Filter className="h-4 w-4 mr-2" />
          Filtrele
        </Button>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {filteredProjects.map((project) => (
          <Card 
            key={project.id} 
            className="hover:shadow-lg transition-all cursor-pointer group border-2 hover:border-primary-200"
            onClick={() => handleProjectClick(project.id)}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 group-hover:from-blue-600 group-hover:to-purple-600 transition-all">
                    <Smartphone className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors flex items-center gap-1">
                      {project.name}
                      <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <p className="text-sm text-gray-500">{project.description}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white">
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleProjectClick(project.id); }}>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Detayları Gör
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                      <Edit className="h-4 w-4 mr-2" />
                      Düzenle
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={(e) => e.stopPropagation()} className="text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Sil
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <Badge className={statusConfig[project.status as keyof typeof statusConfig].color}>
                    {statusConfig[project.status as keyof typeof statusConfig].label}
                  </Badge>
                  <span className="text-gray-500">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />

                <div className="flex items-center gap-2 mt-3">
                  {project.platforms.includes("ios") && (
                    <Badge variant="outline" className="text-xs">
                      <Apple className="h-3 w-3 mr-1" />
                      iOS
                    </Badge>
                  )}
                  {project.platforms.includes("android") && (
                    <Badge variant="outline" className="text-xs">
                      <Play className="h-3 w-3 mr-1" />
                      Android
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
                  <div className="flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    {project.downloads.toLocaleString()} indirme
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {project.lastUpdate}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <Smartphone className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Proje Bulunamadı</h3>
          <p className="text-gray-500 mt-1">Arama kriterlerinize uygun proje yok.</p>
          <Button onClick={() => setIsDialogOpen(true)} className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Yeni Proje Oluştur
          </Button>
        </div>
      )}

      {/* Create Project Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-white sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Yeni Mobil Proje Oluştur</DialogTitle>
            <DialogDescription>
              Yeni bir mobil uygulama projesi eklemek için bilgileri doldurun.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Proje Adı *</Label>
              <Input
                id="name"
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                placeholder="Proje adı"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Açıklama</Label>
              <Textarea
                id="description"
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                placeholder="Proje açıklaması"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Durum</Label>
              <Select
                value={newProject.status}
                onValueChange={(value) => setNewProject({ ...newProject, status: value })}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="planning">Planlama</SelectItem>
                  <SelectItem value="development">Geliştirme</SelectItem>
                  <SelectItem value="active">Yayında</SelectItem>
                  <SelectItem value="paused">Durduruldu</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Platformlar</Label>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="ios"
                    checked={newProject.ios}
                    onCheckedChange={(checked) => setNewProject({ ...newProject, ios: !!checked })}
                  />
                  <Label htmlFor="ios" className="flex items-center gap-1 cursor-pointer">
                    <Apple className="h-4 w-4" /> iOS
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="android"
                    checked={newProject.android}
                    onCheckedChange={(checked) => setNewProject({ ...newProject, android: !!checked })}
                  />
                  <Label htmlFor="android" className="flex items-center gap-1 cursor-pointer">
                    <Play className="h-4 w-4" /> Android
                  </Label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              İptal
            </Button>
            <Button onClick={handleCreateProject} disabled={!newProject.name}>
              Oluştur
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
