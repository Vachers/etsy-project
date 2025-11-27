// Platform definitions for seeding database
// These are the default platforms that will be added to the database

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

// Empty arrays for removed features - can be populated later
export const aiPlatforms: never[] = [];
export const mockupCategories: never[] = [];
export const mockupSources: never[] = [];

export const salesPlatforms: SalesPlatformData[] = [
  {
    name: "Etsy",
    slug: "etsy",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Etsy_logo.svg/200px-Etsy_logo.svg.png",
    websiteUrl: "https://www.etsy.com",
    commissionRate: 6.5,
    defaultCurrency: "USD",
    color: "#f56400",
    description: "El yapımı ve vintage ürünler için global pazar yeri",
  },
  {
    name: "Gumroad",
    slug: "gumroad",
    logo: "https://gumroad.com/favicon.ico",
    websiteUrl: "https://gumroad.com",
    commissionRate: 10,
    defaultCurrency: "USD",
    color: "#ff90e8",
    description: "Dijital ürün satışı için basit platform",
  },
  {
    name: "Amazon KDP",
    slug: "amazon-kdp",
    logo: "https://kdp.amazon.com/favicon.ico",
    websiteUrl: "https://kdp.amazon.com",
    commissionRate: 30,
    defaultCurrency: "USD",
    color: "#ff9900",
    description: "E-kitap ve print-on-demand yayıncılık",
  },
  {
    name: "Creative Market",
    slug: "creative-market",
    logo: "https://creativemarket.com/favicon.ico",
    websiteUrl: "https://creativemarket.com",
    commissionRate: 40,
    defaultCurrency: "USD",
    color: "#8bc34a",
    description: "Tasarım varlıkları için pazar yeri",
  },
  {
    name: "Envato",
    slug: "envato",
    logo: "https://envato.com/favicon.ico",
    websiteUrl: "https://envato.com",
    commissionRate: 50,
    defaultCurrency: "USD",
    color: "#82b541",
    description: "Dijital varlıklar için dev pazar yeri",
  },
  {
    name: "Bandcamp",
    slug: "bandcamp",
    logo: "https://bandcamp.com/favicon.ico",
    websiteUrl: "https://bandcamp.com",
    commissionRate: 15,
    defaultCurrency: "USD",
    color: "#629aa9",
    description: "Bağımsız müzisyenler için satış platformu",
  },
  {
    name: "Steam",
    slug: "steam",
    logo: "https://store.steampowered.com/favicon.ico",
    websiteUrl: "https://store.steampowered.com",
    commissionRate: 30,
    defaultCurrency: "USD",
    color: "#1b2838",
    description: "PC oyunları için en büyük platform",
  },
  {
    name: "Unity Asset Store",
    slug: "unity-asset-store",
    logo: "https://assetstore.unity.com/favicon.ico",
    websiteUrl: "https://assetstore.unity.com",
    commissionRate: 30,
    defaultCurrency: "USD",
    color: "#000000",
    description: "Unity oyun varlıkları mağazası",
  },
  {
    name: "Canva",
    slug: "canva",
    logo: "https://www.canva.com/favicon.ico",
    websiteUrl: "https://www.canva.com/creators",
    commissionRate: 35,
    defaultCurrency: "USD",
    color: "#00c4cc",
    description: "Canva şablon satışı",
  },
  {
    name: "Codecanyon",
    slug: "codecanyon",
    logo: "https://codecanyon.net/favicon.ico",
    websiteUrl: "https://codecanyon.net",
    commissionRate: 37.5,
    defaultCurrency: "USD",
    color: "#0084ff",
    description: "Script ve kod satışı için pazar yeri",
  },
];
