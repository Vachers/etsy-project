"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Bot,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  ExternalLink,
  Play,
  Pause,
  Calendar,
  Zap,
  Clock,
  CheckCircle,
  Edit,
  Trash2,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data
const automationProjects = [
  {
    id: "auto-1",
    name: "E-posta Otomasyonu",
    description: "Müşteri e-posta kampanyaları",
    status: "running",
    runs: 1520,
    successRate: 98.5,
    lastRun: "2024-01-15 14:30",
    schedule: "Her gün 09:00",
  },
  {
    id: "auto-2",
    name: "Veri Senkronizasyonu",
    description: "Platform arası veri aktarımı",
    status: "running",
    runs: 3200,
    successRate: 99.2,
    lastRun: "2024-01-15 15:00",
    schedule: "Her saat",
  },
  {
    id: "auto-3",
    name: "Rapor Oluşturma",
    description: "Haftalık performans raporları",
    status: "paused",
    runs: 52,
    successRate: 100,
    lastRun: "2024-01-08 09:00",
    schedule: "Her Pazartesi 09:00",
  },
  {
    id: "auto-4",
    name: "Sosyal Medya Paylaşımı",
    description: "Otomatik içerik paylaşımı",
    status: "running",
    runs: 890,
    successRate: 95.8,
    lastRun: "2024-01-15 12:00",
    schedule: "Her 6 saatte",
  },
  {
    id: "auto-5",
    name: "Yedekleme Sistemi",
    description: "Veritabanı yedekleme",
    status: "running",
    runs: 365,
    successRate: 100,
    lastRun: "2024-01-15 03:00",
    schedule: "Her gün 03:00",
  },
];

const statusConfig = {
  running: { label: "Çalışıyor", color: "bg-green-100 text-green-800", icon: Play },
  paused: { label: "Durduruldu", color: "bg-amber-100 text-amber-800", icon: Pause },
  error: { label: "Hata", color: "bg-red-100 text-red-800", icon: Pause },
};

export default function AutomationsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [automations, setAutomations] = useState(automationProjects);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAutomation, setNewAutomation] = useState({
    name: "",
    description: "",
    schedule: "",
    status: "paused",
  });

  const filteredProjects = automations.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalRuns = automations.reduce((sum, p) => sum + p.runs, 0);
  const avgSuccessRate = automations.reduce((sum, p) => sum + p.successRate, 0) / automations.length;

  const handleCreateAutomation = () => {
    if (!newAutomation.name) return;

    const automation = {
      id: `auto-${Date.now()}`,
      name: newAutomation.name,
      description: newAutomation.description,
      status: newAutomation.status,
      runs: 0,
      successRate: 0,
      lastRun: "-",
      schedule: newAutomation.schedule || "Manuel",
    };

    setAutomations([...automations, automation]);
    setIsDialogOpen(false);
    setNewAutomation({ name: "", description: "", schedule: "", status: "paused" });
  };

  const handleProjectClick = (projectId: string) => {
    router.push(`/projects/${projectId}`);
  };

  const toggleAutomationStatus = (id: string) => {
    setAutomations(automations.map(a => 
      a.id === id 
        ? { ...a, status: a.status === "running" ? "paused" : "running" }
        : a
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Bot className="h-7 w-7 text-primary-600" />
            Otomasyonlar
          </h1>
          <p className="text-gray-500 mt-1">
            Otomasyon süreçlerinizi yönetin ve izleyin
          </p>
        </div>
        <Button 
          className="bg-primary-600 hover:bg-primary-700"
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Yeni Otomasyon
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary-50 to-white border-primary-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100">
                <Bot className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{automations.length}</div>
                <p className="text-sm text-gray-500">Toplam Otomasyon</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-white border-green-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <Play className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {automations.filter((p) => p.status === "running").length}
                </div>
                <p className="text-sm text-gray-500">Aktif</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <Zap className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{totalRuns.toLocaleString()}</div>
                <p className="text-sm text-gray-500">Toplam Çalışma</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-50 to-white border-emerald-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{avgSuccessRate.toFixed(1)}%</div>
                <p className="text-sm text-gray-500">Başarı Oranı</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Otomasyon ara..."
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

      {/* Automations List */}
      <div className="grid gap-4">
        {filteredProjects.map((project) => {
          const StatusIcon = statusConfig[project.status as keyof typeof statusConfig].icon;
          return (
            <Card 
              key={project.id} 
              className="hover:shadow-lg transition-all cursor-pointer group border-2 hover:border-primary-200"
              onClick={() => handleProjectClick(project.id)}
            >
              <CardContent className="p-5">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-600 group-hover:to-pink-600 transition-all">
                      <Bot className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors flex items-center gap-1">
                        {project.name}
                        <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </h3>
                      <p className="text-sm text-gray-500">{project.description}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <Badge className={statusConfig[project.status as keyof typeof statusConfig].color}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {statusConfig[project.status as keyof typeof statusConfig].label}
                    </Badge>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Zap className="h-4 w-4" />
                        <span className="font-medium text-gray-900">{project.runs.toLocaleString()}</span> çalışma
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="font-medium text-gray-900">{project.successRate}%</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {project.schedule}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {project.lastRun}
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
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); toggleAutomationStatus(project.id); }}>
                          {project.status === "running" ? (
                            <>
                              <Pause className="h-4 w-4 mr-2" />
                              Durdur
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4 mr-2" />
                              Başlat
                            </>
                          )}
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
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <Bot className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Otomasyon Bulunamadı</h3>
          <p className="text-gray-500 mt-1">Arama kriterlerinize uygun otomasyon yok.</p>
          <Button onClick={() => setIsDialogOpen(true)} className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Yeni Otomasyon Oluştur
          </Button>
        </div>
      )}

      {/* Create Automation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-white sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Yeni Otomasyon Oluştur</DialogTitle>
            <DialogDescription>
              Yeni bir otomasyon süreci eklemek için bilgileri doldurun.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Otomasyon Adı *</Label>
              <Input
                id="name"
                value={newAutomation.name}
                onChange={(e) => setNewAutomation({ ...newAutomation, name: e.target.value })}
                placeholder="Otomasyon adı"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Açıklama</Label>
              <Textarea
                id="description"
                value={newAutomation.description}
                onChange={(e) => setNewAutomation({ ...newAutomation, description: e.target.value })}
                placeholder="Otomasyon açıklaması"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Başlangıç Durumu</Label>
                <Select
                  value={newAutomation.status}
                  onValueChange={(value) => setNewAutomation({ ...newAutomation, status: value })}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="paused">Durdurulmuş</SelectItem>
                    <SelectItem value="running">Çalışıyor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="schedule">Zamanlama</Label>
                <Input
                  id="schedule"
                  value={newAutomation.schedule}
                  onChange={(e) => setNewAutomation({ ...newAutomation, schedule: e.target.value })}
                  placeholder="Örn: Her gün 09:00"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              İptal
            </Button>
            <Button onClick={handleCreateAutomation} disabled={!newAutomation.name}>
              Oluştur
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
