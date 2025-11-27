"use client";

import { useState } from "react";
import {
  Users,
  Plus,
  Search,
  MoreHorizontal,
  Mail,
  Phone,
  Shield,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  FolderKanban,
  X,
  Check,
  ChevronDown,
  Copy,
  Key,
  Package,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

// Types
interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "admin" | "member" | "viewer";
  avatar?: string;
  status: "active" | "inactive" | "pending";
  assignedProjects: string[];
  createdAt: Date;
  inviteToken?: string;
  tokenExpiresAt?: Date;
}

// Generate random token
const generateToken = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
};

interface Project {
  id: string;
  name: string;
  category: string;
}

// Mock data
const mockProjects: Project[] = [
  { id: "proj-1", name: "React ile Modern Web Geliştirme", category: "E-book" },
  { id: "proj-2", name: "UI/UX Design Kit Pro", category: "Digital Product" },
  { id: "proj-3", name: "Complete Business Bundle", category: "Bundle" },
  { id: "proj-4", name: "YouTube Kanal Kiti", category: "YouTube" },
  { id: "proj-5", name: "Social Media Templates", category: "Social Media" },
  { id: "proj-6", name: "Indie Game Starter Kit", category: "Game" },
  { id: "proj-7", name: "Müzik Prodüksiyon Paketi", category: "Music" },
  { id: "proj-8", name: "Otomatik Tweet Botu", category: "Script" },
];

const mockTeamMembers: TeamMember[] = [
  {
    id: "member-1",
    name: "Ahmet Yılmaz",
    email: "ahmet@example.com",
    phone: "+90 532 123 4567",
    role: "admin",
    status: "active",
    assignedProjects: ["proj-1", "proj-2", "proj-3"],
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "member-2",
    name: "Elif Demir",
    email: "elif@example.com",
    phone: "+90 533 234 5678",
    role: "member",
    status: "active",
    assignedProjects: ["proj-4", "proj-5"],
    createdAt: new Date("2024-02-20"),
  },
  {
    id: "member-3",
    name: "Mehmet Kaya",
    email: "mehmet@example.com",
    role: "member",
    status: "active",
    assignedProjects: ["proj-6"],
    createdAt: new Date("2024-03-10"),
  },
  {
    id: "member-4",
    name: "Ayşe Öztürk",
    email: "ayse@example.com",
    role: "viewer",
    status: "pending",
    assignedProjects: [],
    createdAt: new Date("2024-04-05"),
  },
  {
    id: "member-5",
    name: "Can Aydın",
    email: "can@example.com",
    phone: "+90 535 456 7890",
    role: "member",
    status: "inactive",
    assignedProjects: ["proj-7", "proj-8"],
    createdAt: new Date("2024-03-25"),
  },
];

const roleLabels = {
  admin: { label: "Admin", color: "bg-purple-100 text-purple-700" },
  member: { label: "Üye", color: "bg-primary-100 text-primary-700" },
  viewer: { label: "İzleyici", color: "bg-gray-100 text-gray-700" },
};

const statusLabels = {
  active: { label: "Aktif", color: "bg-secondary-100 text-secondary-700" },
  inactive: { label: "Pasif", color: "bg-gray-100 text-gray-600" },
  pending: { label: "Beklemede", color: "bg-amber-100 text-amber-700" },
};

// Digital products list
const mockDigitalProducts = [
  { id: "dp-1", name: "React ile Modern Web Geliştirme", category: "E-book" },
  { id: "dp-2", name: "UI/UX Design Kit Pro", category: "Digital Product" },
  { id: "dp-3", name: "Complete Business Bundle", category: "Bundle" },
  { id: "dp-4", name: "YouTube Kanal Kiti", category: "YouTube" },
  { id: "dp-5", name: "Social Media Templates", category: "Social Media" },
  { id: "dp-6", name: "Indie Game Starter Kit", category: "Game" },
  { id: "dp-7", name: "Müzik Prodüksiyon Paketi", category: "Music" },
  { id: "dp-8", name: "Otomatik Tweet Botu", category: "Script" },
];

export default function TeamPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [members, setMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [projectSearchQuery, setProjectSearchQuery] = useState("");
  const [projectDialogTab, setProjectDialogTab] = useState<"projects" | "products">("projects");
  
  // Token display state
  const [showTokenDialog, setShowTokenDialog] = useState(false);
  const [generatedToken, setGeneratedToken] = useState("");
  const [tokenCopied, setTokenCopied] = useState(false);
  
  // New member form state
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    phone: "",
    role: "member" as TeamMember["role"],
  });

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter projects based on search
  const filteredProjects = mockProjects.filter((project) =>
    project.name.toLowerCase().includes(projectSearchQuery.toLowerCase()) ||
    project.category.toLowerCase().includes(projectSearchQuery.toLowerCase())
  );

  const filteredDigitalProducts = mockDigitalProducts.filter((product) =>
    product.name.toLowerCase().includes(projectSearchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(projectSearchQuery.toLowerCase())
  );

  const handleAddMember = () => {
    const token = generateToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Token expires in 7 days
    
    const member: TeamMember = {
      id: `member-${Date.now()}`,
      ...newMember,
      status: "pending",
      assignedProjects: [],
      createdAt: new Date(),
      inviteToken: token,
      tokenExpiresAt: expiresAt,
    };
    setMembers([...members, member]);
    setNewMember({ name: "", email: "", phone: "", role: "member" });
    setIsAddDialogOpen(false);
    
    // Show token dialog
    setGeneratedToken(token);
    setShowTokenDialog(true);
  };

  const copyToken = () => {
    navigator.clipboard.writeText(generatedToken);
    setTokenCopied(true);
    setTimeout(() => setTokenCopied(false), 2000);
  };

  const handleOpenProjectDialog = (member: TeamMember) => {
    setSelectedMember(member);
    setSelectedProjects(member.assignedProjects);
    setIsProjectDialogOpen(true);
  };

  const handleSaveProjects = () => {
    if (selectedMember) {
      setMembers(
        members.map((m) =>
          m.id === selectedMember.id
            ? { ...m, assignedProjects: selectedProjects }
            : m
        )
      );
      setIsProjectDialogOpen(false);
      setSelectedMember(null);
    }
  };

  const handleDeleteMember = (memberId: string) => {
    setMembers(members.filter((m) => m.id !== memberId));
  };

  const handleToggleStatus = (memberId: string) => {
    setMembers(
      members.map((m) =>
        m.id === memberId
          ? { ...m, status: m.status === "active" ? "inactive" : "active" }
          : m
      )
    );
  };

  const getProjectById = (id: string) => mockProjects.find((p) => p.id === id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ekip Yönetimi</h1>
          <p className="text-sm text-gray-500 mt-1">
            Ekip üyelerini yönetin ve projelere atayın
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <UserPlus className="h-4 w-4" />
              Üye Ekle
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yeni Ekip Üyesi</DialogTitle>
              <DialogDescription>
                Ekibe yeni bir üye ekleyin. Davet e-postası gönderilecektir.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Ad Soyad</Label>
                <Input
                  id="name"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  placeholder="Ahmet Yılmaz"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-posta</Label>
                <Input
                  id="email"
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  placeholder="ahmet@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefon (Opsiyonel)</Label>
                <Input
                  id="phone"
                  value={newMember.phone}
                  onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                  placeholder="+90 5XX XXX XXXX"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Rol</Label>
                <Select
                  value={newMember.role}
                  onValueChange={(value: TeamMember["role"]) =>
                    setNewMember({ ...newMember, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin - Tüm erişim</SelectItem>
                    <SelectItem value="member">Üye - Atanan projelere erişim</SelectItem>
                    <SelectItem value="viewer">İzleyici - Sadece görüntüleme</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                İptal
              </Button>
              <Button onClick={handleAddMember} disabled={!newMember.name || !newMember.email}>
                Davet Gönder
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{members.length}</p>
                <p className="text-sm text-gray-500">Toplam Üye</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-secondary-100 flex items-center justify-center">
                <Check className="h-5 w-5 text-secondary-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {members.filter((m) => m.status === "active").length}
                </p>
                <p className="text-sm text-gray-500">Aktif Üye</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Shield className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {members.filter((m) => m.role === "admin").length}
                </p>
                <p className="text-sm text-gray-500">Admin</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Mail className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {members.filter((m) => m.status === "pending").length}
                </p>
                <p className="text-sm text-gray-500">Bekleyen Davet</p>
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
            placeholder="Üye ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Team Members Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Üye</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Atanan Projeler</TableHead>
                <TableHead>Katılım Tarihi</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback className="bg-primary-100 text-primary-700">
                          {member.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">{member.name}</p>
                        <p className="text-sm text-gray-500">{member.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={roleLabels[member.role].color}>
                      {roleLabels[member.role].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusLabels[member.status].color}>
                      {statusLabels[member.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {member.assignedProjects.length > 0 ? (
                        <>
                          <div className="flex -space-x-1">
                            {member.assignedProjects.slice(0, 3).map((projId, i) => (
                              <div
                                key={projId}
                                className="h-6 w-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium"
                                title={getProjectById(projId)?.name}
                              >
                                {i + 1}
                              </div>
                            ))}
                          </div>
                          {member.assignedProjects.length > 3 && (
                            <span className="text-sm text-gray-500">
                              +{member.assignedProjects.length - 3}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-sm text-gray-400">Proje atanmamış</span>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 gap-1 text-primary-600 hover:text-primary-700"
                        onClick={() => handleOpenProjectDialog(member)}
                      >
                        <FolderKanban className="h-3.5 w-3.5" />
                        Ata
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {member.createdAt.toLocaleDateString("tr-TR")}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
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
                        <DropdownMenuItem
                          className="gap-2"
                          onClick={() => handleOpenProjectDialog(member)}
                        >
                          <FolderKanban className="h-4 w-4" />
                          Proje Ata
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="gap-2"
                          onClick={() => handleToggleStatus(member.id)}
                        >
                          {member.status === "active" ? (
                            <>
                              <X className="h-4 w-4" />
                              Pasif Yap
                            </>
                          ) : (
                            <>
                              <Check className="h-4 w-4" />
                              Aktif Yap
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="gap-2 text-red-600 focus:text-red-600"
                          onClick={() => handleDeleteMember(member.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          Sil
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Project Assignment Dialog - Enhanced */}
      <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Proje ve Ürün Ata</DialogTitle>
            <DialogDescription>
              {selectedMember?.name} için proje ve dijital ürün erişimi ayarlayın.
            </DialogDescription>
          </DialogHeader>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Proje veya ürün ara..."
              value={projectSearchQuery}
              onChange={(e) => setProjectSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Tabs */}
          <div className="flex gap-2 border-b">
            <button
              onClick={() => setProjectDialogTab("projects")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
                projectDialogTab === "projects"
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              )}
            >
              <FolderKanban className="h-4 w-4" />
              Projeler ({filteredProjects.length})
            </button>
            <button
              onClick={() => setProjectDialogTab("products")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
                projectDialogTab === "products"
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              )}
            >
              <Package className="h-4 w-4" />
              Dijital Ürünler ({filteredDigitalProducts.length})
            </button>
          </div>
          
          <div className="max-h-[350px] overflow-y-auto">
            {projectDialogTab === "projects" ? (
              <div className="grid gap-2 sm:grid-cols-2">
                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                      selectedProjects.includes(project.id)
                        ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                    )}
                    onClick={() => {
                      if (selectedProjects.includes(project.id)) {
                        setSelectedProjects(selectedProjects.filter((id) => id !== project.id));
                      } else {
                        setSelectedProjects([...selectedProjects, project.id]);
                      }
                    }}
                  >
                    <Checkbox
                      checked={selectedProjects.includes(project.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedProjects([...selectedProjects, project.id]);
                        } else {
                          setSelectedProjects(selectedProjects.filter((id) => id !== project.id));
                        }
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">{project.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{project.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid gap-2 sm:grid-cols-2">
                {filteredDigitalProducts.map((product) => (
                  <div
                    key={product.id}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                      selectedProjects.includes(product.id)
                        ? "border-secondary-500 bg-secondary-50 dark:bg-secondary-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                    )}
                    onClick={() => {
                      if (selectedProjects.includes(product.id)) {
                        setSelectedProjects(selectedProjects.filter((id) => id !== product.id));
                      } else {
                        setSelectedProjects([...selectedProjects, product.id]);
                      }
                    }}
                  >
                    <Checkbox
                      checked={selectedProjects.includes(product.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedProjects([...selectedProjects, product.id]);
                        } else {
                          setSelectedProjects(selectedProjects.filter((id) => id !== product.id));
                        }
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">{product.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{product.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <div className="flex items-center justify-between w-full">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {selectedProjects.length} öğe seçildi
              </p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsProjectDialogOpen(false)}>
                  İptal
                </Button>
                <Button onClick={handleSaveProjects}>
                  Kaydet
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Token Display Dialog */}
      <Dialog open={showTokenDialog} onOpenChange={setShowTokenDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-primary-500" />
              Davet Tokeni Oluşturuldu
            </DialogTitle>
            <DialogDescription>
              Yeni üye bu token ile sisteme giriş yapabilir. Token 7 gün geçerlidir.
              İlk girişte şifre oluşturması istenecektir.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label>Davet Tokeni</Label>
              <div className="flex gap-2">
                <Input
                  value={generatedToken}
                  readOnly
                  className="font-mono text-sm bg-gray-50 dark:bg-gray-800"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={copyToken}
                  className={cn(
                    tokenCopied && "bg-secondary-100 text-secondary-700 border-secondary-300"
                  )}
                >
                  {tokenCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                <strong>Önemli:</strong> Bu token sadece bir kez gösterilecektir. 
                Lütfen üyeye güvenli bir şekilde iletin.
              </p>
            </div>
            <div className="space-y-2">
              <Label>Giriş Linki</Label>
              <Input
                value={`${typeof window !== 'undefined' ? window.location.origin : ''}/login?token=${generatedToken}`}
                readOnly
                className="font-mono text-xs bg-gray-50 dark:bg-gray-800"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowTokenDialog(false)}>
              Tamam
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

