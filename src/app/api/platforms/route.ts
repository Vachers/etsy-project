// ========================================
// Platforms API Route
// GET: List all platforms
// POST: Create new platform
// ========================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET - List all platforms
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("active") === "true";

    const platforms = await prisma.salesPlatform.findMany({
      where: activeOnly ? { isActive: true } : undefined,
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { listings: true },
        },
      },
    });

    return NextResponse.json(platforms);
  } catch (error) {
    console.error("Error fetching platforms:", error);
    return NextResponse.json(
      { error: "Platformlar yüklenirken hata oluştu" },
      { status: 500 }
    );
  }
}

// POST - Create new platform
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      slug,
      logo,
      websiteUrl,
      commissionRate,
      defaultCurrency,
      color,
      description,
    } = body;

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json(
        { error: "Platform adı ve slug zorunludur" },
        { status: 400 }
      );
    }

    // Check if platform already exists
    const existingPlatform = await prisma.salesPlatform.findFirst({
      where: {
        OR: [{ name }, { slug }],
      },
    });

    if (existingPlatform) {
      return NextResponse.json(
        { error: "Bu isim veya slug ile platform zaten mevcut" },
        { status: 400 }
      );
    }

    const platform = await prisma.salesPlatform.create({
      data: {
        name,
        slug,
        logo,
        websiteUrl,
        commissionRate: commissionRate || 0,
        defaultCurrency: defaultCurrency || "USD",
        color: color || "#2563eb",
        description,
      },
    });

    return NextResponse.json(platform, { status: 201 });
  } catch (error) {
    console.error("Error creating platform:", error);
    return NextResponse.json(
      { error: "Platform oluşturulurken hata oluştu" },
      { status: 500 }
    );
  }
}

