"use client";

import { useState } from "react";
import {
  Server,
  Plus,
  Search,
  MoreHorizontal,
  Activity,
  Cpu,
  MemoryStick,
  HardDrive,
  Wifi,
  Power,
  PowerOff,
  RefreshCw,
  Terminal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ServerInfo {
  id: string;
  name: string;
  provider: string;
  ip: string;
  os: string;
  status: "running" | "stopped" | "restarting" | "error";
  cpu: { cores: number; usage: number };
  ram: { total: number; used: number };
  storage: { total: number; used: number };
  uptime: string;
  location: string;
  price: number;
}

const mockServers: ServerInfo[] = [
  {
    id: "srv-1",
    name: "Production Server",
    provider: "DigitalOcean",
    ip: "165.22.15.200",
    os: "Ubuntu 22.04 LTS",
    status: "running",
    cpu: { cores: 4, usage: 45 },
    ram: { total: 8, used: 5.2 },
    storage: { total: 160, used: 85 },
    uptime: "45 gün 12 saat",
    location: "Frankfurt, DE",
    price: 48,
  },
  {
    id: "srv-2",
    name: "Staging Server",
    provider: "AWS EC2",
    ip: "54.93.12.105",
    os: "Amazon Linux 2",
    status: "running",
    cpu: { cores: 2, usage: 22 },
    ram: { total: 4, used: 1.8 },
    storage: { total: 80, used: 32 },
    uptime: "12 gün 5 saat",
    location: "Ireland, EU",
    price: 35,
  },
  {
    id: "srv-3",
    name: "Database Server",
    provider: "Hetzner",
    ip: "95.216.45.88",
    os: "Debian 11",
    status: "running",
    cpu: { cores: 8, usage: 68 },
    ram: { total: 32, used: 24 },
    storage: { total: 500, used: 320 },
    uptime: "120 gün 8 saat",
    location: "Helsinki, FI",
    price: 89,
  },
  {
    id: "srv-4",
    name: "Backup Server",
    provider: "Vultr",
    ip: "45.77.88.123",
    os: "CentOS 8",
    status: "stopped",
    cpu: { cores: 2, usage: 0 },
    ram: { total: 4, used: 0 },
    storage: { total: 200, used: 145 },
    uptime: "-",
    location: "Amsterdam, NL",
    price: 24,
  },
];

const statusConfig = {
  running: { label: "Çalışıyor", color: "bg-secondary-100 text-secondary-700", icon: Power },
  stopped: { label: "Durduruldu", color: "bg-gray-100 text-gray-600", icon: PowerOff },
  restarting: { label: "Yeniden Başlatılıyor", color: "bg-amber-100 text-amber-700", icon: RefreshCw },
  error: { label: "Hata", color: "bg-red-100 text-red-700", icon: Activity },
};

export default function ServersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [servers] = useState<ServerInfo[]>(mockServers);

  const filteredServers = servers.filter((server) =>
    server.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    server.ip.includes(searchQuery)
  );

  const runningServers = servers.filter((s) => s.status === "running").length;
  const totalMonthly = servers.reduce((sum, s) => sum + s.price, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sunucular</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Sunucu kaynaklarınızı izleyin ve yönetin
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Sunucu Ekle
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <Server className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{servers.length}</p>
                <p className="text-sm text-gray-500">Toplam Sunucu</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-secondary-100 dark:bg-secondary-900/30 flex items-center justify-center">
                <Power className="h-5 w-5 text-secondary-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{runningServers}</p>
                <p className="text-sm text-gray-500">Çalışıyor</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
                <Cpu className="h-5 w-5 text-cyan-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{servers.reduce((sum, s) => sum + s.cpu.cores, 0)}</p>
                <p className="text-sm text-gray-500">Toplam CPU</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Activity className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">${totalMonthly}</p>
                <p className="text-sm text-gray-500">Aylık Maliyet</p>
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
            placeholder="Sunucu veya IP ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Servers Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {filteredServers.map((server) => {
          const StatusIcon = statusConfig[server.status].icon;
          const cpuPercent = server.cpu.usage;
          const ramPercent = (server.ram.used / server.ram.total) * 100;
          const storagePercent = (server.storage.used / server.storage.total) * 100;

          return (
            <Card key={server.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "h-12 w-12 rounded-lg flex items-center justify-center",
                      server.status === "running" ? "bg-secondary-100 dark:bg-secondary-900/30" : "bg-gray-100 dark:bg-gray-800"
                    )}>
                      <Server className={cn(
                        "h-6 w-6",
                        server.status === "running" ? "text-secondary-600" : "text-gray-400"
                      )} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{server.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        {server.provider} • {server.location}
                      </CardDescription>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="gap-2">
                        <Terminal className="h-4 w-4" />
                        SSH Bağlan
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2">
                        <RefreshCw className="h-4 w-4" />
                        Yeniden Başlat
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="gap-2">
                        {server.status === "running" ? (
                          <>
                            <PowerOff className="h-4 w-4" />
                            Durdur
                          </>
                        ) : (
                          <>
                            <Power className="h-4 w-4" />
                            Başlat
                          </>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={cn("gap-1", statusConfig[server.status].color)}>
                    <StatusIcon className="h-3 w-3" />
                    {statusConfig[server.status].label}
                  </Badge>
                  <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                    {server.ip}
                  </code>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Resources */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Cpu className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-500">CPU</span>
                    </div>
                    <Progress value={cpuPercent} className="h-2" />
                    <p className="text-xs text-gray-500">{cpuPercent}% ({server.cpu.cores} core)</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <MemoryStick className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-500">RAM</span>
                    </div>
                    <Progress value={ramPercent} className="h-2" />
                    <p className="text-xs text-gray-500">{server.ram.used} / {server.ram.total} GB</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <HardDrive className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-500">Disk</span>
                    </div>
                    <Progress value={storagePercent} className="h-2" />
                    <p className="text-xs text-gray-500">{server.storage.used} / {server.storage.total} GB</p>
                  </div>
                </div>

                {/* Info */}
                <div className="pt-3 border-t grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">OS:</span>
                    <span className="ml-2">{server.os}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Uptime:</span>
                    <span className="ml-2">{server.uptime}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Ücret:</span>
                    <span className="ml-2 font-medium">${server.price}/ay</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}


