// Satış Platformları
export interface SalesPlatformData {
  name: string;
  slug: string;
  logo?: string;
  websiteUrl: string;
  commissionRate: number;
  defaultCurrency: string;
  color: string;
  description: string;
}

export const salesPlatforms: SalesPlatformData[] = [
  {
    name: "Etsy",
    slug: "etsy",
    websiteUrl: "https://www.etsy.com",
    commissionRate: 6.5,
    defaultCurrency: "USD",
    color: "#f56400",
    description: "El yapımı ve dijital ürünler için popüler pazar yeri",
  },
  {
    name: "Gumroad",
    slug: "gumroad",
    websiteUrl: "https://gumroad.com",
    commissionRate: 10,
    defaultCurrency: "USD",
    color: "#ff90e8",
    description: "Dijital ürün satışı için basit platform",
  },
  {
    name: "Amazon KDP",
    slug: "amazon-kdp",
    websiteUrl: "https://kdp.amazon.com",
    commissionRate: 30,
    defaultCurrency: "USD",
    color: "#ff9900",
    description: "Amazon Kindle Direct Publishing",
  },
  {
    name: "Creative Market",
    slug: "creative-market",
    websiteUrl: "https://creativemarket.com",
    commissionRate: 40,
    defaultCurrency: "USD",
    color: "#8bc34a",
    description: "Tasarım varlıkları için pazar yeri",
  },
  {
    name: "Redbubble",
    slug: "redbubble",
    websiteUrl: "https://www.redbubble.com",
    commissionRate: 80,
    defaultCurrency: "USD",
    color: "#e41321",
    description: "Print-on-demand ürün platformu",
  },
  {
    name: "Society6",
    slug: "society6",
    websiteUrl: "https://society6.com",
    commissionRate: 90,
    defaultCurrency: "USD",
    color: "#000000",
    description: "Sanatçılar için print-on-demand",
  },
  {
    name: "Zazzle",
    slug: "zazzle",
    websiteUrl: "https://www.zazzle.com",
    commissionRate: 85,
    defaultCurrency: "USD",
    color: "#ff6900",
    description: "Özelleştirilebilir ürün platformu",
  },
  {
    name: "Printful",
    slug: "printful",
    websiteUrl: "https://www.printful.com",
    commissionRate: 0,
    defaultCurrency: "USD",
    color: "#00b4a8",
    description: "Print-on-demand ve dropshipping servisi",
  },
  {
    name: "Canva",
    slug: "canva",
    websiteUrl: "https://www.canva.com/creators",
    commissionRate: 35,
    defaultCurrency: "USD",
    color: "#00c4cc",
    description: "Canva şablon ve grafik satışı",
  },
  {
    name: "Envato Elements",
    slug: "envato-elements",
    websiteUrl: "https://elements.envato.com",
    commissionRate: 50,
    defaultCurrency: "USD",
    color: "#82b541",
    description: "Dijital varlıklar için premium platform",
  },
  {
    name: "Envato Market",
    slug: "envato-market",
    websiteUrl: "https://themeforest.net",
    commissionRate: 37.5,
    defaultCurrency: "USD",
    color: "#82b541",
    description: "ThemeForest, CodeCanyon vb.",
  },
  {
    name: "Shopify",
    slug: "shopify",
    websiteUrl: "https://www.shopify.com",
    commissionRate: 2.9,
    defaultCurrency: "USD",
    color: "#7ab55c",
    description: "E-ticaret platformu",
  },
  {
    name: "WooCommerce",
    slug: "woocommerce",
    websiteUrl: "https://woocommerce.com",
    commissionRate: 0,
    defaultCurrency: "USD",
    color: "#96588a",
    description: "WordPress e-ticaret eklentisi",
  },
  {
    name: "eBay",
    slug: "ebay",
    websiteUrl: "https://www.ebay.com",
    commissionRate: 12.9,
    defaultCurrency: "USD",
    color: "#e53238",
    description: "Küresel açık artırma ve satış platformu",
  },
  {
    name: "Trendyol",
    slug: "trendyol",
    websiteUrl: "https://www.trendyol.com",
    commissionRate: 15,
    defaultCurrency: "TRY",
    color: "#f27a1a",
    description: "Türkiye'nin en büyük e-ticaret platformu",
  },
  {
    name: "Hepsiburada",
    slug: "hepsiburada",
    websiteUrl: "https://www.hepsiburada.com",
    commissionRate: 12,
    defaultCurrency: "TRY",
    color: "#ff6000",
    description: "Türkiye e-ticaret platformu",
  },
  {
    name: "N11",
    slug: "n11",
    websiteUrl: "https://www.n11.com",
    commissionRate: 10,
    defaultCurrency: "TRY",
    color: "#7b2d8e",
    description: "Türkiye pazar yeri",
  },
];

// AI Görsel Platformları
export interface AIPlatformData {
  id: string;
  name: string;
  color: string;
  versions?: string[];
}

export const aiPlatforms: AIPlatformData[] = [
  {
    id: "MIDJOURNEY",
    name: "Midjourney",
    color: "#5865F2",
    versions: ["v4", "v5", "v5.1", "v5.2", "v6", "v6.1", "niji"],
  },
  {
    id: "FLUX",
    name: "Flux",
    color: "#FF6B6B",
    versions: ["Flux Pro", "Flux Dev", "Flux Schnell", "Flux 1.1 Pro"],
  },
  {
    id: "NANO_BANANA_PRO",
    name: "Nano Banana Pro",
    color: "#FFE135",
    versions: ["v1", "v2"],
  },
  {
    id: "LEONARDO_AI",
    name: "Leonardo AI",
    color: "#6366F1",
    versions: ["Leonardo Diffusion", "Leonardo Vision", "PhotoReal", "DreamShaper"],
  },
  {
    id: "DALLE",
    name: "DALL-E",
    color: "#10A37F",
    versions: ["DALL-E 2", "DALL-E 3"],
  },
  {
    id: "STABLE_DIFFUSION",
    name: "Stable Diffusion",
    color: "#A855F7",
    versions: ["SD 1.5", "SDXL", "SD 3.0", "SD Turbo"],
  },
  {
    id: "IDEOGRAM",
    name: "Ideogram",
    color: "#EC4899",
    versions: ["v1", "v2"],
  },
  {
    id: "PLAYGROUND",
    name: "Playground AI",
    color: "#22C55E",
    versions: ["Playground v2", "Playground v2.5"],
  },
  {
    id: "BING_IMAGE_CREATOR",
    name: "Bing Image Creator",
    color: "#00A4EF",
    versions: ["DALL-E 3"],
  },
  {
    id: "ADOBE_FIREFLY",
    name: "Adobe Firefly",
    color: "#FF0000",
    versions: ["Firefly Image 2", "Firefly Image 3"],
  },
  {
    id: "OTHER",
    name: "Diğer",
    color: "#6B7280",
    versions: [],
  },
];

// Mockup Kaynakları
export interface MockupSourceData {
  id: string;
  name: string;
  color: string;
}

export const mockupSources: MockupSourceData[] = [
  { id: "PLACEIT", name: "Placeit", color: "#5E5CE6" },
  { id: "CANVA", name: "Canva", color: "#00C4CC" },
  { id: "PHOTOSHOP", name: "Photoshop", color: "#31A8FF" },
  { id: "FIGMA", name: "Figma", color: "#F24E1E" },
  { id: "SMARTMOCKUPS", name: "SmartMockups", color: "#FF5722" },
  { id: "MOCKUP_WORLD", name: "Mockup World", color: "#4CAF50" },
  { id: "OTHER", name: "Diğer", color: "#6B7280" },
];

// Mockup Kategorileri
export interface MockupCategoryData {
  id: string;
  name: string;
  icon: string;
}

export const mockupCategories: MockupCategoryData[] = [
  { id: "TSHIRT", name: "T-Shirt", icon: "👕" },
  { id: "MUG", name: "Kupa", icon: "☕" },
  { id: "POSTER", name: "Poster", icon: "🖼️" },
  { id: "FRAME", name: "Çerçeve", icon: "🖼️" },
  { id: "PHONE_CASE", name: "Telefon Kılıfı", icon: "📱" },
  { id: "TOTE_BAG", name: "Bez Çanta", icon: "👜" },
  { id: "PILLOW", name: "Yastık", icon: "🛋️" },
  { id: "CANVAS", name: "Kanvas", icon: "🎨" },
  { id: "BOOK_COVER", name: "Kitap Kapağı", icon: "📚" },
  { id: "DIGITAL_DEVICE", name: "Dijital Cihaz", icon: "💻" },
  { id: "OTHER", name: "Diğer", icon: "📦" },
];

// Dosya Türleri
export interface FileTypeData {
  id: string;
  name: string;
  extension: string;
  color: string;
}

export const fileTypes: FileTypeData[] = [
  { id: "PSD", name: "Photoshop", extension: ".psd", color: "#31A8FF" },
  { id: "AI", name: "Illustrator", extension: ".ai", color: "#FF9A00" },
  { id: "PNG", name: "PNG", extension: ".png", color: "#5C6BC0" },
  { id: "JPG", name: "JPEG", extension: ".jpg", color: "#43A047" },
  { id: "SVG", name: "SVG", extension: ".svg", color: "#FFB300" },
  { id: "PDF", name: "PDF", extension: ".pdf", color: "#F44336" },
  { id: "ZIP", name: "ZIP", extension: ".zip", color: "#795548" },
  { id: "RAR", name: "RAR", extension: ".rar", color: "#9C27B0" },
  { id: "EPS", name: "EPS", extension: ".eps", color: "#FF5722" },
  { id: "TIFF", name: "TIFF", extension: ".tiff", color: "#607D8B" },
  { id: "OTHER", name: "Diğer", extension: "", color: "#6B7280" },
];

// Pre-Sale Aşamaları
export interface PreSaleStageData {
  id: string;
  name: string;
  color: string;
  order: number;
}

export const preSaleStages: PreSaleStageData[] = [
  { id: "IDEA", name: "Fikir", color: "#9333EA", order: 1 },
  { id: "RESEARCH", name: "Araştırma", color: "#3B82F6", order: 2 },
  { id: "DESIGN", name: "Tasarım", color: "#F59E0B", order: 3 },
  { id: "MOCKUP", name: "Mockup", color: "#EC4899", order: 4 },
  { id: "SEO", name: "SEO", color: "#10B981", order: 5 },
  { id: "READY", name: "Hazır", color: "#22C55E", order: 6 },
];


