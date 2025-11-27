import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/analytics - Get analytics data
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "all"; // all, month, quarter, year

    // Get date range based on period
    let startDate: Date | undefined;
    const now = new Date();
    
    switch (period) {
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "quarter":
        const quarter = Math.floor(now.getMonth() / 3);
        startDate = new Date(now.getFullYear(), quarter * 3, 1);
        break;
      case "year":
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
    }

    // Get products with listings and sales
    const products = await prisma.digitalProduct.findMany({
      where: { userId: session.user.id },
      include: {
        listings: {
          include: {
            platform: true,
            salesRecords: {
              where: startDate
                ? { periodStart: { gte: startDate } }
                : undefined,
            },
          },
        },
      },
    });

    // Calculate platform stats
    const platformStats: Record<string, {
      name: string;
      color: string;
      totalProducts: number;
      totalSales: number;
      grossRevenue: number;
      commission: number;
      netRevenue: number;
    }> = {};

    // Calculate category stats
    const categoryStats: Record<string, {
      totalProducts: number;
      totalSales: number;
      netRevenue: number;
    }> = {};

    // Process data
    let totalProducts = 0;
    let totalSales = 0;
    let totalGrossRevenue = 0;
    let totalCommission = 0;
    let totalNetRevenue = 0;

    products.forEach((product) => {
      totalProducts++;

      // Category stats
      if (!categoryStats[product.category]) {
        categoryStats[product.category] = {
          totalProducts: 0,
          totalSales: 0,
          netRevenue: 0,
        };
      }
      categoryStats[product.category].totalProducts++;

      product.listings.forEach((listing) => {
        // Initialize platform stats
        if (!platformStats[listing.platform.id]) {
          platformStats[listing.platform.id] = {
            name: listing.platform.name,
            color: listing.platform.color,
            totalProducts: 0,
            totalSales: 0,
            grossRevenue: 0,
            commission: 0,
            netRevenue: 0,
          };
        }
        platformStats[listing.platform.id].totalProducts++;

        // Sum sales records
        listing.salesRecords.forEach((record) => {
          const quantity = record.quantity;
          const gross = Number(record.grossRevenue);
          const commission = Number(record.commissionAmount);
          const net = Number(record.netRevenue);

          // Global totals
          totalSales += quantity;
          totalGrossRevenue += gross;
          totalCommission += commission;
          totalNetRevenue += net;

          // Platform totals
          platformStats[listing.platform.id].totalSales += quantity;
          platformStats[listing.platform.id].grossRevenue += gross;
          platformStats[listing.platform.id].commission += commission;
          platformStats[listing.platform.id].netRevenue += net;

          // Category totals
          categoryStats[product.category].totalSales += quantity;
          categoryStats[product.category].netRevenue += net;
        });
      });
    });

    // Get top products
    const topProducts = products
      .map((product) => {
        const productSales = product.listings.reduce((sum, listing) => {
          return (
            sum +
            listing.salesRecords.reduce((lSum, record) => lSum + record.quantity, 0)
          );
        }, 0);

        const productRevenue = product.listings.reduce((sum, listing) => {
          return (
            sum +
            listing.salesRecords.reduce(
              (lSum, record) => lSum + Number(record.netRevenue),
              0
            )
          );
        }, 0);

        return {
          id: product.id,
          title: product.title,
          thumbnail: product.thumbnail,
          category: product.category,
          totalSales: productSales,
          totalRevenue: productRevenue,
          platforms: product.listings.map((l) => ({
            name: l.platform.name,
            color: l.platform.color,
          })),
        };
      })
      .filter((p) => p.totalSales > 0)
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 10);

    // Monthly trends (last 6 months)
    const monthlyTrends: { month: string; sales: number; revenue: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

      let monthSales = 0;
      let monthRevenue = 0;

      products.forEach((product) => {
        product.listings.forEach((listing) => {
          listing.salesRecords.forEach((record) => {
            const recordDate = new Date(record.periodEnd);
            if (recordDate >= monthStart && recordDate <= monthEnd) {
              monthSales += record.quantity;
              monthRevenue += Number(record.netRevenue);
            }
          });
        });
      });

      monthlyTrends.push({
        month: monthStart.toLocaleDateString("tr-TR", {
          month: "short",
          year: "numeric",
        }),
        sales: monthSales,
        revenue: monthRevenue,
      });
    }

    return NextResponse.json({
      summary: {
        totalProducts,
        totalSales,
        totalGrossRevenue,
        totalCommission,
        totalNetRevenue,
      },
      platformStats: Object.values(platformStats),
      categoryStats,
      topProducts,
      monthlyTrends,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Analytics verileri yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

