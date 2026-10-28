import { repairMojibake } from "../lib/text-encoding";

const media = (url: string, altBn = "", altEn = "") => ({
  url,
  publicId: "",
  alt: { bn: altBn, en: altEn },
  width: 0,
  height: 0,
});

const heroImage = media(
  "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=2000&q=85",
  "à¦¸à§‹à¦²à¦¾à¦° à¦ªà§à¦¯à¦¾à¦¨à§‡à¦²",
  "Solar panels",
);

const aboutImage = media(
  "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1000&q=85",
  "à¦¸à§Œà¦° à¦¬à¦¿à¦¦à§à¦¯à§à§Ž à¦ªà§à¦°à¦•à¦²à§à¦ª",
  "Solar power project",
);

const projectOneImage = media(
  "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=800&q=80",
  "à¦†à¦¬à¦¾à¦¸à¦¿à¦• à¦¸à§‹à¦²à¦¾à¦°",
  "Residential solar",
);

const projectTwoImage = media(
  "https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=800&q=80",
  "à¦‡à¦¨à¦­à¦¾à¦°à§à¦Ÿà¦¾à¦° à¦¸à¦¿à¦¸à§à¦Ÿà§‡à¦®",
  "Inverter system",
);

const projectThreeImage = media(
  "https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=800&q=80",
  "à¦•à¦®à¦¾à¦°à§à¦¶à¦¿à¦¯à¦¼à¦¾à¦² à¦¸à§‹à¦²à¦¾à¦°",
  "Commercial solar",
);

export const siteSettingSeed = {
  key: "site",
  siteName: {
    bn: "à¦•à¦¾à¦¶à§à¦®à§€à¦°à¦¿ à¦ªà¦¾à¦“à¦¯à¦¼à¦¾à¦° à¦‡à¦žà§à¦œà¦¿à¦¨à¦¿à¦¯à¦¼à¦¾à¦°à¦¿à¦‚ à¦¸à¦²à¦¿à¦‰à¦¶à¦¨ à¦¹à¦¾à¦¬",
    en: "Kashmiri Power Engineering Solution Hub",
  },
  shortName: "KPESH",
  tagline: {
    bn: "à¦¸à§à¦®à¦¾à¦°à§à¦Ÿ à¦à¦¨à¦¾à¦°à§à¦œà¦¿, à¦¨à¦¿à¦°à§à¦­à¦°à¦¯à§‹à¦—à§à¦¯ à¦¸à¦®à¦¾à¦§à¦¾à¦¨",
    en: "Smart energy. Reliable solutions.",
  },
  logo: media("", "KPESH à¦²à§‹à¦—à§‹", "KPESH logo"),
  backgroundVideo: { url: "", publicId: "", mimeType: "" },
  faviconUrl: "",
  theme: {
    navy: "#092a32",
    navy2: "#0c3940",
    brand: "#9bd64a",
    brandDark: "#4d8d2a",
  },
  contact: {
    phone: "+880 1918-268922",
    phoneAlt: "",
    email: "kashmiripower.esh@gmail.com",
    whatsapp: "+8801918268922",
    address: {
      bn: "à¦ªà§à¦²à¦¿à¦¶ à¦ªà§à¦²à¦¾à¦œà¦¾, à§¨à¦¯à¦¼ à¦¤à¦²à¦¾, à¦®à§à¦•à¦¸à§à¦¦à¦ªà§à¦°, à¦—à§‹à¦ªà¦¾à¦²à¦—à¦žà§à¦œ, à¦¬à¦¾à¦‚à¦²à¦¾à¦¦à§‡à¦¶",
      en: "Police Plaza, 2nd Floor, Muksudpur, Gopalganj, Bangladesh",
    },
    mapUrl: "",
  },
  social: {
    facebook: "",
    youtube: "",
    instagram: "",
    linkedin: "",
  },
  seo: {
    title: {
      bn: "KPESH | à¦•à¦¾à¦¶à§à¦®à§€à¦°à¦¿ à¦ªà¦¾à¦“à¦¯à¦¼à¦¾à¦° à¦‡à¦žà§à¦œà¦¿à¦¨à¦¿à¦¯à¦¼à¦¾à¦°à¦¿à¦‚ à¦¸à¦²à¦¿à¦‰à¦¶à¦¨ à¦¹à¦¾à¦¬",
      en: "KPESH | Kashmiri Power Engineering Solution Hub",
    },
    description: {
      bn: "à¦®à§à¦•à¦¸à§à¦¦à¦ªà§à¦°, à¦—à§‹à¦ªà¦¾à¦²à¦—à¦žà§à¦œà§‡ à¦¸à§‹à¦²à¦¾à¦°, IPS, à¦‡à¦¨à¦­à¦¾à¦°à§à¦Ÿà¦¾à¦° à¦“ à¦¬à§à¦¯à¦¾à¦Ÿà¦¾à¦°à¦¿ à¦¸à¦®à¦¾à¦§à¦¾à¦¨à¥¤",
      en: "Solar, IPS, inverter and battery solutions in Muksudpur, Gopalganj, Bangladesh.",
    },
    keywords: [
      "KPESH",
      "solar",
      "IPS",
      "inverter",
      "battery",
      "Muksudpur",
      "Gopalganj",
      "Bangladesh",
    ],
    ogImageUrl: heroImage.url,
  },
  announcement: {
    enabled: false,
    text: { bn: "", en: "" },
  },
};

export const categorySeeds = [
  {
    kind: "service" as const,
    name: { bn: "à¦¸à§‹à¦²à¦¾à¦°", en: "Solar" },
    slug: "solar",
    description: {
      bn: "à¦¸à§‹à¦²à¦¾à¦° à¦ªà§à¦¯à¦¾à¦¨à§‡à¦² à¦“ à¦¸à¦¿à¦¸à§à¦Ÿà§‡à¦® à¦¸à¦²à¦¿à¦‰à¦¶à¦¨",
      en: "Solar panel and system solutions",
    },
    icon: "â˜€",
    sortOrder: 1,
  },
  {
    kind: "service" as const,
    name: { bn: "à¦¬à§à¦¯à¦¾à¦•à¦†à¦ª à¦ªà¦¾à¦“à¦¯à¦¼à¦¾à¦°", en: "Backup power" },
    slug: "backup-power",
    description: {
      bn: "IPS, à¦‡à¦¨à¦­à¦¾à¦°à§à¦Ÿà¦¾à¦° à¦“ à¦¬à§à¦¯à¦¾à¦Ÿà¦¾à¦°à¦¿ à¦¸à¦¿à¦¸à§à¦Ÿà§‡à¦®",
      en: "IPS, inverter and battery systems",
    },
    icon: "ÏŸ",
    sortOrder: 2,
  },
  {
    kind: "service" as const,
    name: {
      bn: "à¦‡à¦¨à¦¸à§à¦Ÿà¦²à§‡à¦¶à¦¨ à¦“ à¦¸à¦¾à¦°à§à¦­à¦¿à¦¸",
      en: "Installation & service",
    },
    slug: "installation-service",
    description: {
      bn: "à¦¸à§‡à¦Ÿà¦†à¦ª, à¦°à¦•à§à¦·à¦£à¦¾à¦¬à§‡à¦•à§à¦·à¦£ à¦“ à¦Ÿà§‡à¦•à¦¨à¦¿à¦•à§à¦¯à¦¾à¦² à¦¸à¦¹à¦¾à¦¯à¦¼à¦¤à¦¾",
      en: "Setup, maintenance and technical support",
    },
    icon: "âŒ",
    sortOrder: 3,
  },
  {
    kind: "project" as const,
    name: { bn: "à¦†à¦¬à¦¾à¦¸à¦¿à¦• à¦¸à§‹à¦²à¦¾à¦°", en: "Residential solar" },
    slug: "residential-solar",
    description: {
      bn: "à¦¬à¦¾à¦¸à¦¾à¦° à¦œà¦¨à§à¦¯ à¦¸à§‹à¦²à¦¾à¦° à¦¸à¦®à¦¾à¦§à¦¾à¦¨",
      en: "Solar solutions for homes",
    },
    sortOrder: 1,
  },
  {
    kind: "project" as const,
    name: { bn: "à¦‡à¦¨à¦­à¦¾à¦°à§à¦Ÿà¦¾à¦° à¦¸à¦¿à¦¸à§à¦Ÿà§‡à¦®", en: "Inverter systems" },
    slug: "inverter-systems",
    description: {
      bn: "à¦¨à¦¿à¦°à¦¬à¦šà§à¦›à¦¿à¦¨à§à¦¨ à¦¬à¦¿à¦¦à§à¦¯à§à§Ž à¦¬à§à¦¯à¦¾à¦•à¦†à¦ª",
      en: "Reliable backup power",
    },
    sortOrder: 2,
  },
  {
    kind: "project" as const,
    name: { bn: "à¦•à¦®à¦¾à¦°à§à¦¶à¦¿à¦¯à¦¼à¦¾à¦² à¦¸à§‹à¦²à¦¾à¦°", en: "Commercial solar" },
    slug: "commercial-solar",
    description: {
      bn: "à¦¬à§à¦¯à¦¬à¦¸à¦¾à¦° à¦œà¦¨à§à¦¯ à¦à¦¨à¦¾à¦°à§à¦œà¦¿ à¦¸à¦®à¦¾à¦§à¦¾à¦¨",
      en: "Energy solutions for businesses",
    },
    sortOrder: 3,
  },
  {
    kind: "product" as const,
    name: { bn: "à¦¸à§‹à¦²à¦¾à¦° à¦ªà§à¦¯à¦¾à¦¨à§‡à¦²", en: "Solar panels" },
    slug: "solar-panels",
    description: {
      bn: "à¦¸à§‹à¦²à¦¾à¦° à¦ªà§à¦¯à¦¾à¦¨à§‡à¦² à¦“ à¦®à¦¡à¦¿à¦‰à¦²",
      en: "Solar panels and modules",
    },
    sortOrder: 1,
  },
  {
    kind: "product" as const,
    name: { bn: "à¦‡à¦¨à¦­à¦¾à¦°à§à¦Ÿà¦¾à¦°", en: "Inverters" },
    slug: "inverters",
    description: {
      bn: "à¦¹à¦¾à¦‡à¦¬à§à¦°à¦¿à¦¡ à¦“ à¦…à¦¨-à¦—à§à¦°à¦¿à¦¡ à¦‡à¦¨à¦­à¦¾à¦°à§à¦Ÿà¦¾à¦°",
      en: "Hybrid and on-grid inverters",
    },
    sortOrder: 2,
  },
  {
    kind: "product" as const,
    name: { bn: "à¦¬à§à¦¯à¦¾à¦Ÿà¦¾à¦°à¦¿", en: "Batteries" },
    slug: "batteries",
    description: {
      bn: "à¦¸à§‹à¦²à¦¾à¦° à¦“ à¦¬à§à¦¯à¦¾à¦•à¦†à¦ª à¦¬à§à¦¯à¦¾à¦Ÿà¦¾à¦°à¦¿",
      en: "Solar and backup batteries",
    },
    sortOrder: 3,
  },
  {
    kind: "product" as const,
    name: { bn: "IPS à¦¸à¦¿à¦¸à§à¦Ÿà§‡à¦®", en: "IPS systems" },
    slug: "ips-systems",
    description: {
      bn: "à¦¬à¦¾à¦¸à¦¾ à¦“ à¦ªà§à¦°à¦¤à¦¿à¦·à§à¦ à¦¾à¦¨à§‡à¦° IPS",
      en: "IPS for homes and offices",
    },
    sortOrder: 4,
  },
  {
    kind: "post" as const,
    name: { bn: "à¦–à¦¬à¦°", en: "News" },
    slug: "news",
    description: { bn: "KPESH à¦à¦° à¦–à¦¬à¦°", en: "KPESH news" },
    sortOrder: 1,
  },
  {
    kind: "post" as const,
    name: { bn: "à¦—à¦¾à¦‡à¦¡", en: "Guides" },
    slug: "guides",
    description: {
      bn: "à¦¸à§‹à¦²à¦¾à¦° à¦“ à¦¬à§à¦¯à¦¾à¦•à¦†à¦ª à¦ªà¦¾à¦“à¦¯à¦¼à¦¾à¦° à¦—à¦¾à¦‡à¦¡",
      en: "Solar and backup power guides",
    },
    sortOrder: 2,
  },
];

export const brandSeeds = [
  { name: "Growatt", slug: "growatt", website: "", sortOrder: 1 },
  { name: "DEYE", slug: "deye", website: "", sortOrder: 2 },
  { name: "Sungrow", slug: "sungrow", website: "", sortOrder: 3 },
  { name: "Jinko Solar", slug: "jinko-solar", website: "", sortOrder: 4 },
  { name: "Hithium", slug: "hithium", website: "", sortOrder: 5 },
];

export const serviceSeeds = [
  {
    categoryKey: "service:solar",
    title: { bn: "à¦¸à§‹à¦²à¦¾à¦° à¦¸à¦¿à¦¸à§à¦Ÿà§‡à¦®", en: "Solar Systems" },
    slug: "solar-systems",
    excerpt: {
      bn: "à¦¸à§‹à¦²à¦¾à¦° à¦ªà§à¦¯à¦¾à¦¨à§‡à¦² à¦“ à¦‰à¦ªà¦¯à§à¦•à§à¦¤ à¦…à¦¨-à¦—à§à¦°à¦¿à¦¡, à¦…à¦«-à¦—à§à¦°à¦¿à¦¡ à¦¬à¦¾ à¦¹à¦¾à¦‡à¦¬à§à¦°à¦¿à¦¡ à¦¸à¦¿à¦¸à§à¦Ÿà§‡à¦®à§‡à¦° à¦ªà¦°à¦¿à¦•à¦²à§à¦ªà¦¨à¦¾ à¦“ à¦‡à¦¨à¦¸à§à¦Ÿà¦²à§‡à¦¶à¦¨à¥¤",
      en: "Planning and installation of suitable on-grid, off-grid or hybrid solar systems.",
    },
    content: {
      bn: "à¦†à¦ªà¦¨à¦¾à¦° à¦¬à¦¿à¦¦à§à¦¯à§à§Ž à¦¬à§à¦¯à¦¬à¦¹à¦¾à¦°, à¦›à¦¾à¦¦à§‡à¦° à¦œà¦¾à¦¯à¦¼à¦—à¦¾ à¦“ à¦¬à¦¾à¦œà§‡à¦Ÿ à¦¬à§à¦à§‡ à¦‰à¦ªà¦¯à§à¦•à§à¦¤ à¦¸à§‹à¦²à¦¾à¦° à¦¸à¦¿à¦¸à§à¦Ÿà§‡à¦® à¦ªà¦°à¦¿à¦•à¦²à§à¦ªà¦¨à¦¾ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à¥¤ à¦ªà¦°à¦¿à¦•à¦²à§à¦ªà¦¨à¦¾ à¦¥à§‡à¦•à§‡ à¦‡à¦¨à¦¸à§à¦Ÿà¦²à§‡à¦¶à¦¨ à¦ªà¦°à§à¦¯à¦¨à§à¦¤ à¦¸à¦¹à¦¾à¦¯à¦¼à¦¤à¦¾ à¦ªà¦¾à¦“à¦¯à¦¼à¦¾ à¦¯à¦¾à¦¯à¦¼à¥¤",
      en: "We plan a suitable solar system based on your electricity usage, roof space and budget, with support from planning through installation.",
    },
    cover: heroImage,
    features: [
      {
        title: { bn: "à¦…à¦¨-à¦—à§à¦°à¦¿à¦¡ à¦¸à¦¿à¦¸à§à¦Ÿà§‡à¦®", en: "On-grid systems" },
        description: {
          bn: "à¦—à§à¦°à¦¿à¦¡à§‡à¦° à¦¸à¦¾à¦¥à§‡ à¦¸à¦‚à¦¯à§à¦•à§à¦¤ à¦¸à§‹à¦²à¦¾à¦° à¦¸à¦®à¦¾à¦§à¦¾à¦¨",
          en: "Solar solutions connected to the grid",
        },
      },
      {
        title: { bn: "à¦¹à¦¾à¦‡à¦¬à§à¦°à¦¿à¦¡ à¦¸à¦¿à¦¸à§à¦Ÿà§‡à¦®", en: "Hybrid systems" },
        description: {
          bn: "à¦¸à§‹à¦²à¦¾à¦° à¦“ à¦¬à§à¦¯à¦¾à¦Ÿà¦¾à¦°à¦¿ à¦¬à§à¦¯à¦¾à¦•à¦†à¦ª à¦à¦•à¦¸à¦¾à¦¥à§‡",
          en: "Solar with battery backup",
        },
      },
    ],
    featured: true,
    sortOrder: 1,
  },
  {
    categoryKey: "service:backup-power",
    title: { bn: "IPS à¦“ à¦‡à¦¨à¦­à¦¾à¦°à§à¦Ÿà¦¾à¦°", en: "IPS & Inverters" },
    slug: "ips-inverters",
    excerpt: {
      bn: "à¦¬à¦¾à¦¸à¦¾ à¦“ à¦ªà§à¦°à¦¤à¦¿à¦·à§à¦ à¦¾à¦¨à§‡à¦° à¦²à§‹à¦¡ à¦…à¦¨à§à¦¯à¦¾à¦¯à¦¼à§€ à¦‡à¦¨à¦­à¦¾à¦°à§à¦Ÿà¦¾à¦°, IPS à¦“ à¦¬à§à¦¯à¦¾à¦•à¦†à¦ª à¦¸à¦¿à¦¸à§à¦Ÿà§‡à¦® à¦¨à¦¿à¦°à§à¦¬à¦¾à¦šà¦¨à¥¤",
      en: "Choose backup systems and inverters based on your home or business load.",
    },
    content: {
      bn: "à¦†à¦ªà¦¨à¦¾à¦° à¦ªà§à¦°à¦¯à¦¼à§‹à¦œà¦¨à§€à¦¯à¦¼ à¦²à§‹à¦¡ à¦“ à¦¬à§à¦¯à¦¾à¦•à¦†à¦ª à¦¸à¦®à¦¯à¦¼ à¦…à¦¨à§à¦¯à¦¾à¦¯à¦¼à§€ à¦‡à¦¨à¦­à¦¾à¦°à§à¦Ÿà¦¾à¦° à¦“ IPS à¦¸à¦¿à¦¸à§à¦Ÿà§‡à¦® à¦¨à¦¿à¦°à§à¦¬à¦¾à¦šà¦¨à§‡ à¦¸à¦¹à¦¾à¦¯à¦¼à¦¤à¦¾ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à¥¤",
      en: "We help you choose an inverter and IPS system based on your required load and backup time.",
    },
    cover: projectTwoImage,
    features: [],
    featured: true,
    sortOrder: 2,
  },
  {
    categoryKey: "service:backup-power",
    title: { bn: "à¦¬à§à¦¯à¦¾à¦Ÿà¦¾à¦°à¦¿ à¦¸à¦²à¦¿à¦‰à¦¶à¦¨", en: "Battery Solutions" },
    slug: "battery-solutions",
    excerpt: {
      bn: "à¦¬à§à¦¯à¦¬à¦¹à¦¾à¦°, à¦¬à§à¦¯à¦¾à¦•à¦†à¦ª à¦¸à¦®à¦¯à¦¼ à¦“ à¦¸à¦¿à¦¸à§à¦Ÿà§‡à¦®à§‡à¦° à¦¸à¦¾à¦®à¦žà§à¦œà¦¸à§à¦¯ à¦…à¦¨à§à¦¯à¦¾à¦¯à¦¼à§€ à¦¬à§à¦¯à¦¾à¦Ÿà¦¾à¦°à¦¿ à¦¨à¦¿à¦°à§à¦¬à¦¾à¦šà¦¨à¥¤",
      en: "Battery selection based on usage, backup time and system compatibility.",
    },
    content: {
      bn: "à¦†à¦ªà¦¨à¦¾à¦° à¦¸à¦¿à¦¸à§à¦Ÿà§‡à¦® à¦“ à¦¬à§à¦¯à¦¬à¦¹à¦¾à¦°à§‡à¦° à¦§à¦°à¦¨ à¦…à¦¨à§à¦¯à¦¾à¦¯à¦¼à§€ à¦‰à¦ªà¦¯à§à¦•à§à¦¤ à¦¬à§à¦¯à¦¾à¦Ÿà¦¾à¦°à¦¿ à¦¬à§‡à¦›à§‡ à¦¨à¦¿à¦¤à§‡ à¦¸à¦¹à¦¾à¦¯à¦¼à¦¤à¦¾ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à¥¤",
      en: "We help you select the right battery for your system and usage pattern.",
    },
    cover: projectThreeImage,
    features: [],
    featured: true,
    sortOrder: 3,
  },
  {
    categoryKey: "service:installation-service",
    title: {
      bn: "à¦‡à¦¨à¦¸à§à¦Ÿà¦²à§‡à¦¶à¦¨ à¦“ à¦¸à¦¾à¦°à§à¦­à¦¿à¦¸",
      en: "Installation & Service",
    },
    slug: "installation-service",
    excerpt: {
      bn: "à¦¸à¦¿à¦¸à§à¦Ÿà§‡à¦® à¦¸à§‡à¦Ÿà¦†à¦ª, à¦ªà§à¦°à¦¾à¦¥à¦®à¦¿à¦• à¦ªà¦°à§€à¦•à§à¦·à¦¾, à¦°à¦•à§à¦·à¦£à¦¾à¦¬à§‡à¦•à§à¦·à¦£ à¦“ à¦Ÿà§‡à¦•à¦¨à¦¿à¦•à§à¦¯à¦¾à¦² à¦¸à¦¹à¦¾à¦¯à¦¼à¦¤à¦¾à¥¤",
      en: "System setup, initial checks, maintenance and technical assistance.",
    },
    content: {
      bn: "à¦¸à¦¿à¦¸à§à¦Ÿà§‡à¦® à¦‡à¦¨à¦¸à§à¦Ÿà¦²à§‡à¦¶à¦¨, à¦ªà§à¦°à¦¾à¦¥à¦®à¦¿à¦• à¦ªà¦°à§€à¦•à§à¦·à¦¾ à¦à¦¬à¦‚ à¦ªà¦°à¦¬à¦°à§à¦¤à§€ à¦Ÿà§‡à¦•à¦¨à¦¿à¦•à§à¦¯à¦¾à¦² à¦¸à¦¹à¦¾à¦¯à¦¼à¦¤à¦¾à¦° à¦œà¦¨à§à¦¯ à¦¯à§‹à¦—à¦¾à¦¯à§‹à¦— à¦•à¦°à¦¾ à¦¯à¦¾à¦¯à¦¼à¥¤",
      en: "Contact us for system installation, initial checks and ongoing technical support.",
    },
    cover: aboutImage,
    features: [],
    featured: true,
    sortOrder: 4,
  },
];

export const projectSeeds = [
  {
    categoryKey: "project:residential-solar",
    title: {
      bn: "à¦¬à¦¾à¦¸à¦¾à¦° à¦œà¦¨à§à¦¯ à¦¸à§‹à¦²à¦¾à¦° à¦¸à¦®à¦¾à¦§à¦¾à¦¨",
      en: "Solar solutions for homes",
    },
    slug: "home-solar-solution",
    excerpt: {
      bn: "à¦†à¦¬à¦¾à¦¸à¦¿à¦• à¦¸à§‹à¦²à¦¾à¦° à¦¸à¦¿à¦¸à§à¦Ÿà§‡à¦®à§‡à¦° à¦¨à¦®à§à¦¨à¦¾ à¦ªà§à¦°à¦•à¦²à§à¦ªà¥¤",
      en: "A sample residential solar project.",
    },
    content: {
      bn: "à¦à¦‡ à¦ªà§à¦°à¦•à¦²à§à¦ªà§‡à¦° à¦›à¦¬à¦¿ à¦“ à¦¬à¦¿à¦¬à¦°à¦£ à¦¡à§‡à¦®à§‹ à¦¹à¦¿à¦¸à§‡à¦¬à§‡ à¦¬à§à¦¯à¦¬à¦¹à§ƒà¦¤à¥¤ à¦¬à¦¾à¦¸à§à¦¤à¦¬ à¦ªà§à¦°à¦•à¦²à§à¦ªà§‡à¦° à¦¤à¦¥à§à¦¯ à¦…à§à¦¯à¦¾à¦¡à¦®à¦¿à¦¨ à¦ªà§à¦¯à¦¾à¦¨à§‡à¦² à¦¥à§‡à¦•à§‡ à¦¯à§‹à¦— à¦•à¦°à¦¾ à¦¯à¦¾à¦¬à§‡à¥¤",
      en: "The image and description are used as a demo. Real project details can be added from the admin panel.",
    },
    cover: projectOneImage,
    location: {
      bn: "à¦®à§à¦•à¦¸à§à¦¦à¦ªà§à¦°, à¦—à§‹à¦ªà¦¾à¦²à¦—à¦žà§à¦œ",
      en: "Muksudpur, Gopalganj",
    },
    capacity: "",
    featured: true,
    sortOrder: 1,
  },
  {
    categoryKey: "project:inverter-systems",
    title: {
      bn: "à¦¨à¦¿à¦°à¦¬à¦šà§à¦›à¦¿à¦¨à§à¦¨ à¦¬à¦¿à¦¦à§à¦¯à§à§Ž à¦¬à§à¦¯à¦¾à¦•à¦†à¦ª",
      en: "Reliable backup power",
    },
    slug: "backup-power-system",
    excerpt: {
      bn: "à¦‡à¦¨à¦­à¦¾à¦°à§à¦Ÿà¦¾à¦° à¦“ à¦¬à§à¦¯à¦¾à¦Ÿà¦¾à¦°à¦¿ à¦¬à§à¦¯à¦¾à¦•à¦†à¦ª à¦¸à¦¿à¦¸à§à¦Ÿà§‡à¦®à§‡à¦° à¦¨à¦®à§à¦¨à¦¾à¥¤",
      en: "A sample inverter and battery backup system.",
    },
    content: {
      bn: "à¦¡à§‡à¦®à§‹ à¦ªà§à¦°à¦•à¦²à§à¦ªà§‡à¦° à¦¬à¦¿à¦¬à¦°à¦£à¥¤ à¦¬à¦¾à¦¸à§à¦¤à¦¬ à¦¤à¦¥à§à¦¯ à¦ªà¦°à§‡ à¦¯à§‹à¦— à¦•à¦°à¦¾ à¦¹à¦¬à§‡à¥¤",
      en: "Demo project description. Real details will be added later.",
    },
    cover: projectTwoImage,
    location: {
      bn: "à¦®à§à¦•à¦¸à§à¦¦à¦ªà§à¦°, à¦—à§‹à¦ªà¦¾à¦²à¦—à¦žà§à¦œ",
      en: "Muksudpur, Gopalganj",
    },
    capacity: "",
    featured: true,
    sortOrder: 2,
  },
  {
    categoryKey: "project:commercial-solar",
    title: {
      bn: "à¦¬à§à¦¯à¦¬à¦¸à¦¾à¦° à¦œà¦¨à§à¦¯ à¦à¦¨à¦¾à¦°à§à¦œà¦¿",
      en: "Energy for businesses",
    },
    slug: "commercial-solar-project",
    excerpt: {
      bn: "à¦•à¦®à¦¾à¦°à§à¦¶à¦¿à¦¯à¦¼à¦¾à¦² à¦¸à§‹à¦²à¦¾à¦° à¦¸à¦¿à¦¸à§à¦Ÿà§‡à¦®à§‡à¦° à¦¨à¦®à§à¦¨à¦¾à¥¤",
      en: "A sample commercial solar system.",
    },
    content: {
      bn: "à¦¡à§‡à¦®à§‹ à¦ªà§à¦°à¦•à¦²à§à¦ªà§‡à¦° à¦¬à¦¿à¦¬à¦°à¦£à¥¤ à¦¬à¦¾à¦¸à§à¦¤à¦¬ à¦¤à¦¥à§à¦¯ à¦ªà¦°à§‡ à¦¯à§‹à¦— à¦•à¦°à¦¾ à¦¹à¦¬à§‡à¥¤",
      en: "Demo project description. Real details will be added later.",
    },
    cover: projectThreeImage,
    location: { bn: "à¦—à§‹à¦ªà¦¾à¦²à¦—à¦žà§à¦œ", en: "Gopalganj" },
    capacity: "",
    featured: true,
    sortOrder: 3,
  },
];

export const productSeeds = [
  {
    categoryKey: "product:inverters",
    brandSlug: "deye",
    title: {
      bn: "à§« à¦•à¦¿à¦²à§‹à¦“à¦¯à¦¼à¦¾à¦Ÿ à¦¹à¦¾à¦‡à¦¬à§à¦°à¦¿à¦¡ à¦‡à¦¨à¦­à¦¾à¦°à§à¦Ÿà¦¾à¦°",
      en: "5kW Hybrid Inverter",
    },
    slug: "5kw-hybrid-inverter",
    excerpt: {
      bn: "à¦¹à¦¾à¦‡à¦¬à§à¦°à¦¿à¦¡ à¦¸à§‹à¦²à¦¾à¦° à¦¸à¦¿à¦¸à§à¦Ÿà§‡à¦®à§‡à¦° à¦œà¦¨à§à¦¯ à¦‡à¦¨à¦­à¦¾à¦°à§à¦Ÿà¦¾à¦°à¥¤",
      en: "Inverter for hybrid solar systems.",
    },
    description: {
      bn: "à¦ªà¦£à§à¦¯à§‡à¦° à¦¬à¦¿à¦¸à§à¦¤à¦¾à¦°à¦¿à¦¤ à¦¸à§à¦ªà§‡à¦¸à¦¿à¦«à¦¿à¦•à§‡à¦¶à¦¨ à¦“ à¦¦à¦¾à¦® à¦…à§à¦¯à¦¾à¦¡à¦®à¦¿à¦¨ à¦ªà§à¦¯à¦¾à¦¨à§‡à¦² à¦¥à§‡à¦•à§‡ à¦¯à§‹à¦— à¦•à¦°à¦¾ à¦¯à¦¾à¦¬à§‡à¥¤",
      en: "Full specifications and pricing can be added from the admin panel.",
    },
    cover: projectTwoImage,
    price: { amount: 0, currency: "BDT", showPrice: false, callForPrice: true },
    specs: [
      { label: { bn: "à¦§à¦¾à¦°à¦£à¦•à§à¦·à¦®à¦¤à¦¾", en: "Capacity" }, value: "5kW" },
      { label: { bn: "à¦§à¦°à¦¨", en: "Type" }, value: "Hybrid" },
    ],
    stockStatus: "in_stock" as const,
    featured: true,
    sortOrder: 1,
  },
  {
    categoryKey: "product:solar-panels",
    brandSlug: "jinko-solar",
    title: {
      bn: "à§«à§«à§¦ à¦“à¦¯à¦¼à¦¾à¦Ÿ à¦¸à§‹à¦²à¦¾à¦° à¦ªà§à¦¯à¦¾à¦¨à§‡à¦²",
      en: "550W Solar Panel",
    },
    slug: "550w-solar-panel",
    excerpt: {
      bn: "à¦‰à¦šà§à¦š à¦¦à¦•à§à¦·à¦¤à¦¾à¦° à¦®à¦¨à§‹ à¦¸à§‹à¦²à¦¾à¦° à¦ªà§à¦¯à¦¾à¦¨à§‡à¦²à¥¤",
      en: "High-efficiency mono solar panel.",
    },
    description: {
      bn: "à¦ªà¦£à§à¦¯à§‡à¦° à¦¬à¦¿à¦¸à§à¦¤à¦¾à¦°à¦¿à¦¤ à¦¸à§à¦ªà§‡à¦¸à¦¿à¦«à¦¿à¦•à§‡à¦¶à¦¨ à¦“ à¦¦à¦¾à¦® à¦…à§à¦¯à¦¾à¦¡à¦®à¦¿à¦¨ à¦ªà§à¦¯à¦¾à¦¨à§‡à¦² à¦¥à§‡à¦•à§‡ à¦¯à§‹à¦— à¦•à¦°à¦¾ à¦¯à¦¾à¦¬à§‡à¥¤",
      en: "Full specifications and pricing can be added from the admin panel.",
    },
    cover: heroImage,
    price: { amount: 0, currency: "BDT", showPrice: false, callForPrice: true },
    specs: [{ label: { bn: "à¦§à¦¾à¦°à¦£à¦•à§à¦·à¦®à¦¤à¦¾", en: "Capacity" }, value: "550W" }],
    stockStatus: "in_stock" as const,
    featured: true,
    sortOrder: 2,
  },
  {
    categoryKey: "product:batteries",
    brandSlug: "hithium",
    title: {
      bn: "à¦²à¦¿à¦¥à¦¿à¦¯à¦¼à¦¾à¦® à¦¸à§‹à¦²à¦¾à¦° à¦¬à§à¦¯à¦¾à¦Ÿà¦¾à¦°à¦¿",
      en: "Lithium Solar Battery",
    },
    slug: "lithium-solar-battery",
    excerpt: {
      bn: "à¦¸à§‹à¦²à¦¾à¦° à¦¸à§à¦Ÿà§‹à¦°à§‡à¦œà§‡à¦° à¦œà¦¨à§à¦¯ à¦²à¦¿à¦¥à¦¿à¦¯à¦¼à¦¾à¦® à¦¬à§à¦¯à¦¾à¦Ÿà¦¾à¦°à¦¿à¥¤",
      en: "Lithium battery for solar storage.",
    },
    description: {
      bn: "à¦ªà¦£à§à¦¯à§‡à¦° à¦¬à¦¿à¦¸à§à¦¤à¦¾à¦°à¦¿à¦¤ à¦¸à§à¦ªà§‡à¦¸à¦¿à¦«à¦¿à¦•à§‡à¦¶à¦¨ à¦“ à¦¦à¦¾à¦® à¦…à§à¦¯à¦¾à¦¡à¦®à¦¿à¦¨ à¦ªà§à¦¯à¦¾à¦¨à§‡à¦² à¦¥à§‡à¦•à§‡ à¦¯à§‹à¦— à¦•à¦°à¦¾ à¦¯à¦¾à¦¬à§‡à¥¤",
      en: "Full specifications and pricing can be added from the admin panel.",
    },
    cover: projectThreeImage,
    price: { amount: 0, currency: "BDT", showPrice: false, callForPrice: true },
    specs: [{ label: { bn: "à¦§à¦°à¦¨", en: "Type" }, value: "Lithium" }],
    stockStatus: "in_stock" as const,
    featured: true,
    sortOrder: 3,
  },
  {
    categoryKey: "product:ips-systems",
    brandSlug: "",
    title: { bn: "à§« à¦•à§‡à¦­à¦¿à¦ IPS à¦¸à¦¿à¦¸à§à¦Ÿà§‡à¦®", en: "5kVA IPS System" },
    slug: "5kva-ips-system",
    excerpt: {
      bn: "à¦¬à¦¾à¦¸à¦¾ à¦“ à¦ªà§à¦°à¦¤à¦¿à¦·à§à¦ à¦¾à¦¨à§‡à¦° à¦œà¦¨à§à¦¯ IPS à¦¸à¦¿à¦¸à§à¦Ÿà§‡à¦®à¥¤",
      en: "IPS system for homes and offices.",
    },
    description: {
      bn: "à¦ªà¦£à§à¦¯à§‡à¦° à¦¬à¦¿à¦¸à§à¦¤à¦¾à¦°à¦¿à¦¤ à¦¸à§à¦ªà§‡à¦¸à¦¿à¦«à¦¿à¦•à§‡à¦¶à¦¨ à¦“ à¦¦à¦¾à¦® à¦…à§à¦¯à¦¾à¦¡à¦®à¦¿à¦¨ à¦ªà§à¦¯à¦¾à¦¨à§‡à¦² à¦¥à§‡à¦•à§‡ à¦¯à§‹à¦— à¦•à¦°à¦¾ à¦¯à¦¾à¦¬à§‡à¥¤",
      en: "Full specifications and pricing can be added from the admin panel.",
    },
    cover: projectTwoImage,
    price: { amount: 0, currency: "BDT", showPrice: false, callForPrice: true },
    specs: [{ label: { bn: "à¦§à¦¾à¦°à¦£à¦•à§à¦·à¦®à¦¤à¦¾", en: "Capacity" }, value: "5kVA" }],
    stockStatus: "in_stock" as const,
    featured: false,
    sortOrder: 4,
  },
];

export const faqSeeds = [
  {
    question: {
      bn: "à¦†à¦ªà¦¨à¦¾à¦°à¦¾ à¦•à§€ à¦•à§€ à¦¸à§‡à¦¬à¦¾ à¦¦à§‡à¦¨?",
      en: "What services do you offer?",
    },
    answer: {
      bn: "à¦¸à§‹à¦²à¦¾à¦° à¦¸à¦¿à¦¸à§à¦Ÿà§‡à¦®, IPS à¦“ à¦‡à¦¨à¦­à¦¾à¦°à§à¦Ÿà¦¾à¦°, à¦¬à§à¦¯à¦¾à¦Ÿà¦¾à¦°à¦¿ à¦¸à¦²à¦¿à¦‰à¦¶à¦¨ à¦à¦¬à¦‚ à¦‡à¦¨à¦¸à§à¦Ÿà¦²à§‡à¦¶à¦¨ à¦“ à¦¸à¦¾à¦°à§à¦­à¦¿à¦¸ à¦¨à¦¿à¦¯à¦¼à§‡ à¦•à¦¾à¦œ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à¥¤",
      en: "We work with solar systems, IPS and inverters, battery solutions, and installation and service.",
    },
    category: "general",
    sortOrder: 1,
  },
  {
    question: {
      bn: "ইনস্টলেশন কি আপনারা করেন?",
      en: "Do you handle installation?",
    },
    answer: {
      bn: "à¦¸à¦¿à¦¸à§à¦Ÿà§‡à¦® à¦¸à§‡à¦Ÿà¦†à¦ª à¦“ à¦ªà§à¦°à¦¾à¦¥à¦®à¦¿à¦• à¦ªà¦°à§€à¦•à§à¦·à¦¾à¦° à¦œà¦¨à§à¦¯ à¦¯à§‹à¦—à¦¾à¦¯à§‹à¦— à¦•à¦°à¦¤à§‡ à¦ªà¦¾à¦°à§‡à¦¨à¥¤ à¦¬à¦¿à¦¸à§à¦¤à¦¾à¦°à¦¿à¦¤ à¦¸à§‡à¦¬à¦¾ à¦ªà¦°à¦¿à¦¸à¦° à¦¯à§‹à¦—à¦¾à¦¯à§‹à¦— à¦•à¦°à§‡ à¦¨à¦¿à¦¶à§à¦šà¦¿à¦¤ à¦•à¦°à§à¦¨à¥¤",
      en: "You can contact us for system setup and initial checks. Confirm the exact service scope with us.",
    },
    category: "service",
    sortOrder: 2,
  },
  {
    question: {
      bn: "à¦•à§‹à¦¨ à¦à¦²à¦¾à¦•à¦¾à¦¯à¦¼ à¦¸à§‡à¦¬à¦¾ à¦ªà¦¾à¦“à¦¯à¦¼à¦¾ à¦¯à¦¾à¦¯à¦¼?",
      en: "Which areas do you serve?",
    },
    answer: {
      bn: "à¦®à§à¦•à¦¸à§à¦¦à¦ªà§à¦°, à¦—à§‹à¦ªà¦¾à¦²à¦—à¦žà§à¦œ à¦à¦²à¦¾à¦•à¦¾à¦¯à¦¼ à¦¸à§‡à¦¬à¦¾ à¦¦à§‡à¦“à¦¯à¦¼à¦¾ à¦¹à¦¯à¦¼à¥¤ à¦†à¦ªà¦¨à¦¾à¦° à¦à¦²à¦¾à¦•à¦¾ à¦¸à¦®à§à¦ªà¦°à§à¦•à§‡ à¦œà¦¾à¦¨à¦¤à§‡ à¦¯à§‹à¦—à¦¾à¦¯à§‹à¦— à¦•à¦°à§à¦¨à¥¤",
      en: "We serve the Muksudpur and Gopalganj area. Contact us to ask about your location.",
    },
    category: "general",
    sortOrder: 3,
  },
  {
    question: { bn: "à¦¦à¦¾à¦® à¦•à§€à¦­à¦¾à¦¬à§‡ à¦œà¦¾à¦¨à¦¬?", en: "How can I get pricing?" },
    answer: {
      bn: "à¦†à¦ªà¦¨à¦¾à¦° à¦ªà§à¦°à¦¯à¦¼à§‹à¦œà¦¨ à¦“ à¦²à§‹à¦¡ à¦œà¦¾à¦¨à¦¿à¦¯à¦¼à§‡ à¦¯à§‹à¦—à¦¾à¦¯à§‹à¦— à¦•à¦°à§à¦¨à¥¤ à¦ªà§à¦°à¦¯à¦¼à§‹à¦œà¦¨ à¦…à¦¨à§à¦¯à¦¾à¦¯à¦¼à§€ à¦•à§‹à¦Ÿà§‡à¦¶à¦¨ à¦¦à§‡à¦“à¦¯à¦¼à¦¾ à¦¹à¦¬à§‡à¥¤",
      en: "Contact us with your requirements and load details so we can prepare a quote.",
    },
    category: "pricing",
    sortOrder: 4,
  },
];

export const postSeeds = [
  {
    categoryKey: "post:news",
    title: {
      bn: "KPESH à¦“à¦¯à¦¼à§‡à¦¬à¦¸à¦¾à¦‡à¦Ÿà§‡ à¦¸à§à¦¬à¦¾à¦—à¦¤à¦®",
      en: "Welcome to the KPESH website",
    },
    slug: "welcome-to-kpesh",
    excerpt: {
      bn: "à¦†à¦®à¦¾à¦¦à§‡à¦° à¦¨à¦¤à§à¦¨ à¦“à¦¯à¦¼à§‡à¦¬à¦¸à¦¾à¦‡à¦Ÿà§‡à¦° à¦ªà§à¦°à¦¥à¦® à¦ªà§‹à¦¸à§à¦Ÿà¥¤",
      en: "The first post on our new website.",
    },
    content: {
      bn: "<p>KPESH à¦à¦° à¦¨à¦¤à§à¦¨ à¦“à¦¯à¦¼à§‡à¦¬à¦¸à¦¾à¦‡à¦Ÿà§‡ à¦¸à§à¦¬à¦¾à¦—à¦¤à¦®à¥¤ à¦¶à§€à¦˜à§à¦°à¦‡ à¦à¦–à¦¾à¦¨à§‡ à¦¸à§‹à¦²à¦¾à¦°, IPS, à¦‡à¦¨à¦­à¦¾à¦°à§à¦Ÿà¦¾à¦° à¦“ à¦¬à§à¦¯à¦¾à¦Ÿà¦¾à¦°à¦¿ à¦¸à¦®à§à¦ªà¦°à§à¦•à¦¿à¦¤ à¦¤à¦¥à§à¦¯ à¦ªà§à¦°à¦•à¦¾à¦¶à¦¿à¦¤ à¦¹à¦¬à§‡à¥¤</p>",
      en: "<p>Welcome to the new KPESH website. Solar, IPS, inverter and battery updates will be published here soon.</p>",
    },
    tags: ["KPESH", "website"],
    status: "published" as const,
  },
];

export const navigationSeeds = [
  { label: { bn: "à¦¹à§‹à¦®", en: "Home" }, href: "/", location: "header" as const, sortOrder: 1 },
  {
    label: { bn: "à¦†à¦®à¦¾à¦¦à§‡à¦° à¦¸à¦®à§à¦ªà¦°à§à¦•à§‡", en: "About" },
    href: "/about",
    location: "header" as const,
    sortOrder: 2,
  },
  {
    label: { bn: "à¦¸à§‡à¦¬à¦¾à¦¸à¦®à§‚à¦¹", en: "Services" },
    href: "/services",
    location: "header" as const,
    sortOrder: 3,
  },
  {
    label: { bn: "à¦ªà¦£à§à¦¯", en: "Products" },
    href: "/products",
    location: "header" as const,
    sortOrder: 4,
  },
  {
    label: { bn: "à¦ªà§à¦°à¦•à¦²à§à¦ª", en: "Projects" },
    href: "/projects",
    location: "header" as const,
    sortOrder: 5,
  },
  {
    label: { bn: "à¦¬à§à¦²à¦—", en: "Blog" },
    href: "/blog",
    location: "header" as const,
    sortOrder: 6,
  },
  {
    label: { bn: "à¦¯à§‹à¦—à¦¾à¦¯à§‹à¦—", en: "Contact" },
    href: "/contact",
    location: "header" as const,
    sortOrder: 7,
  },
];

export const contentBlockSeeds = [
  {
    key: "home.hero",
    type: "hero" as const,
    title: {
      bn: "à¦†à¦ªà¦¨à¦¾à¦° à¦­à¦¬à¦¿à¦·à§à¦¯à§Žà¦•à§‡ à¦¶à¦•à§à¦¤à¦¿ à¦¦à¦¿à¦¨ à¦¸à§à¦®à¦¾à¦°à§à¦Ÿ à¦à¦¨à¦¾à¦°à§à¦œà¦¿à¦¤à§‡",
      en: "Power your future with smarter energy",
    },
    content: {
      bn: "à¦¸à§‹à¦²à¦¾à¦°, IPS, à¦‡à¦¨à¦­à¦¾à¦°à§à¦Ÿà¦¾à¦° à¦“ à¦¬à§à¦¯à¦¾à¦Ÿà¦¾à¦°à¦¿à¦° à¦œà¦¨à§à¦¯ à¦ªà¦°à¦¿à¦•à¦²à§à¦ªà¦¨à¦¾ à¦¥à§‡à¦•à§‡ à¦‡à¦¨à¦¸à§à¦Ÿà¦²à§‡à¦¶à¦¨â€”à¦†à¦ªà¦¨à¦¾à¦° à¦ªà§à¦°à¦¯à¦¼à§‹à¦œà¦¨ à¦…à¦¨à§à¦¯à¦¾à¦¯à¦¼à§€ à¦¸à¦®à¦¾à¦§à¦¾à¦¨à¥¤",
      en: "From planning to installation, explore solar, IPS, inverter and battery solutions designed around your needs.",
    },
    image: heroImage,
    data: {
      eyebrow: {
        bn: "à¦¸à§à¦®à¦¾à¦°à§à¦Ÿ à¦à¦¨à¦¾à¦°à§à¦œà¦¿, à¦¨à¦¿à¦°à§à¦­à¦°à¦¯à§‹à¦—à§à¦¯ à¦¸à¦®à¦¾à¦§à¦¾à¦¨",
        en: "Smart energy. Reliable solutions.",
      },
      primaryCta: {
        label: {
          bn: "à¦ªà¦°à¦¾à¦®à¦°à§à¦¶ à¦“ à¦•à§‹à¦Ÿà§‡à¦¶à¦¨ à¦¨à¦¿à¦¨",
          en: "Get advice & a quote",
        },
        href: "/contact",
      },
      secondaryCta: {
        label: { bn: "à¦†à¦®à¦¾à¦¦à§‡à¦° à¦¸à§‡à¦¬à¦¾ à¦¦à§‡à¦–à§à¦¨", en: "Explore our services" },
        href: "/services",
      },
    },
    sortOrder: 1,
  },
  {
    key: "home.about",
    type: "about" as const,
    title: {
      bn: "à¦¶à¦•à§à¦¤à¦¿à¦° à¦¨à¦¿à¦°à§à¦­à¦°à¦¯à§‹à¦—à§à¦¯ à¦¸à¦®à¦¾à¦§à¦¾à¦¨, à¦†à¦ªà¦¨à¦¾à¦° à¦ªà¦¾à¦¶à§‡",
      en: "Reliable power solutions, by your side",
    },
    content: {
      bn: "Kashmiri Power Engineering Solution Hub à¦à¦•à¦Ÿà¦¿ à¦à¦¨à¦¾à¦°à§à¦œà¦¿ à¦¸à¦²à¦¿à¦‰à¦¶à¦¨ à¦¬à§à¦°à§à¦¯à¦¾à¦¨à§à¦¡, à¦¯à¦¾ à¦¸à§‹à¦²à¦¾à¦°, IPS, à¦‡à¦¨à¦­à¦¾à¦°à§à¦Ÿà¦¾à¦° à¦“ à¦¬à§à¦¯à¦¾à¦Ÿà¦¾à¦°à¦¿-à¦¸à¦®à§à¦ªà¦°à§à¦•à¦¿à¦¤ à¦ªà¦£à§à¦¯ à¦à¦¬à¦‚ à¦¸à§‡à¦¬à¦¾ à¦¨à¦¿à¦¯à¦¼à§‡ à¦•à¦¾à¦œ à¦•à¦°à¦¾à¦° à¦²à¦•à§à¦·à§à¦¯ à¦°à¦¾à¦–à§‡à¥¤",
      en: "Kashmiri Power Engineering Solution Hub is an energy-solutions brand focused on solar, IPS, inverter and battery-related products and services.",
    },
    image: aboutImage,
    data: {},
    sortOrder: 2,
  },
  {
    key: "home.cta",
    type: "cta" as const,
    title: {
      bn: "à¦†à¦ªà¦¨à¦¾à¦° à¦¬à¦¿à¦¦à§à¦¯à§à§Ž à¦šà¦¾à¦¹à¦¿à¦¦à¦¾ à¦¨à¦¿à¦¯à¦¼à§‡ à¦†à¦œà¦‡ à¦•à¦¥à¦¾ à¦¬à¦²à§à¦¨",
      en: "Let's discuss your power needs today",
    },
    content: {
      bn: "à¦†à¦ªà¦¨à¦¾à¦° à¦†à¦¨à§à¦®à¦¾à¦¨à¦¿à¦• à¦²à§‹à¦¡, à¦¬à¦¾à¦œà§‡à¦Ÿ à¦“ à¦ªà§à¦°à¦¯à¦¼à§‹à¦œà¦¨ à¦œà¦¾à¦¨à¦¾à¦²à§‡ à¦‰à¦ªà¦¯à§à¦•à§à¦¤ à¦¸à¦®à¦¾à¦§à¦¾à¦¨ à¦¨à¦¿à¦¯à¦¼à§‡ à¦†à¦²à§‹à¦šà¦¨à¦¾ à¦•à¦°à¦¾ à¦¯à¦¾à¦¬à§‡à¥¤",
      en: "Share your estimated load, budget and requirements so we can discuss a suitable solution.",
    },
    image: media(""),
    data: {
      button: {
        label: { bn: "à¦¯à§‹à¦—à¦¾à¦¯à§‹à¦— à¦•à¦°à§à¦¨", en: "Contact us" },
        href: "/contact",
      },
    },
    sortOrder: 3,
  },
  {
    key: "home.footer",
    type: "footer" as const,
    title: { bn: "", en: "" },
    content: {
      bn: "Powering Your Future with Smart Energy Solutions.",
      en: "Powering Your Future with Smart Energy Solutions.",
    },
    image: media(""),
    data: {},
    sortOrder: 4,
  },
];

function repairSeedText(value: unknown): void {
  if (!value || typeof value !== "object") return;

  for (const [key, child] of Object.entries(value)) {
    if (typeof child === "string") {
      const repaired = repairMojibake(child);
      if (repaired !== child) Object.assign(value, { [key]: repaired });
    } else {
      repairSeedText(child);
    }
  }
}

[
  siteSettingSeed,
  categorySeeds,
  brandSeeds,
  serviceSeeds,
  projectSeeds,
  productSeeds,
  faqSeeds,
  postSeeds,
  navigationSeeds,
  contentBlockSeeds,
].forEach(repairSeedText);
