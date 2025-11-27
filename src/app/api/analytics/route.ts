import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET /api/analytics - Get dashboard analytics from database
export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get real counts from database
    const [
      productCount,
      platformCount,
      salesCount,
      totalRevenue,
      recentSales,
      platformStats,
    ] = await Promise.all([
      prisma.digitalProduct.count(),
      prisma.salesPlatform.count(),
      prisma.salesRecord.count(),
      prisma.salesRecord.aggregate({
        _sum: { amount: true },
      }),
      prisma.salesRecord.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          product: true,
          platform: true,
        },
      }),
      prisma.salesPlatform.findMany({
        include: {
          _count: {
            select: { salesRecords: true },
          },
          salesRecords: {
            select: { amount: true },
          },
        },
      }),
    ]);

    // Calculate platform stats
    const platformStatsFormatted = platformStats.map((platform) => {
      const totalPlatformRevenue = platform.salesRecords.reduce(
        (sum, sale) => sum + (sale.amount?.toNumber() || 0),
        0
      );
      return {
        id: platform.id,
        name: platform.name,
        slug: platform.slug,
        color: platform.color,
        sales: platform._count.salesRecords,
        revenue: totalPlatformRevenue,
      };
    });

    const totalRevenueValue = totalRevenue._sum.amount?.toNumber() || 0;

    // Format recent sales
    const recentSalesFormatted = recentSales.map((sale) => ({
      id: sale.id,
      productName: sale.product?.title || "Ürün",
      platformName: sale.platform?.name || "Platform",
      amount: sale.amount?.toNumber() || 0,
      currency: sale.currency,
      date: sale.createdAt,
    }));

    return NextResponse.json({
      stats: {
        totalRevenue: totalRevenueValue,
        totalExpense: 0, // Can be calculated from expenses table if exists
        netProfit: totalRevenueValue,
        activeProducts: productCount,
        totalSales: salesCount,
        activePlatforms: platformCount,
      },
      recentSales: recentSalesFormatted,
      platformStats: platformStatsFormatted,
      chartData: [], // Will be populated when there's actual data
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json(
      { error: "Analytics verileri alınamadı", details: String(error) },
      { status: 500 }
    );
  }
}
