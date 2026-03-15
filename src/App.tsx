import { useState, useMemo } from 'react';
import {
  ShoppingBag, Menu, X, Globe, Heart, Phone, Mail, MapPin,
  ChevronRight, Shield, Truck, RotateCcw, CreditCard,
  Instagram, Facebook, MessageCircle, Star, Package
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

// ─── App ───
export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [activeCategory, setActiveCategory] = useState('all');
  const [cartCount, setCartCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedProduct, setExpandedProduct] = useState<number | null>(null);

  const t = translations[lang];

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') return products;
    return products.filter(p => p.category === activeCategory);
  }, [activeCategory]);

  const toggleLang = () => setLang(l => l === 'en' ? 'ta' : 'en');

  return (
    <div className="min-h-screen grain" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>

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

      {/* ═══ NAVIGATION ═══ */}
      <nav
        className="sticky top-0 z-50 backdrop-blur-xl border-b px-6 py-4 flex justify-between items-center"
        style={{
          background: 'rgba(11, 7, 6, 0.9)',
          borderColor: 'rgba(212, 168, 83, 0.1)',
        }}
      >
        {/* Mobile menu button */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(true)} aria-label="Open menu">
          <Menu size={24} style={{ color: 'var(--gold-300)' }} />
        </button>

        {/* Logo */}
        <div className="text-center md:text-left cursor-pointer" onClick={() => setActiveCategory('all')}>
          <h1
            className="text-xl md:text-2xl tracking-[0.3em] font-bold gold-shimmer"
            style={{ fontFamily: lang === 'ta' ? 'var(--font-tamil)' : 'var(--font-display)' }}
          >
            {t.shopName}
          </h1>
        </div>

        {/* Desktop nav links */}
        <div
          className="hidden md:flex items-center gap-8 text-[11px] uppercase tracking-[0.2em]"
          style={{ color: 'var(--text-secondary)', fontFamily: lang === 'ta' ? 'var(--font-tamil)' : 'var(--font-body)' }}
        >
          <button onClick={() => setActiveCategory('all')} className="hover:text-[var(--gold-300)] transition-colors">{t.nav.home}</button>
          <button onClick={() => setActiveCategory('bridalSets')} className="hover:text-[var(--gold-300)] transition-colors">{t.nav.bridalSets}</button>
          <button onClick={() => setActiveCategory('victorianSets')} className="hover:text-[var(--gold-300)] transition-colors">{t.nav.victorianSets}</button>
          <button onClick={() => setActiveCategory('templeJewelry')} className="hover:text-[var(--gold-300)] transition-colors">{t.nav.templeJewelry}</button>
          <button onClick={() => setActiveCategory('beadNecklaces')} className="hover:text-[var(--gold-300)] transition-colors">{t.nav.beadNecklaces}</button>
          <button onClick={() => setActiveCategory('accessories')} className="hover:text-[var(--gold-300)] transition-colors">{t.nav.accessories}</button>
          <button onClick={() => {}} className="hover:text-[var(--gold-300)] transition-colors">{t.nav.about}</button>
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
          <button className="relative hover:text-[var(--gold-300)] transition-colors" style={{ color: 'var(--gold-300)' }}>
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span
                className="absolute -top-2 -right-2 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold"
                style={{ background: 'var(--ruby)', color: 'white' }}
              >
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </nav>

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
        {/* ═══ HERO SECTION ═══ */}
        <header className="relative overflow-hidden hero-pattern" style={{ minHeight: '75vh', background: 'var(--bg-secondary)' }}>
          {/* Decorative gradients */}
          <div className="absolute inset-0" style={{
            background: `
              radial-gradient(ellipse 80% 50% at 50% 50%, rgba(212, 168, 83, 0.08) 0%, transparent 60%),
              radial-gradient(ellipse 40% 60% at 20% 80%, rgba(155, 27, 48, 0.1) 0%, transparent 50%),
              radial-gradient(ellipse 40% 60% at 80% 20%, rgba(27, 107, 58, 0.06) 0%, transparent 50%)
            `
          }} />

          {/* Decorative temple arch using CSS */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] opacity-[0.04]" style={{
            background: 'radial-gradient(ellipse at center, var(--gold-300) 0%, transparent 70%)',
            borderRadius: '0 0 50% 50%',
          }} />

          <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-24" style={{ minHeight: '75vh' }}>
            {/* Ornate top decoration */}
            <div className="temple-divider w-48 mb-8">
              <Star size={12} style={{ color: 'var(--gold-500)' }} />
            </div>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-[11px] tracking-[0.4em] uppercase mb-6"
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
              className="text-lg md:text-xl italic mb-2 max-w-xl"
              style={{
                color: 'var(--gold-100)',
                fontFamily: lang === 'ta' ? 'var(--font-tamil)' : 'var(--font-accent)',
                opacity: 0.8,
              }}
            >
              {t.tagline}
            </motion.p>

            <div className="mb-10" />

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="flex flex-wrap gap-4 justify-center"
            >
              <button
                onClick={() => {
                  document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-10 py-4 text-[11px] uppercase tracking-[0.3em] font-bold transition-all hover:scale-105"
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
                className="px-10 py-4 text-[11px] uppercase tracking-[0.3em] font-bold transition-all hover:scale-105 border"
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

            {/* Ornate bottom decoration */}
            <div className="temple-divider w-48 mt-12">
              <Star size={12} style={{ color: 'var(--gold-500)' }} />
            </div>
          </div>
        </header>

        {/* ═══ TRUST BADGES ═══ */}
        <section
          className="border-y py-8 px-6"
          style={{ borderColor: 'rgba(212, 168, 83, 0.1)', background: 'var(--bg-secondary)' }}
        >
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <Shield size={22} />, title: t.trust.quality, desc: t.trust.qualityDesc },
              { icon: <RotateCcw size={22} />, title: t.trust.returns, desc: t.trust.returnsDesc },
              { icon: <Truck size={22} />, title: t.trust.shipping, desc: t.trust.shippingDesc },
              { icon: <CreditCard size={22} />, title: t.trust.payment, desc: t.trust.paymentDesc },
            ].map((badge, i) => (
              <motion.div
                key={i}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 justify-center text-center md:text-left md:justify-start"
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
        <section className="py-16 px-6 texture-overlay" style={{ background: 'var(--bg-primary)' }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-[11px] tracking-[0.3em] uppercase mb-3" style={{ color: 'var(--gold-500)' }}>
                {lang === 'en' ? 'Browse By' : 'வகை வாரியாக'}
              </p>
              <h3
                className="text-3xl md:text-4xl tracking-wider mb-2"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--gold-100)' }}
              >
                {t.categories.all}
              </h3>
              <div className="temple-divider w-32 mx-auto mt-4">
                <Star size={10} style={{ color: 'var(--gold-600)' }} />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
              {Object.entries(t.categories).map(([key, label]) => {
                const isActive = activeCategory === key;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setActiveCategory(key);
                      if (key !== 'all') {
                        setTimeout(() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }), 100);
                      }
                    }}
                    className="py-4 px-3 text-center transition-all duration-300 border"
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
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══ PRODUCTS GRID ═══ */}
        <section id="products" className="py-16 px-6" style={{ background: 'var(--bg-primary)' }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h3
                className="text-3xl md:text-4xl tracking-wider"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--gold-100)' }}
              >
                {activeCategory === 'all' ? (lang === 'en' ? 'Our Collection' : 'எங்கள் தொகுப்பு') : t.categories[activeCategory as keyof typeof t.categories]}
              </h3>
              <div className="temple-divider w-32 mx-auto mt-4">
                <Star size={10} style={{ color: 'var(--gold-600)' }} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
              {filteredProducts.map((product) => (
                  <div key={product.id}>
                    <ProductCard
                      product={product}
                      lang={lang}
                      t={t}
                      expanded={expandedProduct === product.id}
                      onToggle={() => setExpandedProduct(expandedProduct === product.id ? null : product.id)}
                      onAddToCart={() => setCartCount(c => c + 1)}
                    />
                  </div>
                ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-20" style={{ color: 'var(--text-muted)' }}>
                <Package size={48} className="mx-auto mb-4 opacity-30" />
                <p>{lang === 'en' ? 'More products coming soon!' : 'மேலும் தயாரிப்புகள் விரைவில்!'}</p>
              </div>
            )}
          </div>
        </section>

        {/* ═══ ABOUT 1-GRAM GOLD ═══ */}
        <section className="py-20 px-6 texture-overlay" style={{ background: 'var(--bg-secondary)' }}>
          <div className="max-w-5xl mx-auto">
            <div className="ornate-border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start py-8">
                {/* Left: What is 1-gram gold */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
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
                      <div key={i} className="flex items-start gap-2">
                        <ChevronRight size={14} style={{ color: 'var(--gold-400)', marginTop: 2, flexShrink: 0 }} />
                        <span className="text-[12px]" style={{ color: 'var(--text-secondary)', fontFamily: lang === 'ta' ? 'var(--font-tamil)' : 'var(--font-body)' }}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Right: Why Choose Us */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
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
                      <div key={i} className="flex items-center gap-3">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                          style={{ background: 'var(--gold-600)', color: 'var(--bg-primary)' }}
                        >
                          {i + 1}
                        </div>
                        <span className="text-[13px]" style={{ color: 'var(--text-secondary)', fontFamily: lang === 'ta' ? 'var(--font-tamil)' : 'var(--font-body)' }}>
                          {point}
                        </span>
                      </div>
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
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
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
            <a
              href={whatsappLink(WHATSAPP_NUMBER, t.whatsapp.message)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-4 text-[12px] uppercase tracking-[0.2em] font-bold transition-all hover:scale-105"
              style={{ background: '#25D366', color: 'white', borderRadius: '4px' }}
            >
              <MessageCircle size={18} />
              {lang === 'en' ? 'Chat on WhatsApp' : 'WhatsApp-ல் பேசுங்கள்'}
            </a>
          </motion.div>
        </section>
      </main>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t pt-16 pb-8 px-6" style={{ background: 'var(--bg-secondary)', borderColor: 'rgba(212, 168, 83, 0.1)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div>
              <h2 className="text-lg tracking-[0.2em] mb-4 gold-shimmer" style={{ fontFamily: lang === 'ta' ? 'var(--font-tamil)' : 'var(--font-display)' }}>
                {t.shopName}
              </h2>
              <p className="text-[12px] leading-relaxed mb-4" style={{ color: 'var(--text-secondary)', fontFamily: lang === 'ta' ? 'var(--font-tamil)' : 'var(--font-body)' }}>
                {t.footer.aboutText}
              </p>
              <div className="flex gap-3">
                <a href="#" className="p-2 border rounded transition-all hover:border-[var(--gold-400)] hover:text-[var(--gold-300)]" style={{ borderColor: 'rgba(212, 168, 83, 0.2)', color: 'var(--text-muted)' }}>
                  <Instagram size={16} />
                </a>
                <a href="#" className="p-2 border rounded transition-all hover:border-[var(--gold-400)] hover:text-[var(--gold-300)]" style={{ borderColor: 'rgba(212, 168, 83, 0.2)', color: 'var(--text-muted)' }}>
                  <Facebook size={16} />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold mb-4" style={{ color: 'var(--gold-300)' }}>
                {t.footer.quickLinks}
              </h4>
              <ul className="space-y-2.5">
                {[t.nav.home, t.nav.bridalSets, t.nav.victorianSets, t.nav.templeJewelry, t.nav.beadNecklaces, t.nav.accessories, t.nav.about].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-[12px] hover:text-[var(--gold-300)] transition-colors" style={{ color: 'var(--text-secondary)', fontFamily: lang === 'ta' ? 'var(--font-tamil)' : 'var(--font-body)' }}>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Care */}
            <div>
              <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold mb-4" style={{ color: 'var(--gold-300)' }}>
                {t.footer.customerCare}
              </h4>
              <ul className="space-y-2.5">
                {[t.footer.shippingPolicy, t.footer.returnsPolicy, t.footer.faqs, t.footer.sizeGuide, t.footer.privacyPolicy].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-[12px] hover:text-[var(--gold-300)] transition-colors" style={{ color: 'var(--text-secondary)', fontFamily: lang === 'ta' ? 'var(--font-tamil)' : 'var(--font-body)' }}>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold mb-4" style={{ color: 'var(--gold-300)' }}>
                {t.footer.connect}
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-[12px]" style={{ color: 'var(--text-secondary)' }}>
                  <Mail size={14} style={{ color: 'var(--gold-500)' }} />
                  <span>hello@aurajewellery.in</span>
                </div>
                <div className="flex items-center gap-3 text-[12px]" style={{ color: 'var(--text-secondary)' }}>
                  <Phone size={14} style={{ color: 'var(--gold-500)' }} />
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-3 text-[12px]" style={{ color: 'var(--text-secondary)' }}>
                  <MapPin size={14} style={{ color: 'var(--gold-500)' }} />
                  <span style={{ fontFamily: lang === 'ta' ? 'var(--font-tamil)' : 'var(--font-body)' }}>{t.footer.address}</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="mt-6">
                <p className="text-[10px] uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                  {t.footer.paymentMethods}
                </p>
                <div className="payment-methods">
                  {['UPI', 'GPay', 'Cards', 'COD', 'Net Banking'].map(m => (
                    <span key={m} className="payment-badge">{m}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div
            className="border-t pt-6 flex flex-col md:flex-row justify-between items-center gap-3"
            style={{ borderColor: 'rgba(212, 168, 83, 0.1)' }}
          >
            <p className="text-[10px] tracking-wider" style={{ color: 'var(--text-muted)' }}>
              {t.footer.copyright}
            </p>
            <p className="text-[10px] tracking-wider" style={{ color: 'var(--text-muted)' }}>
              {lang === 'en' ? 'Handcrafted with love in Chennai' : 'சென்னையில் அன்புடன் கைவினையாக செய்யப்பட்டது'}
            </p>
          </div>
        </div>
      </footer>

      {/* ═══ FLOATING WHATSAPP BUTTON ═══ */}
      <a
        href={whatsappLink(WHATSAPP_NUMBER, t.whatsapp.message)}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
        title={t.whatsapp.tooltip}
      >
        <MessageCircle size={28} color="white" fill="white" />
      </a>
    </div>
  );
}

// ─── Product Card Component ───
function ProductCard({
  product,
  lang,
  t,
  expanded,
  onToggle,
  onAddToCart,
}: {
  product: Product;
  lang: Language;
  t: any;
  expanded: boolean;
  onToggle: () => void;
  onAddToCart: () => void;
}) {
  const name = lang === 'en' ? product.nameEn : product.nameTa;
  const description = lang === 'en' ? product.descriptionEn : product.descriptionTa;
  const material = lang === 'en' ? product.materialEn : product.materialTa;
  const includes = lang === 'en' ? product.includesEn : product.includesTa;
  const fontFamily = lang === 'ta' ? 'var(--font-tamil)' : 'var(--font-body)';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="card-glow border overflow-hidden"
      style={{
        background: 'var(--bg-card)',
        borderColor: 'rgba(212, 168, 83, 0.1)',
        borderRadius: '6px',
      }}
    >
      {/* Image area */}
      <div
        className="relative product-placeholder cursor-pointer"
        style={{ aspectRatio: '4/3' }}
        onClick={onToggle}
      >
        {product.image ? (
          <img src={product.image} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: product.gradientPlaceholder }}
          >
            <div className="text-center">
              <div
                className="text-5xl mb-2 opacity-30"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--gold-100)' }}
              >
                ✦
              </div>
              <p className="text-[10px] uppercase tracking-widest" style={{ color: 'rgba(245, 230, 200, 0.3)' }}>
                {lang === 'en' ? 'Photo Coming Soon' : 'புகைப்படம் விரைவில்'}
              </p>
            </div>
          </div>
        )}

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
          className="absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-colors"
          style={{ background: 'rgba(0,0,0,0.4)' }}
          onClick={(e) => { e.stopPropagation(); }}
        >
          <Heart size={16} style={{ color: 'var(--gold-300)' }} />
        </button>

        {/* Price overlay */}
        <div
          className="absolute bottom-3 right-3 px-4 py-2 backdrop-blur-sm rounded"
          style={{ background: 'rgba(0,0,0,0.6)' }}
        >
          <span
            className="text-lg font-bold"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--gold-300)' }}
          >
            {product.priceFormatted}
          </span>
        </div>
      </div>

      {/* Card content */}
      <div className="p-5">
        {/* Name */}
        <h4
          className="text-lg tracking-wider mb-1 cursor-pointer"
          style={{ fontFamily: lang === 'ta' ? 'var(--font-tamil)' : 'var(--font-display)', color: 'var(--gold-100)' }}
          onClick={onToggle}
        >
          {name}
        </h4>

        {/* Code */}
        <p className="text-[10px] uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
          {t.product.code}: {product.code}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
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
              className="overflow-hidden"
            >
              <p className="text-[12px] leading-relaxed mb-4" style={{ color: 'var(--text-secondary)', fontFamily }}>
                {description}
              </p>

              <div className="mb-3">
                <p className="text-[10px] uppercase tracking-wider mb-1 font-bold" style={{ color: 'var(--gold-400)' }}>
                  {t.product.material}
                </p>
                <p className="text-[11px]" style={{ color: 'var(--text-secondary)', fontFamily }}>
                  {material}
                </p>
              </div>

              <div className="mb-4">
                <p className="text-[10px] uppercase tracking-wider mb-1 font-bold" style={{ color: 'var(--gold-400)' }}>
                  {t.product.includes}
                </p>
                <ul className="space-y-1">
                  {includes.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-[11px]" style={{ color: 'var(--text-secondary)', fontFamily }}>
                      <ChevronRight size={10} style={{ color: 'var(--gold-500)' }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* View details toggle */}
        <button
          onClick={onToggle}
          className="text-[10px] uppercase tracking-wider mb-4 flex items-center gap-1 hover:text-[var(--gold-300)] transition-colors"
          style={{ color: 'var(--gold-500)', fontFamily }}
        >
          {expanded ? (lang === 'en' ? 'Show Less' : 'குறைவாகக் காட்டு') : t.product.viewDetails}
          <ChevronRight size={12} className={`transition-transform ${expanded ? 'rotate-90' : ''}`} />
        </button>

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={onAddToCart}
            className="flex-1 py-3 text-[11px] uppercase tracking-wider font-bold transition-all hover:opacity-90"
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
            className="py-3 px-4 transition-all hover:opacity-90 flex items-center"
            style={{
              background: '#25D366',
              borderRadius: '3px',
            }}
          >
            <MessageCircle size={16} color="white" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
