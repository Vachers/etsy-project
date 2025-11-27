import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Tek satış hesabını getir
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const account = await prisma.salesAccount.findUnique({
      where: { id: params.id },
      include: {
        platform: true,
        listings: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!account) {
      return NextResponse.json(
        { error: "Satış hesabı bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json(account);
  } catch (error) {
    console.error("Sales account fetch error:", error);
    return NextResponse.json(
      { error: "Satış hesabı getirilemedi" },
      { status: 500 }
    );
  }
}

// Satış hesabını güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, shopName, shopUrl, username, email, isDefault, isActive, notes } = body;

    // Eğer isDefault true ise, aynı platformdaki diğer hesapların isDefault'ını false yap
    if (isDefault) {
      const currentAccount = await prisma.salesAccount.findUnique({
        where: { id: params.id },
      });

      if (currentAccount) {
        await prisma.salesAccount.updateMany({
          where: { platformId: currentAccount.platformId, isDefault: true, id: { not: params.id } },
          data: { isDefault: false },
        });
      }
    }

    const account = await prisma.salesAccount.update({
      where: { id: params.id },
      data: {
        name,
        shopName,
        shopUrl,
        username,
        email,
        isDefault,
        isActive,
        notes,
      },
      include: {
        platform: true,
      },
    });

    return NextResponse.json(account);
  } catch (error) {
    console.error("Sales account update error:", error);
    return NextResponse.json(
      { error: "Satış hesabı güncellenemedi" },
      { status: 500 }
    );
  }
}

// Satış hesabını sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.salesAccount.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: "Satış hesabı silindi" });
  } catch (error) {
    console.error("Sales account delete error:", error);
    return NextResponse.json(
      { error: "Satış hesabı silinemedi" },
      { status: 500 }
    );
  }
}


