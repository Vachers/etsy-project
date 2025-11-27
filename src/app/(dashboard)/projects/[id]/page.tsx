"use client";

import { use, useState, useRef, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Edit,
  MoreHorizontal,
  Plus,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  Users,
  History,
  MessageSquare,
  Send,
  UserPlus,
  Shield,
  Eye,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge, PriorityBadge } from "@/components/common";
import { formatCurrency, cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  status: "todo" | "in_progress" | "completed";
  priority: "low" | "medium" | "high";
  dueDate: Date;
}

interface ProjectMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "admin" | "member" | "viewer";
  joinedAt: Date;
}

interface ActivityLog {
  id: string;
  action: string;
  description: string;
  user: string;
  createdAt: Date;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  createdAt: Date;
  isOwn?: boolean;
}

// Mock project data
const project = {
  id: "1",
  title: "E-Ticaret Website Geliştirme",
  description:
    "Shopify entegrasyonlu yeni e-ticaret platformu. Müşterilerimiz için modern, hızlı ve kullanıcı dostu bir alışveriş deneyimi sunmayı hedefliyoruz.",
  status: "active" as const,
  priority: "high" as const,
  budget: 50000,
  spent: 32000,
  progress: 65,
  startDate: new Date("2024-01-15"),
  endDate: new Date("2024-03-30"),
  category: "Web Geliştirme",
  client: "ABC Şirketi",
};

const tasks: Task[] = [
  { id: "1", title: "Wireframe tasarımları", status: "completed", priority: "high", dueDate: new Date("2024-01-20") },
  { id: "2", title: "UI/UX mockups", status: "completed", priority: "high", dueDate: new Date("2024-01-25") },
  { id: "3", title: "Frontend geliştirme", status: "in_progress", priority: "high", dueDate: new Date("2024-02-15") },
  { id: "4", title: "Backend API geliştirme", status: "in_progress", priority: "high", dueDate: new Date("2024-02-20") },
  { id: "5", title: "Ödeme entegrasyonu", status: "todo", priority: "medium", dueDate: new Date("2024-03-01") },
  { id: "6", title: "Test ve QA", status: "todo", priority: "medium", dueDate: new Date("2024-03-15") },
  { id: "7", title: "Deployment", status: "todo", priority: "high", dueDate: new Date("2024-03-25") },
];

// Mock project members
const projectMembers: ProjectMember[] = [
  {
    id: "member-1",
    name: "Ahmet Yılmaz",
    email: "ahmet@example.com",
    role: "admin",
    joinedAt: new Date("2024-01-15"),
  },
  {
    id: "member-2",
    name: "Elif Demir",
    email: "elif@example.com",
    role: "member",
    joinedAt: new Date("2024-01-20"),
  },
  {
    id: "member-3",
    name: "Mehmet Kaya",
    email: "mehmet@example.com",
    role: "member",
    joinedAt: new Date("2024-02-01"),
  },
  {
    id: "member-4",
    name: "Ayşe Öztürk",
    email: "ayse@example.com",
    role: "viewer",
    joinedAt: new Date("2024-02-10"),
  },
];

// Mock activity logs
const activityLogs: ActivityLog[] = [
  {
    id: "log-1",
    action: "TASK_COMPLETED",
    description: "UI/UX mockups görevi tamamlandı",
    user: "Ahmet Yılmaz",
    createdAt: new Date("2024-02-15T10:30:00"),
  },
  {
    id: "log-2",
    action: "MEMBER_ADDED",
    description: "Ayşe Öztürk projeye eklendi",
    user: "Ahmet Yılmaz",
    createdAt: new Date("2024-02-10T14:20:00"),
  },
  {
    id: "log-3",
    action: "STATUS_CHANGED",
    description: "Proje durumu 'aktif' olarak güncellendi",
    user: "Ahmet Yılmaz",
    createdAt: new Date("2024-02-05T09:00:00"),
  },
  {
    id: "log-4",
    action: "TASK_ADDED",
    description: "Ödeme entegrasyonu görevi eklendi",
    user: "Elif Demir",
    createdAt: new Date("2024-02-01T16:45:00"),
  },
  {
    id: "log-5",
    action: "FILE_UPLOADED",
    description: "design-v2.fig dosyası yüklendi",
    user: "Mehmet Kaya",
    createdAt: new Date("2024-01-28T11:15:00"),
  },
  {
    id: "log-6",
    action: "CREATED",
    description: "Proje oluşturuldu",
    user: "Ahmet Yılmaz",
    createdAt: new Date("2024-01-15T08:00:00"),
  },
];

// Mock messages
const initialMessages: Message[] = [
  {
    id: "msg-1",
    content: "Merhaba ekip, projeye hoş geldiniz!",
    senderId: "member-1",
    senderName: "Ahmet Yılmaz",
    createdAt: new Date("2024-01-15T09:00:00"),
    isOwn: false,
  },
  {
    id: "msg-2",
    content: "Teşekkürler Ahmet, tasarım dosyalarını yarın yükleyeceğim.",
    senderId: "member-2",
    senderName: "Elif Demir",
    createdAt: new Date("2024-01-15T09:05:00"),
    isOwn: false,
  },
  {
    id: "msg-3",
    content: "Harika, Backend API planlamasına başlayabiliriz.",
    senderId: "member-3",
    senderName: "Mehmet Kaya",
    createdAt: new Date("2024-01-15T09:10:00"),
    isOwn: true,
  },
  {
    id: "msg-4",
    content: "Wireframe'ler hazır, inceleyebilir misiniz?",
    senderId: "member-2",
    senderName: "Elif Demir",
    createdAt: new Date("2024-01-18T14:30:00"),
    isOwn: false,
  },
  {
    id: "msg-5",
    content: "Çok güzel görünüyor! Birkaç küçük değişiklik önerim var.",
    senderId: "member-1",
    senderName: "Ahmet Yılmaz",
    createdAt: new Date("2024-01-18T15:00:00"),
    isOwn: false,
  },
];

const roleLabels = {
  admin: { label: "Admin", color: "bg-purple-100 text-purple-700", icon: Shield },
  member: { label: "Üye", color: "bg-primary-100 text-primary-700", icon: Users },
  viewer: { label: "İzleyici", color: "bg-gray-100 text-gray-600", icon: Eye },
};

const actionIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  CREATED: Plus,
  UPDATED: Edit,
  STATUS_CHANGED: AlertCircle,
  MEMBER_ADDED: UserPlus,
  MEMBER_REMOVED: X,
  TASK_ADDED: Plus,
  TASK_COMPLETED: CheckCircle,
  FILE_UPLOADED: Plus,
  COMMENT_ADDED: MessageSquare,
  SETTINGS_CHANGED: Edit,
};

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState("overview");
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const inProgressTasks = tasks.filter((t) => t.status === "in_progress").length;
  const todoTasks = tasks.filter((t) => t.status === "todo").length;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (activeTab === "messages") {
      scrollToBottom();
    }
  }, [activeTab, messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message: Message = {
      id: `msg-${Date.now()}`,
      content: newMessage,
      senderId: "current-user",
      senderName: "Ben",
      createdAt: new Date(),
      isOwn: true,
    };
    
    setMessages([...messages, message]);
    setNewMessage("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link
              href="/projects"
              className="flex items-center gap-1 hover:text-gray-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Projeler
            </Link>
            <span>/</span>
            <span>{project.title}</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
          <div className="flex items-center gap-2 mt-2">
            <StatusBadge status={project.status} />
            <PriorityBadge priority={project.priority} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Edit className="h-4 w-4" />
            Düzenle
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Arşivle</DropdownMenuItem>
              <DropdownMenuItem>Kopyala</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Sil
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">İlerleme</p>
                <p className="text-2xl font-bold">{project.progress}%</p>
              </div>
              <div className="p-3 bg-primary-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-primary-600" />
              </div>
            </div>
            <Progress value={project.progress} className="mt-3 h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Bütçe Kullanımı</p>
                <p className="text-2xl font-bold">
                  {Math.round((project.spent / project.budget) * 100)}%
                </p>
              </div>
              <div className="p-3 bg-secondary-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-secondary-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {formatCurrency(project.spent)} / {formatCurrency(project.budget)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Ekip Üyeleri</p>
                <p className="text-2xl font-bold">{projectMembers.length}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="flex -space-x-2 mt-2">
              {projectMembers.slice(0, 4).map((member) => (
                <Avatar key={member.id} className="h-6 w-6 border-2 border-white">
                  <AvatarFallback className="text-xs bg-primary-100 text-primary-700">
                    {member.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
              ))}
              {projectMembers.length > 4 && (
                <div className="h-6 w-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs">
                  +{projectMembers.length - 4}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Bitiş Tarihi</p>
                <p className="text-2xl font-bold">
                  {format(project.endDate, "d MMM", { locale: tr })}
                </p>
              </div>
              <div className="p-3 bg-accent-100 rounded-lg">
                <Calendar className="h-6 w-6 text-accent-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {Math.ceil((project.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} gün kaldı
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-white border">
          <TabsTrigger value="overview" className="gap-2">
            <CheckCircle className="h-4 w-4" />
            Genel Bakış
          </TabsTrigger>
          <TabsTrigger value="members" className="gap-2">
            <Users className="h-4 w-4" />
            Ekip ({projectMembers.length})
          </TabsTrigger>
          <TabsTrigger value="logs" className="gap-2">
            <History className="h-4 w-4" />
            Log Geçmişi
          </TabsTrigger>
          <TabsTrigger value="messages" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Mesajlar
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Proje Açıklaması</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">{project.description}</p>
                  <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
                    <div>
                      <p className="text-sm text-gray-500">Kategori</p>
                      <p className="font-medium">{project.category}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Müşteri</p>
                      <p className="font-medium">{project.client}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Başlangıç</p>
                      <p className="font-medium">
                        {format(project.startDate, "d MMMM yyyy", { locale: tr })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Bitiş</p>
                      <p className="font-medium">
                        {format(project.endDate, "d MMMM yyyy", { locale: tr })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tasks */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Görevler</CardTitle>
                    <CardDescription>
                      {completedTasks} / {tasks.length} tamamlandı
                    </CardDescription>
                  </div>
                  <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Görev Ekle
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg border transition-colors",
                          task.status === "completed"
                            ? "bg-gray-50 border-gray-200"
                            : "bg-white border-gray-200 hover:border-primary-200"
                        )}
                      >
                        <Checkbox checked={task.status === "completed"} />
                        <div className="flex-1">
                          <p
                            className={cn(
                              "font-medium",
                              task.status === "completed" && "line-through text-gray-400"
                            )}
                          >
                            {task.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            Bitiş: {format(task.dueDate, "d MMM", { locale: tr })}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {task.status === "in_progress" && (
                            <span className="flex items-center gap-1 text-xs text-warning-600">
                              <Clock className="h-3 w-3" />
                              Devam ediyor
                            </span>
                          )}
                          <PriorityBadge priority={task.priority as any} />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Team Members Grid */}
            <div className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Ekip Üyeleri</CardTitle>
                  <Button size="sm" variant="outline" onClick={() => setIsAddMemberOpen(true)}>
                    <UserPlus className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {projectMembers.map((member) => {
                      const RoleIcon = roleLabels[member.role].icon;
                      return (
                        <div
                          key={member.id}
                          className="flex flex-col items-center p-3 rounded-lg border bg-gray-50 text-center"
                        >
                          <Avatar className="h-12 w-12 mb-2">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback className="bg-primary-100 text-primary-700">
                              {member.name.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <p className="text-sm font-medium truncate w-full">{member.name}</p>
                          <Badge className={cn("mt-1 gap-1", roleLabels[member.role].color)}>
                            <RoleIcon className="h-3 w-3" />
                            {roleLabels[member.role].label}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Son Aktiviteler</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activityLogs.slice(0, 4).map((log, index) => {
                      const ActionIcon = actionIcons[log.action] || AlertCircle;
                      return (
                        <div key={log.id} className="flex gap-3">
                          <div className="relative">
                            <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                              <ActionIcon className="h-4 w-4 text-primary-600" />
                            </div>
                            {index < 3 && (
                              <div className="absolute left-4 top-8 h-full w-px bg-gray-200" />
                            )}
                          </div>
                          <div className="flex-1 pb-4">
                            <p className="text-sm text-gray-600">{log.description}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {log.user} • {format(log.createdAt, "d MMM HH:mm", { locale: tr })}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Members Tab */}
        <TabsContent value="members" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Ekip Üyeleri</CardTitle>
                <CardDescription>
                  Bu projeye atanan tüm ekip üyeleri
                </CardDescription>
              </div>
              <Button className="gap-2" onClick={() => setIsAddMemberOpen(true)}>
                <UserPlus className="h-4 w-4" />
                Üye Ekle
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {projectMembers.map((member) => {
                  const RoleIcon = roleLabels[member.role].icon;
                  return (
                    <div
                      key={member.id}
                      className="flex items-center gap-4 p-4 rounded-lg border bg-white hover:border-primary-200 transition-colors"
                    >
                      <Avatar className="h-14 w-14">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback className="bg-primary-100 text-primary-700 text-lg">
                          {member.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900">{member.name}</p>
                        <p className="text-sm text-gray-500 truncate">{member.email}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={cn("gap-1", roleLabels[member.role].color)}>
                            <RoleIcon className="h-3 w-3" />
                            {roleLabels[member.role].label}
                          </Badge>
                          <span className="text-xs text-gray-400">
                            {format(member.joinedAt, "d MMM yyyy", { locale: tr })}
                          </span>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Rol Değiştir</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <X className="h-4 w-4 mr-2" />
                            Projeden Çıkar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Logs Tab */}
        <TabsContent value="logs" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Aktivite Geçmişi</CardTitle>
              <CardDescription>
                Projede yapılan tüm değişikliklerin kaydı
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activityLogs.map((log, index) => {
                  const ActionIcon = actionIcons[log.action] || AlertCircle;
                  return (
                    <div key={log.id} className="flex gap-4">
                      <div className="relative">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <ActionIcon className="h-5 w-5 text-primary-600" />
                        </div>
                        {index < activityLogs.length - 1 && (
                          <div className="absolute left-5 top-10 h-full w-px bg-gray-200" />
                        )}
                      </div>
                      <div className="flex-1 pb-6">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-gray-900">{log.description}</p>
                          <span className="text-sm text-gray-400">
                            {format(log.createdAt, "d MMM yyyy HH:mm", { locale: tr })}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {log.user} tarafından
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Messages Tab */}
        <TabsContent value="messages" className="mt-6">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="border-b">
              <CardTitle>Proje Mesajları</CardTitle>
              <CardDescription>
                Sadece projeye atanan üyeler bu mesajları görebilir
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 p-0 flex flex-col">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex gap-3",
                        message.isOwn && "flex-row-reverse"
                      )}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={message.senderAvatar} />
                        <AvatarFallback className="text-xs bg-primary-100 text-primary-700">
                          {message.senderName.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={cn(
                          "max-w-[70%] rounded-lg p-3",
                          message.isOwn
                            ? "bg-primary-500 text-white"
                            : "bg-gray-100 text-gray-900"
                        )}
                      >
                        {!message.isOwn && (
                          <p className="text-xs font-medium mb-1">{message.senderName}</p>
                        )}
                        <p className="text-sm">{message.content}</p>
                        <p
                          className={cn(
                            "text-xs mt-1",
                            message.isOwn ? "text-primary-200" : "text-gray-400"
                          )}
                        >
                          {format(message.createdAt, "HH:mm", { locale: tr })}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder="Mesajınızı yazın..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Member Dialog */}
      <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Üye Ekle</DialogTitle>
            <DialogDescription>
              Projeye yeni bir ekip üyesi ekleyin
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Üye Seç</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Üye seçin..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user-1">Can Aydın - can@example.com</SelectItem>
                  <SelectItem value="user-2">Zeynep Yıldız - zeynep@example.com</SelectItem>
                  <SelectItem value="user-3">Ali Kara - ali@example.com</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Rol</label>
              <Select defaultValue="member">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin - Tüm erişim</SelectItem>
                  <SelectItem value="member">Üye - Düzenleme yetkisi</SelectItem>
                  <SelectItem value="viewer">İzleyici - Sadece görüntüleme</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddMemberOpen(false)}>
              İptal
            </Button>
            <Button onClick={() => setIsAddMemberOpen(false)}>
              Ekle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


