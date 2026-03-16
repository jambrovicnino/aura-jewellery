import { useState, useMemo, useEffect, useRef, useCallback, Fragment } from 'react';
import {
  ShoppingBag, Menu, X, Globe, Heart, Phone, Mail, MapPin,
  ChevronRight, Shield, Truck, RotateCcw, CreditCard,
  Instagram, Facebook, MessageCircle, Star, Package,
  ZoomIn, ChevronLeft, ChevronDown, Search,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
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
            <span className="inline-block mb-3 text-[10px] uppercase tracking-wider font-semibold px-3 py-1 rounded"
              style={{
                background: product.badge === 'new' ? 'var(--emerald)' : 'var(--ruby)',
                color: 'white',
              }}>
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

// ─── Editorial Product Card ───
function EditorialProductCard({ product, lang, t, onImageClick, isWishlisted, onWishlist }: {
  product: Product; lang: Language; t: any;
  onImageClick: () => void; isWishlisted: boolean; onWishlist: () => void;
}) {
  const name = lang === 'en' ? product.nameEn : product.nameTa;
  return (
    <div className="editorial-card group">
      <div className="relative overflow-hidden" style={{ aspectRatio: '3/4' }} onClick={onImageClick}>
        {product.image ? (
          <img src={product.image} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: product.gradientPlaceholder }}>
            <p className="text-[10px] uppercase tracking-widest" style={{ color: 'rgba(245,230,200,0.3)' }}>
              {lang === 'en' ? 'Photo Coming Soon' : 'புகைப்படம் விரைவில்'}
            </p>
          </div>
        )}
        {/* Quick View overlay */}
        <div className="quick-view absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <span className="text-[11px] uppercase tracking-[0.2em]" style={{ color: 'var(--gold-100)' }}>{t.story.quickView}</span>
        </div>
        {/* Wishlist heart — top right */}
        <button className="wishlist-btn absolute top-4 right-4 p-2 rounded-full transition-all hover:scale-110"
          style={{ background: 'rgba(0,0,0,0.4)' }}
          onClick={(e) => { e.stopPropagation(); onWishlist(); }}>
          <Heart size={16} className={isWishlisted ? 'heart-active' : ''}
            style={{ color: isWishlisted ? '#ef4444' : 'var(--gold-300)' }}
            fill={isWishlisted ? '#ef4444' : 'none'} />
        </button>
      </div>
      {/* Badge as tiny gold text */}
      {product.badge && (
        <p className="text-[10px] uppercase tracking-[0.15em] mt-4"
          style={{ color: 'var(--gold-500)', fontFamily: 'var(--font-body)' }}>
          {product.badge === 'new' ? t.product.newArrival : t.product.bestSeller}
        </p>
      )}
      {/* Product name */}
      <h3 className="text-sm tracking-wider mt-1 cursor-pointer hover:text-[var(--gold-300)] transition-colors"
        style={{ fontFamily: lang === 'ta' ? 'var(--font-tamil)' : 'var(--font-display)', color: 'var(--gold-100)' }}
        onClick={onImageClick}>
        {name}
      </h3>
      {/* Price */}
      <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
        {product.priceFormatted}
      </p>
    </div>
  );
}

// ─── App ───
export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [activeCategory, setActiveCategory] = useState('all');
  const [cartCount, setCartCount] = useState(0);
  const [lightboxProduct, setLightboxProduct] = useState<Product | null>(null);
  const [wishlisted, setWishlisted] = useState<Set<number>>(new Set());
  const [toasts, setToasts] = useState<{ id: number; message: string }[]>([]);
  const [cartBounce, setCartBounce] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pastHero, setPastHero] = useState(false);

  const heroRef = useRef<HTMLElement>(null);
  const toastIdRef = useRef(0);
  const t = translations[lang];

  // IntersectionObserver on heroRef
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setPastHero(!entry.isIntersecting);
      },
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') return products;
    return products.filter(p => p.category === activeCategory);
  }, [activeCategory]);

  const categories: [string, string][] = [
    ['all', t.categories.all],
    ['bridalSets', t.categories.bridalSets],
    ['victorianSets', t.categories.victorianSets],
    ['templeJewelry', t.categories.templeJewelry],
    ['beadNecklaces', t.categories.beadNecklaces],
    ['accessories', t.categories.accessories],
    ['earrings', t.categories.earrings],
    ['bangles', t.categories.bangles],
  ];

  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

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

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* 1. TOP NAV BAR — fixed, h-16, z-50 */}
      <nav className="fixed top-0 left-0 right-0 h-16 z-50 flex items-center justify-between px-6 md:px-10"
        style={{ background: 'rgba(11,7,6,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(212,168,83,0.08)' }}>
        {/* Left: Menu button */}
        <button onClick={() => setDrawerOpen(true)}>
          <Menu size={22} style={{ color: 'var(--gold-300)' }} />
        </button>
        {/* Center: Logo */}
        <h1 className="text-lg tracking-[0.3em] uppercase" style={{ fontFamily: 'var(--font-display)', color: 'var(--gold-100)' }}>
          {t.shopName}
        </h1>
        {/* Right: Lang toggle + Cart */}
        <div className="flex items-center gap-4">
          <button onClick={() => setLang(lang === 'en' ? 'ta' : 'en')} className="flex items-center gap-1.5 text-xs tracking-wider"
            style={{ color: 'var(--text-secondary)' }}>
            <Globe size={14} />
            <span>{t.langSwitch}</span>
          </button>
          <button className={`relative ${cartBounce ? 'cart-bounce' : ''}`}>
            <ShoppingBag size={20} style={{ color: 'var(--gold-300)' }} />
            {cartCount > 0 && <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold"
              style={{ background: 'var(--gold-500)', color: 'var(--bg-primary)' }}>{cartCount}</span>}
          </button>
        </div>
      </nav>

      {/* 2. SLIDE-OUT DRAWER */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="drawer-overlay" onClick={() => setDrawerOpen(false)} />
            <motion.div initial={{ x: -350 }} animate={{ x: 0 }} exit={{ x: -350 }}
              transition={{ type: 'tween', duration: 0.3 }} className="drawer-panel">
              <div className="p-8">
                {/* Close button */}
                <button onClick={() => setDrawerOpen(false)} className="mb-8">
                  <X size={22} style={{ color: 'var(--gold-300)' }} />
                </button>
                {/* Brand */}
                <h2 className="text-sm tracking-[0.3em] uppercase mb-10" style={{ fontFamily: 'var(--font-display)', color: 'var(--gold-100)' }}>
                  {t.shopName}
                </h2>
                {/* Category links */}
                <div className="space-y-1">
                  {categories.map(([key, label]) => {
                    const count = key === 'all' ? products.length : products.filter(p => p.category === key).length;
                    return (
                      <button key={key} onClick={() => { setActiveCategory(key); setDrawerOpen(false); scrollToProducts(); }}
                        className="w-full flex items-center justify-between py-3 text-sm tracking-wider transition-colors hover:text-[var(--gold-300)]"
                        style={{ color: activeCategory === key ? 'var(--gold-300)' : 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>
                        <span>{label}</span>
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>({count})</span>
                      </button>
                    );
                  })}
                </div>
                {/* Divider */}
                <div className="my-8 h-px" style={{ background: 'rgba(212,168,83,0.1)' }} />
                {/* Secondary links */}
                <div className="space-y-3">
                  {[t.drawer.about, t.drawer.shippingPolicy, t.drawer.contact].map(link => (
                    <button key={link} className="block text-sm tracking-wider" style={{ color: 'var(--text-muted)' }}>{link}</button>
                  ))}
                </div>
                {/* Language at bottom */}
                <div className="mt-12">
                  <button onClick={() => { setLang(lang === 'en' ? 'ta' : 'en'); setDrawerOpen(false); }}
                    className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <Globe size={14} /> {t.langSwitch}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 3. HERO — Full viewport video */}
      <section ref={heroRef} className="relative h-screen overflow-hidden">
        <video autoPlay muted loop playsInline poster="/videos/hero-poster.jpeg"
          className="absolute inset-0 w-full h-full object-cover">
          <source src="/videos/hero-earrings.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to bottom, rgba(11,7,6,0.2) 0%, rgba(11,7,6,0.4) 50%, rgba(11,7,6,0.85) 100%)'
        }} />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
            className="text-[10px] md:text-[11px] tracking-[0.4em] uppercase mb-6"
            style={{ color: 'var(--gold-500)', fontFamily: 'var(--font-body)' }}>
            {t.taglineSub}
          </motion.p>
          <motion.h2 initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}
            className="text-4xl md:text-6xl lg:text-7xl leading-tight mb-5 gold-shimmer"
            style={{ fontFamily: lang === 'ta' ? 'var(--font-tamil)' : 'var(--font-display)', fontWeight: 600 }}>
            {t.shopName}
          </motion.h2>
          <motion.p initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.7 }}
            className="text-base md:text-lg italic mb-12 max-w-md"
            style={{ color: 'var(--gold-100)', fontFamily: lang === 'ta' ? 'var(--font-tamil)' : 'var(--font-accent)', opacity: 0.7 }}>
            {t.tagline}
          </motion.p>
          <motion.a initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.9 }}
            href="#products" className="px-10 py-3.5 text-[11px] tracking-[0.3em] uppercase border transition-all hover:bg-[var(--gold-500)] hover:text-[var(--bg-primary)] hover:border-[var(--gold-500)]"
            style={{ borderColor: 'var(--gold-400)', color: 'var(--gold-300)', fontFamily: 'var(--font-body)' }}>
            {t.hero.cta}
          </motion.a>
        </div>
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 scroll-indicator">
          <ChevronDown size={20} style={{ color: 'var(--gold-500)' }} />
        </div>
      </section>

      {/* 4. STICKY CATEGORY STRIP — appears after scrolling past hero */}
      {pastHero && (
        <div className="fixed top-16 left-0 right-0 z-40 py-3 px-6"
          style={{ background: 'rgba(11,7,6,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(212,168,83,0.06)' }}>
          <div className="max-w-6xl mx-auto flex gap-3 overflow-x-auto scrollbar-hide justify-start md:justify-center">
            {categories.map(([key, label]) => (
              <button key={key} className={`category-pill ${activeCategory === key ? 'active' : ''}`}
                onClick={() => setActiveCategory(key)}>
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 5. PRODUCTS SECTION */}
      <section id="products" className="px-6 md:px-12 lg:px-20 py-20" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-6xl mx-auto">
          {/* Section heading — only visible when not using sticky strip */}
          {!pastHero && (
            <div className="flex gap-3 overflow-x-auto mb-14 justify-start md:justify-center pb-2">
              {categories.map(([key, label]) => (
                <button key={key} className={`category-pill ${activeCategory === key ? 'active' : ''}`}
                  onClick={() => setActiveCategory(key)}>
                  {label}
                </button>
              ))}
            </div>
          )}

          {/* 2-column editorial grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-14">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, i) => (
                <Fragment key={product.id}>
                  {/* Interstitial after 6th product */}
                  {i === 6 && (
                    <motion.div key="story-quote" layout className="col-span-full py-20 text-center"
                      initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                      <p className="text-2xl md:text-4xl italic leading-relaxed max-w-3xl mx-auto"
                        style={{ fontFamily: 'var(--font-accent)', color: 'var(--gold-300)' }}>
                        &ldquo;{t.story.quote}&rdquo;
                      </p>
                    </motion.div>
                  )}
                  {/* Interstitial after 12th product */}
                  {i === 12 && (
                    <motion.div key="story-craft" layout className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-12 py-16 items-center"
                      initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                      <div>
                        <h3 className="text-2xl md:text-3xl tracking-wider mb-4"
                          style={{ fontFamily: lang === 'ta' ? 'var(--font-tamil)' : 'var(--font-display)', color: 'var(--gold-100)' }}>
                          {t.story.craftTitle}
                        </h3>
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)', fontFamily: lang === 'ta' ? 'var(--font-tamil)' : 'var(--font-body)' }}>
                          {t.story.craftDescription}
                        </p>
                      </div>
                      <div className="overflow-hidden rounded-sm" style={{ aspectRatio: '4/5' }}>
                        <img src="/images/products/kemp-lakshmi-choker-set.jpeg" alt="Handcrafted jewellery" className="w-full h-full object-cover" />
                      </div>
                    </motion.div>
                  )}
                  {/* Interstitial after 18th product — trust bar */}
                  {i === 18 && (
                    <motion.div key="trust-bar" layout className="col-span-full flex flex-wrap justify-center gap-10 md:gap-16 py-14"
                      initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                      {[
                        { icon: Shield, label: t.trust.quality, desc: t.trust.qualityDesc },
                        { icon: Truck, label: t.trust.shipping, desc: t.trust.shippingDesc },
                        { icon: RotateCcw, label: t.trust.returns, desc: t.trust.returnsDesc },
                        { icon: CreditCard, label: t.trust.payment, desc: t.trust.paymentDesc },
                      ].map(({ icon: Icon, label, desc }) => (
                        <div key={label} className="text-center">
                          <Icon size={20} className="mx-auto mb-2" style={{ color: 'var(--gold-500)' }} />
                          <p className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: 'var(--gold-200)' }}>{label}</p>
                          <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>{desc}</p>
                        </div>
                      ))}
                    </motion.div>
                  )}
                  {/* Product card */}
                  <motion.div layout initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.03, duration: 0.35 }}>
                    <EditorialProductCard product={product} lang={lang} t={t}
                      onImageClick={() => setLightboxProduct(product)}
                      isWishlisted={wishlisted.has(product.id)}
                      onWishlist={() => toggleWishlist(product.id)} />
                  </motion.div>
                </Fragment>
              ))}
            </AnimatePresence>
          </div>

          {filteredProducts.length === 0 && (
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

      {/* 6. ABOUT SECTION */}
      <section className="px-6 md:px-12 lg:px-20 py-20" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
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
      </section>

      {/* 7. FOOTER */}
      <footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid rgba(212,168,83,0.08)' }}
        className="px-6 md:px-12 lg:px-20 py-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Col 1: Brand */}
          <div>
            <h3 className="text-sm tracking-[0.3em] uppercase mb-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--gold-100)' }}>{t.shopName}</h3>
            <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>{t.footer.aboutText}</p>
            <div className="flex gap-4">
              <Instagram size={18} style={{ color: 'var(--text-muted)' }} />
              <Facebook size={18} style={{ color: 'var(--text-muted)' }} />
            </div>
          </div>
          {/* Col 2: Quick Links — category names */}
          <div>
            <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold mb-4" style={{ color: 'var(--gold-300)' }}>
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2.5">
              {categories.map(([key, label]) => (
                <li key={key}>
                  <button onClick={() => { setActiveCategory(key); scrollToProducts(); }}
                    className="text-[12px] hover:text-[var(--gold-300)] transition-all"
                    style={{ color: 'var(--text-secondary)', fontFamily: lang === 'ta' ? 'var(--font-tamil)' : 'var(--font-body)' }}>
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {/* Col 3: Customer Care */}
          <div>
            <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold mb-4" style={{ color: 'var(--gold-300)' }}>
              {t.footer.customerCare}
            </h4>
            <ul className="space-y-2.5">
              {[t.footer.shippingPolicy, t.footer.returnsPolicy, t.footer.faqs, t.footer.sizeGuide, t.footer.privacyPolicy].map((link) => (
                <li key={link}>
                  <a href="#" className="text-[12px] hover:text-[var(--gold-300)] transition-all"
                    style={{ color: 'var(--text-secondary)', fontFamily: lang === 'ta' ? 'var(--font-tamil)' : 'var(--font-body)' }}>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          {/* Col 4: Get in Touch */}
          <div>
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
          </div>
        </div>
        <div className="max-w-6xl mx-auto pt-8" style={{ borderTop: '1px solid rgba(212,168,83,0.06)' }}>
          <div className="flex flex-wrap justify-between items-center gap-4">
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t.footer.copyright}</p>
            <div className="flex gap-3">
              {['UPI', 'GPay', 'Cards', 'COD', 'Net Banking'].map(method => (
                <span key={method} className="payment-badge">{method}</span>
              ))}
            </div>
          </div>
          <p className="text-xs text-center mt-6 italic" style={{ color: 'var(--text-muted)' }}>
            Handcrafted with love in Chennai
          </p>
        </div>
      </footer>

      {/* WhatsApp float */}
      <a href={whatsappLink(WHATSAPP_NUMBER, t.whatsapp.message)} target="_blank" rel="noopener noreferrer" className="whatsapp-float">
        <MessageCircle size={28} color="white" />
      </a>

      {/* Toast container */}
      <div className="toast-container">
        <AnimatePresence>
          {toasts.map(toast => (
            <div key={toast.id}>
              <Toast message={toast.message} onDone={() => removeToast(toast.id)} />
            </div>
          ))}
        </AnimatePresence>
      </div>

      {/* Lightbox */}
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
    </div>
  );
}
