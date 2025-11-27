"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  Tag,
  MoreHorizontal,
  Edit,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface Event {
  id: string;
  title: string;
  description?: string;
  date: Date;
  time?: string;
  type: "task" | "meeting" | "deadline" | "reminder";
  color: string;
}

const eventTypes = {
  task: { label: "Görev", color: "bg-primary-500" },
  meeting: { label: "Toplantı", color: "bg-secondary-500" },
  deadline: { label: "Son Tarih", color: "bg-red-500" },
  reminder: { label: "Hatırlatma", color: "bg-warning-500" },
};

const mockEvents: Event[] = [
  {
    id: "1",
    title: "E-book Lansman",
    description: "React kitabının resmi lansman tarihi",
    date: new Date(2024, 10, 28),
    time: "10:00",
    type: "deadline",
    color: "bg-red-500",
  },
  {
    id: "2",
    title: "İçerik Toplantısı",
    description: "Yeni içerik stratejisi görüşmesi",
    date: new Date(2024, 10, 29),
    time: "14:00",
    type: "meeting",
    color: "bg-secondary-500",
  },
  {
    id: "3",
    title: "Kapak Tasarımı",
    description: "Digital Products için yeni kapak tasarımları",
    date: new Date(2024, 10, 30),
    time: "09:00",
    type: "task",
    color: "bg-primary-500",
  },
  {
    id: "4",
    title: "Satış Raporu",
    description: "Aylık satış raporunu hazırla",
    date: new Date(2024, 11, 1),
    type: "reminder",
    color: "bg-warning-500",
  },
  {
    id: "5",
    title: "Platform Güncellemesi",
    description: "Etsy ve Gumroad platform güncellemeleri",
    date: new Date(2024, 11, 5),
    time: "11:00",
    type: "task",
    color: "bg-primary-500",
  },
];

const DAYS = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
const MONTHS = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    type: "task" as Event["type"],
  });

  // Get calendar data
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7; // Monday = 0

  // Generate calendar days
  const calendarDays: (Date | null)[] = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(new Date(year, month, i));
  }

  const getEventsForDate = (date: Date) => {
    return events.filter(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear()
    );
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleAddEvent = () => {
    if (newEvent.title && newEvent.date) {
      const event: Event = {
        id: Date.now().toString(),
        title: newEvent.title,
        description: newEvent.description,
        date: new Date(newEvent.date),
        time: newEvent.time,
        type: newEvent.type,
        color: eventTypes[newEvent.type].color,
      };
      setEvents([...events, event]);
      setNewEvent({ title: "", description: "", date: "", time: "", type: "task" });
      setIsAddingEvent(false);
    }
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter((e) => e.id !== id));
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Takvim</h1>
          <p className="text-sm text-gray-500 mt-1">Etkinliklerinizi ve görevlerinizi yönetin</p>
        </div>
        <Button onClick={() => setIsAddingEvent(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Etkinlik Ekle
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" onClick={handlePrevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-xl font-semibold text-gray-900">
                {MONTHS[month]} {year}
              </h2>
              <Button variant="outline" size="icon" onClick={handleNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(new Date())}
            >
              Bugün
            </Button>
          </CardHeader>
          <CardContent>
            {/* Day Headers */}
            <div className="grid grid-cols-7 mb-2">
              {DAYS.map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-medium text-gray-500 py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((date, index) => {
                if (!date) {
                  return <div key={`empty-${index}`} className="h-24 bg-gray-50 rounded-lg" />;
                }

                const dayEvents = getEventsForDate(date);
                const isSelected =
                  selectedDate &&
                  date.getDate() === selectedDate.getDate() &&
                  date.getMonth() === selectedDate.getMonth();

                return (
                  <div
                    key={date.toISOString()}
                    onClick={() => setSelectedDate(date)}
                    className={cn(
                      "h-24 p-2 rounded-lg border cursor-pointer transition-all overflow-hidden",
                      isToday(date)
                        ? "bg-primary-50 border-primary-300"
                        : "bg-white border-gray-200 hover:border-gray-300",
                      isSelected && "ring-2 ring-primary-500"
                    )}
                  >
                    <div
                      className={cn(
                        "text-sm font-medium mb-1",
                        isToday(date) ? "text-primary-600" : "text-gray-900"
                      )}
                    >
                      {date.getDate()}
                    </div>
                    <div className="space-y-1">
                      {dayEvents.slice(0, 2).map((event) => (
                        <div
                          key={event.id}
                          className={cn(
                            "text-xs px-1.5 py-0.5 rounded text-white truncate",
                            event.color
                          )}
                        >
                          {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-gray-500 pl-1">
                          +{dayEvents.length - 2} daha
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Sidebar - Selected Date Events */}
        <div className="space-y-6">
          {/* Selected Date */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                {selectedDate
                  ? `${selectedDate.getDate()} ${MONTHS[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`
                  : "Tarih Seçin"}
              </CardTitle>
              <CardDescription>
                {selectedDateEvents.length} etkinlik
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {selectedDateEvents.length > 0 ? (
                selectedDateEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start gap-3 p-3 rounded-lg border bg-white hover:shadow-sm transition-shadow"
                  >
                    <div className={cn("w-1 h-full min-h-[48px] rounded-full", event.color)} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{event.title}</p>
                      {event.description && (
                        <p className="text-sm text-gray-500 truncate">{event.description}</p>
                      )}
                      {event.time && (
                        <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                          <Clock className="h-3 w-3" />
                          {event.time}
                        </div>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Düzenle
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteEvent(event.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Sil
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <CalendarIcon className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">Bu tarihte etkinlik yok</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Yaklaşan Etkinlikler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {events
                .filter((e) => e.date >= new Date())
                .sort((a, b) => a.date.getTime() - b.date.getTime())
                .slice(0, 5)
                .map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center gap-3 py-2 border-b last:border-0"
                  >
                    <div className={cn("w-2 h-2 rounded-full", event.color)} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {event.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {event.date.getDate()} {MONTHS[event.date.getMonth()]}
                        {event.time && ` • ${event.time}`}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-xs",
                        event.type === "deadline" && "bg-red-100 text-red-700",
                        event.type === "meeting" && "bg-secondary-100 text-secondary-700",
                        event.type === "task" && "bg-primary-100 text-primary-700",
                        event.type === "reminder" && "bg-warning-100 text-warning-700"
                      )}
                    >
                      {eventTypes[event.type].label}
                    </Badge>
                  </div>
                ))}
            </CardContent>
          </Card>

          {/* Event Types Legend */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Etkinlik Türleri</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(eventTypes).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2">
                    <div className={cn("w-3 h-3 rounded-full", value.color)} />
                    <span className="text-sm text-gray-600">{value.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Event Dialog */}
      <Dialog open={isAddingEvent} onOpenChange={setIsAddingEvent}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Yeni Etkinlik Ekle</DialogTitle>
            <DialogDescription>
              Takviminize yeni bir etkinlik ekleyin
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Başlık</Label>
              <Input
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                placeholder="Etkinlik başlığı..."
              />
            </div>
            <div className="space-y-2">
              <Label>Açıklama</Label>
              <Textarea
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                placeholder="Etkinlik açıklaması..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tarih</Label>
                <Input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Saat</Label>
                <Input
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Tür</Label>
              <Select
                value={newEvent.type}
                onValueChange={(value: Event["type"]) =>
                  setNewEvent({ ...newEvent, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(eventTypes).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full", value.color)} />
                        {value.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingEvent(false)}>
              İptal
            </Button>
            <Button onClick={handleAddEvent}>Ekle</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


