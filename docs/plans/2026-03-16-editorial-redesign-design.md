# Aura Jewellery — Editorial Redesign Design

**Date**: 2026-03-16
**Approach**: Editorial Scroll (Approach A)
**Inspiration**: Mejuri.com (hero/layout), MaisonMiru.com (clean editorial feel)
**Theme**: Keep existing dark palette, adopt clean editorial layout principles

---

## Design Decisions

- **Hero**: Full-viewport stock video (Pexels) of model wearing earrings. Pure brand moment — no products, no prices, just video + brand text + single CTA.
- **Navigation**: Minimal top bar (hamburger, logo, search, lang, cart). No horizontal category links. All navigation via slide-out drawer from left.
- **Products**: Large 2-column grid, no card borders/backgrounds. Images float on dark page. Minimal text (name + price only). Details on click (lightbox).
- **Interstitials**: Story blocks between product rows for editorial rhythm.
- **Color**: Existing dark palette (#0B0706, gold #D4A853, etc.) unchanged.
- **Prices**: Keep existing product data with current prices displayed.

---

## Section 1: Navigation

### Top Bar (fixed, no shrink)
- Left: hamburger icon (☰)
- Center: "AURA JEWELLERY" in Cinzel
- Right: search icon, language toggle (EN/தமிழ்), cart icon with count

### Slide-out Drawer (from left, ~350px, full height)
- Dark panel (#110E0C) with gold accents
- Brand name at top
- Category links with product counts: All, Bridal Sets (4), Victorian Sets (5), Temple Jewelry (10), Bead Necklaces (1), Accessories (2), Earrings, Bangles
- Divider
- About, Shipping Policy, Contact
- Language toggle at bottom
- Semi-transparent backdrop overlay to close

---

## Section 2: Hero

### Full-Viewport Video (100vh)
- **Source**: Free stock video from Pexels — woman wearing earrings, looped, muted, autoplay
- **Overlay**: Dark gradient (heavier at bottom) for text readability
- **Content** (centered):
  - Tracking text: "PREMIUM SOUTH INDIAN IMITATION JEWELLERY"
  - Heading: "AURA JEWELLERY" (~5rem, Cinzel)
  - Tagline: "Timeless Temple Elegance, Crafted for Every Woman" (italic, Cormorant Garamond)
  - CTA: "SHOP COLLECTION" — gold outline button, scrolls to products
- **Bottom**: Animated scroll indicator (chevron or thin line, slow pulse)
- **Mobile**: Video still plays, poster frame fallback if autoplay blocked

---

## Section 3: Product Browsing

### Category Strip (sticky below nav after scrolling past hero)
- Horizontal pills: All, Bridal Sets, Victorian Sets, Temple Jewelry, Bead Necklaces, Accessories, Earrings, Bangles
- Active: gold background. Inactive: subtle outline
- Scrollable on mobile, centered on desktop

### 2-Column Product Grid
- No card borders, no card backgrounds — images on dark page
- Image aspect ratio: 3:4 (portrait)
- **Default**: Image + product name (small text) + price underneath
- **Hover**: Subtle zoom (1.03x), "Quick View" fades in over image center, wishlist heart appears top-right
- **Click**: Opens existing lightbox with full details
- **Badge**: "Best Seller" / "New" as tiny gold text above product name (not a pill on image)
- **Spacing**: gap-10 (~40px), generous section padding
- **Mobile**: Single column, large images

---

## Section 4: Interstitial Story Blocks

### Block 1 (after row 3)
- Full-width, text-only on dark background
- Large italic quote: "Every piece tells a story of South Indian heritage"
- Centered, Cormorant Garamond, gold text
- Fade-in on scroll

### Block 2 (after row 6)
- Split layout: left text ("Handcrafted with Love in Chennai" + brand paragraph), right product image as lifestyle shot

### Block 3 (after row 9)
- Trust bar: Free Shipping, 7-Day Returns, Secure Payment, Quality Checked
- Horizontal row, small icons, minimal styling

---

## Section 5: Footer

- 4-column grid: Brand + description, Quick Links, Customer Care, Get in Touch
- Payment badges: UPI, GPay, Cards, COD, Net Banking
- WhatsApp floating button (existing)
- Copyright: "© 2026 Aura Jewellery. All Rights Reserved."
- Tagline: "Handcrafted with love in Chennai"

---

## Technical Notes

- Stack: React 19 + Vite 6 + Tailwind 4 + Motion (framer-motion) + TypeScript
- Keep existing: translations.ts, products.ts (all 24 products with current prices/images)
- Video: Embed from Pexels CDN or download to public/videos/
- Fonts: Cinzel (display), DM Sans (body), Cormorant Garamond (accent), Noto Sans Tamil
- Existing features retained: bilingual toggle, WhatsApp integration, lightbox, wishlist, cart, toast notifications
