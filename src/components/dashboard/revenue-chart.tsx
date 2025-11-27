"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { chartColors } from "@/lib/utils";
import { useState } from "react";

interface ChartDataPoint {
  date: string;
  revenue: number;
  expense: number;
  profit?: number;
}

interface RevenueChartProps {
  data?: ChartDataPoint[];
  title?: string;
  className?: string;
}

const defaultData: ChartDataPoint[] = [
  { date: "Oca", revenue: 4000, expense: 2400, profit: 1600 },
  { date: "Şub", revenue: 3000, expense: 1398, profit: 1602 },
  { date: "Mar", revenue: 5000, expense: 2800, profit: 2200 },
  { date: "Nis", revenue: 4780, expense: 3908, profit: 872 },
  { date: "May", revenue: 5890, expense: 4800, profit: 1090 },
  { date: "Haz", revenue: 6390, expense: 3800, profit: 2590 },
  { date: "Tem", revenue: 7490, expense: 4300, profit: 3190 },
];

export function RevenueChart({
  data = defaultData,
  title = "Gelir & Gider Analizi",
  className,
}: RevenueChartProps) {
  const [period, setPeriod] = useState("7d");

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Son 7 gün</SelectItem>
            <SelectItem value="30d">Son 30 gün</SelectItem>
            <SelectItem value="90d">Son 3 ay</SelectItem>
            <SelectItem value="12m">Son 12 ay</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
              <XAxis
                dataKey="date"
                stroke="#71717a"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#71717a"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₺${value / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e4e4e7",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
                formatter={(value: number, name: string) => [
                  `₺${value.toLocaleString("tr-TR")}`,
                  name === "revenue"
                    ? "Gelir"
                    : name === "expense"
                    ? "Gider"
                    : "Kar",
                ]}
                labelFormatter={(label) => `Tarih: ${label}`}
              />
              <Legend
                formatter={(value) =>
                  value === "revenue"
                    ? "Gelir"
                    : value === "expense"
                    ? "Gider"
                    : "Kar"
                }
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke={chartColors.secondary}
                strokeWidth={2}
                dot={{ fill: chartColors.secondary, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: chartColors.secondary, strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="expense"
                stroke={chartColors.accent}
                strokeWidth={2}
                dot={{ fill: chartColors.accent, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: chartColors.accent, strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="profit"
                stroke={chartColors.profit}
                strokeWidth={2}
                dot={{ fill: chartColors.profit, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: chartColors.profit, strokeWidth: 2 }}
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

