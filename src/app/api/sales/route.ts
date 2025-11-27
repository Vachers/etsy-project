import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createSaleSchema = z.object({
  title: z.string().min(1, "Başlık gereklidir"),
  description: z.string().optional(),
  amount: z.number().positive("Tutar pozitif olmalıdır"),
  currency: z.string().default("TRY"),
  platform: z.enum(["ETSY", "AMAZON", "SHOPIFY", "EBAY", "WEBSITE", "OTHER"]).default("OTHER"),
  status: z.enum(["PENDING", "COMPLETED", "REFUNDED", "CANCELLED"]).default("PENDING"),
  orderId: z.string().optional(),
  customerName: z.string().optional(),
  customerEmail: z.string().email().optional(),
  projectId: z.string().optional(),
  saleDate: z.string().optional(),
  notes: z.string().optional(),
});

// GET /api/sales - List all sales
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const platform = searchParams.get("platform");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const where: any = {
      userId: session.user.id,
    };

    if (platform && platform !== "all") {
      where.platform = platform.toUpperCase();
    }

    if (status && status !== "all") {
      where.status = status.toUpperCase();
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { customerName: { contains: search, mode: "insensitive" } },
        { orderId: { contains: search, mode: "insensitive" } },
      ];
    }

    if (startDate || endDate) {
      where.saleDate = {};
      if (startDate) {
        where.saleDate.gte = new Date(startDate);
      }
      if (endDate) {
        where.saleDate.lte = new Date(endDate);
      }
    }

    const [sales, total, stats] = await Promise.all([
      prisma.sale.findMany({
        where,
        include: {
          project: {
            select: { id: true, title: true },
          },
        },
        orderBy: { saleDate: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.sale.count({ where }),
      prisma.sale.aggregate({
        where: {
          userId: session.user.id,
          status: "COMPLETED",
        },
        _sum: { amount: true },
        _count: true,
      }),
    ]);

    return NextResponse.json({
      data: sales,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      stats: {
        totalRevenue: stats._sum.amount || 0,
        totalSales: stats._count || 0,
      },
    });
  } catch (error) {
    console.error("Error fetching sales:", error);
    return NextResponse.json(
      { error: "Satışlar yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// POST /api/sales - Create a new sale
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createSaleSchema.parse(body);

    const sale = await prisma.sale.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        amount: validatedData.amount,
        currency: validatedData.currency,
        platform: validatedData.platform,
        status: validatedData.status,
        orderId: validatedData.orderId,
        customerName: validatedData.customerName,
        customerEmail: validatedData.customerEmail,
        projectId: validatedData.projectId,
        saleDate: validatedData.saleDate ? new Date(validatedData.saleDate) : new Date(),
        notes: validatedData.notes,
        userId: session.user.id,
      },
      include: {
        project: {
          select: { id: true, title: true },
        },
      },
    });

    return NextResponse.json(sale, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Geçersiz veri", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error creating sale:", error);
    return NextResponse.json(
      { error: "Satış oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
}

