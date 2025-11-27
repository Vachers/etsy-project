import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createSalesRecordSchema = z.object({
  listingId: z.string(),
  periodStart: z.string().transform((val) => new Date(val)),
  periodEnd: z.string().transform((val) => new Date(val)),
  quantity: z.number().int().nonnegative(),
  grossRevenue: z.number().nonnegative(),
  commissionAmount: z.number().nonnegative(),
  netRevenue: z.number(),
  currency: z.string().default("TRY"),
  notes: z.string().optional(),
});

// GET /api/products/[id]/sales - Get all sales records for a product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const platformId = searchParams.get("platformId");

    // Verify product ownership
    const product = await prisma.digitalProduct.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
    }

    if (product.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Get sales records
    const listings = await prisma.productPlatformListing.findMany({
      where: {
        productId: id,
        ...(platformId ? { platformId } : {}),
      },
      include: {
        platform: true,
        salesRecords: {
          orderBy: { periodEnd: "desc" },
        },
      },
    });

    // Calculate totals
    const totals = listings.reduce(
      (acc, listing) => {
        listing.salesRecords.forEach((record) => {
          acc.totalQuantity += record.quantity;
          acc.totalGrossRevenue += Number(record.grossRevenue);
          acc.totalCommission += Number(record.commissionAmount);
          acc.totalNetRevenue += Number(record.netRevenue);
        });
        return acc;
      },
      {
        totalQuantity: 0,
        totalGrossRevenue: 0,
        totalCommission: 0,
        totalNetRevenue: 0,
      }
    );

    return NextResponse.json({
      listings,
      totals,
    });
  } catch (error) {
    console.error("Error fetching sales records:", error);
    return NextResponse.json(
      { error: "Satış kayıtları yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// POST /api/products/[id]/sales - Create a new sales record
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = createSalesRecordSchema.parse(body);

    // Verify product ownership and listing
    const listing = await prisma.productPlatformListing.findUnique({
      where: { id: validatedData.listingId },
      include: {
        product: {
          select: { userId: true },
        },
      },
    });

    if (!listing) {
      return NextResponse.json({ error: "Liste bulunamadı" }, { status: 404 });
    }

    if (listing.product.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (listing.productId !== id) {
      return NextResponse.json(
        { error: "Liste bu ürüne ait değil" },
        { status: 400 }
      );
    }

    // Create sales record
    const salesRecord = await prisma.salesRecord.create({
      data: {
        listingId: validatedData.listingId,
        periodStart: validatedData.periodStart,
        periodEnd: validatedData.periodEnd,
        quantity: validatedData.quantity,
        grossRevenue: validatedData.grossRevenue,
        commissionAmount: validatedData.commissionAmount,
        netRevenue: validatedData.netRevenue,
        currency: validatedData.currency,
        notes: validatedData.notes,
      },
      include: {
        listing: {
          include: {
            platform: true,
          },
        },
      },
    });

    return NextResponse.json(salesRecord, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Geçersiz veri", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error creating sales record:", error);
    return NextResponse.json(
      { error: "Satış kaydı oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
}

