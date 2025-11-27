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
      salesRecordCount,
      totalRevenue,
      recentSalesRecords,
      platforms,
    ] = await Promise.all([
      prisma.digitalProduct.count(),
      prisma.salesPlatform.count(),
      prisma.salesRecord.count(),
      prisma.salesRecord.aggregate({
        _sum: { grossRevenue: true, netRevenue: true },
      }),
      prisma.salesRecord.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          listing: {
            include: {
              product: true,
              platform: true,
            },
          },
        },
      }),
      prisma.salesPlatform.findMany({
        where: { isActive: true },
        include: {
          listings: {
            include: {
              salesRecords: true,
            },
          },
        },
      }),
    ]);

    // Calculate platform stats
    const platformStats = platforms.map((platform) => {
      let totalSales = 0;
      let totalRevenue = 0;

      platform.listings.forEach((listing) => {
        listing.salesRecords.forEach((record) => {
          totalSales += record.quantity;
          totalRevenue += record.grossRevenue?.toNumber() || 0;
        });
      });

      return {
        id: platform.id,
        name: platform.name,
        slug: platform.slug,
        color: platform.color,
        sales: totalSales,
        revenue: totalRevenue,
      };
    });

    const totalRevenueValue = totalRevenue._sum.grossRevenue?.toNumber() || 0;

    // Format recent sales
    const recentSales = recentSalesRecords.map((record) => ({
      id: record.id,
      productName: record.listing?.product?.title || "Ürün",
      platformName: record.listing?.platform?.name || "Platform",
      amount: record.grossRevenue?.toNumber() || 0,
      currency: record.currency,
      date: record.createdAt,
    }));

    return NextResponse.json({
      stats: {
        totalRevenue: totalRevenueValue,
        totalExpense: 0,
        netProfit: totalRevenue._sum.netRevenue?.toNumber() || 0,
        activeProducts: productCount,
        totalSales: salesRecordCount,
        activePlatforms: platformCount,
      },
      recentSales,
      platformStats,
      chartData: [],
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json(
      { error: "Analytics verileri alınamadı", details: String(error) },
      { status: 500 }
    );
  }
}
