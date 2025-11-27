"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Loader2, Calculator, TrendingUp } from "lucide-react";

interface SalesRecordFormData {
  id?: string;
  periodStart: string;
  periodEnd: string;
  quantity: number;
  grossRevenue: number;
  commissionAmount: number;
  netRevenue: number;
  currency: string;
  notes: string;
}

interface ListingInfo {
  id: string;
  price: number;
  currency: string;
  platform: {
    id: string;
    name: string;
    color: string;
    commissionRate: number;
  };
  product: {
    id: string;
    title: string;
  };
}

interface SalesRecordFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listing: ListingInfo | null;
  salesRecord?: SalesRecordFormData | null;
  onSuccess: () => void;
}

const currencies = [
  { value: "TRY", label: "₺ TRY", symbol: "₺" },
  { value: "USD", label: "$ USD", symbol: "$" },
  { value: "EUR", label: "€ EUR", symbol: "€" },
  { value: "GBP", label: "£ GBP", symbol: "£" },
];

export function SalesRecordForm({
  open,
  onOpenChange,
  listing,
  salesRecord,
  onSuccess,
}: SalesRecordFormProps) {
  const isEditing = !!salesRecord?.id;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const today = new Date().toISOString().split("T")[0];
  const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    .toISOString()
    .split("T")[0];

  const [formData, setFormData] = useState<SalesRecordFormData>({
    periodStart: salesRecord?.periodStart || firstDayOfMonth,
    periodEnd: salesRecord?.periodEnd || today,
    quantity: salesRecord?.quantity || 0,
    grossRevenue: salesRecord?.grossRevenue || 0,
    commissionAmount: salesRecord?.commissionAmount || 0,
    netRevenue: salesRecord?.netRevenue || 0,
    currency: salesRecord?.currency || listing?.currency || "TRY",
    notes: salesRecord?.notes || "",
  });

  // Auto-calculate based on quantity or gross revenue
  useEffect(() => {
    if (listing && formData.quantity > 0) {
      const gross = formData.quantity * Number(listing.price);
      const commission = gross * (Number(listing.platform.commissionRate) / 100);
      const net = gross - commission;

      setFormData((prev) => ({
        ...prev,
        grossRevenue: parseFloat(gross.toFixed(2)),
        commissionAmount: parseFloat(commission.toFixed(2)),
        netRevenue: parseFloat(net.toFixed(2)),
      }));
    }
  }, [formData.quantity, listing]);

  // Recalculate commission when gross revenue changes manually
  const handleGrossRevenueChange = (value: number) => {
    const commission = listing
      ? value * (Number(listing.platform.commissionRate) / 100)
      : 0;
    const net = value - commission;

    setFormData((prev) => ({
      ...prev,
      grossRevenue: value,
      commissionAmount: parseFloat(commission.toFixed(2)),
      netRevenue: parseFloat(net.toFixed(2)),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listing) return;

    setLoading(true);
    setError(null);

    try {
      const url = isEditing
        ? `/api/products/${listing.product.id}/sales/${salesRecord.id}`
        : `/api/products/${listing.product.id}/sales`;
      const method = isEditing ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          listingId: listing.id,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Bir hata oluştu");
      }

      onSuccess();
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const getCurrencySymbol = (currency: string) => {
    const curr = currencies.find((c) => c.value === currency);
    return curr?.symbol || currency;
  };

  if (!listing) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Satış Kaydı Düzenle" : "Yeni Satış Kaydı Ekle"}
          </DialogTitle>
          <DialogDescription>
            <div className="flex items-center gap-2 mt-2">
              <div
                className="flex h-6 w-6 items-center justify-center rounded text-white text-xs font-bold"
                style={{ backgroundColor: listing.platform.color }}
              >
                {listing.platform.name.charAt(0)}
              </div>
              <span className="font-medium">{listing.platform.name}</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600">{listing.product.title}</span>
            </div>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Period Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="periodStart">Dönem Başlangıcı *</Label>
              <Input
                id="periodStart"
                type="date"
                value={formData.periodStart}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    periodStart: e.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="periodEnd">Dönem Bitişi *</Label>
              <Input
                id="periodEnd"
                type="date"
                value={formData.periodEnd}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    periodEnd: e.target.value,
                  }))
                }
                required
              />
            </div>
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <Label htmlFor="quantity">Satış Adedi</Label>
            <Input
              id="quantity"
              type="number"
              min="0"
              value={formData.quantity}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  quantity: parseInt(e.target.value) || 0,
                }))
              }
              placeholder="0"
            />
            <p className="text-xs text-gray-500">
              Birim fiyat: {getCurrencySymbol(listing.currency)}
              {Number(listing.price).toFixed(2)}
            </p>
          </div>

          {/* Revenue Fields */}
          <div className="rounded-lg border bg-gray-50 p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Calculator className="h-4 w-4" />
              Gelir Hesaplaması
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="grossRevenue">Brüt Gelir</Label>
                <div className="flex gap-2">
                  <Input
                    id="grossRevenue"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.grossRevenue}
                    onChange={(e) =>
                      handleGrossRevenueChange(parseFloat(e.target.value) || 0)
                    }
                    className="flex-1"
                  />
                  <Select
                    value={formData.currency}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, currency: value }))
                    }
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((curr) => (
                        <SelectItem key={curr.value} value={curr.value}>
                          {curr.symbol}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="commissionAmount">
                  Komisyon (%{Number(listing.platform.commissionRate).toFixed(2)})
                </Label>
                <Input
                  id="commissionAmount"
                  type="number"
                  step="0.01"
                  value={formData.commissionAmount}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      commissionAmount: parseFloat(e.target.value) || 0,
                      netRevenue:
                        prev.grossRevenue - (parseFloat(e.target.value) || 0),
                    }))
                  }
                  className="bg-white"
                />
              </div>
            </div>

            <div className="pt-2 border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-secondary-600" />
                  <span className="font-medium text-gray-700">Net Gelir</span>
                </div>
                <span className="text-xl font-bold text-secondary-600">
                  {getCurrencySymbol(formData.currency)}
                  {formData.netRevenue.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notlar</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
              }
              placeholder="Bu dönem hakkında notlar..."
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              İptal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Güncelle" : "Kaydet"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

