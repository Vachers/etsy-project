import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const listingSchema = z.object({
  platformId: z.string(),
  price: z.number().nonnegative(),
  currency: z.string().default("TRY"),
  productUrl: z.string().optional(),
  status: z.enum(["DRAFT", "ACTIVE", "SELLING", "PAUSED", "ARCHIVED"]).default("DRAFT"),
});

const updateProductSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  thumbnail: z.string().optional(),
  category: z.enum([
    "EBOOKS",
    "DIGITAL_PRODUCTS",
    "DIGITAL_BUNDLES",
    "SOCIAL_MEDIA",
    "DETECTIVE_PROJECTS",
    "MUSIC_PROJECTS",
    "GAME_SELL",
  ]).optional(),
  status: z.enum(["DRAFT", "ACTIVE", "SELLING", "ARCHIVED"]).optional(),
  downloadUrl: z.string().optional(),
  fileSize: z.string().optional(),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
  listings: z.array(listingSchema).optional(),
});

// GET /api/products/[id] - Get a single product
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

    const product = await prisma.digitalProduct.findUnique({
      where: { id },
      include: {
        listings: {
          include: {
            platform: true,
            salesRecords: {
              orderBy: { periodEnd: "desc" },
            },
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
    }

    if (product.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Ürün yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// PATCH /api/products/[id] - Update a product
export async function PATCH(
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
    const validatedData = updateProductSchema.parse(body);

    // Check if product exists and belongs to user
    const existingProduct = await prisma.digitalProduct.findUnique({
      where: { id },
      include: { listings: true },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
    }

    if (existingProduct.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Update product with listings in a transaction
    const product = await prisma.$transaction(async (tx) => {
      // Update the product
      await tx.digitalProduct.update({
        where: { id },
        data: {
          title: validatedData.title,
          description: validatedData.description,
          thumbnail: validatedData.thumbnail,
          category: validatedData.category,
          status: validatedData.status,
          downloadUrl: validatedData.downloadUrl,
          fileSize: validatedData.fileSize,
          tags: validatedData.tags,
          metadata: validatedData.metadata,
        },
      });

      // Update listings if provided
      if (validatedData.listings) {
        // Get existing listing platform IDs
        const existingPlatformIds = existingProduct.listings.map(l => l.platformId);
        const newPlatformIds = validatedData.listings.map(l => l.platformId);

        // Delete removed listings
        const toDelete = existingPlatformIds.filter(id => !newPlatformIds.includes(id));
        if (toDelete.length > 0) {
          await tx.productPlatformListing.deleteMany({
            where: {
              productId: id,
              platformId: { in: toDelete },
            },
          });
        }

        // Upsert listings
        for (const listing of validatedData.listings) {
          await tx.productPlatformListing.upsert({
            where: {
              productId_platformId: {
                productId: id,
                platformId: listing.platformId,
              },
            },
            update: {
              price: listing.price,
              currency: listing.currency,
              productUrl: listing.productUrl,
              status: listing.status,
              listedAt: listing.status === "SELLING" ? new Date() : undefined,
            },
            create: {
              productId: id,
              platformId: listing.platformId,
              price: listing.price,
              currency: listing.currency,
              productUrl: listing.productUrl,
              status: listing.status,
              listedAt: listing.status === "SELLING" ? new Date() : null,
            },
          });
        }
      }

      // Return updated product
      return tx.digitalProduct.findUnique({
        where: { id },
        include: {
          listings: {
            include: {
              platform: true,
              salesRecords: {
                orderBy: { periodEnd: "desc" },
              },
            },
          },
        },
      });
    });

    return NextResponse.json(product);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Geçersiz veri", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Ürün güncellenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Delete a product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const product = await prisma.digitalProduct.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
    }

    if (product.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.digitalProduct.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Ürün silinirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
