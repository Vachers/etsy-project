import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateSaleSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  amount: z.number().positive().optional(),
  currency: z.string().optional(),
  platform: z.enum(["ETSY", "AMAZON", "SHOPIFY", "EBAY", "WEBSITE", "OTHER"]).optional(),
  status: z.enum(["PENDING", "COMPLETED", "REFUNDED", "CANCELLED"]).optional(),
  orderId: z.string().optional(),
  customerName: z.string().optional(),
  customerEmail: z.string().email().optional(),
  projectId: z.string().optional().nullable(),
  saleDate: z.string().optional(),
  notes: z.string().optional(),
});

// GET /api/sales/[id] - Get a single sale
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sale = await prisma.sale.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
      include: {
        project: {
          select: { id: true, title: true },
        },
      },
    });

    if (!sale) {
      return NextResponse.json({ error: "Satış bulunamadı" }, { status: 404 });
    }

    return NextResponse.json(sale);
  } catch (error) {
    console.error("Error fetching sale:", error);
    return NextResponse.json(
      { error: "Satış yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// PATCH /api/sales/[id] - Update a sale
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if sale exists and belongs to user
    const existingSale = await prisma.sale.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!existingSale) {
      return NextResponse.json({ error: "Satış bulunamadı" }, { status: 404 });
    }

    const body = await request.json();
    const validatedData = updateSaleSchema.parse(body);

    const sale = await prisma.sale.update({
      where: { id },
      data: {
        ...validatedData,
        saleDate: validatedData.saleDate ? new Date(validatedData.saleDate) : undefined,
      },
      include: {
        project: {
          select: { id: true, title: true },
        },
      },
    });

    return NextResponse.json(sale);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Geçersiz veri", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error updating sale:", error);
    return NextResponse.json(
      { error: "Satış güncellenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// DELETE /api/sales/[id] - Delete a sale
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if sale exists and belongs to user
    const existingSale = await prisma.sale.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!existingSale) {
      return NextResponse.json({ error: "Satış bulunamadı" }, { status: 404 });
    }

    await prisma.sale.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Satış başarıyla silindi" });
  } catch (error) {
    console.error("Error deleting sale:", error);
    return NextResponse.json(
      { error: "Satış silinirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

