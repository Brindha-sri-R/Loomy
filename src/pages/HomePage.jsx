import {
  ArrowLeft,
  ArrowRight,
  Award,
  Footprints,
  HardHat,
  Headphones,
  Heart,
  Plus,
  RefreshCw,
  ShieldCheck,
  Shirt,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard';
import ProductSkeleton from '../components/product/ProductSkeleton';
import MarqueeTicker from '../components/ui/MarqueeTicker';
import TiltCard from '../components/ui/TiltCard';
import { useStore } from '../context/StoreContext';
import {
  FEATURED_CATEGORY_CARDS,
  FILTER_CATEGORIES,
  PRODUCTS,
} from '../data/products';
import { useReveal } from '../hooks/useReveal';

const CATEGORY_ICONS = {
  'All Items': ShoppingBag,
  Shirts: Shirt,
  Hoodies: Sparkles,
  Jackets: Sparkles,
  Outerwear: Sparkles,
  Knitwear: Shirt,
  Footwear: Footprints,
  Headwear: HardHat,
  Accessories: Sparkles,
  Shorts: Sparkles,
};

const PRODUCT_TABS = [
  'New Arrivals',
  'Best Sellers',
  'Trending Products',
  'Featured Collections',
];

const CENTER_COLLECTIONS = [
  {
    key: 'Shirts',
    label: 'Shirts',
    count: '182',
    shopLink: '/shop?category=Shirts',
    leftTitle: 'Relaxed Tailoring',
    leftSubtitle: 'Organic cotton & poplin weaves',
    leftImage:
      'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=700&q=80',
    rightProduct: PRODUCTS[0], // Summer T-Shirts
  },
  {
    key: 'Hoodies',
    label: 'Hoodies',
    count: '124',
    shopLink: '/shop?category=Hoodies',
    leftTitle: 'Heavyweight Fleece',
    leftSubtitle: '480gsm brushed French terry',
    leftImage:
      'https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?auto=format&fit=crop&w=700&q=80',
    rightProduct: PRODUCTS[4], // Pullover Hoodie
  },
  {
    key: 'Jackets',
    label: 'Jackets',
    count: '215',
    shopLink: '/shop?category=Jackets',
    leftTitle: 'Urban Technical Shells',
    leftSubtitle: 'Weather-sealed & articulated',
    leftImage:
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=700&q=80',
    rightProduct: PRODUCTS[2], // Puffer Jacket
  },
  {
    key: 'Outerwear',
    label: 'Outerwear',
    count: '341',
    shopLink: '/shop?category=Outerwear',
    leftTitle: 'Architectural Coats',
    leftSubtitle: 'Fluid gabardine & ripstop',
    leftImage:
      'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?auto=format&fit=crop&w=700&q=80',
    rightProduct: PRODUCTS[6], // Aero Tech Windbreaker
  },
  {
    key: 'Knitwear',
    label: 'Knitwear',
    count: '98',
    shopLink: '/shop?category=Knitwear',
    leftTitle: 'Sculpted Merino',
    leftSubtitle: 'Fine-gauge minimalist knits',
    leftImage:
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=700&q=80',
    rightProduct: PRODUCTS[5], // Crewneck Sweater
  },
  {
    key: 'Footwear',
    label: 'Footwear',
    count: '268',
    shopLink: '/shop?category=Footwear',
    leftTitle: 'Engineered Soles',
    leftSubtitle: 'Dual-density urban runners',
    leftImage:
      'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=700&q=80',
    rightProduct: PRODUCTS[7], // Kinetic Runner 01
  },
  {
    key: 'Headwear',
    label: 'Headwear',
    count: '107',
    shopLink: '/shop?category=Headwear',
    leftTitle: 'Everyday Caps & Knits',
    leftSubtitle: 'Brushed twill & combed wool',
    leftImage:
      'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=700&q=80',
    rightProduct: PRODUCTS[9], // Ribbed Knit Beanie
  },
  {
    key: 'Accessories',
    label: 'Accessories',
    count: '94',
    shopLink: '/shop?category=Accessories',
    leftTitle: 'Sculpted Eyewear',
    leftSubtitle: 'UV400 bio-acetate frames',
    leftImage:
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=700&q=80',
    rightProduct: PRODUCTS[11], // Aura Visor Shades
  },
];

const STORE_FEATURES = [
  {
    Icon: ShieldCheck,
    title: 'Secure Shopping',
    desc: 'Encrypted checkout & verified payments.',
  },
  {
    Icon: RefreshCw,
    title: 'Easy Returns',
    desc: 'Hassle-free 30-day exchanges & refunds.',
  },
  {
    Icon: Award,
    title: 'Quality Products',
    desc: 'Organic cotton & technical ripstop craft.',
  },
  {
    Icon: Truck,
    title: 'Reliable Delivery',
    desc: 'Free express shipping over $250.',
  },
  {
    Icon: Headphones,
    title: 'Customer Support',
    desc: 'Dedicated style & order assistance.',
  },
];

function RevealSection({ children, className = '' }) {
  const [ref, visible] = useReveal(0.08);
  return (
    <div
      ref={ref}
      className={`reveal ${visible ? 'reveal-visible' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

export default function HomePage() {
  const { addToCart, wishlist, toggleWishlist } = useStore();
  const trendingRef = useRef(null);

  const [scrollY, setScrollY] = useState(0);
  const [activeColIdx, setActiveColIdx] = useState(0);
  const [colTransitioning, setColTransitioning] = useState(false);

  const [activeTab, setActiveTab] = useState('New Arrivals');
  const [selectedFilter, setSelectedFilter] = useState('All Items');
  const [isFiltering, setIsFiltering] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const heroProduct = PRODUCTS[0];
  const activeCol = CENTER_COLLECTIONS[activeColIdx];
  const trendingProducts = PRODUCTS.filter((p) => p.trending);

  const handleCenterHover = (idx) => {
    if (idx === activeColIdx) return;
    setActiveColIdx(idx);
    setColTransitioning(true);
    window.clearTimeout(window.__loomyCenterTimer);
    window.__loomyCenterTimer = window.setTimeout(
      () => setColTransitioning(false),
      160
    );
  };

  const tabProducts = PRODUCTS.filter((p) => {
    if (activeTab === 'New Arrivals') return p.isNewDrop;
    if (activeTab === 'Best Sellers') return p.rating >= 4.6;
    if (activeTab === 'Trending Products') return p.trending;
    return true;
  });

  const filteredProducts =
    selectedFilter === 'All Items'
      ? tabProducts
      : tabProducts.filter(
          (p) =>
            p.category === selectedFilter || p.subCategory === selectedFilter
        );

  const displayedProducts = (
    filteredProducts.length > 0 ? filteredProducts : PRODUCTS
  ).slice(0, visibleCount);

  const triggerFilterLoad = () => {
    setIsFiltering(true);
    window.setTimeout(() => setIsFiltering(false), 220);
  };

  const handleTabSelect = (tab) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    setSelectedFilter('All Items');
    setVisibleCount(6);
    triggerFilterLoad();
  };

  const handleFilterSelect = (cat) => {
    if (cat === selectedFilter) return;
    setSelectedFilter(cat);
    setVisibleCount(6);
    triggerFilterLoad();
  };

  const scrollTrending = (dir) => {
    if (!trendingRef.current) return;
    trendingRef.current.scrollBy({ left: dir * 320, behavior: 'smooth' });
  };

  return (
    <div className="animate-page-enter relative w-full">
      {/* 1. HERO SECTION */}
      <section className="relative z-10 bg-[#F2F3F7]/75 pt-6 pb-16 backdrop-blur-[1px] sm:pt-10 sm:pb-22">
        <div className="dashed-grid-overlay">
          <div />
          <div />
          <div />
          <div />
        </div>

        <div className="relative z-10 mx-auto max-w-[1440px] px-5 sm:px-10">
          <div className="grid min-h-[540px] grid-cols-1 items-center gap-8 lg:min-h-[620px] lg:grid-cols-12 lg:gap-0">
            {/* Left Ecommerce Copy & CTAs */}
            <div
              className="animate-hero-type relative z-20 flex flex-col justify-between lg:col-span-4 lg:h-full lg:py-8"
              style={{
                transform: `translate3d(0, ${Math.min(scrollY, 600) * 0.05}px, 0)`,
              }}
            >
              <div>
                <h1 className="text-[clamp(2.9rem,5.4vw,5.1rem)] leading-[0.94] font-bold tracking-[-0.045em] text-[#111111]">
                  Discover
                  <span className="block">Your Style.</span>
                </h1>

                <p className="mt-5 max-w-[290px] text-sm leading-relaxed text-[#5C5C62]">
                  Contemporary essentials and statement outerwear crafted for
                  everyday wear.
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <Link
                    to="/shop"
                    className="inline-flex items-center gap-3 rounded-full bg-[#111111] py-2.5 pr-2.5 pl-6 text-xs font-semibold text-white shadow-md transition-transform hover:scale-[1.03] active:scale-95"
                  >
                    <span>Shop Now</span>
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#7C8BFF] text-white">
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </Link>

                  <a
                    href="#collections"
                    className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white px-5 py-3 text-xs font-semibold text-[#111111] transition-colors hover:bg-black/5"
                  >
                    Explore Collection
                  </a>
                </div>
              </div>

              <div className="mt-10 border-t border-dashed border-black/10 pt-5 lg:mt-0">
                <p className="text-xs font-bold tracking-wider text-[#111111] uppercase">
                  Free Express Shipping
                </p>
                <p className="mt-0.5 text-xs text-[#6E6E73]">
                  Complimentary delivery on orders over $250
                </p>
              </div>
            </div>

            {/* Centerpiece Fashion Model */}
            <div
              className="animate-hero-model relative z-10 flex justify-center lg:col-span-4"
              style={{
                transform: `translate3d(0, ${-Math.min(scrollY, 600) * 0.1}px, 0)`,
              }}
            >
              <div className="pointer-events-none absolute top-1/2 left-1/2 h-[380px] w-[280px] -translate-x-1/2 -translate-y-1/2 -rotate-6 rounded-[40px] bg-gradient-to-tr from-[#DCE0FC] via-[#E8EAFC] to-[#FCE7F3] sm:h-[490px] sm:w-[350px]" />
              <div className="relative h-[460px] w-full max-w-[410px] overflow-hidden rounded-[26px] shadow-[0_28px_65px_rgba(0,0,0,0.09)] sm:h-[560px] lg:h-[600px]">
                <img
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=85"
                  alt="Loomy Fashion Collection"
                  className="h-full w-full object-cover object-top"
                />
              </div>
            </div>

            {/* Right Column: Secondary Headline + 3D Floating Product Card */}
            <div
              className="animate-hero-type relative z-20 flex flex-col justify-between lg:col-span-4 lg:h-full lg:items-end lg:py-8"
              style={{
                transform: `translate3d(0, ${-Math.min(scrollY, 600) * 0.14}px, 0)`,
              }}
            >
              <div className="lg:text-right">
                <h2 className="text-[clamp(2.5rem,4.5vw,4.3rem)] leading-[0.94] font-bold tracking-[-0.045em] text-[#111111]">
                  Shop
                  <span className="block">The Look.</span>
                </h2>
              </div>

              <TiltCard
                maxTilt={8}
                className="animate-hero-card mt-8 w-full max-w-[255px]"
              >
                <div className="group rounded-[22px] border border-black/[0.06] bg-white/95 p-3 shadow-[0_22px_50px_rgba(0,0,0,0.09)] backdrop-blur-md">
                  <Link to={`/product/${heroProduct.id}`} className="block">
                    <div className="relative aspect-[4/3.9] overflow-hidden rounded-[16px] bg-[#F3F3F5]">
                      <img
                        src={heroProduct.image}
                        alt={heroProduct.name}
                        className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute top-2.5 right-2.5 rounded-full bg-[#E11D48] px-2.5 py-0.5 text-[10px] font-bold text-white">
                        {heroProduct.discount}
                      </span>
                    </div>
                  </Link>

                  <div className="mt-3 flex items-end justify-between gap-2 px-0.5">
                    <div className="min-w-0">
                      <Link
                        to={`/product/${heroProduct.id}`}
                        className="block truncate text-xs font-bold text-[#111111] hover:text-[#7C8BFF]"
                      >
                        {heroProduct.name}
                      </Link>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="text-xs font-extrabold text-[#111111]">
                          ${heroProduct.price.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-[#6E6E73] line-through">
                          ${heroProduct.originalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-[#6E6E73]">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        {heroProduct.rating}
                      </span>
                      <button
                        type="button"
                        onClick={() => addToCart(heroProduct)}
                        aria-label="Add featured product to bag"
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-[#111111] text-white transition-all hover:scale-110 hover:bg-[#7C8BFF]"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </TiltCard>

              <Link
                to="/shop"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#111111] shadow-xs hover:bg-[#111111] hover:text-white"
              >
                <span>Explore the Collection</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE TICKER */}
      <div className="relative z-10">
        <MarqueeTicker />
      </div>

      {/* 2. CENTER COLLECTION INTERACTION + 8-CATEGORY SECTION */}
      <section
        id="collections"
        className="relative z-10 bg-white/80 py-18 backdrop-blur-[2px] sm:py-26"
      >
        <div className="dashed-grid-overlay">
          <div />
          <div />
          <div />
          <div />
        </div>

        <RevealSection className="relative z-10 mx-auto max-w-[1440px] px-5 sm:px-10">
          <div className="mb-12 text-center">
            <span className="text-[11px] font-semibold tracking-[0.16em] text-[#7C8BFF] uppercase">
              COLLECTIONS
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-[-0.035em] text-[#111111] sm:text-4xl">
              Explore by Collection
            </h2>
          </div>

          {/* 3-Part Composition: LEFT (Decorative Editorial) | CENTER (Touchable Links) | RIGHT (Distinct Product Card) */}
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
            {/* LEFT SIDE: Distinct Decorative Editorial Card */}
            <div className="lg:col-span-4">
              <TiltCard maxTilt={6}>
                <Link
                  to={activeCol.shopLink}
                  className={`block rounded-[24px] border border-black/[0.06] bg-white p-3.5 shadow-[0_18px_45px_rgba(0,0,0,0.06)] transition-all duration-300 ${
                    colTransitioning
                      ? 'scale-[0.98] opacity-60'
                      : 'scale-100 -rotate-1 opacity-100 hover:rotate-0'
                  }`}
                >
                  <div className="aspect-[4/4.5] overflow-hidden rounded-[18px] bg-[#F3F3F5]">
                    <img
                      key={activeCol.leftImage}
                      src={activeCol.leftImage}
                      alt={activeCol.leftTitle}
                      className="animate-page-enter h-full w-full object-cover object-top transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <div className="mt-3.5 flex items-center justify-between px-1">
                    <div>
                      <p className="text-sm font-bold text-[#111111]">
                        {activeCol.leftTitle}
                      </p>
                      <p className="text-xs text-[#6E6E73]">
                        {activeCol.leftSubtitle}
                      </p>
                    </div>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F3F3F5] text-[#111111]">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </TiltCard>
            </div>

            {/* CENTER SELECTOR: Touchable / Clickable Links */}
            <div className="flex flex-col items-center space-y-1 lg:col-span-4">
              {CENTER_COLLECTIONS.map((col, idx) => {
                const isActive = idx === activeColIdx;
                return (
                  <Link
                    key={col.key}
                    to={col.shopLink}
                    onMouseEnter={() => handleCenterHover(idx)}
                    onTouchStart={() => handleCenterHover(idx)}
                    className="group relative flex w-full items-center justify-between border-b border-dashed border-black/10 px-3 py-3 transition-all"
                  >
                    <span
                      className={`text-xl font-bold tracking-[-0.03em] transition-all duration-200 sm:text-2xl ${
                        isActive
                          ? 'translate-x-1.5 text-[#111111]'
                          : 'text-black/30 group-hover:text-black/70'
                      }`}
                    >
                      {col.label}
                    </span>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-semibold transition-colors ${
                          isActive ? 'text-[#7C8BFF]' : 'text-black/25'
                        }`}
                      >
                        {col.count}
                      </span>
                      <ArrowRight
                        className={`h-3.5 w-3.5 transition-all ${
                          isActive
                            ? 'translate-x-0 text-[#111111] opacity-100'
                            : '-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-60'
                        }`}
                      />
                    </div>

                    {isActive && (
                      <span className="absolute bottom-0 left-3 h-[2px] w-14 bg-[#7C8BFF]" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* RIGHT SIDE: Distinct Product Card with Shopping Interaction */}
            <div className="lg:col-span-4">
              <TiltCard maxTilt={6}>
                <div
                  className={`relative rounded-[24px] border border-black/[0.06] bg-white p-3.5 shadow-[0_18px_45px_rgba(0,0,0,0.06)] transition-all duration-300 ${
                    colTransitioning
                      ? 'scale-[0.98] opacity-60'
                      : 'scale-100 rotate-1 opacity-100 hover:rotate-0'
                  }`}
                >
                  <Link
                    to={`/product/${activeCol.rightProduct.id}`}
                    className="relative block aspect-[4/4.5] overflow-hidden rounded-[18px] bg-[#F3F3F5]"
                  >
                    <img
                      key={activeCol.rightProduct.image}
                      src={activeCol.rightProduct.image}
                      alt={activeCol.rightProduct.name}
                      className="animate-page-enter h-full w-full object-cover object-top transition-transform duration-500 hover:scale-105"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleWishlist(activeCol.rightProduct.id);
                      }}
                      aria-label="Save to wishlist"
                      className="absolute top-3 left-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 shadow-xs"
                    >
                      <Heart
                        className={`h-3.5 w-3.5 ${
                          wishlist.includes(activeCol.rightProduct.id)
                            ? 'fill-[#F5A6D8] text-[#F5A6D8]'
                            : 'text-[#111111]'
                        }`}
                      />
                    </button>
                  </Link>
                  <div className="mt-3.5 flex items-center justify-between px-1">
                    <div>
                      <p className="text-sm font-bold text-[#111111]">
                        {activeCol.rightProduct.name}
                      </p>
                      <div className="mt-0.5 flex items-center gap-2">
                        <span className="text-xs font-extrabold text-[#111111]">
                          ${activeCol.rightProduct.price.toFixed(2)}
                        </span>
                        <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-[#6E6E73]">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          {activeCol.rightProduct.rating}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => addToCart(activeCol.rightProduct)}
                      aria-label={`Add ${activeCol.rightProduct.name} to bag`}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-[#111111] text-white transition-transform hover:scale-105 hover:bg-[#7C8BFF]"
                    >
                      <ShoppingBag className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </TiltCard>
            </div>
          </div>

          {/* SEPARATE 8-CATEGORY SECTION */}
          <div id="categories" className="mt-22">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <span className="text-[11px] font-semibold tracking-[0.15em] text-[#6E6E73] uppercase">
                  DEPARTMENTS
                </span>
                <h3 className="mt-1 text-2xl font-bold tracking-tight text-[#111111] sm:text-3xl">
                  Shop by Category
                </h3>
              </div>
              <Link
                to="/shop"
                className="text-xs font-semibold text-[#6E6E73] hover:text-[#111111]"
              >
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {FEATURED_CATEGORY_CARDS.map((cat) => (
                <Link
                  key={cat.name}
                  to={`/shop?category=${encodeURIComponent(cat.filterKey)}`}
                  className="group relative aspect-[3/3.6] overflow-hidden rounded-[20px] bg-[#F3F3F5]"
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                  <div className="absolute right-4 bottom-4 left-4 text-white">
                    <p className="text-base font-bold">{cat.name}</p>
                    <p className="text-[11px] text-white/75">{cat.count}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </RevealSection>
      </section>

      {/* 3. PRODUCT SECTION */}
      <section
        id="new-arrivals"
        className="relative z-10 bg-[#F2F2F4]/80 py-18 backdrop-blur-[2px] sm:py-24"
      >
        <div className="dashed-grid-overlay">
          <div />
          <div />
          <div />
          <div />
        </div>

        <RevealSection className="relative z-10 mx-auto max-w-[1440px] px-5 sm:px-10">
          <div className="flex flex-col justify-between gap-6 border-b border-dashed border-black/15 pb-6 lg:flex-row lg:items-end">
            <div className="flex flex-wrap gap-2">
              {PRODUCT_TABS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => handleTabSelect(tab)}
                  className={`rounded-full px-5 py-2.5 text-xs font-bold transition-all ${
                    activeTab === tab
                      ? 'bg-[#111111] text-white shadow-sm'
                      : 'bg-white text-[#6E6E73] hover:text-[#111111]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-1">
              {FILTER_CATEGORIES.map((cat) => {
                const Icon = CATEGORY_ICONS[cat] || ShoppingBag;
                const isActive = selectedFilter === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleFilterSelect(cat)}
                    className={`inline-flex shrink-0 items-center gap-2 rounded-full py-1.5 pr-3.5 pl-1.5 text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#7C8BFF] text-white'
                        : 'bg-white text-[#111111] hover:bg-white/80'
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full ${
                        isActive
                          ? 'bg-white text-[#111111]'
                          : 'bg-[#F3F3F5] text-[#111111]'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {isFiltering
              ? Array.from({ length: 3 }).map((_, i) => (
                  <ProductSkeleton key={i} />
                ))
              : displayedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </div>

          <div className="mt-12 flex justify-center">
            {visibleCount < filteredProducts.length ? (
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => prev + 6)}
                className="inline-flex items-center gap-4 rounded-full bg-[#111111] py-2 pr-2 pl-6 text-xs font-semibold text-white shadow-md transition-transform hover:scale-[1.03] active:scale-95"
              >
                <span>Load More Products</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#7C8BFF] text-white">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </button>
            ) : (
              <Link
                to="/shop"
                className="inline-flex items-center gap-4 rounded-full bg-[#111111] py-2 pr-2 pl-6 text-xs font-semibold text-white shadow-md transition-transform hover:scale-[1.03]"
              >
                <span>Shop All Products</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#7C8BFF] text-white">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            )}
          </div>

          {/* Horizontal Trending Carousel */}
          <div className="mt-20">
            <div className="flex items-end justify-between gap-4">
              <div>
                <span className="text-[11px] font-semibold tracking-[0.15em] text-[#7C8BFF] uppercase">
                  TRENDING NOW
                </span>
                <h3 className="mt-1 text-2xl font-bold tracking-tight text-[#111111] sm:text-3xl">
                  Most Wanted Pieces
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scrollTrending(-1)}
                  aria-label="Scroll trending left"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white text-[#111111] hover:bg-[#111111] hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollTrending(1)}
                  aria-label="Scroll trending right"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white text-[#111111] hover:bg-[#111111] hover:text-white"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div
              ref={trendingRef}
              className="no-scrollbar mt-7 flex gap-5 overflow-x-auto pb-2"
            >
              {trendingProducts.map((product) => (
                <div
                  key={product.id}
                  className="w-[270px] shrink-0 sm:w-[300px]"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </RevealSection>
      </section>

      {/* 4. PROMOTIONAL BANNER */}
      <section className="relative z-10 overflow-hidden bg-[#E9EBFA]/85 py-16 backdrop-blur-[2px] sm:py-22">
        <RevealSection className="relative z-10 mx-auto max-w-[1440px] px-5 sm:px-10">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <span className="inline-block rounded-full bg-white px-3.5 py-1 text-[11px] font-bold tracking-[0.14em] text-[#E11D48] uppercase">
                Special Offer · Up to 20% Off
              </span>
              <h2 className="mt-4 text-4xl leading-[1.02] font-bold tracking-[-0.04em] text-[#111111] sm:text-5xl">
                Elevate Your
                <br />
                Everyday Wardrobe
              </h2>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#4A4A52]">
                Save on selected signature essentials plus enjoy complimentary
                express shipping over $250.
              </p>

              <div className="mt-8">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-4 rounded-full bg-[#111111] py-2.5 pr-2.5 pl-6 text-xs font-semibold text-white shadow-lg transition-transform hover:scale-[1.03] active:scale-95"
                >
                  <span>Shop Now</span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#7C8BFF] text-white">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7">
              <TiltCard maxTilt={4}>
                <div className="relative aspect-[16/9] overflow-hidden rounded-[24px] border border-white/60 bg-white shadow-xl">
                  <img
                    src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85"
                    alt="Loomy Promotional Showcase"
                    className="h-full w-full object-cover object-top transition-transform duration-700 hover:scale-105"
                  />
                </div>
              </TiltCard>
            </div>
          </div>
        </RevealSection>
      </section>

      {/* 5. FEATURES SECTION */}
      <section className="relative z-10 border-t border-black/5 bg-white/90 py-14 backdrop-blur-[2px] sm:py-18">
        <RevealSection className="mx-auto max-w-[1440px] px-5 sm:px-10">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {STORE_FEATURES.map(({ Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-2xl border border-black/[0.05] bg-[#F8F8FA] p-5 transition-transform duration-300 hover:-translate-y-1"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#111111] text-white">
                  <Icon className="h-4 w-4" />
                </span>
                <h3 className="mt-4 text-sm font-bold text-[#111111]">
                  {title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-[#6E6E73]">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </RevealSection>
      </section>
    </div>
  );
}
