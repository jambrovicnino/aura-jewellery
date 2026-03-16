# Reactive Redesign — Approach A: "Polish & Animate"

**Date:** 2026-03-16
**Status:** Approved
**Dependencies:** Motion (framer-motion) — already installed

## Overview

Transform the static landing page into a fully reactive, interactive experience. Every scroll, hover, click, and transition will feel polished and premium. No new dependencies needed.

## Design Sections

### 1. Hero — Product Showcase Carousel
- Auto-rotate 4-5 bestseller products every 4s with crossfade
- Each slide: product image + name/price
- Progress dots as manual controls
- Parallax background shift on cursor movement

### 2. Navbar — Scroll-Aware
- Shrinks from 80px to 60px on scroll
- Active category gets animated gold underline
- Border-bottom glow appears after scrolling past hero

### 3. Product Cards — Rich Hover & Interactions
- Image zoom 1.08x on hover (0.5s ease)
- Card lift translateY(-8px) with gold glow shadow
- Wishlist heart: fills red with pulse on click (local state)
- Badge: gentle pulse animation loop
- Price tag: subtle slide-in on hover

### 4. Category Filter — Animated Layout Shuffle
- Products animate out (fade + scale down)
- Filtered products animate in with 50ms stagger
- AnimatePresence + layout prop for smooth position morphing
- Active button gets animated gold background fill

### 5. Product Lightbox Modal
- Full-screen overlay on image click
- Large image with zoom capability
- Product details on right (below on mobile)
- Backdrop blur + dark overlay
- Scale-up entrance, scale-down exit
- WhatsApp inquiry button in modal

### 6. Add-to-Cart Micro-Animations
- Button color flash (gold → white → gold)
- Cart icon bounces (scale 1→1.3→1) on count change
- Toast notification slides from bottom-right, auto-dismiss 2s

### 7. Scroll-Triggered Section Reveals
- All sections use whileInView with once: true, amount: 0.2
- Trust badges: stagger fade-up
- Category grid: stagger scale-in
- Product grid: stagger from bottom 50ms delay
- About: left slides left, right slides right
- CTA: fade-up with scale
- Footer: stagger fade-up

### 8. Language Toggle Crossfade
- All text does opacity 0→1 (150ms) on language change

### 9. Loading State
- Skeleton shimmer placeholders for 300ms
- Then cascade reveal animation

## Files to Modify
- `src/App.tsx` — Main component, all sections and ProductCard
- `src/index.css` — New animation keyframes and styles

## Architecture
- No new components/files needed
- All interactions use Motion (framer-motion) + CSS transitions
- Local state for wishlist, toast, carousel index
- No routing changes
