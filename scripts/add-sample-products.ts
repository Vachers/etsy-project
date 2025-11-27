import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Get admin user
  const admin = await prisma.user.findUnique({
    where: { email: "sinanbaslar@gmail.com" },
  });

  if (!admin) {
    console.error("Admin kullanıcı bulunamadı!");
    return;
  }

  console.log("Admin kullanıcı bulundu:", admin.name);

  // Sample products for each category
  const products = [
    {
      title: "React ile Modern Web Geliştirme Rehberi",
      description: "Bu kapsamlı e-kitap, React.js ile modern web uygulamaları geliştirmenin tüm yönlerini kapsamaktadır. Hooks, Context API, Redux ve daha fazlası!",
      category: "EBOOKS" as const,
      status: "ACTIVE" as const,
      fileSize: "15 MB",
      tags: ["react", "javascript", "web development", "frontend"],
    },
    {
      title: "UI/UX Design Kit Pro",
      description: "Profesyonel UI/UX tasarım kiti. 500+ bileşen, 100+ sayfa şablonu içerir.",
      category: "DIGITAL_PRODUCTS" as const,
      status: "ACTIVE" as const,
      fileSize: "250 MB",
      tags: ["ui", "ux", "design", "figma", "sketch"],
    },
    {
      title: "Complete Business Bundle",
      description: "İş dünyası için komple dijital paket. Sunum şablonları, Excel dosyaları, Word belgeleri.",
      category: "DIGITAL_BUNDLES" as const,
      status: "ACTIVE" as const,
      fileSize: "500 MB",
      tags: ["business", "templates", "bundle", "office"],
    },
    {
      title: "Social Media Templates Pack",
      description: "Instagram, Facebook, Twitter için 200+ sosyal medya şablonu.",
      category: "SOCIAL_MEDIA" as const,
      status: "ACTIVE" as const,
      fileSize: "180 MB",
      tags: ["social media", "instagram", "facebook", "templates"],
    },
    {
      title: "Mystery Detective Game Assets",
      description: "Dedektif oyunu için hazır asset paketi. Karakterler, arka planlar, efektler.",
      category: "DETECTIVE_PROJECTS" as const,
      status: "ACTIVE" as const,
      fileSize: "350 MB",
      tags: ["game assets", "detective", "mystery", "characters"],
    },
    {
      title: "Lofi Hip Hop Sample Pack",
      description: "Lofi müzik prodüksiyonu için 500+ sample. Drums, melodies, effects.",
      category: "MUSIC_PROJECTS" as const,
      status: "ACTIVE" as const,
      fileSize: "2 GB",
      tags: ["lofi", "hip hop", "samples", "music production"],
    },
    {
      title: "Indie Game Starter Kit",
      description: "Unity için hazır oyun başlangıç kiti. Tam kaynak kodu dahil.",
      category: "GAME_SELL" as const,
      status: "ACTIVE" as const,
      fileSize: "450 MB",
      tags: ["unity", "game", "indie", "starter kit", "source code"],
    },
  ];

  console.log("\nÜrünler ekleniyor...\n");

  for (const productData of products) {
    try {
      const existing = await prisma.digitalProduct.findFirst({
        where: { 
          title: productData.title,
          userId: admin.id,
        },
      });

      if (existing) {
        console.log(`⏭️  "${productData.title}" zaten mevcut`);
        continue;
      }

      const product = await prisma.digitalProduct.create({
        data: {
          ...productData,
          userId: admin.id,
        },
      });
      console.log(`✅ "${product.title}" eklendi (${product.category})`);
    } catch (error) {
      console.error(`❌ "${productData.title}" eklenirken hata:`, error);
    }
  }

  console.log("\n✅ Tüm ürünler eklendi!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

