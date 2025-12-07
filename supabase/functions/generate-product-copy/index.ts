/* eslint-disable */
// @ts-nocheck - This file runs on Deno, not Node.js
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

interface VisionAnalysis {
  guessedName: string;
  branchOrNation: string;
  eraOrDecade: string;
  itemType: string;
  camouflagePattern: string;
  likelyUseCases: string[];
  conditionGuess: string;
  isCollectableLikely: boolean;
  historicalNotes: string;
  otherDetails: string;
}

interface GeneratedContent {
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

async function analyzeImages(
  images: string[],
  title: string,
  category: string,
  isCollectable: boolean,
  staffNotes: string
): Promise<VisionAnalysis> {
  console.log(`Starting vision analysis with ${images.length} image(s)...`);

  const systemPrompt = `You are an expert in military surplus and outdoor clothing and equipment.

Your job is to:
1. Look at the supplied images.
2. Read the metadata (working title, category, staff notes, and collectable flag).
3. Identify what the item most likely is, as specifically as you reasonably can.
4. Return a structured JSON response only – no extra text.

The items will mostly be:
- Jackets, parkas, smocks, shirts, trousers, shorts
- Vests, raincoats, thermal layers
- Packs, webbing, belts, pouches
- Outdoor / hunting / tramping / camping gear
- Commercial replicas of classic military designs

IMPORTANT BEHAVIOUR
- Sometimes the working title will be UNKNOWN or empty. That means the user does NOT know what the item is. In that case, you must identify the item from the images yourself.
- Sometimes the working title will be a rough guess (e.g. "US flight jacket", "German parka"). Use this only as a hint. If the images disagree, trust the images.
- If you are not sure of a detail (e.g. exact model, decade, nation), you MUST say "unknown" or use "likely" instead of guessing with certainty.
- Never invent a specific contract number, NSN, or exact year.
- If it looks like a commercial replica rather than genuine surplus, state that.

Examine ALL images carefully - some may show the main item while others might show labels, tags, stamps, markings, or detail shots that help with identification.

IMPORTANT: Return ONLY valid JSON with no additional text or markdown formatting.`;

  const userPrompt = `Analyze these military surplus item images and provide identification details.

Look at ALL images - the first is typically the main product shot, but additional images may show important details like size labels, date stamps, manufacturer marks, or condition details.

Input data:
- Working Title: ${title || "UNKNOWN"}
- Category: ${category || "unknown"}
- Collectable flag: ${isCollectable}
- Staff notes: ${staffNotes || "none provided"}
- Number of images: ${images.length}

Return a JSON object with these exact fields:
{
  "guessedName": "string - your best identification (e.g. 'British Army DPM combat shirt' or 'UNKNOWN' if cannot identify)",
  "branchOrNation": "string (e.g. 'British Army', 'US Navy', 'Swiss Army', 'German Army', or 'UNKNOWN')",
  "eraOrDecade": "string - use 'likely' if uncertain (e.g. 'likely 1980s', 'WWII', 'Cold War era', or 'UNKNOWN')",
  "itemType": "string (e.g. 'field shirt', 'parka', 'cargo trousers', 'rucksack', 'helmet', or 'UNKNOWN')",
  "camouflagePattern": "string (e.g. 'DPM', 'Woodland', 'Flecktarn', 'Olive drab', 'None/solid colour', or 'UNKNOWN')",
  "likelyUseCases": ["hunting", "tramping", "camping", "reenactment", "collecting", "everyday wear"],
  "conditionGuess": "short phrase (e.g. 'used/very good', 'used/fair', 'mint', 'heavily worn', or 'UNKNOWN')",
  "isCollectableLikely": boolean,
  "isLikelyReplica": boolean,
  "confidence": number (0.0 to 1.0),
  "historicalNotes": "1-3 sentences summarising any historical context, if obvious. Include any info gleaned from labels/tags.",
  "otherDetails": "any other visually inferred details e.g. closure type, pockets, hood, lining, markings, label info, sizing from tags."
}`;
  // Build content array with text prompt and all images
  const contentArray: Array<{ type: string; text?: string; image_url?: { url: string; detail: string } }> = [
    { type: "text", text: userPrompt },
  ];

  // Add all images to the content array
  for (const imageBase64 of images) {
    contentArray.push({
      type: "image_url",
      image_url: {
        url: imageBase64,
        detail: "high",
      },
    });
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: contentArray,
        },
      ],
      max_tokens: 1000,
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Vision API error:", errorText);
    throw new Error(`Vision API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;

  console.log("Vision response:", content);

  // Parse JSON from response (handle potential markdown code blocks)
  let jsonStr = content;
  if (content.includes("```json")) {
    jsonStr = content.split("```json")[1].split("```")[0].trim();
  } else if (content.includes("```")) {
    jsonStr = content.split("```")[1].split("```")[0].trim();
  }

  return JSON.parse(jsonStr) as VisionAnalysis;
}

async function generateProductCopy(
  visionAnalysis: VisionAnalysis,
  title: string,
  category: string,
  isCollectable: boolean,
  staffNotes: string
): Promise<GeneratedContent> {
  console.log("Generating product copy...");

  const systemPrompt = `You are a professional product copywriter for a New Zealand outdoor and military surplus retailer.
Your job is to create accurate, descriptive, clear, New Zealand–English product descriptions for jackets, clothing, packs, boots, camping gear and genuine surplus items.

Your tone and structure MUST match the style of Army and Outdoors (NZ).
Do NOT use American-style phrasing, overhyped marketing, or terms like "airsoft" or "paintball" unless specifically provided in the staff notes.

Your audience is:
• Hunters
• Trampers / trekkers
• Campers
• Outdoor workers
• Collectors of military clothing
• People needing warm or cool, practical, durable everyday outerwear

Always use New Zealand/UK spelling (e.g., colour, aluminium, fibre, metre).

DESCRIPTION RULES
Your description MUST follow this structure:

**Paragraph 1**
• Clearly state what the item is.
• Mention whether it is surplus, replica, or commercially new.
• Describe the jacket/gear in practical outdoor use cases (hunting, tramping, camping, cold weather, general outdoor work).
• Comment on insulation, warmth, shell fabric, comfort, and durability.

**Paragraph 2**
• Identify key functional aspects (pockets, closures, lining, reinforced areas, design heritage).
• Provide practical outdoor usefulness (wind resistance, layering, reversible high-visibility side, lightweight warmth, etc.).
• If it is inspired by a military design, mention it factually and professionally.

**Paragraph 3 (optional, only when relevant)**
• Add any additional fit, construction, or performance notes if the item benefits from explanation.

FEATURES RULES
Each feature MUST be:
• Short
• Practical
• Outdoor-usage focused
• Specific to the garment's construction and design

Examples of feature tone:
• "Durable nylon shell built for outdoor use"
• "Warm polyester insulation for cold-weather conditions"
• "Reversible design with high-visibility orange lining"
• "Elasticated cuffs, collar and waistband to retain heat"

STRICT BEHAVIOUR
• NEVER mention airsoft or paintball unless provided in staff notes.
• NEVER repeat phrases like "fashion-forward."
• NEVER use overly American phrasing ("in the field", "gearheads", etc.).
• NEVER imply historical authenticity unless confirmed by vision analysis or staff notes.
• Keep everything factual and aligned with outdoor use in New Zealand.
• Stay consistent with the style of the Army and Outdoors online store.

COLLECTABLE STYLE (only if flagged as collectable or display-only):
• Start with a clear statement, e.g. "This is a collectable product, sold as a display piece only. It is not intended for modern wear or practical use."
• Include historical context (era, likely use, branch) when supported by data.
• Describe construction details and condition (patina, fading, repairs, small flaws) in a positive but honest way.
• Write 2–4 paragraphs to tell the story – but stay factual.
• Avoid promising authenticity beyond what's provided; if something is "likely" from a certain era, say so.

TAGS:
• Use 4–10 tags combining: nation/branch, item type, use cases (hunting, tramping, camping, collecting), camo type, era/decade when known.

NOTES FOR LISTER:
• Internal guidance for staff: sizing info, condition caveats, uncertainties to double-check.

NAVIGATION PLACEMENT:
You MUST choose the closest match from this SITE MAP and output navigation fields:

Clothing > Jackets & Coats > Leather & Flight Jackets
Clothing > Jackets & Coats > Winter Coats & Liners
Clothing > Jackets & Coats > Field Jackets & Parkas
Clothing > Jackets & Coats > Dress Jackets & Tunics
Clothing > Jackets & Coats > Rain & Softshell Jackets
Clothing > Jackets & Coats > Vests & Waistcoats
Clothing > Jackets & Coats > Track Tops & Hoodies
Clothing > Jackets & Coats > Camouflage Jackets

Clothing > Shirts & T-Shirts > Field Shirts
Clothing > Shirts & T-Shirts > Service & Dress Shirts
Clothing > Shirts & T-Shirts > Camouflage Shirts
Clothing > Shirts & T-Shirts > Plain & Print T-Shirts
Clothing > Shirts & T-Shirts > Camouflage T-Shirts
Clothing > Shirts & T-Shirts > Polos
Clothing > Shirts & T-Shirts > Singlets & Tank Tops

Clothing > Pants & Shorts > Combat & Cargo Trousers
Clothing > Pants & Shorts > Tactical & Duty Trousers
Clothing > Pants & Shorts > Shorts & Sports Pants
Clothing > Pants & Shorts > Rain & Softshell Trousers
Clothing > Pants & Shorts > Dress Trousers
Clothing > Pants & Shorts > Camouflage Trousers
Clothing > Pants & Shorts > Work Pants

Clothing > Headwear > Beanies & Balaclavas
Clothing > Headwear > Facemasks
Clothing > Headwear > Berets & Slide Caps
Clothing > Headwear > Boonie Hats
Clothing > Headwear > Caps & Hats
Clothing > Headwear > Helmets
Clothing > Headwear > Pith Helmets
Clothing > Headwear > Scarves & Shemaghs

Clothing > Fleeces & Jerseys
Clothing > Belts & Suspenders
Clothing > Overalls
Clothing > Gloves & Mittens
Clothing > Thermals & Base Layers
Clothing > Sunglasses & Goggles
Clothing > Children's Clothing
Clothing > Repairs & Maintenance

Footwear > Boots > Duty Boots
Footwear > Boots > Combat Boots
Footwear > Boots > Safety Boots
Footwear > Boots > Waterproof Boots
Footwear > Boots > Hiking Boots
Footwear > Footwear Accessories
Footwear > Shoes & Sandals
Footwear > Socks

Packs & Bags > Day Packs
Packs & Bags > Hiking Packs
Packs & Bags > Hydration Packs
Packs & Bags > Kit & Utility Bags
Packs & Bags > Rifle Cases
Packs & Bags > Waist & Sling Packs
Packs & Bags > Shoulder Bags
Packs & Bags > Dry Bags & Sacks
Packs & Bags > Wallets, Bags & Cases
Packs & Bags > Pack Accessories

Combat Gear > Combat Pouches
Combat Gear > Load Bearing Gear
Combat Gear > Holsters & Accessories
Combat Gear > Hydration
Combat Gear > Clothing & Stealth
Combat Gear > Armour & Protection
Combat Gear > Dog Tags

Camping & Survival > Cooking & Eating
Camping & Survival > Hydration
Camping & Survival > Sleeping Bags & Mats
Camping & Survival > Tents & Bashas
Camping & Survival > Lighting & Torches
Camping & Survival > Navigation & Optics
Camping & Survival > Tools
Camping & Survival > Bivy Bags
Camping & Survival > Ropes & Fastenings
Camping & Survival > First-Aid & Hygiene
Camping & Survival > Emergency Kit

Equipment > Flags, Badges & Insignia
Equipment > Gifts & Novelties
Equipment > Books & Publications
Equipment > Reenactment
Equipment > Collectables & Rarities
Equipment > Camouflage Netting
Equipment > Storage Containers

Dog Tags
One-Offs (Collectables)

Output these fields:
• navPrimary: top level (e.g. "Clothing")
• navSecondary: second level (e.g. "Jackets & Coats") – use empty string if only two levels
• navTertiary: third level (e.g. "Leather & Flight Jackets") – use empty string if only one or two levels
• navPath: the full path (e.g. "Clothing > Jackets & Coats > Leather & Flight Jackets")

SEO METADATA:
• metaTitle: 55–65 characters, include product name, key use, and sometimes colour. NZ English.
• metaDescription: 140–160 characters, summarising what it is, who it suits (hunters, trampers, campers, everyday wear, etc.) and a key benefit (warmth, durability, surplus style).
• metaKeywords: 5–10 short phrases combining item type, use, pattern/colour and style/branch where relevant.

OUTPUT FORMAT:
Return ONLY valid JSON with no additional text:
{
  "suggestedTitle": "string",
  "description": "string – Markdown paragraphs, no heading, no bullet list.",
  "features": ["First bullet", "Second bullet", "..."],
  "tags": ["tag1", "tag2", "..."],
  "notesForLister": "string – internal notes for staff",
  "navPrimary": "string",
  "navSecondary": "string",
  "navTertiary": "string",
  "navPath": "string",
  "seo": {
    "metaTitle": "string",
    "metaDescription": "string",
    "metaKeywords": ["keyword1", "keyword2", "..."]
  }
}`;

  const userContent = `Generate product copy for this military surplus item:

STAFF INPUT:
- Title: ${title}
- Category: ${category || "not specified"}
- Collectable/Display Only: ${isCollectable}
- Staff Notes: ${staffNotes || "none"}

VISION ANALYSIS:
${JSON.stringify(visionAnalysis, null, 2)}

Return ONLY the JSON object with suggestedTitle, description, features, tags, and notesForLister.`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent },
      ],
      max_tokens: 2000,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Copy generation API error:", errorText);
    throw new Error(`Copy generation API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;

  console.log("Copy generation response:", content);

  // Parse JSON from response
  let jsonStr = content;
  if (content.includes("```json")) {
    jsonStr = content.split("```json")[1].split("```")[0].trim();
  } else if (content.includes("```")) {
    jsonStr = content.split("```")[1].split("```")[0].trim();
  }

  return JSON.parse(jsonStr) as GeneratedContent;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not configured");
    }

    const { title, category, isCollectable, staffNotes, images } = await req.json();

    console.log("Received request:", { title, category, isCollectable, imageCount: images?.length || 0 });

    if (!title || !images || images.length === 0) {
      return new Response(
        JSON.stringify({ error: "Title and at least one image are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Step 1: Vision analysis with all images
    const visionAnalysis = await analyzeImages(
      images,
      title,
      category,
      isCollectable,
      staffNotes
    );

    console.log("Vision analysis complete:", visionAnalysis.guessedName);

    // Step 2: Generate product copy
    const generatedContent = await generateProductCopy(
      visionAnalysis,
      title,
      category,
      isCollectable,
      staffNotes
    );

    console.log("Product copy generated:", generatedContent.suggestedTitle);

    return new Response(
      JSON.stringify({
        visionAnalysis,
        generatedContent,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in generate-product-copy:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
