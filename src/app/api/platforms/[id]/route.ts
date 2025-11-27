// ========================================
// Platform [id] API Route
// GET: Get platform by ID
// PATCH: Update platform
// DELETE: Delete platform
// ========================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET - Get platform by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const platform = await prisma.salesPlatform.findUnique({
      where: { id },
      include: {
        listings: {
          include: {
            product: true,
            salesRecords: {
              orderBy: { periodEnd: "desc" },
              take: 5,
            },
          },
        },
        _count: {
          select: { listings: true },
        },
      },
    });

    if (!platform) {
      return NextResponse.json(
        { error: "Platform bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json(platform);
  } catch (error) {
    console.error("Error fetching platform:", error);
    return NextResponse.json(
      { error: "Platform yüklenirken hata oluştu" },
      { status: 500 }
    );
  }
}

// PATCH - Update platform
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const platform = await prisma.salesPlatform.findUnique({
      where: { id },
    });

    if (!platform) {
      return NextResponse.json(
        { error: "Platform bulunamadı" },
        { status: 404 }
      );
    }

    // Check for duplicate name/slug if changed
    if (body.name && body.name !== platform.name) {
      const existingName = await prisma.salesPlatform.findFirst({
        where: { name: body.name, NOT: { id } },
      });
      if (existingName) {
        return NextResponse.json(
          { error: "Bu isimle başka bir platform mevcut" },
          { status: 400 }
        );
      }
    }

    if (body.slug && body.slug !== platform.slug) {
      const existingSlug = await prisma.salesPlatform.findFirst({
        where: { slug: body.slug, NOT: { id } },
      });
      if (existingSlug) {
        return NextResponse.json(
          { error: "Bu slug ile başka bir platform mevcut" },
          { status: 400 }
        );
      }
    }

    const updatedPlatform = await prisma.salesPlatform.update({
      where: { id },
      data: {
        name: body.name,
        slug: body.slug,
        logo: body.logo,
        websiteUrl: body.websiteUrl,
        commissionRate: body.commissionRate,
        defaultCurrency: body.defaultCurrency,
        color: body.color,
        description: body.description,
        isActive: body.isActive,
      },
    });

    return NextResponse.json(updatedPlatform);
  } catch (error) {
    console.error("Error updating platform:", error);
    return NextResponse.json(
      { error: "Platform güncellenirken hata oluştu" },
      { status: 500 }
    );
  }
}

// DELETE - Delete platform
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const platform = await prisma.salesPlatform.findUnique({
      where: { id },
      include: {
        _count: {
          select: { listings: true },
        },
      },
    });

    if (!platform) {
      return NextResponse.json(
        { error: "Platform bulunamadı" },
        { status: 404 }
      );
    }

    // Check if platform has listings
    if (platform._count.listings > 0) {
      return NextResponse.json(
        {
          error: `Bu platform ${platform._count.listings} ürün ile ilişkili. Önce ürün ilişkilerini kaldırın.`,
        },
        { status: 400 }
      );
    }

    await prisma.salesPlatform.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting platform:", error);
    return NextResponse.json(
      { error: "Platform silinirken hata oluştu" },
      { status: 500 }
    );
  }
}

