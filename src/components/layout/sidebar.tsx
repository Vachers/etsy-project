"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FolderKanban,
  ShoppingCart,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Users,
  Calendar,
  FileText,
  Zap,
  BookOpen,
  Package,
  Boxes,
  Share2,
  Search,
  Music,
  Gamepad2,
  Youtube,
  Code,
  Database,
  Layers,
  Globe,
  Server,
  HardDrive,
  Key,
  UserCheck,
  MoreHorizontal,
  Brain,
  Monitor,
  Smartphone,
  Bot,
  Mail,
  Gamepad,
  AtSign,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

// Ana navigasyon (Dashboard, Satışlar, Takvim, Raporlar)
const mainNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Satışlar",
    href: "/sales",
    icon: ShoppingCart,
  },
  {
    title: "Takvim",
    href: "/calendar",
    icon: Calendar,
  },
  {
    title: "Raporlar",
    href: "/reports",
    icon: FileText,
  },
];

// Projeler bölümü (açılır kapanır)
const projectsNavItems: NavItem[] = [
  {
    title: "Proje Dashboard",
    href: "/projects",
    icon: FolderKanban,
  },
  {
    title: "Web Projeler",
    href: "/projects/web",
    icon: Monitor,
  },
  {
    title: "Mobil Projeler",
    href: "/projects/mobile",
    icon: Smartphone,
  },
  {
    title: "Otomasyonlar",
    href: "/projects/automations",
    icon: Bot,
  },
];

// Dijital Ürünler Navigasyonu
const digitalProductsNavItems: NavItem[] = [
  {
    title: "E-Books",
    href: "/ebooks",
    icon: BookOpen,
  },
  {
    title: "Digital Products",
    href: "/digital-products",
    icon: Package,
  },
  {
    title: "Digital Bundles",
    href: "/digital-bundles",
    icon: Boxes,
  },
  {
    title: "Social Media",
    href: "/social-media",
    icon: Share2,
  },
  {
    title: "Detective Projects",
    href: "/detective-projects",
    icon: Search,
  },
  {
    title: "Music Projects",
    href: "/music-projects",
    icon: Music,
  },
  {
    title: "Game Sell",
    href: "/game-sell",
    icon: Gamepad2,
  },
  {
    title: "Youtube",
    href: "/youtube",
    icon: Youtube,
  },
  {
    title: "Scripts",
    href: "/scripts",
    icon: Code,
  },
];

// WebAdmin menüsü (açılır kapanır)
const webAdminNavItems: NavItem[] = [
  {
    title: "Domainler",
    href: "/webadmin/domains",
    icon: Globe,
  },
  {
    title: "Hosting",
    href: "/webadmin/hosting",
    icon: HardDrive,
  },
  {
    title: "Sunucular",
    href: "/webadmin/servers",
    icon: Server,
  },
  {
    title: "Lisanslar",
    href: "/webadmin/licenses",
    icon: Key,
  },
  {
    title: "Üyelikler",
    href: "/webadmin/memberships",
    icon: UserCheck,
  },
  {
    title: "Cortex",
    href: "/webadmin/cortex",
    icon: Brain,
  },
  {
    title: "Diğer",
    href: "/webadmin/other",
    icon: MoreHorizontal,
  },
];

// Hesaplar menüsü (açılır kapanır)
const accountsNavItems: NavItem[] = [
  {
    title: "Mail Hesapları",
    href: "/accounts/mail",
    icon: Mail,
  },
  {
    title: "Oyun Hesapları",
    href: "/accounts/gaming",
    icon: Gamepad,
  },
  {
    title: "Sosyal Medya Hesapları",
    href: "/accounts/social-media",
    icon: AtSign,
  },
];

// Tanımlar menüsü (açılır kapanır)
const definitionsNavItems: NavItem[] = [
  {
    title: "Platform Yönetimi",
    href: "/settings/platforms",
    icon: Layers,
  },
  {
    title: "Satış Hesapları",
    href: "/settings/sales-accounts",
    icon: Store,
  },
];

// Sistem menüsü (açılır kapanır) - En altta olacak
const systemNavItems: NavItem[] = [
  {
    title: "Ekip",
    href: "/team",
    icon: Users,
  },
  {
    title: "Entegrasyonlar",
    href: "/integrations",
    icon: Zap,
  },
  {
    title: "Ayarlar",
    href: "/settings",
    icon: Settings,
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [accountsOpen, setAccountsOpen] = useState(false);
  const [webAdminOpen, setWebAdminOpen] = useState(false);
  const [definitionsOpen, setDefinitionsOpen] = useState(false);
  const [systemOpen, setSystemOpen] = useState(false);

  const NavLink = ({ item }: { item: NavItem }) => {
    const isActive = pathname === item.href || 
      (item.href !== "/" && pathname.startsWith(item.href));
    const Icon = item.icon;

    const linkContent = (
      <Link
        href={item.href}
        className={cn(
          "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
          "hover:bg-primary-50 hover:text-primary-600",
          isActive
            ? "bg-primary-50 text-primary-600 shadow-sm"
            : "text-gray-600",
          isCollapsed && "justify-center px-2"
        )}
      >
        <Icon className={cn("h-5 w-5 shrink-0", isActive && "text-primary-500")} />
        {!isCollapsed && (
          <span className="truncate">{item.title}</span>
        )}
        {!isCollapsed && item.badge && (
          <span className="ml-auto flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-500 text-xs font-medium text-white">
            {item.badge}
          </span>
        )}
      </Link>
    );

    if (isCollapsed) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
          <TooltipContent side="right" className="flex items-center gap-2">
            {item.title}
            {item.badge && (
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-500 text-xs font-medium text-white">
                {item.badge}
              </span>
            )}
          </TooltipContent>
        </Tooltip>
      );
    }

    return linkContent;
  };

  // Collapsible Menu Component
  const CollapsibleMenu = ({ 
    title, 
    icon: Icon, 
    items, 
    isOpen, 
    onOpenChange 
  }: { 
    title: string; 
    icon: React.ComponentType<{ className?: string }>; 
    items: NavItem[]; 
    isOpen: boolean; 
    onOpenChange: (open: boolean) => void;
  }) => {
    if (isCollapsed) {
      return (
        <div className="space-y-1">
          {items.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </div>
      );
    }

    return (
      <Collapsible open={isOpen} onOpenChange={onOpenChange}>
        <CollapsibleTrigger asChild>
          <button
            className={cn(
              "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
              "hover:bg-gray-100 text-gray-600",
              isOpen && "bg-gray-50"
            )}
          >
            <Icon className="h-5 w-5 shrink-0 text-gray-500" />
            <span className="flex-1 text-left">{title}</span>
            <ChevronDown className={cn(
              "h-4 w-4 text-gray-400 transition-transform duration-200",
              isOpen && "rotate-180"
            )} />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pl-4 pt-0.5 space-y-0.5">
          {items.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </CollapsibleContent>
      </Collapsible>
    );
  };

  return (
    <aside
      className={cn(
        "relative flex h-screen flex-col border-r border-gray-200 bg-white transition-all duration-300 overflow-hidden",
        isCollapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Logo - Fixed, doesn't scroll */}
      <div className={cn(
        "flex h-16 min-h-[64px] shrink-0 items-center border-b border-gray-200 px-4",
        isCollapsed && "justify-center px-2"
      )}>
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-primary">
            <Zap className="h-5 w-5 text-white" />
          </div>
          {!isCollapsed && (
            <span className="text-lg font-bold text-gray-800">
              PROJEKTİF
            </span>
          )}
        </Link>
      </div>

      {/* Navigation - Scrollable */}
      <ScrollArea className="flex-1 overflow-y-auto">
        <nav className="flex flex-col gap-0.5 px-3 py-3">
          {/* Main Navigation */}
          <div className="space-y-0.5">
            {mainNavItems.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </div>

          {/* Separator */}
          <div className="my-2 border-t border-gray-200" />

          {/* Projeler Bölümü (açılır kapanır) */}
          <div className="space-y-0.5">
            <CollapsibleMenu
              title="Projeler"
              icon={FolderKanban}
              items={projectsNavItems}
              isOpen={projectsOpen}
              onOpenChange={setProjectsOpen}
            />
          </div>

          {/* Separator */}
          <div className="my-2 border-t border-gray-200" />

          {/* Digital Products Navigation */}
          <div className="space-y-0.5">
            {!isCollapsed && (
              <p className="mb-1.5 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Dijital Ürünler
              </p>
            )}
            {digitalProductsNavItems.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </div>

          {/* Separator */}
          <div className="my-2 border-t border-gray-200" />

          {/* Hesaplar Menüsü (açılır kapanır) */}
          <div className="space-y-0.5">
            <CollapsibleMenu
              title="Hesaplar"
              icon={Users}
              items={accountsNavItems}
              isOpen={accountsOpen}
              onOpenChange={setAccountsOpen}
            />
          </div>

          {/* Separator */}
          <div className="my-2 border-t border-gray-200" />

          {/* WebAdmin Menüsü (açılır kapanır) */}
          <div className="space-y-0.5">
            <CollapsibleMenu
              title="WebAdmin"
              icon={Server}
              items={webAdminNavItems}
              isOpen={webAdminOpen}
              onOpenChange={setWebAdminOpen}
            />
          </div>

          {/* Separator */}
          <div className="my-2 border-t border-gray-200" />

          {/* Tanımlar Menüsü (açılır kapanır) */}
          <div className="space-y-0.5">
            <CollapsibleMenu
              title="Tanımlar"
              icon={Database}
              items={definitionsNavItems}
              isOpen={definitionsOpen}
              onOpenChange={setDefinitionsOpen}
            />
          </div>

          {/* Separator */}
          <div className="my-2 border-t border-gray-200" />

          {/* Sistem Menüsü (açılır kapanır) - EN ALTTA */}
          <div className="space-y-0.5">
            <CollapsibleMenu
              title="Sistem"
              icon={Settings}
              items={systemNavItems}
              isOpen={systemOpen}
              onOpenChange={setSystemOpen}
            />
          </div>
        </nav>
      </ScrollArea>

      {/* Collapse Button - Fixed at bottom */}
      <div className="shrink-0 border-t border-gray-200 p-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "w-full justify-center text-gray-500 hover:text-gray-700",
            !isCollapsed && "justify-start"
          )}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 mr-2" />
              <span>Daralt</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
