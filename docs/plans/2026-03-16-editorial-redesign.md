# Editorial Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign Aura Jewellery from ornate dark-theme carousel layout to a clean editorial scroll experience inspired by Mejuri/Maison Miru, keeping the dark palette.

**Architecture:** Complete rewrite of App.tsx and index.css. Keep data layer (products.ts, translations.ts) untouched. New components: SlideDrawer, VideoHero, ProductGrid with interstitials, editorial ProductCard. Add stock video from Pexels for hero.

**Tech Stack:** React 19, Vite 6, Tailwind 4, Motion (framer-motion), TypeScript, Lucide React icons

---

### Task 1: Download Hero Video + Update Translations

**Files:**
- Create: `public/videos/hero-earrings.mp4` (download from Pexels)
- Modify: `src/data/translations.ts` — add new translation keys

**Step 1: Find and download a free stock video**

Search Pexels for a woman wearing earrings video. Download MP4 to `public/videos/hero-earrings.mp4`. If download fails, use a Pexels embed URL as fallback.

**Step 2: Add new translation keys**

Add to both `en` and `ta` sections of translations.ts:

```typescript
// Add to nav section:
shop: "Shop",        // ta: "கடை"
search: "Search",    // ta: "தேடு"

// Add new section:
hero: {
  cta: "SHOP COLLECTION",  // ta: "தொகுப்பைக் காண"
  scrollHint: "Scroll to explore",  // ta: "ஸ்க்ரோல் செய்யவும்"
},

// Add to drawer:
drawer: {
  about: "About",           // ta: "எங்களைப் பற்றி"
  shippingPolicy: "Shipping Policy",  // ta: "ஷிப்பிங் கொள்கை"
  contact: "Contact Us",    // ta: "தொடர்பு கொள்ளுங்கள்"
},

// Add interstitial content:
story: {
  quote: "Every piece tells a story of South Indian heritage",
  // ta: "ஒவ்வொரு நகையும் தென்னிந்திய பாரம்பரியத்தின் கதையைச் சொல்கிறது"
  craftTitle: "Handcrafted with Love in Chennai",
  // ta: "சென்னையில் அன்புடன் கைவினையாக செய்யப்பட்டது"
  craftDescription: "Each piece is meticulously crafted by skilled artisans carrying forward generations of South Indian jewellery-making tradition.",
  // ta: "ஒவ்வொரு நகையும் தென்னிந்திய நகை தயாரிப்பு பாரம்பரியத்தை முன்னெடுக்கும் திறமையான கைவினைஞர்களால் உருவாக்கப்படுகிறது."
  quickView: "Quick View",  // ta: "விரைவாகக் காண"
},
```

**Step 3: Commit**

```bash
git add public/videos/ src/data/translations.ts
git commit -m "feat: add hero video and editorial translation keys"
```

---

### Task 2: Rewrite CSS — Editorial Theme

**Files:**
- Modify: `src/index.css` — complete rewrite

**Step 1: Rewrite index.css**

Keep the `:root` CSS variables (dark palette, fonts, gold spectrum) exactly as they are. Replace everything else with clean editorial styles:

```css
@import "tailwindcss";

/* Keep existing :root block unchanged */

/* Reset & Base — same as current */

/* NEW: Scroll indicator animation */
@keyframes scroll-pulse {
  0%, 100% { opacity: 0.4; transform: translateY(0); }
  50% { opacity: 1; transform: translateY(8px); }
}
.scroll-indicator { animation: scroll-pulse 2s ease-in-out infinite; }

/* NEW: Slide-out drawer */
.drawer-overlay {
  position: fixed; inset: 0; z-index: 140;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
}
.drawer-panel {
  position: fixed; top: 0; left: 0; bottom: 0;
  width: 350px; max-width: 85vw;
  z-index: 150;
  background: var(--bg-secondary);
  border-right: 1px solid rgba(212, 168, 83, 0.1);
  overflow-y: auto;
}

/* NEW: Product card — editorial (no borders, no background) */
.editorial-card { position: relative; cursor: pointer; }
.editorial-card img {
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
.editorial-card:hover img { transform: scale(1.03); }
.editorial-card .quick-view {
  opacity: 0; transition: opacity 0.3s;
}
.editorial-card:hover .quick-view { opacity: 1; }
.editorial-card .wishlist-btn {
  opacity: 0; transition: opacity 0.3s;
}
.editorial-card:hover .wishlist-btn { opacity: 1; }

/* NEW: Category pills — editorial */
.category-pill {
  padding: 8px 20px;
  border: 1px solid rgba(212, 168, 83, 0.2);
  border-radius: 100px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--text-secondary);
  background: transparent;
  transition: all 0.3s;
  cursor: pointer;
  white-space: nowrap;
}
.category-pill:hover {
  border-color: var(--gold-400);
  color: var(--gold-300);
}
.category-pill.active {
  background: var(--gold-500);
  border-color: var(--gold-500);
  color: var(--bg-primary);
}

/* Keep existing: gold-shimmer, lightbox, toast, whatsapp-float, scrollbar, skeleton, payment-badge, tag-pill, ::selection */
/* Remove: card-glow, ornate-border, temple-divider, hero-pattern, carousel-dot, category-btn, nav-link, badge-pulse/badge-new/badge-bestseller, product-image-wrapper (replaced by editorial-card) */
```

**Step 2: Commit**

```bash
git add src/index.css
git commit -m "feat: rewrite CSS for editorial layout"
```

---

### Task 3: Rewrite App.tsx — Navigation + Drawer

**Files:**
- Modify: `src/App.tsx` — rewrite the App component

**Step 1: Write the new top bar and drawer**

Replace the entire App.tsx. Start with imports, helpers (keep whatsappLink, whatsappProductLink), and the main App component structure:

```tsx
// Top bar: fixed, h-16, z-50
// Left: Menu icon (hamburger) → opens drawer
// Center: "AURA JEWELLERY" in Cinzel
// Right: Search icon, Globe + lang text, ShoppingBag + count

// Drawer state: const [drawerOpen, setDrawerOpen] = useState(false)
// AnimatePresence for drawer overlay + panel
// Drawer panel slides in from left (motion.div x: -350 → 0)
// Categories with product counts (computed from products array)
// Divider line
// About, Shipping, Contact links
// Language toggle at bottom
```

Keep existing state: `lang`, `activeCategory`, `cartCount`, `expandedProduct`, `lightboxProduct`, `wishlisted`, `toasts`, `cartBounce`.

Remove state: `heroIndex`, `isLoading`, `scrolled`, `heroRef`, `heroY`, `heroOpacity`, `scrollYProgress`.

Add state: `drawerOpen` (boolean), `pastHero` (boolean, for sticky category strip).

**Step 2: Commit**

```bash
git add src/App.tsx
git commit -m "feat: implement minimal nav bar and slide-out drawer"
```

---

### Task 4: Video Hero Section

**Files:**
- Modify: `src/App.tsx` — add hero section after nav

**Step 1: Build the full-viewport video hero**

```tsx
// <section className="relative h-screen overflow-hidden">
//   <video autoPlay muted loop playsInline poster="/videos/hero-poster.jpg"
//     className="absolute inset-0 w-full h-full object-cover">
//     <source src="/videos/hero-earrings.mp4" type="video/mp4" />
//   </video>
//   <div className="absolute inset-0" style={{
//     background: 'linear-gradient(to bottom, rgba(11,7,6,0.3) 0%, rgba(11,7,6,0.5) 60%, rgba(11,7,6,0.9) 100%)'
//   }} />
//   <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
//     <motion.p tracking text "PREMIUM SOUTH INDIAN..."
//     <motion.h1 "AURA JEWELLERY" gold-shimmer
//     <motion.p italic tagline
//     <motion.a "SHOP COLLECTION" — gold outline button, href="#products"
//   </div>
//   <div className="absolute bottom-8 left-1/2 -translate-x-1/2 scroll-indicator">
//     <ChevronDown />
//   </div>
// </section>
```

Use staggered entry animations (initial y:30 opacity:0, animate y:0 opacity:1 with increasing delays).

**Step 2: Commit**

```bash
git add src/App.tsx
git commit -m "feat: add full-viewport video hero section"
```

---

### Task 5: Sticky Category Strip + 2-Column Product Grid

**Files:**
- Modify: `src/App.tsx` — products section

**Step 1: Add scroll detection for sticky category strip**

```tsx
// useEffect with IntersectionObserver on hero section
// When hero exits viewport, setPastHero(true) → category strip becomes sticky
// Strip: fixed below nav bar (top-16), full width, dark bg with blur
```

**Step 2: Build category strip**

```tsx
// Horizontal scroll container on mobile, centered flex on desktop
// category pills: "All", "Bridal Sets", etc.
// onClick → setActiveCategory
// Active pill gets .active class (gold bg)
```

**Step 3: Build 2-column editorial product grid**

```tsx
// <section id="products" className="px-6 md:px-12 lg:px-20 py-20">
//   <div className="max-w-6xl mx-auto">
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-14">
//       {filteredProducts.map((product, i) => {
//         // Insert interstitial blocks after every 6 products
//         const items = [];
//         if (i === 6) items.push(<StoryBlock1 />);
//         if (i === 12) items.push(<StoryBlock2 />);
//         if (i === 18) items.push(<StoryBlock3 />);
//         items.push(<EditorialProductCard key={product.id} ... />);
//         return items;
//       })}
//     </div>
//   </div>
// </section>
```

**Step 4: Build EditorialProductCard component**

```tsx
// function EditorialProductCard({ product, lang, onImageClick, isWishlisted, onWishlist })
//
// <div className="editorial-card group">
//   <div className="relative overflow-hidden" style={{ aspectRatio: '3/4' }}>
//     <img src={product.image} className="w-full h-full object-cover" />
//     {/* Quick View overlay — center */}
//     <div className="quick-view absolute inset-0 flex items-center justify-center bg-black/30">
//       <span className="text-xs uppercase tracking-widest text-gold-100">Quick View</span>
//     </div>
//     {/* Wishlist heart — top right, hidden until hover */}
//     <button className="wishlist-btn absolute top-4 right-4 ...">
//       <Heart />
//     </button>
//   </div>
//   {/* Badge as text */}
//   {product.badge && <p className="text-[10px] uppercase tracking-wider text-gold-500 mt-4">
//     {product.badge === 'new' ? 'New Arrival' : 'Best Seller'}
//   </p>}
//   {/* Name */}
//   <h3 className="text-sm tracking-wider mt-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--gold-100)' }}>
//     {lang === 'en' ? product.nameEn : product.nameTa}
//   </h3>
//   {/* Price */}
//   <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
//     {product.priceFormatted}
//   </p>
// </div>
```

**Step 5: Commit**

```bash
git add src/App.tsx
git commit -m "feat: add sticky categories and 2-column editorial product grid"
```

---

### Task 6: Interstitial Story Blocks

**Files:**
- Modify: `src/App.tsx` — add story block components

**Step 1: Build three interstitial components**

```tsx
// StoryQuote — full-width centered italic quote
// <motion.div whileInView fade-in className="col-span-full py-24 text-center">
//   <p className="text-3xl md:text-4xl italic" style={{ fontFamily: 'var(--font-accent)', color: 'var(--gold-300)' }}>
//     "Every piece tells a story of South Indian heritage"
//   </p>
// </motion.div>

// StoryCraft — split layout, text left, product image right
// <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-12 py-20 items-center">
//   <div>
//     <h3 Cinzel "Handcrafted with Love in Chennai"
//     <p DM Sans brand description
//   </div>
//   <div>
//     <img one of the product images used as lifestyle shot (e.g. kemp-lakshmi-choker-set.jpeg)
//   </div>
// </div>

// TrustBar — horizontal trust indicators
// <div className="col-span-full flex flex-wrap justify-center gap-12 py-16">
//   {[Shield/quality, Truck/shipping, RotateCcw/returns, CreditCard/payment].map(...)}
// </div>
```

**Step 2: Integrate into product grid**

Insert story blocks at positions 6, 12, and 18 in the product rendering loop. Each block spans `col-span-full` (both columns in the grid).

**Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "feat: add editorial interstitial story blocks"
```

---

### Task 7: Lightbox + Toast + WhatsApp (Retain Existing)

**Files:**
- Modify: `src/App.tsx` — keep/adapt existing components

**Step 1: Keep Lightbox component**

Retain the existing Lightbox component largely unchanged. It already has:
- Image zoom, product details, materials, includes
- Add to cart button, WhatsApp inquiry link
- ESC to close, backdrop click to close

Minor updates:
- Ensure it uses the editorial color scheme (no ornate borders)
- Keep the 2-panel layout (image left, details right on desktop)

**Step 2: Keep Toast component unchanged**

**Step 3: Keep WhatsApp floating button unchanged**

**Step 4: Commit**

```bash
git add src/App.tsx
git commit -m "feat: retain lightbox, toast, and WhatsApp components"
```

---

### Task 8: Footer — Clean Editorial

**Files:**
- Modify: `src/App.tsx` — footer section

**Step 1: Build clean footer**

```tsx
// <footer className="border-t border-[rgba(212,168,83,0.1)] px-6 md:px-12 lg:px-20 py-20"
//   style={{ background: 'var(--bg-secondary)' }}>
//   <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
//     Column 1: Brand name + description + social icons
//     Column 2: Quick Links (Home, Bridal Sets, Victorian Sets, etc.)
//     Column 3: Customer Care (Shipping, Returns, FAQs, Size Guide, Privacy)
//     Column 4: Get in Touch (email, phone, address)
//   </div>
//   <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-[rgba(212,168,83,0.08)]">
//     Payment badges + copyright + "Handcrafted with love in Chennai"
//   </div>
// </footer>
```

**Step 2: Commit**

```bash
git add src/App.tsx
git commit -m "feat: add editorial footer"
```

---

### Task 9: Build + Verify + Deploy

**Files:**
- None (build + deploy only)

**Step 1: Build for production**

```bash
node node_modules/vite/bin/vite.js build
```

Expected: Build succeeds, no TypeScript errors.

**Step 2: Verify in preview server**

- Check desktop (1440px): video hero, 2-column grid, interstitials, footer
- Check mobile (375px): single column, video plays, drawer works
- Check lightbox opens on product click
- Check category filtering works
- Check language toggle works

**Step 3: Push and deploy**

```bash
git push origin master
npx vercel --prod --yes
```

**Step 4: Final commit if any fixes needed**

```bash
git add -A
git commit -m "fix: post-deploy adjustments"
git push origin master
npx vercel --prod --yes
```
