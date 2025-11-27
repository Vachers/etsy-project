"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  FolderPlus,
  ShoppingCart,
  CheckCircle,
  UserPlus,
  Edit,
  Trash2,
} from "lucide-react";

interface Activity {
  id: string;
  type: "project" | "sale" | "task" | "user";
  action: "created" | "updated" | "completed" | "deleted";
  title: string;
  description?: string;
  timestamp: string;
}

interface ActivityFeedProps {
  activities?: Activity[];
  className?: string;
}

const activityIcons: Record<Activity["type"], Record<Activity["action"], React.ComponentType<{ className?: string }>>> = {
  project: {
    created: FolderPlus,
    updated: Edit,
    completed: CheckCircle,
    deleted: Trash2,
  },
  sale: {
    created: ShoppingCart,
    updated: Edit,
    completed: CheckCircle,
    deleted: Trash2,
  },
  task: {
    created: FolderPlus,
    updated: Edit,
    completed: CheckCircle,
    deleted: Trash2,
  },
  user: {
    created: UserPlus,
    updated: Edit,
    completed: CheckCircle,
    deleted: Trash2,
  },
};

const activityColors: Record<Activity["action"], string> = {
  created: "bg-primary-100 text-primary-600",
  updated: "bg-warning-100 text-warning-600",
  completed: "bg-secondary-100 text-secondary-600",
  deleted: "bg-accent-100 text-accent-600",
};

const defaultActivities: Activity[] = [
  {
    id: "1",
    type: "sale",
    action: "created",
    title: "Yeni satış oluşturuldu",
    description: "Etsy'den ₺1,250 tutarında satış",
    timestamp: "5 dk önce",
  },
  {
    id: "2",
    type: "project",
    action: "completed",
    title: "Proje tamamlandı",
    description: "Logo Tasarımı projesi başarıyla tamamlandı",
    timestamp: "1 saat önce",
  },
  {
    id: "3",
    type: "task",
    action: "updated",
    title: "Görev güncellendi",
    description: "Ürün fotoğrafları görevi düzenlendi",
    timestamp: "2 saat önce",
  },
  {
    id: "4",
    type: "project",
    action: "created",
    title: "Yeni proje oluşturuldu",
    description: "E-ticaret Website projesi başlatıldı",
    timestamp: "3 saat önce",
  },
  {
    id: "5",
    type: "sale",
    action: "completed",
    title: "Ödeme alındı",
    description: "₺2,500 tutarında ödeme onaylandı",
    timestamp: "5 saat önce",
  },
  {
    id: "6",
    type: "task",
    action: "completed",
    title: "Görev tamamlandı",
    description: "SEO optimizasyonu tamamlandı",
    timestamp: "1 gün önce",
  },
];

export function ActivityFeed({
  activities = defaultActivities,
  className,
}: ActivityFeedProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Son Aktiviteler</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80 pr-4">
          <div className="space-y-4">
            {activities.map((activity, index) => {
              const Icon = activityIcons[activity.type][activity.action];
              const colorClass = activityColors[activity.action];

              return (
                <div key={activity.id} className="flex gap-3">
                  <div className="relative">
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full",
                        colorClass
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    {index < activities.length - 1 && (
                      <div className="absolute left-4 top-8 h-full w-px bg-gray-200" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.title}
                    </p>
                    {activity.description && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        {activity.description}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {activity.timestamp}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

