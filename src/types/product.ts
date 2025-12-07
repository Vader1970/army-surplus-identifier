export interface VisionAnalysis {
  guessedName: string;
  branchOrNation: string;
  eraOrDecade: string;
  itemType: string;
  camouflagePattern: string;
  likelyUseCases: string[];
  conditionGuess: string;
  isCollectableLikely: boolean;
  isLikelyReplica: boolean;
  confidence: number;
  historicalNotes: string;
  otherDetails: string;
}

export interface GeneratedContent {
  suggestedTitle: string;
  description: string;
  features: string[];
  tags: string[];
  notesForLister: string;

  navPrimary: string;
  navSecondary: string;
  navTertiary: string;
  navPath: string;

  seo: {
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string[];
  };
}

export interface ProductFormData {
  title: string;
  category: string;
  isCollectable: boolean;
  staffNotes: string;
  images: string[]; // Array of base64 images
}

export const CATEGORIES = [
  "Leather & Flight Jackets",
  "Winter Coats & Liners",
  "Field Jackets & Parkas",
  "Dress Jackets & Tunics",
  "Rain & Softshell Jackets",
  "Vests & Waistcoats",
  "Track Tops & Hoodies",
  "Camouflage Jackets",

  "Field Shirts",
  "Service & Dress Shirts",
  "Camouflage Shirts",
  "Plain & Print T-Shirts",
  "Camouflage T-Shirts",
  "Polos",
  "Singlets & Tank Tops",

  "Combat & Cargo Trousers",
  "Tactical & Duty Trousers",
  "Shorts & Sports Pants",
  "Rain & Softshell Trousers",
  "Dress Trousers",
  "Camouflage Trousers",
  "Work Pants",

  "Headwear",
  "Fleeces & Jerseys",
  "Belts & Suspenders",
  "Overalls",
  "Gloves & Mittens",
  "Thermals & Base Layers",
  "Sunglasses & Goggles",
  "Children's Clothing",

  "Boots",
  "Packs & Bags",
  "Combat Gear",
  "Camping & Survival",
  "Equipment & Accessories",
  "Collectables & Rarities",
  "Dog Tags",
  "One-Offs (Collectables)",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];
