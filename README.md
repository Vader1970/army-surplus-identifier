📦 Surplus Identifier
AI-Powered Product Identification & Copy Generator for Military Surplus Retail

Surplus Identifier is an AI-assisted product listing tool designed for military surplus and outdoor retailers.
It automates the identification of surplus items and generates high-quality, NZ-English product descriptions, complete with SEO metadata and navigation placement for e-commerce systems such as Shopify.

The tool is built to match the tone, accuracy, and practical outdoor focus of Army and Outdoors (NZ) — with clean, factual descriptions that appeal to hunters, trampers, campers, outdoor workers, collectors, and everyday users who value durable gear.

✨ Features
🔍 1. AI Vision Identification

The system reviews one or more uploaded images and produces a structured identification analysis:

Likely item name

Branch or nation (e.g., US Navy, British Army, German Bundeswehr)

Era or decade

Item type

Camouflage pattern or colour

Likely use cases (hunting, tramping, camping, collecting, everyday wear)

Condition guess

Whether the item is genuine surplus or a commercial replica

Historical notes

Additional details (closure type, lining, pockets, label information, etc.)

Confidence score

When the title is unknown, the model fully identifies the item using images alone.

✏️ 2. Product Copy Generation

Uses the identification analysis to create:

Suggested title

2–3 paragraph NZ-style description

Outdoor-focused bullet-point features

Relevant search tags

Internal notes for listers (e.g., sizing, condition, uncertainties)

The tool supports two writing modes:

🟢 Standard Product Mode

For general outdoor use, focusing on practicality, warmth, durability, and construction details.

🟠 Collectable / Display-Only Mode

Includes historical background and detailed condition notes when an item is flagged as a collectable.

🧭 3. Automatic Navigation Placement

The system determines where each product belongs within the retailer’s navigation structure, using the complete multi-level sitemap.

Example output:

{
  "navPrimary": "Clothing",
  "navSecondary": "Jackets & Coats",
  "navTertiary": "Leather & Flight Jackets",
  "navPath": "Clothing > Jackets & Coats > Leather & Flight Jackets"
}

This eliminates guesswork for staff and ensures consistent product categorisation.

🌐 4. SEO Metadata Generation

Each generated product includes:

metaTitle (55–65 characters)

metaDescription (140–160 characters)

metaKeywords (5–10 short phrases)

SEO output uses New Zealand English and focuses on practical searches such as:

outdoor wear

cold-weather jacket

hunting trousers

fleece layering

camo patterns

🧩 5. Clean JSON Output

All AI responses return structured JSON, ideal for use in:

Shopify product import

Internal CMS

Headless e-commerce automation

Batch generation workflows

Example:

{
  "suggestedTitle": "Black MA-1 Flight Jacket",
  "description": "...",
  "features": ["Durable nylon shell", "Warm polyester insulation"],
  "tags": ["flight jacket", "black", "winter", "outdoor"],
  "notesForLister": "Confirm sizing label and lining condition.",

  "navPrimary": "Clothing",
  "navSecondary": "Jackets & Coats",
  "navTertiary": "Leather & Flight Jackets",
  "navPath": "Clothing > Jackets & Coats > Leather & Flight Jackets",

  "seo": {
    "metaTitle": "Black MA-1 Flight Jacket – Warm Outdoor Layer",
    "metaDescription": "Durable MA-1 style jacket offering warmth for hunting, tramping and everyday outdoor wear.",
    "metaKeywords": ["flight jacket", "MA-1", "outdoor wear", "bomber jacket"]
  }
}

🛠️ Tech Stack
Backend

Deno

OpenAI GPT-4o Vision for image identification

OpenAI GPT-4o for description + SEO generation

Pure JSON in/out API

Frontend

Form-driven UI allowing:

Title / working title

Category selection

Collectable toggle

Staff notes

Multi-image upload

Display of structured output

📁 File Structure Overview

/src
  /types
    product.ts          → Shared TypeScript interfaces
  /api
    generate-product.ts → Deno server-side function calling OpenAI
  /components
    ProductForm.tsx     → Input form for staff
    OutputPanel.tsx     → Structured product output
  /utils
    formatters.ts       → Helper utilities

🔑 Environment Variables

Set your OpenAI API key in the environment variables:

OPENAI_API_KEY=sk-...

This key is used server-side only and is never exposed to the client.

🚀 Workflow

Provide a working title (or leave it unknown).

Select a category (optional).

Upload 1–5 images of the item.

Add staff notes (optional).

Mark as collectable if applicable.

Submit.

The system returns:

AI identification

Title

Description

Features

Tags

Internal notes

Correct navigation path

SEO metadata

🧪 Example Use Case

Input:
Images of a black nylon bomber jacket with orange lining.

AI identifies:
MA-1 style flight jacket, commercial replica, suitable for cold-weather outdoor use.

Output:

Warm, outdoor-focused description

Detailed features list

Tags: ["black", "flight jacket", "cold weather", "nylon"]

Navigation path: Clothing > Jackets & Coats > Leather & Flight Jackets

SEO metadata ready for Shopify

📌 Roadmap

Batch processing for multiple images

Automatic Shopify product publishing

Alt-text generation for accessibility and SEO

Confidence-based warnings for low-certainty identifications

📝 License

Internal or private commercial use only unless otherwise specified.