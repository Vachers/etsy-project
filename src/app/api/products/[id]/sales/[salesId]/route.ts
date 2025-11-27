import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateSalesRecordSchema = z.object({
  periodStart: z.string().transform((val) => new Date(val)).optional(),
  periodEnd: z.string().transform((val) => new Date(val)).optional(),
  quantity: z.number().int().nonnegative().optional(),
  grossRevenue: z.number().nonnegative().optional(),
  commissionAmount: z.number().nonnegative().optional(),
  netRevenue: z.number().optional(),
  currency: z.string().optional(),
  notes: z.string().optional(),
});

// GET /api/products/[id]/sales/[salesId] - Get a single sales record
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; salesId: string }> }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, salesId } = await params;

    const salesRecord = await prisma.salesRecord.findUnique({
      where: { id: salesId },
      include: {
        listing: {
          include: {
            platform: true,
            product: {
              select: { id: true, title: true, userId: true },
            },
          },
        },
      },
    });

    if (!salesRecord) {
      return NextResponse.json(
        { error: "Satış kaydı bulunamadı" },
        { status: 404 }
      );
    }

    if (salesRecord.listing.product.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (salesRecord.listing.productId !== id) {
      return NextResponse.json(
        { error: "Satış kaydı bu ürüne ait değil" },
        { status: 400 }
      );
    }

    return NextResponse.json(salesRecord);
  } catch (error) {
    console.error("Error fetching sales record:", error);
    return NextResponse.json(
      { error: "Satış kaydı yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// PATCH /api/products/[id]/sales/[salesId] - Update a sales record
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; salesId: string }> }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, salesId } = await params;
    const body = await request.json();
    const validatedData = updateSalesRecordSchema.parse(body);

    // Verify ownership
    const existingRecord = await prisma.salesRecord.findUnique({
      where: { id: salesId },
      include: {
        listing: {
          include: {
            product: {
              select: { userId: true },
            },
          },
        },
      },
    });

    if (!existingRecord) {
      return NextResponse.json(
        { error: "Satış kaydı bulunamadı" },
        { status: 404 }
      );
    }

    if (existingRecord.listing.product.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (existingRecord.listing.productId !== id) {
      return NextResponse.json(
        { error: "Satış kaydı bu ürüne ait değil" },
        { status: 400 }
      );
    }

    const updatedRecord = await prisma.salesRecord.update({
      where: { id: salesId },
      data: {
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

    return NextResponse.json(updatedRecord);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Geçersiz veri", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error updating sales record:", error);
    return NextResponse.json(
      { error: "Satış kaydı güncellenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id]/sales/[salesId] - Delete a sales record
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; salesId: string }> }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, salesId } = await params;

    // Verify ownership
    const existingRecord = await prisma.salesRecord.findUnique({
      where: { id: salesId },
      include: {
        listing: {
          include: {
            product: {
              select: { userId: true },
            },
          },
        },
      },
    });

    if (!existingRecord) {
      return NextResponse.json(
        { error: "Satış kaydı bulunamadı" },
        { status: 404 }
      );
    }

    if (existingRecord.listing.product.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (existingRecord.listing.productId !== id) {
      return NextResponse.json(
        { error: "Satış kaydı bu ürüne ait değil" },
        { status: 400 }
      );
    }

    await prisma.salesRecord.delete({
      where: { id: salesId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting sales record:", error);
    return NextResponse.json(
      { error: "Satış kaydı silinirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

