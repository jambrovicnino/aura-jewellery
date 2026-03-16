import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import {
  ShoppingBag, Menu, X, Globe, Heart, Phone, Mail, MapPin,
  ChevronRight, Shield, Truck, RotateCcw, CreditCard,
  Instagram, Facebook, MessageCircle, Star, Package,
  ZoomIn, ChevronLeft,
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { translations, type Language } from './data/translations';
import { products, WHATSAPP_NUMBER, type Product } from './data/products';

// ─── WhatsApp helper ───
function whatsappLink(number: string, message: string) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

function whatsappProductLink(product: Product, lang: Language) {
  const name = lang === 'en' ? product.nameEn : product.nameTa;
  const msg = lang === 'en'
    ? `Hi! I'm interested in "${name}" (Code: ${product.code}, Price: ${product.priceFormatted}). Is it available?`
    : `வணக்கம்! "${name}" (குறியீடு: ${product.code}, விலை: ${product.priceFormatted}) பற்றி விசாரிக்க விரும்புகிறேன். கிடைக்குமா?`;
  return whatsappLink(WHATSAPP_NUMBER, msg);
}

// ─── Featured products for hero carousel ───
const featuredProducts = products.filter(p => p.badge === 'bestseller' || p.badge === 'new').slice(0, 5);

// ─── Toast Component ───
function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 2200);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <motion.div
      initial={{ y: 80, opacity: 0, scale: 0.8 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: 80, opacity: 0, scale: 0.8 }}
      className="px-6 py-3 rounded-lg shadow-2xl text-sm font-semibold tracking-wider pointer-events-auto"
      style={{
        background: 'linear-gradient(135deg, var(--gold-500), var(--gold-400))',
        color: 'var(--bg-primary)',
        fontFamily: 'var(--font-body)',
      }}
    >
      {message}
    </motion.div>
  );
}

// ─── Lightbox Modal ───
function Lightbox({
  product, lang, t, onClose, onAddToCart,
}: {
  product: Product; lang: Language; t: any; onClose: () => void; onAddToCart: () => void;
}) {
  const [zoomed, setZoomed] = useState(false);
  const name = lang === 'en' ? product.nameEn : product.nameTa;
  const description = lang === 'en' ? product.descriptionEn : product.descriptionTa;
  const material = lang === 'en' ? product.materialEn : product.materialTa;
  const includes = lang === 'en' ? product.includesEn : product.includesTa;
  const fontFamily = lang === 'ta' ? 'var(--font-tamil)' : 'var(--font-body)';

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', handleKey); };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="lightbox-overlay"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="lightbox-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <div
          className={`lightbox-image-container ${zoomed ? 'zoomed' : ''}`}
          onClick={() => setZoomed(!zoomed)}
        >
          <img src={product.image} alt={name} className="lightbox-image" />
        </div>

        {/* Details */}
        <div className="lightbox-details">
          <button
            onClick={onClose}
            className="float-right p-2 hover:text-[var(--gold-300)] transition-colors"
            style={{ color: 'var(--text-muted)' }}
          >
            <X size={24} />
          </button>

          {product.badge && (
            <span className={`inline-block mb-3 ${product.badge === 'new' ? 'badge-new' : 'badge-bestseller'}`}>
              {product.badge === 'new' ? t.product.newArrival : t.product.bestSeller}
            </span>
          )}

          <h3
            className="text-2xl md:text-3xl tracking-wider mb-2"
            style={{ fontFamily: lang === 'ta' ? 'var(--font-tamil)' : 'var(--font-display)', color: 'var(--gold-100)' }}
          >
            {name}
          </h3>

          <p className="text-[10px] uppercase tracking-wider mb-4" style={{ color: 'var(--text-muted)' }}>
            {t.product.code}: {product.code}
          </p>

          <p
            className="text-2xl font-bold mb-6"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--gold-300)' }}
          >
            {product.priceFormatted}
          </p>

          <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-secondary)', fontFamily }}>
            {description}
          </p>

          <div className="mb-4">
            <p className="text-[10px] uppercase tracking-wider mb-2 font-bold" style={{ color: 'var(--gold-400)' }}>
              {t.product.material}
            </p>
            <p className="text-[12px]" style={{ color: 'var(--text-secondary)', fontFamily }}>
              {material}
            </p>
          </div>

          <div className="mb-6">
            <p className="text-[10px] uppercase tracking-wider mb-2 font-bold" style={{ color: 'var(--gold-400)' }}>
              {t.product.includes}
            </p>
            <ul className="space-y-1.5">
              {includes.map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-[12px]" style={{ color: 'var(--text-secondary)', fontFamily }}>
                  <ChevronRight size={10} style={{ color: 'var(--gold-500)' }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-6">
            {product.tags.map(tag => (
              <span key={tag} className="tag-pill">{tag}</span>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={onAddToCart}
              className="flex-1 py-3 text-[11px] uppercase tracking-wider font-bold transition-all hover:opacity-90"
              style={{
                background: 'linear-gradient(135deg, var(--gold-500), var(--gold-400))',
                color: 'var(--bg-primary)',
                borderRadius: '4px',
                fontFamily,
              }}
            >
              {t.product.addToCart}
            </button>
            <a
              href={whatsappProductLink(product, lang)}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-6 transition-all hover:opacity-90 flex items-center gap-2 text-[11px] uppercase tracking-wider font-bold"
              style={{
                background: '#25D366',
                borderRadius: '4px',
                color: 'white',
              }}
            >
              <MessageCircle size={16} />
              {lang === 'en' ? 'Inquire' : 'விசாரி'}
            </a>
          </div>

          <p className="mt-4 text-[10px] flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
            <ZoomIn size={12} /> {lang === 'en' ? 'Click image to zoom' : 'படத்தை பெரிதாக்க கிளிக் செய்யவும்'}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Skeleton Card ───
function SkeletonCard() {
  return (
    <div className="border overflow-hidden" style={{ background: 'var(--bg-card)', borderColor: 'rgba(212,168,83,0.1)', borderRadius: '6px' }}>
      <div className="skeleton" style={{ aspectRatio: '4/3' }} />
      <div className="p-5 space-y-3">
        <div className="skeleton h-5 w-3/4" />
        <div className="skeleton h-3 w-1/3" />
        <div className="flex gap-2">
          <div className="skeleton h-5 w-16 rounded-full" />
          <div className="skeleton h-5 w-16 rounded-full" />
          <div className="skeleton h-5 w-16 rounded-full" />
        </div>
        <div className="skeleton h-10 w-full" />
      </div>
    </div>
  );
}

// ─── App ───
export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [activeCategory, setActiveCategory] = useState('all');
  const [cartCount, setCartCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedProduct, setExpandedProduct] = useState<number | null>(null);
  const [lightboxProduct, setLightboxProduct] = useState<Product | null>(null);
  const [wishlisted, setWishlisted] = useState<Set<number>>(new Set());
  const [toasts, setToasts] = useState<{ id: number; message: string }[]>([]);
  const [cartBounce, setCartBounce] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  const heroRef = useRef<HTMLElement>(null);
  const toastIdRef = useRef(0);
  const t = translations[lang];

  // Scroll tracking for navbar
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hero carousel auto-advance
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex(prev => (prev + 1) % featuredProducts.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Loading skeleton
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') return products;
    return products.filter(p => p.category === activeCategory);
  }, [activeCategory]);

  const toggleLang = () => setLang(l => l === 'en' ? 'ta' : 'en');

  const toggleWishlist = useCallback((id: number) => {
    setWishlisted(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const addToCart = useCallback((productName: string) => {
    setCartCount(c => c + 1);
    setCartBounce(true);
    setTimeout(() => setCartBounce(false), 500);
    const id = ++toastIdRef.current;
    const message = lang === 'en' ? `${productName} added to cart!` : `${productName} கார்ட்டில் சேர்க்கப்பட்டது!`;
    setToasts(prev => [...prev, { id, message }]);
  }, [lang]);

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Hero parallax
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <motion.div
      key={lang}
      initial={{ opacity: 0.7 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15 }}
      className="min-h-screen grain"
      style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      {/* ═══ FREE SHIPPING BANNER ═══ */}
      <div
        className="py-2.5 px-4 text-center text-[11px] tracking-[0.2em] uppercase"
        style={{
          background: 'linear-gradient(90deg, var(--burgundy), var(--ruby), var(--burgundy))',
          color: 'var(--gold-100)',
          fontFamily: 'var(--font-body)',
        }}
      >
        <span className="font-tamil">{t.banner}</span>
      </div>

      {/* ═══ NAVIGATION — Scroll-Aware ═══ */}
      <motion.nav
        className="sticky top-0 z-50 backdrop-blur-xl border-b px-6 flex justify-between items-center"
        style={{
          background: 'rgba(11, 7, 6, 0.9)',
          borderColor: scrolled ? 'rgba(212, 168, 83, 0.2)' : 'rgba(212, 168, 83, 0.1)',
        }}
        animate={{
          paddingTop: scrolled ? 10 : 16,
          paddingBottom: scrolled ? 10 : 16,
          boxShadow: scrolled ? '0 4px 30px rgba(212, 168, 83, 0.08)' : '0 0px 0px rgba(0,0,0,0)',
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Mobile menu button */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(true)} aria-label="Open menu">
          <Menu size={24} style={{ color: 'var(--gold-300)' }} />
        </button>

        {/* Logo */}
        <div className="text-center md:text-left cursor-pointer" onClick={() => setActiveCategory('all')}>
          <motion.h1
            className="tracking-[0.3em] font-bold gold-shimmer"
            style={{ fontFamily: lang === 'ta' ? 'var(--font-tamil)' : 'var(--font-display)' }}
            animate={{ fontSize: scrolled ? '1.1rem' : '1.35rem' }}
            transition={{ duration: 0.3 }}
          >
            {t.shopName}
          </motion.h1>
        </div>

        {/* Desktop nav links */}
        <div
          className="hidden md:flex items-center gap-8 text-[11px] uppercase tracking-[0.2em]"
          style={{ color: 'var(--text-secondary)', fontFamily: lang === 'ta' ? 'var(--font-tamil)' : 'var(--font-body)' }}
        >
          {[
            { label: t.nav.home, cat: 'all' },
            { label: t.nav.bridalSets, cat: 'bridalSets' },
            { label: t.nav.victorianSets, cat: 'victorianSets' },
            { label: t.nav.templeJewelry, cat: 'templeJewelry' },
            { label: t.nav.beadNecklaces, cat: 'beadNecklaces' },
            { label: t.nav.accessories, cat: 'accessories' },
          ].map(item => (
            <button
              key={item.cat}
              onClick={() => {
                setActiveCategory(item.cat);
                if (item.cat !== 'all') {
                  setTimeout(() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }), 100);
                }
              }}
              className={`nav-link hover:text-[var(--gold-300)] transition-colors ${activeCategory === item.cat ? 'active text-[var(--gold-300)]' : ''}`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 text-[11px] tracking-wider hover:text-[var(--gold-300)] transition-colors"
            style={{ color: 'var(--text-secondary)', fontFamily: lang === 'en' ? 'var(--font-tamil)' : 'var(--font-body)' }}
          >
            <Globe size={14} />
            {t.langSwitch}
          </button>
          <button
            className={`relative hover:text-[var(--gold-300)] transition-colors ${cartBounce ? 'cart-bounce' : ''}`}
            style={{ color: 'var(--gold-300)' }}
          >
            <ShoppingBag size={20} />
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold"
                  style={{ background: 'var(--ruby)', color: 'white' }}
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.nav>

      {/* ═══ MOBILE MENU ═══ */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 z-[60] p-8 flex flex-col"
            style={{ background: 'var(--bg-primary)' }}
          >
            <button onClick={() => setIsMenuOpen(false)} className="self-end mb-8">
              <X size={28} style={{ color: 'var(--gold-300)' }} />
            </button>
            <div className="flex flex-col gap-6" style={{ fontFamily: lang === 'ta' ? 'var(--font-tamil)' : 'var(--font-display)' }}>
              {[
                { label: t.nav.home, cat: 'all' },
                { label: t.nav.bridalSets, cat: 'bridalSets' },
                { label: t.nav.victorianSets, cat: 'victorianSets' },
                { label: t.nav.templeJewelry, cat: 'templeJewelry' },
                { label: t.nav.beadNecklaces, cat: 'beadNecklaces' },
                { label: t.nav.accessories, cat: 'accessories' },
                { label: t.nav.about, cat: null },
                { label: t.nav.contact, cat: null },
              ].map((item, i) => (
                <motion.button
                  key={item.label}
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => {
                    if (item.cat !== null) setActiveCategory(item.cat);
                    setIsMenuOpen(false);
                  }}
                  className="text-left text-2xl tracking-wider hover:text-[var(--gold-300)] transition-colors"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {item.label}
                </motion.button>
              ))}
            </div>
            <button
              onClick={() => { toggleLang(); setIsMenuOpen(false); }}
              className="mt-auto flex items-center gap-2 text-sm"
              style={{ color: 'var(--gold-300)' }}
            >
              <Globe size={16} /> {t.langSwitch}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {/* ═══ HERO SECTION — Product Carousel ═══ */}
        <header ref={heroRef} className="relative overflow-hidden hero-pattern" style={{ minHeight: '80vh', background: 'var(--bg-secondary)' }}>
          {/* Parallax background */}
          <motion.div className="absolute inset-0" style={{ y: heroY, opacity: heroOpacity }}>
            <div className="absolute inset-0" style={{
              background: `
                radial-gradient(ellipse 80% 50% at 50% 50%, rgba(212, 168, 83, 0.08) 0%, transparent 60%),
                radial-gradient(ellipse 40% 60% at 20% 80%, rgba(155, 27, 48, 0.1) 0%, transparent 50%),
                radial-gradient(ellipse 40% 60% at 80% 20%, rgba(27, 107, 58, 0.06) 0%, transparent 50%)
              `
            }} />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] opacity-[0.04]" style={{
              background: 'radial-gradient(ellipse at center, var(--gold-300) 0%, transparent 70%)',
              borderRadius: '0 0 50% 50%',
            }} />
          </motion.div>

          <div className="relative z-10 flex flex-col items-center justify-center px-6 py-20 md:py-28" style={{ minHeight: '80vh' }}>
            {/* Top ornament */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="temple-divider w-48 mb-8"
            >
              <Star size={12} style={{ color: 'var(--gold-500)' }} />
            </motion.div>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-[11px] tracking-[0.4em] uppercase mb-5"
              style={{ color: 'var(--gold-500)', fontFamily: 'var(--font-body)' }}
            >
              {t.taglineSub}
            </motion.p>

            <motion.h2
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl leading-tight mb-4 gold-shimmer"
              style={{ fontFamily: lang === 'ta' ? 'var(--font-tamil)' : 'var(--font-display)', fontWeight: 600 }}
            >
              {t.shopName}
            </motion.h2>

            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl italic mb-10 max-w-xl text-center"
              style={{ color: 'var(--gold-100)', fontFamily: lang === 'ta' ? 'var(--font-tamil)' : 'var(--font-accent)', opacity: 0.8 }}
            >
              {t.tagline}
            </motion.p>

            {/* ─── Featured Product Carousel ─── */}
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="w-full max-w-3xl mb-10"
            >
              <div className="relative overflow-hidden rounded-lg border" style={{ aspectRatio: '16/9', borderColor: 'rgba(212, 168, 83, 0.15)' }}>
                <AnimatePresence mode="wait">
                  {featuredProducts.length > 0 && (
                    <motion.div
                      key={heroIndex}
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.6 }}
                      className="absolute inset-0 cursor-pointer"
                      onClick={() => setLightboxProduct(featuredProducts[heroIndex])}
                    >
                      <img
                        src={featuredProducts[heroIndex].image}
                        alt={lang === 'en' ? featuredProducts[heroIndex].nameEn : featuredProducts[heroIndex].nameTa}
                        className="w-full h-full object-cover"
                      />
                      {/* Gradient overlay with centered name & price */}
                      <div
                        className="absolute inset-0 flex items-end"
                        style={{ background: 'linear-gradient(to top, rgba(11,7,6,0.85) 0%, rgba(11,7,6,0.3) 25%, transparent 50%)' }}
                      >
                        <div className="px-8 pb-6 w-full text-center">
                          <p
                            className="text-xl md:text-2xl tracking-wider mb-1"
                            style={{ fontFamily: lang === 'ta' ? 'var(--font-tamil)' : 'var(--font-display)', color: 'var(--gold-100)' }}
                          >
                            {lang === 'en' ? featuredProducts[heroIndex].nameEn : featuredProducts[heroIndex].nameTa}
                          </p>
                          <p
                            className="text-2xl md:text-3xl font-bold mb-1"
                            style={{ fontFamily: 'var(--font-display)', color: 'var(--gold-300)' }}
                          >
                            {featuredProducts[heroIndex].priceFormatted}
                          </p>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                            {lang === 'en' ? 'Click to view details' : 'விவரங்களைக் காண கிளிக் செய்யவும்'}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Carousel arrows */}
                <button
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full backdrop-blur-sm transition-all hover:bg-[rgba(212,168,83,0.2)]"
                  style={{ background: 'rgba(0,0,0,0.5)' }}
                  onClick={() => setHeroIndex(prev => (prev - 1 + featuredProducts.length) % featuredProducts.length)}
                >
                  <ChevronLeft size={22} style={{ color: 'var(--gold-300)' }} />
                </button>
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full backdrop-blur-sm transition-all hover:bg-[rgba(212,168,83,0.2)]"
                  style={{ background: 'rgba(0,0,0,0.5)' }}
                  onClick={() => setHeroIndex(prev => (prev + 1) % featuredProducts.length)}
                >
                  <ChevronRight size={22} style={{ color: 'var(--gold-300)' }} />
                </button>
              </div>

              {/* Carousel dots */}
              <div className="flex gap-2.5 justify-center mt-5">
                {featuredProducts.map((_, i) => (
                  <button
                    key={i}
                    className={`carousel-dot ${i === heroIndex ? 'active' : ''}`}
                    onClick={() => setHeroIndex(i)}
                  />
                ))}
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-5 justify-center"
            >
              <button
                onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-12 py-4 text-[11px] uppercase tracking-[0.3em] font-bold transition-all hover:scale-105 hover:shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, var(--gold-500), var(--gold-300))',
                  color: 'var(--bg-primary)',
                  fontFamily: lang === 'ta' ? 'var(--font-tamil)' : 'var(--font-body)',
                  borderRadius: '2px',
                }}
              >
                {t.nav.collections}
              </button>
              <a
                href={whatsappLink(WHATSAPP_NUMBER, t.whatsapp.message)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-12 py-4 text-[11px] uppercase tracking-[0.3em] font-bold transition-all hover:scale-105 border"
                style={{
                  borderColor: 'var(--gold-600)',
                  color: 'var(--gold-300)',
                  fontFamily: lang === 'ta' ? 'var(--font-tamil)' : 'var(--font-body)',
                  borderRadius: '2px',
                }}
              >
                <span className="flex items-center gap-2">
                  <MessageCircle size={14} />
                  {t.nav.contact}
                </span>
              </a>
            </motion.div>

            {/* Bottom ornament */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
              className="temple-divider w-48 mt-12"
            >
              <Star size={12} style={{ color: 'var(--gold-500)' }} />
            </motion.div>
          </div>
        </header>

        {/* ═══ TRUST BADGES ═══ */}
        <section className="border-y py-10 px-6" style={{ borderColor: 'rgba(212, 168, 83, 0.1)', background: 'var(--bg-secondary)' }}>
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: <Shield size={22} />, title: t.trust.quality, desc: t.trust.qualityDesc },
              { icon: <RotateCcw size={22} />, title: t.trust.returns, desc: t.trust.returnsDesc },
              { icon: <Truck size={22} />, title: t.trust.shipping, desc: t.trust.shippingDesc },
              { icon: <CreditCard size={22} />, title: t.trust.payment, desc: t.trust.paymentDesc },
            ].map((badge, i) => (
              <motion.div
                key={i}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                viewport={{ once: true, amount: 0.3 }}
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-3 justify-center text-center md:text-left md:justify-start cursor-default"
              >
                <div style={{ color: 'var(--gold-400)' }}>{badge.icon}</div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--gold-200)', fontFamily: lang === 'ta' ? 'var(--font-tamil)' : 'var(--font-body)' }}>
                    {badge.title}
                  </p>
                  <p className="text-[10px]" style={{ color: 'var(--text-muted)', fontFamily: lang === 'ta' ? 'var(--font-tamil)' : 'var(--font-body)' }}>
                    {badge.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ═══ CATEGORIES ═══ */}
        <section className="py-12 px-6" style={{ background: 'var(--bg-primary)' }}>
          <div className="max-w-6xl mx-auto">

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {Object.entries(t.categories).map(([key, label], i) => {
                const isActive = activeCategory === key;
                return (
                  <motion.button
                    key={key}
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setActiveCategory(key);
                      if (key !== 'all') {
                        setTimeout(() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }), 100);
                      }
                    }}
                    className={`category-btn py-4 px-3 text-center border ${isActive ? 'active' : ''}`}
                    style={{
                      borderColor: isActive ? 'var(--gold-400)' : 'rgba(212, 168, 83, 0.15)',
                      background: isActive
                        ? 'linear-gradient(135deg, rgba(212, 168, 83, 0.15), rgba(184, 134, 11, 0.05))'
                        : 'var(--bg-card)',
                      borderRadius: '4px',
                    }}
                  >
                    <span
                      className="text-[11px] uppercase tracking-wider font-semibold block"
                      style={{
                        color: isActive ? 'var(--gold-300)' : 'var(--text-secondary)',
                        fontFamily: lang === 'ta' ? 'var(--font-tamil)' : 'var(--font-body)',
                      }}
                    >
                      {label}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══ PRODUCTS GRID ═══ */}
        <section id="products" className="py-14 px-6" style={{ background: 'var(--bg-primary)' }}>
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <h3
                className="text-3xl md:text-4xl tracking-wider mb-2"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--gold-100)' }}
              >
                {activeCategory === 'all' ? (lang === 'en' ? 'Our Collection' : 'எங்கள் தொகுப்பு') : t.categories[activeCategory as keyof typeof t.categories]}
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {filteredProducts.length} {lang === 'en' ? 'pieces' : 'பொருட்கள்'}
              </p>
            </motion.div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
                {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
              </div>
            ) : (
              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((product, i) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, y: 30, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: i * 0.05, duration: 0.35 }}
                    >
                      <ProductCard
                        product={product}
                        lang={lang}
                        t={t}
                        expanded={expandedProduct === product.id}
                        onToggle={() => setExpandedProduct(expandedProduct === product.id ? null : product.id)}
                        onAddToCart={() => addToCart(lang === 'en' ? product.nameEn : product.nameTa)}
                        onImageClick={() => setLightboxProduct(product)}
                        isWishlisted={wishlisted.has(product.id)}
                        onWishlist={() => toggleWishlist(product.id)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

            {!isLoading && filteredProducts.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
                style={{ color: 'var(--text-muted)' }}
              >
                <Package size={48} className="mx-auto mb-4 opacity-30" />
                <p>{lang === 'en' ? 'More products coming soon!' : 'மேலும் தயாரிப்புகள் விரைவில்!'}</p>
              </motion.div>
            )}
          </div>
        </section>

        {/* ═══ ABOUT 1-GRAM GOLD ═══ */}
        <section className="py-20 px-6 texture-overlay" style={{ background: 'var(--bg-secondary)' }}>
          <div className="max-w-5xl mx-auto">
            <div className="ornate-border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start py-8">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true, amount: 0.2 }}
                >
                  <h3
                    className="text-2xl md:text-3xl tracking-wider mb-6"
                    style={{ fontFamily: lang === 'ta' ? 'var(--font-tamil)' : 'var(--font-display)', color: 'var(--gold-100)' }}
                  >
                    {t.about.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed mb-8"
                    style={{ color: 'var(--text-secondary)', fontFamily: lang === 'ta' ? 'var(--font-tamil)' : 'var(--font-body)' }}
                  >
                    {t.about.description}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {t.about.features.map((feature, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        viewport={{ once: true }}
                        className="flex items-start gap-2"
                      >
                        <ChevronRight size={14} style={{ color: 'var(--gold-400)', marginTop: 2, flexShrink: 0 }} />
                        <span className="text-[12px]" style={{ color: 'var(--text-secondary)', fontFamily: lang === 'ta' ? 'var(--font-tamil)' : 'var(--font-body)' }}>
                          {feature}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true, amount: 0.2 }}
                  className="p-8 border"
                  style={{
                    background: 'rgba(212, 168, 83, 0.03)',
                    borderColor: 'rgba(212, 168, 83, 0.15)',
                    borderRadius: '4px',
                  }}
                >
                  <h4
                    className="text-xl tracking-wider mb-6"
                    style={{ fontFamily: lang === 'ta' ? 'var(--font-tamil)' : 'var(--font-display)', color: 'var(--gold-200)' }}
                  >
                    {t.about.whyTitle}
                  </h4>
                  <div className="flex flex-col gap-4">
                    {t.about.whyPoints.map((point, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-3"
                      >
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                          style={{ background: 'var(--gold-600)', color: 'var(--bg-primary)' }}
                        >
                          {i + 1}
                        </div>
                        <span className="text-[13px]" style={{ color: 'var(--text-secondary)', fontFamily: lang === 'ta' ? 'var(--font-tamil)' : 'var(--font-body)' }}>
                          {point}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ CTA SECTION ═══ */}
        <section className="py-16 px-6 text-center" style={{
          background: 'linear-gradient(135deg, var(--burgundy), #1a0a10, var(--bg-primary))',
        }}>
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.3 }}
            className="max-w-xl mx-auto"
          >
            <h3
              className="text-2xl md:text-3xl tracking-wider mb-4"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--gold-100)' }}
            >
              {lang === 'en' ? "Can't Decide? We'll Help!" : "முடிவு செய்ய முடியவில்லையா? நாங்கள் உதவுவோம்!"}
            </h3>
            <p
              className="text-sm mb-8"
              style={{ color: 'var(--text-secondary)', fontFamily: lang === 'ta' ? 'var(--font-tamil)' : 'var(--font-body)' }}
            >
              {lang === 'en'
                ? "Send us your requirements on WhatsApp and our jewelry experts will help you pick the perfect piece for any occasion."
                : "உங்கள் தேவைகளை WhatsApp-ல் அனுப்புங்கள், எங்கள் நகை நிபுணர்கள் எந்த நிகழ்வுக்கும் சரியான நகையை தேர்ந்தெடுக்க உதவுவார்கள்."
              }
            </p>
            <motion.a
              href={whatsappLink(WHATSAPP_NUMBER, t.whatsapp.message)}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-10 py-4 text-[12px] uppercase tracking-[0.2em] font-bold"
              style={{ background: '#25D366', color: 'white', borderRadius: '4px' }}
            >
              <MessageCircle size={18} />
              {lang === 'en' ? 'Chat on WhatsApp' : 'WhatsApp-ல் பேசுங்கள்'}
            </motion.a>
          </motion.div>
        </section>
      </main>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t pt-16 pb-8 px-6" style={{ background: 'var(--bg-secondary)', borderColor: 'rgba(212, 168, 83, 0.1)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {[0, 1, 2, 3].map(colIndex => (
              <motion.div
                key={colIndex}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: colIndex * 0.1 }}
                viewport={{ once: true }}
              >
                {colIndex === 0 && (
                  <>
                    <h2 className="text-lg tracking-[0.2em] mb-4 gold-shimmer" style={{ fontFamily: lang === 'ta' ? 'var(--font-tamil)' : 'var(--font-display)' }}>
                      {t.shopName}
                    </h2>
                    <p className="text-[12px] leading-relaxed mb-4" style={{ color: 'var(--text-secondary)', fontFamily: lang === 'ta' ? 'var(--font-tamil)' : 'var(--font-body)' }}>
                      {t.footer.aboutText}
                    </p>
                    <div className="flex gap-3">
                      {[Instagram, Facebook].map((Icon, idx) => (
                        <a key={idx} href="#" className="p-2 border rounded transition-all hover:border-[var(--gold-400)] hover:text-[var(--gold-300)] hover:scale-110" style={{ borderColor: 'rgba(212, 168, 83, 0.2)', color: 'var(--text-muted)' }}>
                          <Icon size={16} />
                        </a>
                      ))}
                    </div>
                  </>
                )}

                {colIndex === 1 && (
                  <>
                    <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold mb-4" style={{ color: 'var(--gold-300)' }}>
                      {t.footer.quickLinks}
                    </h4>
                    <ul className="space-y-2.5">
                      {[t.nav.home, t.nav.bridalSets, t.nav.victorianSets, t.nav.templeJewelry, t.nav.beadNecklaces, t.nav.accessories, t.nav.about].map((link) => (
                        <li key={link}>
                          <a href="#" className="text-[12px] hover:text-[var(--gold-300)] hover:translate-x-1 inline-block transition-all" style={{ color: 'var(--text-secondary)', fontFamily: lang === 'ta' ? 'var(--font-tamil)' : 'var(--font-body)' }}>
                            {link}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {colIndex === 2 && (
                  <>
                    <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold mb-4" style={{ color: 'var(--gold-300)' }}>
                      {t.footer.customerCare}
                    </h4>
                    <ul className="space-y-2.5">
                      {[t.footer.shippingPolicy, t.footer.returnsPolicy, t.footer.faqs, t.footer.sizeGuide, t.footer.privacyPolicy].map((link) => (
                        <li key={link}>
                          <a href="#" className="text-[12px] hover:text-[var(--gold-300)] hover:translate-x-1 inline-block transition-all" style={{ color: 'var(--text-secondary)', fontFamily: lang === 'ta' ? 'var(--font-tamil)' : 'var(--font-body)' }}>
                            {link}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {colIndex === 3 && (
                  <>
                    <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold mb-4" style={{ color: 'var(--gold-300)' }}>
                      {t.footer.connect}
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-[12px]" style={{ color: 'var(--text-secondary)' }}>
                        <Mail size={14} style={{ color: 'var(--gold-500)' }} /> <span>hello@aurajewellery.in</span>
                      </div>
                      <div className="flex items-center gap-3 text-[12px]" style={{ color: 'var(--text-secondary)' }}>
                        <Phone size={14} style={{ color: 'var(--gold-500)' }} /> <span>+91 98765 43210</span>
                      </div>
                      <div className="flex items-center gap-3 text-[12px]" style={{ color: 'var(--text-secondary)' }}>
                        <MapPin size={14} style={{ color: 'var(--gold-500)' }} />
                        <span style={{ fontFamily: lang === 'ta' ? 'var(--font-tamil)' : 'var(--font-body)' }}>{t.footer.address}</span>
                      </div>
                    </div>
                    <div className="mt-6">
                      <p className="text-[10px] uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>{t.footer.paymentMethods}</p>
                      <div className="payment-methods">
                        {['UPI', 'GPay', 'Cards', 'COD', 'Net Banking'].map(m => (
                          <span key={m} className="payment-badge">{m}</span>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </div>

          <div className="border-t pt-6 flex flex-col md:flex-row justify-between items-center gap-3" style={{ borderColor: 'rgba(212, 168, 83, 0.1)' }}>
            <p className="text-[10px] tracking-wider" style={{ color: 'var(--text-muted)' }}>{t.footer.copyright}</p>
            <p className="text-[10px] tracking-wider" style={{ color: 'var(--text-muted)' }}>
              {lang === 'en' ? 'Handcrafted with love in Chennai' : 'சென்னையில் அன்புடன் கைவினையாக செய்யப்பட்டது'}
            </p>
          </div>
        </div>
      </footer>

      {/* ═══ FLOATING WHATSAPP BUTTON ═══ */}
      <motion.a
        href={whatsappLink(WHATSAPP_NUMBER, t.whatsapp.message)}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
        title={t.whatsapp.tooltip}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring' }}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
      >
        <MessageCircle size={28} color="white" fill="white" />
      </motion.a>

      {/* ═══ TOAST NOTIFICATIONS ═══ */}
      <div className="toast-container">
        <AnimatePresence>
          {toasts.map(toast => (
            <div key={toast.id}>
              <Toast message={toast.message} onDone={() => removeToast(toast.id)} />
            </div>
          ))}
        </AnimatePresence>
      </div>

      {/* ═══ LIGHTBOX MODAL ═══ */}
      <AnimatePresence>
        {lightboxProduct && (
          <Lightbox
            product={lightboxProduct}
            lang={lang}
            t={t}
            onClose={() => setLightboxProduct(null)}
            onAddToCart={() => {
              addToCart(lang === 'en' ? lightboxProduct.nameEn : lightboxProduct.nameTa);
              setLightboxProduct(null);
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Product Card Component ───
function ProductCard({
  product, lang, t, expanded, onToggle, onAddToCart, onImageClick, isWishlisted, onWishlist,
}: {
  product: Product;
  lang: Language;
  t: any;
  expanded: boolean;
  onToggle: () => void;
  onAddToCart: () => void;
  onImageClick: () => void;
  isWishlisted: boolean;
  onWishlist: () => void;
}) {
  const [btnFlash, setBtnFlash] = useState(false);
  const name = lang === 'en' ? product.nameEn : product.nameTa;
  const description = lang === 'en' ? product.descriptionEn : product.descriptionTa;
  const material = lang === 'en' ? product.materialEn : product.materialTa;
  const includes = lang === 'en' ? product.includesEn : product.includesTa;
  const fontFamily = lang === 'ta' ? 'var(--font-tamil)' : 'var(--font-body)';

  const handleAddToCart = () => {
    setBtnFlash(true);
    setTimeout(() => setBtnFlash(false), 350);
    onAddToCart();
  };

  return (
    <div
      className="card-glow border overflow-hidden"
      style={{
        background: 'var(--bg-card)',
        borderColor: 'rgba(212, 168, 83, 0.1)',
        borderRadius: '6px',
      }}
    >
      {/* Image area */}
      <div
        className="relative product-image-wrapper cursor-pointer"
        style={{ aspectRatio: '4/3' }}
        onClick={onImageClick}
      >
        {product.image ? (
          <img src={product.image} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: product.gradientPlaceholder }}>
            <div className="text-center">
              <div className="text-5xl mb-2 opacity-30" style={{ fontFamily: 'var(--font-display)', color: 'var(--gold-100)' }}>✦</div>
              <p className="text-[10px] uppercase tracking-widest" style={{ color: 'rgba(245, 230, 200, 0.3)' }}>
                {lang === 'en' ? 'Photo Coming Soon' : 'புகைப்படம் விரைவில்'}
              </p>
            </div>
          </div>
        )}

        {/* Zoom hint on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <ZoomIn size={32} style={{ color: 'var(--gold-300)' }} />
        </div>

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3">
            <span className={product.badge === 'new' ? 'badge-new' : 'badge-bestseller'}>
              {product.badge === 'new' ? t.product.newArrival : t.product.bestSeller}
            </span>
          </div>
        )}

        {/* Wishlist */}
        <button
          className="absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all hover:scale-110"
          style={{ background: 'rgba(0,0,0,0.4)' }}
          onClick={(e) => { e.stopPropagation(); onWishlist(); }}
        >
          <Heart
            size={16}
            className={isWishlisted ? 'heart-active' : ''}
            style={{ color: isWishlisted ? '#ef4444' : 'var(--gold-300)' }}
            fill={isWishlisted ? '#ef4444' : 'none'}
          />
        </button>

        {/* Price overlay */}
        <motion.div
          className="absolute bottom-3 right-3 px-4 py-2 backdrop-blur-sm rounded"
          style={{ background: 'rgba(0,0,0,0.6)' }}
        >
          <span className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--gold-300)' }}>
            {product.priceFormatted}
          </span>
        </motion.div>
      </div>

      {/* Card content */}
      <div className="p-6">
        <h4
          className="text-base tracking-wider mb-1.5 cursor-pointer hover:text-[var(--gold-300)] transition-colors leading-snug"
          style={{ fontFamily: lang === 'ta' ? 'var(--font-tamil)' : 'var(--font-display)', color: 'var(--gold-100)' }}
          onClick={onToggle}
        >
          {name}
        </h4>

        <p className="text-[10px] uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
          {t.product.code}: {product.code}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {product.tags.slice(0, 4).map(tag => (
            <span key={tag} className="tag-pill">{tag}</span>
          ))}
        </div>

        {/* Expanded details */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <p className="text-[12px] leading-relaxed mb-4" style={{ color: 'var(--text-secondary)', fontFamily }}>{description}</p>
              <div className="mb-3">
                <p className="text-[10px] uppercase tracking-wider mb-1 font-bold" style={{ color: 'var(--gold-400)' }}>{t.product.material}</p>
                <p className="text-[11px]" style={{ color: 'var(--text-secondary)', fontFamily }}>{material}</p>
              </div>
              <div className="mb-4">
                <p className="text-[10px] uppercase tracking-wider mb-1 font-bold" style={{ color: 'var(--gold-400)' }}>{t.product.includes}</p>
                <ul className="space-y-1">
                  {includes.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-[11px]" style={{ color: 'var(--text-secondary)', fontFamily }}>
                      <ChevronRight size={10} style={{ color: 'var(--gold-500)' }} />{item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={onToggle}
          className="text-[10px] uppercase tracking-wider mb-4 flex items-center gap-1 hover:text-[var(--gold-300)] transition-colors"
          style={{ color: 'var(--gold-500)', fontFamily }}
        >
          {expanded ? (lang === 'en' ? 'Show Less' : 'குறைவாகக் காட்டு') : t.product.viewDetails}
          <ChevronRight size={12} className={`transition-transform duration-300 ${expanded ? 'rotate-90' : ''}`} />
        </button>

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            className={`flex-1 py-3 text-[11px] uppercase tracking-wider font-bold transition-all hover:opacity-90 active:scale-95 ${btnFlash ? 'btn-flash' : ''}`}
            style={{
              background: 'linear-gradient(135deg, var(--gold-500), var(--gold-400))',
              color: 'var(--bg-primary)',
              borderRadius: '3px',
              fontFamily,
            }}
          >
            {t.product.addToCart}
          </button>
          <a
            href={whatsappProductLink(product, lang)}
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 px-4 transition-all hover:opacity-90 hover:scale-105 active:scale-95 flex items-center"
            style={{ background: '#25D366', borderRadius: '3px' }}
          >
            <MessageCircle size={16} color="white" />
          </a>
        </div>
      </div>
    </div>
  );
}
