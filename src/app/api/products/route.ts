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

const createProductSchema = z.object({
  title: z.string().min(1, "Başlık gereklidir"),
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
  ]),
  status: z.enum(["DRAFT", "ACTIVE", "SELLING", "ARCHIVED"]).default("DRAFT"),
  downloadUrl: z.string().optional(),
  fileSize: z.string().optional(),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.any()).optional(),
  listings: z.array(listingSchema).optional(),
});

// GET /api/products - List all digital products
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");

    const where: any = {
      userId: session.user.id,
    };

    if (category && category !== "all") {
      where.category = category.toUpperCase().replace(/-/g, "_");
    }

    if (status && status !== "all") {
      where.status = status.toUpperCase();
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.digitalProduct.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          listings: {
            include: {
              platform: true,
              salesRecords: {
                orderBy: { periodEnd: "desc" },
                take: 1,
              },
            },
          },
        },
      }),
      prisma.digitalProduct.count({ where }),
    ]);

    // Calculate stats for each product
    const productsWithStats = products.map((product) => {
      const totalSales = product.listings.reduce((sum, listing) => {
        return sum + listing.salesRecords.reduce((lSum, record) => lSum + record.quantity, 0);
      }, 0);

      const totalRevenue = product.listings.reduce((sum, listing) => {
        return sum + listing.salesRecords.reduce((lSum, record) => lSum + Number(record.netRevenue), 0);
      }, 0);

      return {
        ...product,
        totalSales,
        totalRevenue,
      };
    });

    // Get category stats
    const categoryStats = await prisma.digitalProduct.groupBy({
      by: ["category"],
      where: { userId: session.user.id },
      _count: true,
    });

    return NextResponse.json({
      data: productsWithStats,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      stats: categoryStats,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Ürünler yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// POST /api/products - Create a new digital product
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createProductSchema.parse(body);

    // Create product with listings in a transaction
    const product = await prisma.$transaction(async (tx) => {
      // Create the product
      const newProduct = await tx.digitalProduct.create({
        data: {
          title: validatedData.title,
          description: validatedData.description,
          thumbnail: validatedData.thumbnail,
          category: validatedData.category,
          status: validatedData.status,
          downloadUrl: validatedData.downloadUrl,
          fileSize: validatedData.fileSize,
          tags: validatedData.tags || [],
          metadata: validatedData.metadata,
          userId: session.user.id,
        },
      });

      // Create listings if provided
      if (validatedData.listings && validatedData.listings.length > 0) {
        await tx.productPlatformListing.createMany({
          data: validatedData.listings.map((listing) => ({
            productId: newProduct.id,
            platformId: listing.platformId,
            price: listing.price,
            currency: listing.currency,
            productUrl: listing.productUrl,
            status: listing.status,
            listedAt: listing.status === "SELLING" ? new Date() : null,
          })),
        });
      }

      // Return product with listings
      return tx.digitalProduct.findUnique({
        where: { id: newProduct.id },
        include: {
          listings: {
            include: {
              platform: true,
            },
          },
        },
      });
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Geçersiz veri", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Ürün oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
}
