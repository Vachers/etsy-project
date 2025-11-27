import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { salesPlatforms } from "@/lib/platforms";

// Platform Seeding API
export async function POST() {
  try {
    const results = [];

    for (const platform of salesPlatforms) {
      const existingPlatform = await prisma.salesPlatform.findUnique({
        where: { slug: platform.slug },
      });

      if (!existingPlatform) {
        const created = await prisma.salesPlatform.create({
          data: {
            name: platform.name,
            slug: platform.slug,
            websiteUrl: platform.websiteUrl,
            commissionRate: platform.commissionRate,
            defaultCurrency: platform.defaultCurrency,
            color: platform.color,
            description: platform.description,
            isActive: true,
          },
        });
        results.push({ action: "created", platform: created.name });
      } else {
        results.push({ action: "exists", platform: existingPlatform.name });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Platformlar başarıyla eklendi",
      results,
    });
  } catch (error) {
    console.error("Platform seeding error:", error);
    return NextResponse.json(
      { success: false, error: "Platform ekleme hatası" },
      { status: 500 }
    );
  }
}

// Tüm platformları getir
export async function GET() {
  try {
    const platforms = await prisma.salesPlatform.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { listings: true, salesAccounts: true },
        },
      },
    });

    return NextResponse.json(platforms);
  } catch (error) {
    console.error("Platform fetch error:", error);
    return NextResponse.json(
      { error: "Platformlar getirilemedi" },
      { status: 500 }
    );
  }
}
