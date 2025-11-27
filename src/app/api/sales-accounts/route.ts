import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Tüm satış hesaplarını getir
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const platformId = searchParams.get("platformId");

    const where = platformId ? { platformId } : {};

    const accounts = await prisma.salesAccount.findMany({
      where,
      include: {
        platform: true,
        _count: {
          select: { listings: true },
        },
      },
      orderBy: [{ isDefault: "desc" }, { name: "asc" }],
    });

    return NextResponse.json(accounts);
  } catch (error) {
    console.error("Sales accounts fetch error:", error);
    return NextResponse.json(
      { error: "Satış hesapları getirilemedi" },
      { status: 500 }
    );
  }
}

// Yeni satış hesabı oluştur
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, platformId, shopName, shopUrl, username, email, isDefault, notes } = body;

    if (!name || !platformId) {
      return NextResponse.json(
        { error: "Hesap adı ve platform zorunludur" },
        { status: 400 }
      );
    }

    // Eğer isDefault true ise, aynı platformdaki diğer hesapların isDefault'ını false yap
    if (isDefault) {
      await prisma.salesAccount.updateMany({
        where: { platformId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const account = await prisma.salesAccount.create({
      data: {
        name,
        platformId,
        shopName,
        shopUrl,
        username,
        email,
        isDefault: isDefault || false,
        notes,
        isActive: true,
      },
      include: {
        platform: true,
      },
    });

    return NextResponse.json(account, { status: 201 });
  } catch (error) {
    console.error("Sales account creation error:", error);
    return NextResponse.json(
      { error: "Satış hesabı oluşturulamadı" },
      { status: 500 }
    );
  }
}


