# Pronto Junk Removal — HTML → Greastro Migration Plan

Source design: `design_handoff_pronto_junk_removal/index.html`  
Target: `2025-Website-Projects/2026/pronto-junk-removal/`

Work through steps in order. Each step is a single commit. Most steps are **edits to already-existing files** — the template infrastructure is all here, we're just filling it in with Pronto content and styling.

---

## Legend

- ✏️ **Edit** — file exists, update it
- ➕ **New** — file needs to be created
- 🗑️ **Delete** — remove placeholder content

---

## Section → Greastro Mapping

| HTML Section | How it's built in Greastro |
|---|---|
| Header | ✏️ `src/layouts/Header.astro` + `menu-items.json` |
| Hero | ✏️ `src/layouts/FrontPageHero.astro` props in `index.astro` |
| About 3-col | ➕ `src/components/AboutSection.astro` (custom, queries `about-us` + `services`) |
| Benefits | ➕ `benefits` collection + ➕ `BenefitsVariant.astro` |
| Testimonials carousel | ✏️ `testimonials` collection + ➕ `TestimonialCarousel.tsx` (React) |
| Projects before/after | ✏️ `projects` collection + ➕ `ProjectsBeforeAfterVariant.astro` |
| Locations | ➕ `locations` collection + ➕ `LocationsSection.astro` |
| FAQ | ✏️ `faq` collection + existing `AccordionVariant` |
| Image gallery | ➕ `gallery` collection + ➕ `GalleryCarousel.tsx` (React) |
| CTA strip | ➕ `src/components/CTAStrip.astro` |
| Footer | ✏️ `src/layouts/Footer.astro` |

---

## Step 1 — Site Metadata
**✏️ Edit `src/content/siteDomain.js`**
```js
export const SITE_DOMAIN = "prontojunkremoval.com";
export const SITE_URL = `https://${SITE_DOMAIN}`;
```

**✏️ Edit `src/content/siteData.ts`**
```ts
import { SITE_DOMAIN, SITE_URL } from "./siteDomain.js";

export const siteData = {
  title: "Pronto Junk Removal",
  legalName: "Pronto Junk Removal LLC",
  tagline: "Serving Middlesex County, NJ And More",
  description: "Fast, reliable junk removal based in Woodbridge, NJ. We handle rummage, cleanouts, demolition debris, and more — so you don't have to.",
  domain: SITE_DOMAIN,
  url: SITE_URL,
  location: "Woodbridge, NJ",
  address: "Woodbridge Township, NJ 07095",
  phone: "732-710-5405",
  phoneHref: "tel:+17327105405",
};

export const ctaData = {
  text: "Get a Free Quote",
  link: "#contact",
};
```

---

## Step 2 — Design Tokens & CSS Classes
**✏️ Edit `src/styles/global.css`**

### 2a — Colors & Fonts (inside existing `@theme` block)

Replace the two placeholder color lines and add font tokens:
```css
@theme {
  /* Pronto brand yellow → #F6AD00 */
  --color-primary: oklch(78% 0.17 70);
  /* Pronto secondary orange → #FFA800 */
  --color-accent:  oklch(73% 0.18 55);

  /* Neutrals */
  --color-text:    oklch(14% 0.02 260);   /* #111111 */
  --color-heading: oklch(10% 0.02 260);
  --color-bg:      oklch(100% 0 0);       /* pure white */
  --color-surface: oklch(97% 0.004 260);

  /* Pronto fonts */
  --font-sans: 'Raleway', system-ui, sans-serif;
  --font-mont: 'Montserrat', system-ui, sans-serif;
  --font-rob:  'Roboto', system-ui, sans-serif;

  /* ... keep all the existing color scale helpers below unchanged ... */
}
```

Add Google Fonts import at the very top of the file (before `@import "tailwindcss"`):
```css
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500;700;900&family=Raleway:wght@400;500&family=Roboto:wght@400;500;700;900&display=swap');
```

Set default body font (replace the existing `body` block):
```css
body {
  font-family: var(--font-sans);
  @apply overflow-x-hidden;
}
```

### 2b — Pronto Component Classes (add inside existing `@layer components` block)
```css
/* Pronto yellow CTA button */
.btn-yellow {
  background: linear-gradient(180deg, var(--color-primary) 0%, var(--color-accent) 100%);
  border: 2px solid #000;
  color: #000;
  font-family: var(--font-mont);
  font-weight: 700;
  transition: transform 0.15s ease, filter 0.15s ease;
}
.btn-yellow:hover {
  filter: brightness(1.05);
  transform: translateY(-1px);
}

/* Pronto black CTA button */
.btn-black {
  background: #000;
  border: 2px solid #000;
  color: var(--color-primary);
  font-family: var(--font-sans);
  font-weight: 500;
  transition: transform 0.15s ease, filter 0.15s ease;
}
.btn-black:hover {
  background: #1a1a1a;
  transform: translateY(-1px);
}

/* Yellow circle bullet used in service/location lists */
.accordion-bullet {
  width: 25px;
  height: 25px;
  border-radius: 9999px;
  background: var(--color-primary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 25px;
}

/* Chevron that rotates on details[open] */
.chev { transition: transform 0.2s ease; }
details[open] .chev { transform: rotate(180deg); }
```

---

## Step 3 — Google Fonts in Head
**✏️ Edit `src/layouts/HeadTags.astro`**

Add inside `<head>`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;700;900&family=Raleway:wght@400;500&family=Roboto:wght@400;500;700;900&display=swap" rel="stylesheet" />
```
*(Skip if already handled by the `@import url(...)` in global.css — check whether that resolves at build time.)*

---

## Step 4 — Menu Items
**✏️ Edit `src/content/menus/menus.json`** — ensure these IDs exist:
```json
[
  { "id": "main-menu",   "title": "Main Menu" },
  { "id": "footer-menu", "title": "Footer Menu" }
]
```

**✏️ Edit `src/content/menu-items/menu-items.json`** — replace Greastro placeholder items:
```json
[
  { "id": "home",           "title": "Home",          "link": "/",           "menu": ["main-menu", "footer-menu"], "order": 1 },
  { "id": "who-are-we",    "title": "Who Are We",     "link": "/about-us",   "menu": ["main-menu"], "order": 2 },
  { "id": "where-we-work", "title": "Where We Work",  "link": "/locations",  "menu": ["main-menu"], "order": 3 },
  { "id": "services",      "title": "Services",       "link": "/services",   "menu": ["main-menu"], "order": 4 },
  { "id": "contact",       "title": "Contact Us",     "link": "/contact-us", "menu": ["main-menu", "footer-menu"], "order": 5 }
]
```

---

## Step 5 — Header: Phone CTA
**✏️ Edit `src/layouts/Header.astro`**

The Pronto header has a phone number button (desktop: full label + icon; mobile: icon-only yellow circle). The existing Header just has the site title and `MenuVariant`. Add the phone CTA after the `<ContentRenderer>` nav:

```astro
---
import { siteData } from "@/content/siteData";
// ... existing imports
---

<header class="fixed top-0 left-0 right-0 z-50 bg-bg" style="box-shadow:0 0 10px 0 rgba(0,0,0,0.5);">
  <div class="max-w-[1440px] mx-auto px-4 lg:px-[54px] h-[88px] lg:h-[107px] flex items-center justify-between">

    <!-- Logo -->
    <a href="/" class="flex items-center gap-3">
      <img src="/assets/logo.png" alt={siteData.title} class="w-[68px] h-[68px] lg:w-[88px] lg:h-[88px] object-contain" />
    </a>

    <!-- Desktop nav -->
    <ContentRenderer
      query={related("menu-items", "menu", "main-menu")}
      variant="MenuVariant"
      mode="desktop"
      className="hidden lg:flex"
    />

    <!-- Desktop phone CTA -->
    <a href={siteData.phoneHref}
      class="hidden lg:inline-flex items-center gap-3 px-6 h-[65px] rounded-md font-sans font-medium text-[18px] btn-yellow">
      <svg width="18" height="18" viewBox="0 0 13 13" fill="currentColor">
        <path d="M12.528.625 9.887.016a.751.751 0 0 0-.698.352L7.97 3.212a.74.74 0 0 0 .176.711l1.538 1.26a11.27 11.27 0 0 1-4.5 4.499l-1.258-1.539a.745.745 0 0 0-.711-.175L.371 9.187a.747.747 0 0 0-.356.7l.61 2.641A.75.75 0 0 0 1.219 13C7.722 13 13 7.732 13 1.219A.75.75 0 0 0 12.528.625z"/>
      </svg>
      <span>{siteData.phone}</span>
    </a>

    <!-- Mobile: hamburger + phone icon -->
    <div class="lg:hidden flex items-center gap-2">
      <a href={siteData.phoneHref}
        class="w-12 h-12 rounded-full bg-primary grid place-items-center" aria-label="Call us">
        <svg width="22" height="22" viewBox="0 0 13 13" fill="#000">
          <path d="M12.528.625 9.887.016a.751.751 0 0 0-.698.352L7.97 3.212a.74.74 0 0 0 .176.711l1.538 1.26a11.27 11.27 0 0 1-4.5 4.499l-1.258-1.539a.745.745 0 0 0-.711-.175L.371 9.187a.747.747 0 0 0-.356.7l.61 2.641A.75.75 0 0 0 1.219 13C7.722 13 13 7.732 13 1.219A.75.75 0 0 0 12.528.625z"/>
        </svg>
      </a>
      <ContentRenderer
        query={related("menu-items", "menu", "main-menu")}
        variant="MenuVariant"
        mode="mobile"
        hamburgerTransform={true}
      />
    </div>
  </div>
</header>
```

---

## Step 6 — Hero (FrontPageHero props)
**✏️ Edit `src/pages/index.astro`** — update the `<FrontPageHero>` props only (do not touch the rest of index.astro yet):

```astro
<FrontPageHero
  title={siteData.title}
  description={siteData.tagline}
  image={heroImg}
  primaryCTA={{ text: "Get Quote", link: "#contact" }}
/>
```

At the top of the script block, import the hero image:
```ts
import heroImg from "@/assets/hero.jpg";
```

*(Copy `hero.jpg` from the handoff's `assets/` folder into `src/assets/` first — see Step 18.)*

The existing `FrontPageHero.astro` already handles: full-viewport, overlay gradient, centered text, CTA buttons. The overlay is `bg-gradient-to-b from-black/30 to-black/60` — adjust to `from-black/50 to-black/70` to match the HTML's `bg-black/60` if needed.

---

## Step 7 — `about-us` Collection Content
**🗑️ Delete** placeholder items:
- `src/content/about-us/mission.mdx`
- `src/content/about-us/promise.mdx`
- `src/content/about-us/vision.mdx`

**✏️ Edit `src/content/about-us/_meta.mdx`**:
```yaml
---
title: "About Us"
description: "We Do The Work So You Don't Have To"
hasPage: true
itemsHasPage: false
---
```

**➕ Create `src/content/about-us/founder.mdx`**:
```yaml
---
title: "Founded By Teens on a Mission for Success..."
description: "Pronto Junk Removal, founded in 2022 and based in Woodbridge, NJ, is a business operated by 18 year old teenager Anthony Gonzalez and his friends. We are committed to fast and efficient disposal and making space reclamation a hassle-free experience."
order: 1
featuredImage:
  src: "../../assets/founder.png"
  alt: "Anthony Gonzalez, founder of Pronto Junk Removal"
---
```

**➕ Create `src/content/about-us/team.mdx`**:
```yaml
---
title: "Meet The Junk Crew"
order: 2
featuredImage:
  src: "../../assets/team1.jpg"
  alt: "The Junk Crew"
---
```

---

## Step 8 — `services` Collection Content
**🗑️ Delete** `web-development.mdx` and `digital-marketing.mdx`

**✏️ Edit `src/content/services/_meta.mdx`**:
```yaml
---
title: "Services"
description: "Full-service junk removal for homes, businesses, and outdoor spaces."
hasPage: true
itemsHasPage: true
itemsRootPath: true
addToMenu:
  - menu: "main-menu"
    id: "services"
---
```

**➕ Create one `.mdx` per service** (10 total) in `src/content/services/`:

| Filename | Title | Order |
|---|---|---|
| `rummage-removal.mdx` | Rummage Removal | 1 |
| `garbage-cleanouts.mdx` | Garbage Cleanouts | 2 |
| `foreclosure-cleanouts.mdx` | Foreclosure Cleanouts | 3 |
| `attic-cleanouts.mdx` | Attic Clean Outs | 4 |
| `basement-cleanouts.mdx` | Basement Clean Outs | 5 |
| `apartment-cleanouts.mdx` | Apartment Clean Outs | 6 |
| `storage-cleanouts.mdx` | Storage Clean Outs | 7 |
| `house-cleanouts.mdx` | House Cleanouts | 8 |
| `hoarder-cleanouts.mdx` | Hoarder House Clean Outs | 9 |
| `backyard-cleanout.mdx` | Backyard Cleanout | 10 |

Each file follows this pattern:
```yaml
---
title: "Rummage Removal"
description: "Fast removal of unwanted rummage from any space."
order: 1
---
```

No schema changes needed — existing `services` schema covers it.

---

## Step 9 — `benefits` Collection (New)
**✏️ Edit `src/content/config.ts`** — add the collection:
```ts
"benefits": defineCollection({
  schema: ({ image }) =>
    baseSchema({ image }).extend({
      icon: z.string().optional(),
    }),
}),
```

**➕ Create `src/content/benefits/_meta.mdx`**:
```yaml
---
title: "Benefits of Choosing Pronto"
hasPage: false
itemsHasPage: false
---
```

**➕ Create `src/content/benefits/satisfaction-guarantee.mdx`**:
```yaml
---
title: "Satisfaction Guarantee"
description: "Pronto Junk Removal is dedicated to your complete satisfaction, ensuring every clean-out meets your high standards with our impeccable service."
order: 1
icon: "fa:shield"
---
```

**➕ Create `src/content/benefits/quick-and-efficient.mdx`**:
```yaml
---
title: "Quick and Efficient"
description: "We pride ourselves on our swift and efficient junk removal process, guaranteeing a hassle-free experience that minimizes disruption to your day."
order: 2
icon: "fa:bolt"
---
```

---

## Step 10 — `testimonials` Collection Content
**🗑️ Delete** `john-smith.mdx`

**✏️ Edit `src/content/testimonials/_meta.mdx`**:
```yaml
---
title: "Hear From Our Customers"
hasPage: false
itemsHasPage: false
---
```

**➕ Create `src/content/testimonials/ferdi-e.mdx`**:
```yaml
---
title: "Ferdi E."
description: "\"The service was excellent. Definitely would hire again for any removal needs I have in the future.\""
role: "North Edison Homeowner"
rating: 5
order: 1
---
```

No schema changes — existing schema has `role`, `company`, `rating`.

---

## Step 11 — `projects` Collection Schema + Content
**✏️ Edit `src/content/config.ts`** — extend projects schema with `beforeImage`, `afterImage`, `location`:
```ts
"projects": defineCollection({
  schema: ({ image }) =>
    baseSchema({ image }).extend({
      client:       z.string(),
      location:     z.string().optional(),
      category:     z.string(),
      beforeImage:  image().optional(),
      afterImage:   image().optional(),
      projectUrl:   z.string().url().optional(),
      technologies: z.array(z.string()).default([]),
    }),
}),
```

**🗑️ Delete** `ecommerce-platform.mdx`

**✏️ Edit `src/content/projects/_meta.mdx`**:
```yaml
---
title: "Our Projects"
hasPage: true
itemsHasPage: false
---
```

**➕ Create 3 project files:**

`brick-removal.mdx`:
```yaml
---
title: "Brick Removal"
client: "Residential"
location: "Woodbridge, NJ"
category: "Debris Removal"
order: 1
beforeImage:
  src: "../../assets/team1.jpg"
  alt: "Before brick removal"
afterImage:
  src: "../../assets/team2.jpg"
  alt: "After brick removal"
---
```

`shed-demolition.mdx`:
```yaml
---
title: "Shed Demolition"
client: "Residential"
location: "Clark, NJ"
category: "Demolition"
order: 2
beforeImage:
  src: "../../assets/project-extra.jpg"
  alt: "Before shed demolition"
afterImage:
  src: "../../assets/team1.jpg"
  alt: "After shed demolition"
---
```

`backyard-cleanout.mdx`:
```yaml
---
title: "Backyard Cleanout"
client: "Residential"
location: "Linden, NJ"
category: "Cleanout"
order: 3
beforeImage:
  src: "../../assets/team2.jpg"
  alt: "Before backyard cleanout"
afterImage:
  src: "../../assets/project-extra.jpg"
  alt: "After backyard cleanout"
---
```

---

## Step 12 — `locations` Collection (New)
**✏️ Edit `src/content/config.ts`** — add:
```ts
"locations": defineCollection({
  schema: ({ image }) =>
    baseSchema({ image }).extend({
      state: z.string().default("NJ"),
    }),
}),
```

**➕ Create `src/content/locations/_meta.mdx`**:
```yaml
---
title: "Our Service Locations"
description: "We are Located In Woodbridge Township"
hasPage: true
itemsHasPage: false
---
```

**➕ Create 10 county files** in `src/content/locations/`:

| Filename | Title | Order |
|---|---|---|
| `bergen-county.mdx` | Bergen County | 1 |
| `essex-county.mdx` | Essex County | 2 |
| `hudson-county.mdx` | Hudson County | 3 |
| `mercer-county.mdx` | Mercer County | 4 |
| `middlesex-county.mdx` | Middlesex County | 5 |
| `monmouth-county.mdx` | Monmouth County | 6 |
| `ocean-county.mdx` | Ocean County | 7 |
| `passaic-county.mdx` | Passaic County | 8 |
| `somerset-county.mdx` | Somerset County | 9 |
| `union-county.mdx` | Union County | 10 |

Pattern:
```yaml
---
title: "Bergen County"
state: "NJ"
order: 1
---
```

---

## Step 13 — `faq` Collection Content
**🗑️ Delete** `what-is-greastro.mdx` and `how-to-add-content.mdx`

**✏️ Edit `src/content/faq/_meta.mdx`**:
```yaml
---
title: "Frequently Asked Questions"
hasPage: true
itemsHasPage: false
---
```

**➕ Create 4 FAQ files:**

`indoor-outdoor.mdx`:
```yaml
---
title: "Can you handle both indoor and outdoor garbage cleanouts?"
description: "Yes — Pronto Junk Removal handles indoor and outdoor cleanouts of every size, from a single room to entire properties."
order: 1
category: "Services"
---
```

`pricing.mdx`:
```yaml
---
title: "How do you price cleanouts?"
description: "Pricing is based on the volume of junk and the labor involved. We give honest, up-front quotes — no surprise fees."
order: 2
category: "Pricing"
---
```

`heavy-items.mdx`:
```yaml
---
title: "Can you remove heavy items?"
description: "Absolutely — appliances, furniture, brick, and other heavy items are part of our standard service."
order: 3
category: "Services"
---
```

`same-day.mdx`:
```yaml
---
title: "Do you offer same-day service?"
description: "In most cases, yes. Give us a call and we'll do our best to get to you the same day."
order: 4
category: "Scheduling"
---
```

---

## Step 14 — `gallery` Collection (New)
**✏️ Edit `src/content/config.ts`** — add:
```ts
"gallery": defineCollection({
  schema: ({ image }) =>
    baseSchema({ image }),
}),
```

**➕ Create `src/content/gallery/_meta.mdx`**:
```yaml
---
title: "Image Gallery"
description: "Our image gallery showcases the transformative impact of Pronto Junk Removal's work, highlighting snapshots of our thorough clean-outs and junk removal projects."
hasPage: false
itemsHasPage: false
---
```

**➕ Create 6 gallery item files** (using the 3 available assets, cycling):
```yaml
# gallery-1.mdx
---
title: "Truck Load 1"
order: 1
featuredImage:
  src: "../../assets/team1.jpg"
  alt: "Pronto truck loaded with junk"
---
```
Repeat for `gallery-2` through `gallery-6` cycling through `team1.jpg`, `team2.jpg`, `project-extra.jpg`.

---

## Step 15 — `contact-us` + `social-media` JSON
**✏️ Edit `src/content/contact-us/contact-us.json`**:
```json
[
  {
    "id": "phone",
    "title": "Call Us",
    "description": "732-710-5405",
    "link": "tel:+17327105405",
    "linkPrefix": "tel:",
    "icon": "fa:phone",
    "order": 1
  },
  {
    "id": "quote",
    "title": "Get a Free Quote",
    "description": "Fill out our form and we'll get back to you fast.",
    "link": "/contact-us",
    "icon": "fa:envelope",
    "order": 2
  }
]
```

**✏️ Edit `src/content/social-media/socialmedia.json`**:
```json
[
  {
    "id": "instagram",
    "title": "Instagram",
    "link": "https://instagram.com/prontojunkremoval",
    "icon": "fa:instagram",
    "order": 1
  },
  {
    "id": "facebook",
    "title": "Facebook",
    "link": "https://facebook.com/prontojunkremoval",
    "icon": "fa:facebook",
    "order": 2
  }
]
```

---

## Step 16 — AccordionBullet Component
**➕ Create `src/components/AccordionBullet.astro`**

Reusable yellow circle bullet with the checkmark SVG — used in the services list, locations list, and anywhere else the design calls for it.

```astro
---
// Yellow circle bullet used in service/location lists
---
<span class="accordion-bullet">
  <svg width="9" height="5" viewBox="0 0 9 5" fill="#000">
    <path d="M8.126 4.941H.587C.065 4.941-.196 4.31.173 3.941L3.942.172a.585.585 0 0 1 .829 0l3.769 3.769c.369.369.108 1-.414 1z"/>
  </svg>
</span>
```

---

## Step 17 — AboutSection Component
**➕ Create `src/components/AboutSection.astro`**

The 3-column about section can't be expressed as a standard `ContentRenderer` variant because it combines two collections (`about-us` and `services`) in a custom side-by-side layout. Build it as a direct Astro component.

```astro
---
import { query, sortByOrder } from "@/utils/query";
import AccordionBullet from "@/components/AccordionBullet.astro";
import { Image } from "astro:assets";

const aboutEntries = await query("about-us").orderBy(sortByOrder()).get();
const services     = await query("services").orderBy(sortByOrder()).get();
const founder = aboutEntries.entries.find((e) => e.id.includes("founder"));
const team    = aboutEntries.entries.find((e) => e.id.includes("team"));
---

<section id="about" class="py-16 lg:py-[70px]">
  <div class="max-w-[1200px] mx-auto px-6 lg:px-12">
    <h2 class="font-mont font-bold text-center text-[28px] sm:text-[36px] lg:text-[40px] leading-[1.05]">
      We Do The Work So You Don't Have To
    </h2>
    <div class="mt-12 grid gap-12 lg:gap-16 lg:grid-cols-3">

      <!-- Col 1: Founder story + social links -->
      <div>
        {founder && <>
          <h3 class="font-mont font-bold text-[25px] leading-[37.5px] text-[#333]">{founder.data.title}</h3>
          <p class="mt-4 font-sans text-[18px] leading-[27px]">{founder.data.description}</p>
          {founder.data.featuredImage && (
            <div class="mt-8 rounded-md overflow-hidden">
              <Image src={founder.data.featuredImage} alt={founder.data.featuredImage.alt ?? ""} class="w-full h-auto block" />
            </div>
          )}
        </>}
        <h3 class="mt-10 font-mont font-bold text-[25px] text-[#333]">Our Socials</h3>
        <div class="mt-4 flex gap-4">
          <a href="#" aria-label="Instagram" class="w-12 h-12 rounded-full bg-black grid place-items-center text-primary hover:scale-105 transition">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/>
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
            </svg>
          </a>
          <a href="#" aria-label="Facebook" class="w-12 h-12 rounded-full bg-black grid place-items-center text-primary hover:scale-105 transition">
            <svg width="14" height="22" viewBox="0 0 14 24" fill="currentColor">
              <path d="M9 24v-9h3l1-4H9V8.5C9 7.5 9.5 7 10.5 7H13V3h-3C7 3 5 5 5 8v3H2v4h3v9z"/>
            </svg>
          </a>
        </div>
      </div>

      <!-- Col 2: Team photos -->
      <div>
        {team && <>
          <h3 class="font-mont font-bold text-[25px] text-[#333]">{team.data.title}</h3>
          {team.data.featuredImage && (
            <div class="mt-4 rounded-sm overflow-hidden">
              <Image src={team.data.featuredImage} alt={team.data.featuredImage.alt ?? ""} class="w-full h-auto block" />
            </div>
          )}
        </>}
      </div>

      <!-- Col 3: Services list -->
      <div>
        <h3 id="services" class="font-mont font-bold text-[25px] text-[#333]">What We Do</h3>
        <ul class="mt-4 space-y-3">
          {services.entries.map((svc) => (
            <li class="flex items-center gap-3">
              <AccordionBullet />
              <span class="font-rob font-bold text-[16px]">{svc.data.title}</span>
            </li>
          ))}
        </ul>
      </div>

    </div>
  </div>
</section>
```

---

## Step 18 — BenefitsVariant
**➕ Create `src/components/ContentRenderer/variants/BenefitsVariant.astro`**

```astro
---
import type { BaseVariantProps } from "../ContentRenderer.types";

interface Props extends BaseVariantProps {}
const { items = [], title } = Astro.props as Props;
---

<section class="bg-black text-white py-16 lg:py-[110px]">
  <div class="max-w-[1200px] mx-auto px-6 lg:px-12">
    {title && (
      <h2 class="font-mont font-bold text-center text-[36px] lg:text-[45px] leading-[1.15] text-white">
        {title}
      </h2>
    )}
    <div class="mt-12 grid gap-6 lg:gap-[60px] lg:grid-cols-2">
      {items.map((item) => (
        <div class="bg-primary border-2 border-black text-black p-8 lg:p-12 text-center">
          <h3 class="mt-4 font-mont font-bold text-[25px] leading-[37.5px]">{item.title}</h3>
          <p class="mt-2 font-rob text-[16px] leading-6 max-w-md mx-auto">{item.description}</p>
        </div>
      ))}
    </div>
  </div>
</section>
```

**✏️ Register it in `src/components/ContentRenderer/variants/utils/VariantUtils.ts`** — add `BenefitsVariant` to the variant map (follow the existing pattern for the other variants in that file).

---

## Step 19 — ProjectsBeforeAfterVariant
**➕ Create `src/components/ContentRenderer/variants/ProjectsBeforeAfterVariant.astro`**

```astro
---
import type { BaseVariantProps } from "../ContentRenderer.types";
import { Image } from "astro:assets";

interface Props extends BaseVariantProps {}
const { items = [], title } = Astro.props as Props;
---

<section class="relative py-16 lg:py-[50px] bg-black">
  <div class="max-w-[1200px] mx-auto px-6 lg:px-12">
    {title && (
      <h2 class="font-mont font-bold text-center text-[36px] lg:text-[45px] text-white">{title}</h2>
    )}
    <div class="mt-12 grid gap-8 lg:gap-10 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <article class="bg-white overflow-hidden" style="box-shadow:0 0 10px 0 rgba(0,0,0,0.5)">
          {item.beforeImage && (
            <div class="relative aspect-[413/225] bg-neutral-200">
              <Image src={item.beforeImage} alt={item.beforeImage.alt ?? "Before"} class="w-full h-full object-cover" />
              <span class="absolute top-0 left-0 bg-primary text-black font-rob font-medium text-[28px] px-5 py-1">Before</span>
            </div>
          )}
          {item.afterImage && (
            <div class="relative aspect-[413/225] bg-neutral-200">
              <Image src={item.afterImage} alt={item.afterImage.alt ?? "After"} class="w-full h-full object-cover" />
              <span class="absolute bottom-0 right-0 bg-primary text-black font-rob font-medium text-[28px] px-5 py-1">After</span>
            </div>
          )}
          <div class="px-6 pt-8 pb-10 text-center">
            <h3 class="font-mont font-bold text-[25px] text-[#333]">{item.title}</h3>
            {item.location && <p class="mt-1 font-rob text-[16px] text-[#333]">{item.location}</p>}
          </div>
        </article>
      ))}
    </div>
    <div class="mt-12 flex justify-center">
      <a href="/projects" class="btn-yellow inline-flex items-center justify-center w-[244px] h-[70px] rounded-md font-sans font-medium text-[20px]">
        See More
      </a>
    </div>
  </div>
</section>
```

**✏️ Register in `VariantUtils.ts`** — same as BenefitsVariant above.

> **Note on `items` vs `entries`:** Check what field name `BaseVariantProps` uses for the collection data (it may be `items` or `entries` depending on the version). Use whichever the other variants use — look at `GridVariant.astro` for reference.

---

## Step 20 — LocationsSection Component
**➕ Create `src/components/LocationsSection.astro`**

Queries the `locations` collection directly. Purely static — no React needed.

```astro
---
import { query, sortByOrder } from "@/utils/query";
import AccordionBullet from "@/components/AccordionBullet.astro";

const result = await query("locations").orderBy(sortByOrder()).get();
---

<section id="locations" class="py-16 lg:py-[70px]">
  <div class="max-w-[1200px] mx-auto px-6 lg:px-12">
    <h2 class="font-rob font-bold text-center text-[28px] lg:text-[32px] text-[#333]">
      We are Located In Woodbridge Township
    </h2>

    <div class="mt-10 grid gap-10 lg:grid-cols-2 lg:items-start">
      <div>
        <h3 class="font-mont font-bold text-[25px] text-[#333]">Our Service Locations</h3>
        <ul class="mt-4 grid sm:grid-cols-2 gap-3">
          {result.entries.map((loc) => (
            <li class="flex items-center gap-3">
              <AccordionBullet />
              <span class="font-rob font-bold text-[16px]">{loc.data.title}</span>
            </li>
          ))}
        </ul>
      </div>

      <!-- Map placeholder — replace with real embed when available -->
      <div class="relative w-full h-[300px] rounded-sm overflow-hidden border border-black/10 bg-[#E5E3DF]">
        <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full">
          <svg width="34" height="44" viewBox="0 0 24 32" fill="#E94235">
            <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 20 12 20s12-11 12-20C24 5.4 18.6 0 12 0z"/>
            <circle cx="12" cy="12" r="4" fill="#fff"/>
          </svg>
        </div>
        <div class="absolute top-2.5 left-2.5 bg-white rounded-sm px-3 py-2" style="box-shadow:0 1px 4px -1px rgba(0,0,0,0.3)">
          <div class="font-rob font-medium text-[14px]">Middlesex County</div>
          <div class="font-rob text-[12px] text-[#5b5b5b]">New Jersey</div>
        </div>
      </div>
    </div>

    <div class="mt-16 text-center">
      <h3 class="font-mont font-bold text-[25px] text-[#333]">Outside Of This Area?</h3>
      <p class="mt-3 font-sans text-[18px] leading-[27px] max-w-3xl mx-auto">
        We still would love to work with you, just contact us with your location, and details
        of the job you want and we will be happy to help you!
      </p>
      <a href="#contact" class="btn-yellow mt-6 inline-flex items-center justify-center w-[176px] h-[50px] rounded-sm font-sans font-medium text-[20px]">
        Get Quote
      </a>
    </div>
  </div>
</section>
```

---

## Step 21 — TestimonialCarousel (React)
**➕ Create `src/components/TestimonialCarousel.tsx`**

React because it needs client-side `useState` for prev/next cycling.

```tsx
import { useState } from "react";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  rating: number;
}

export default function TestimonialCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  const t = testimonials[index];
  const prev = () => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);
  const next = () => setIndex((i) => (i + 1) % testimonials.length);

  return (
    <section className="bg-primary py-16 lg:py-[70px]">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        <h2 className="font-mont font-bold text-center text-[36px] lg:text-[45px] text-black">
          Hear From Our Customers
        </h2>
        <div className="mt-10 lg:mt-14 relative">
          <div className="bg-white px-6 lg:px-16 py-12 lg:py-14 text-center">
            <svg width="40" height="35" viewBox="0 0 40 35" fill="#000" className="mx-auto">
              <path d="M0 35V20C0 9 7 1 17 0v6c-6 1-10 6-10 12h10v17H0zm23 0V20C23 9 30 1 40 0v6c-6 1-10 6-10 12h10v17H23z"/>
            </svg>
            <div className="mt-4 flex justify-center gap-1 text-primary">
              {Array.from({ length: t.rating }).map((_, i) => (
                <svg key={i} width="33" height="33" viewBox="0 0 24 24" fill="currentColor" stroke="#000" strokeWidth="0.6">
                  <path d="m12 2 3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01z"/>
                </svg>
              ))}
            </div>
            <p className="mt-6 font-sans text-[18px] leading-[27px] text-[#333] max-w-3xl mx-auto">{t.quote}</p>
            <p className="mt-5 font-sans font-medium text-[18px] text-[#333]">{t.name}</p>
            <p className="mt-1 font-sans text-[16px] text-[#333]/80">{t.role}</p>
          </div>
          <button onClick={prev} aria-label="Previous"
            className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-black text-white grid place-items-center hover:bg-neutral-800">
            <svg width="14" height="22" viewBox="0 0 14 22" fill="currentColor"><path d="M13 2 4 11l9 9-2 2L0 11 11 0z"/></svg>
          </button>
          <button onClick={next} aria-label="Next"
            className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-black text-white grid place-items-center hover:bg-neutral-800">
            <svg width="14" height="22" viewBox="0 0 14 22" fill="currentColor"><path d="M1 2 10 11 1 20l2 2L14 11 3 0z"/></svg>
          </button>
        </div>
      </div>
    </section>
  );
}
```

---

## Step 22 — GalleryCarousel (React)
**➕ Create `src/components/GalleryCarousel.tsx`**

React because it needs responsive `perView` calc and `useState` for slide index.

```tsx
import { useState, useEffect } from "react";

interface GalleryImage { src: string; alt: string; }

export default function GalleryCarousel({ images, title, description }: {
  images: GalleryImage[];
  title?: string;
  description?: string;
}) {
  const [current, setCurrent] = useState(0);
  const [pv, setPv] = useState(3);

  useEffect(() => {
    const update = () => setPv(window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const pageCount = Math.ceil(images.length / pv);
  const goTo = (p: number) => setCurrent(Math.max(0, Math.min(p, pageCount - 1)));
  const offset = current * pv;

  return (
    <section className="py-16 lg:py-[50px]">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 text-center">
        {title && <h2 className="font-mont font-bold text-[36px] lg:text-[45px] text-black">{title}</h2>}
        {description && <p className="mt-4 font-rob text-[16px] leading-6 max-w-4xl mx-auto">{description}</p>}

        <div className="mt-10 relative">
          <div className="overflow-hidden">
            <div className="flex gap-4 transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(calc(-${offset} * (100% / ${pv} + ${16 / pv}px)))` }}>
              {images.map((img, i) => (
                <div key={i} className="flex-none" style={{ width: `calc((100% - ${(pv - 1) * 16}px) / ${pv})` }}>
                  <img src={img.src} alt={img.alt} className="w-full aspect-[4/3] object-cover" />
                </div>
              ))}
            </div>
          </div>
          <button onClick={() => goTo(current - 1)} aria-label="Previous"
            className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 bg-black text-white grid place-items-center z-10">
            <svg width="10" height="18" viewBox="0 0 14 22" fill="currentColor"><path d="M13 2 4 11l9 9-2 2L0 11 11 0z"/></svg>
          </button>
          <button onClick={() => goTo(current + 1)} aria-label="Next"
            className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 bg-black text-white grid place-items-center z-10">
            <svg width="10" height="18" viewBox="0 0 14 22" fill="currentColor"><path d="M1 2 10 11 1 20l2 2L14 11 3 0z"/></svg>
          </button>
        </div>

        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: pageCount }).map((_, i) => (
            <button key={i} onClick={() => goTo(i)} aria-label={`Page ${i + 1}`}
              className={`w-3 h-3 rounded-full border-2 border-black transition-colors ${i === current ? "bg-black" : "bg-transparent"}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

## Step 23 — CTAStrip Component
**➕ Create `src/components/CTAStrip.astro`**

```astro
---
import { siteData } from "@/content/siteData";

interface Props {
  heading?: string;
  primaryText?: string;
  primaryLink?: string;
}
const {
  heading = "Want Junk Removed?",
  primaryText = "Get Quote",
  primaryLink = "#contact",
} = Astro.props;
---

<section id="contact" class="relative" style="background: linear-gradient(180deg, var(--color-accent) 0%, #000 100%);">
  <div class="max-w-[1200px] mx-auto px-6 py-14 lg:py-20 text-center">
    <h2 class="font-mont font-bold text-[24px] lg:text-[25px] text-black">{heading}</h2>
    <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
      <a href={primaryLink}
        class="btn-yellow inline-flex items-center justify-center px-10 h-[50px] rounded-sm font-sans font-medium text-[20px]">
        {primaryText}
      </a>
      <a href={siteData.phoneHref}
        class="btn-black inline-flex items-center justify-center gap-3 px-10 h-[50px] rounded-sm font-sans font-medium text-[20px]">
        <svg width="14" height="14" viewBox="0 0 13 13" fill="currentColor">
          <path d="M12.528.625 9.887.016a.751.751 0 0 0-.698.352L7.97 3.212a.74.74 0 0 0 .176.711l1.538 1.26a11.27 11.27 0 0 1-4.5 4.499l-1.258-1.539a.745.745 0 0 0-.711-.175L.371 9.187a.747.747 0 0 0-.356.7l.61 2.641A.75.75 0 0 0 1.219 13C7.722 13 13 7.732 13 1.219A.75.75 0 0 0 12.528.625z"/>
        </svg>
        Call Us
      </a>
    </div>
  </div>
</section>
```

---

## Step 24 — Footer Restyling
**✏️ Edit `src/layouts/Footer.astro`**

The existing footer is minimal. Style it to match the Pronto design: black background, large centered logo, company name, copyright line, attribution.

```astro
---
import { siteData } from "@/content/siteData";
import ContentRenderer from "@/components/ContentRenderer/ContentRenderer.astro";
import { query } from "@/utils/query";
import PreferencesLayout from "./PreferencesLayout.astro";
---

<footer class="bg-black text-white">
  <div class="max-w-[1440px] mx-auto px-6 lg:px-[81px] pt-14 pb-8 text-center">
    <img src="/assets/logo.png" alt={siteData.title}
      class="mx-auto w-[160px] h-[160px] lg:w-[228px] lg:h-[228px] object-contain" />
    <h3 class="mt-6 font-mont font-bold text-[24px] lg:text-[25px] text-white">{siteData.title}</h3>

    <!-- Social icons -->
    <div class="mt-8">
      <ContentRenderer
        query={query("social-media")}
        variant="SocialMediaVariant"
        size="md"
        alignment="center"
        className="text-white justify-center"
      />
    </div>

    <!-- Legal links + preferences -->
    <div class="mt-6 flex flex-wrap justify-center gap-4 text-sm text-white/70">
      <ContentRenderer
        query={query("legal")}
        variant="ListVariant"
        className="text-white/70 flex flex-wrap justify-center gap-4"
      />
      <PreferencesLayout />
    </div>

    <div class="mt-10 pt-6 border-t border-white/10 flex flex-col lg:flex-row gap-2 lg:gap-0 lg:justify-between font-mont font-medium text-[14px] lg:text-[15px] text-white/85">
      <span>&copy;{new Date().getFullYear()} PRONTO Junk Removal. All Rights Reserved.</span>
      <span>Built By Griffin's Web Services</span>
    </div>
  </div>
</footer>
```

---

## Step 25 — AccordionVariant Styling for FAQ
The existing `AccordionVariant.astro` already works. The Pronto FAQ uses a black background with semi-transparent card rows and a yellow bullet + rotating chevron. Rather than modifying the shared variant, wrap it on the homepage with a black section:

In `index.astro`, wrap the FAQ `ContentRenderer` in a section:
```astro
<section class="bg-black text-white py-16 lg:py-[100px]">
  <div class="max-w-[1200px] mx-auto px-6 lg:px-12">
    <ContentRenderer
      query={query("faq").orderBy(sortByOrder())}
      variant="AccordionVariant"
      allowMultiple={false}
    />
  </div>
</section>
```

The `.accordion-bullet` and `.chev` classes added in Step 2 will apply automatically inside the existing `AccordionVariant` — the Accordion component already uses `details` and summary elements that match.

---

## Step 26 — Assemble `index.astro`
**✏️ Edit `src/pages/index.astro`** — replace the Greastro placeholder homepage:

```astro
---
import BaseLayout from "@/layouts/BaseLayout.astro";
import FrontPageHero from "@/layouts/FrontPageHero.astro";
import ContentRenderer from "@/components/ContentRenderer/ContentRenderer.astro";
import AboutSection from "@/components/AboutSection.astro";
import LocationsSection from "@/components/LocationsSection.astro";
import CTAStrip from "@/components/CTAStrip.astro";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import GalleryCarousel from "@/components/GalleryCarousel";
import { siteData } from "@/content/siteData";
import { query, sortByOrder } from "@/utils/query";
import heroImg from "@/assets/hero.jpg";

const testimonialResult = await query("testimonials").orderBy(sortByOrder()).get();
const testimonials = testimonialResult.entries.map((e) => ({
  quote:  e.data.description ?? "",
  name:   e.data.title,
  role:   e.data.role,
  rating: e.data.rating,
}));

const galleryResult = await query("gallery").orderBy(sortByOrder()).get();
const images = galleryResult.entries.map((e) => ({
  src: e.data.featuredImage?.src ?? "",
  alt: e.data.featuredImage?.alt ?? e.data.title,
}));
---

<BaseLayout title="Home" description={siteData.description}>
  <main class="flex-1">

    <FrontPageHero
      title={siteData.title}
      description={siteData.tagline}
      image={heroImg}
      primaryCTA={{ text: "Get Quote", link: "#contact" }}
    />

    <AboutSection />

    <ContentRenderer
      query={query("benefits").orderBy(sortByOrder())}
      variant="BenefitsVariant"
    />

    <TestimonialCarousel testimonials={testimonials} client:visible />

    <ContentRenderer
      query={query("projects").orderBy(sortByOrder())}
      variant="ProjectsBeforeAfterVariant"
      title="Our Projects"
    />

    <LocationsSection />

    <section class="bg-black text-white py-16 lg:py-[100px]">
      <div class="max-w-[1200px] mx-auto px-6 lg:px-12">
        <ContentRenderer
          query={query("faq").orderBy(sortByOrder())}
          variant="AccordionVariant"
          allowMultiple={false}
        />
      </div>
    </section>

    <GalleryCarousel
      images={images}
      title="Image Gallery"
      description="Our image gallery showcases the transformative impact of Pronto Junk Removal's work, highlighting snapshots of our thorough clean-outs and junk removal projects."
      client:visible
    />

    <CTAStrip />

  </main>
</BaseLayout>
```

---

## Step 27 — Copy Assets
Copy from `design_handoff_pronto_junk_removal/assets/` into the Greastro project:

| Source | Destination | Notes |
|---|---|---|
| `hero.jpg` | `src/assets/hero.jpg` | Used by FrontPageHero via `import` |
| `logo.png` | `public/assets/logo.png` | Used by Header + Footer via `/assets/logo.png` |
| `founder.png` | `src/assets/founder.png` | Used by `about-us/founder.mdx` |
| `team1.jpg` | `src/assets/team1.jpg` | About, projects, gallery |
| `team2.jpg` | `src/assets/team2.jpg` | About, projects, gallery |
| `project-extra.jpg` | `src/assets/project-extra.jpg` | Projects, gallery |

Images referenced via `import` in `.mdx` frontmatter (like `../../assets/team1.jpg`) go in `src/assets/`.  
Images referenced as plain URL strings (like `/assets/logo.png`) go in `public/assets/`.

---

## Step 28 — Clean Up Greastro Placeholder Content
Items not yet deleted in previous steps:

- 🗑️ `src/content/blog/first-post.mdx` — delete or leave (blog not in Pronto design)
- ✏️ `src/content/legal/*.mdx` — update effective dates and company name to Pronto
- ✏️ `src/content/authors/authors.json` — clear array (no blog authors needed for now)

---

## Step 29 — Run Dev Server & Check
```bash
cd 2025-Website-Projects/2026/pronto-junk-removal
npm install
npm run dev
```

Then run the type checker:
```bash
npx astro check
```

Walk through each section in the browser top to bottom and compare against the HTML handoff.

---

## What's React vs. Static Astro

| Component | Technology | Why |
|---|---|---|
| `TestimonialCarousel.tsx` | **React** | `useState` for carousel index, prev/next buttons |
| `GalleryCarousel.tsx` | **React** | `useState` + `useEffect` for responsive `perView` |
| `HamburgerMenuDrawer.tsx` | **React (exists)** | Already in the template |
| `AboutSection.astro` | Astro | Pure static layout, no interactivity |
| `LocationsSection.astro` | Astro | Static list from collection |
| `CTAStrip.astro` | Astro | Static markup |
| `AccordionBullet.astro` | Astro | Static SVG wrapper |
| `BenefitsVariant.astro` | Astro | Static grid |
| `ProjectsBeforeAfterVariant.astro` | Astro | Static grid |
| FAQ accordion | Astro (`<details>`) | Native HTML handles open/close |
| Header / Footer | Astro (exists) | Edit existing files |

---

## Master Checklist

### Config & Data
- [ ] Step 1 — `siteData.ts` + `siteDomain.js`
- [ ] Step 4 — `menus.json` + `menu-items.json`
- [ ] Step 15 — `contact-us.json` + `socialmedia.json`

### Styling
- [ ] Step 2 — `global.css` (colors, fonts, `.btn-yellow`, `.btn-black`, `.accordion-bullet`, `.chev`)
- [ ] Step 3 — Google Fonts in `HeadTags.astro`

### Content Collections
- [ ] Step 7 — `about-us` content (delete placeholders, add founder + team)
- [ ] Step 8 — `services` content (delete placeholders, add 10 services)
- [ ] Step 9 — `benefits` collection + `config.ts`
- [ ] Step 10 — `testimonials` content
- [ ] Step 11 — `projects` schema + content
- [ ] Step 12 — `locations` collection + `config.ts`
- [ ] Step 13 — `faq` content
- [ ] Step 14 — `gallery` collection + `config.ts`
- [ ] Step 28 — Legal + blog cleanup

### Components (new)
- [ ] Step 16 — `AccordionBullet.astro`
- [ ] Step 17 — `AboutSection.astro`
- [ ] Step 18 — `BenefitsVariant.astro` + register in `VariantUtils.ts`
- [ ] Step 19 — `ProjectsBeforeAfterVariant.astro` + register in `VariantUtils.ts`
- [ ] Step 20 — `LocationsSection.astro`
- [ ] Step 21 — `TestimonialCarousel.tsx`
- [ ] Step 22 — `GalleryCarousel.tsx`
- [ ] Step 23 — `CTAStrip.astro`

### Existing File Edits
- [ ] Step 5 — `Header.astro` (phone CTA)
- [ ] Step 6 — `index.astro` hero props
- [ ] Step 24 — `Footer.astro`
- [ ] Step 25 — FAQ section wrapper in `index.astro`
- [ ] Step 26 — Full `index.astro` assembly
- [ ] Step 27 — Copy assets

### Verify
- [ ] Step 29 — `npm run dev` + `npx astro check`
