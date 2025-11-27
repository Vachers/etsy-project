import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { salesPlatforms } from "@/lib/platforms";

// POST /api/seed - Seed database with initial data
export async function POST(request: Request) {
  try {
    // Check for secret key
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");
    
    if (secret !== process.env.SEED_SECRET && secret !== "initial-setup-2024") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const results = {
      admin: null as string | null,
      platforms: 0,
      errors: [] as string[],
    };

    // 1. Create admin user
    try {
      const existingAdmin = await prisma.user.findUnique({
        where: { email: "sinanbaslar@gmail.com" },
      });

      if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash("Sb26112020!", 12);
        const admin = await prisma.user.create({
          data: {
            email: "sinanbaslar@gmail.com",
            name: "Sinan Başlar",
            password: hashedPassword,
            role: "ADMIN",
          },
        });
        results.admin = admin.id;
      } else {
        results.admin = existingAdmin.id;
        results.errors.push("Admin kullanıcı zaten mevcut");
      }
    } catch (error) {
      results.errors.push(`Admin oluşturma hatası: ${error}`);
    }

    // 2. Seed platforms
    for (const platform of salesPlatforms) {
      try {
        const existing = await prisma.salesPlatform.findUnique({
          where: { slug: platform.slug },
        });

        if (!existing) {
          await prisma.salesPlatform.create({
            data: {
              name: platform.name,
              slug: platform.slug,
              logo: platform.logo,
              websiteUrl: platform.websiteUrl,
              commissionRate: platform.commissionRate,
              defaultCurrency: platform.defaultCurrency,
              color: platform.color,
              description: platform.description,
              isActive: true,
            },
          });
          results.platforms++;
        }
      } catch (error) {
        results.errors.push(`Platform ${platform.name} hatası: ${error}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Seed işlemi tamamlandı",
      results,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Seed işlemi başarısız", details: String(error) },
      { status: 500 }
    );
  }
}

// GET /api/seed - Check seed status
export async function GET() {
  try {
    const userCount = await prisma.user.count();
    const platformCount = await prisma.salesPlatform.count();
    const productCount = await prisma.digitalProduct.count();

    return NextResponse.json({
      status: "ok",
      counts: {
        users: userCount,
        platforms: platformCount,
        products: productCount,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Veritabanı bağlantı hatası", details: String(error) },
      { status: 500 }
    );
  }
}

