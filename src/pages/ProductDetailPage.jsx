import {
  ArrowLeft,
  ArrowRight,
  Heart,
  Minus,
  Plus,
  ShieldCheck,
  Star,
  Truck,
} from 'lucide-react';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard';
import TiltCard from '../components/ui/TiltCard';
import { useStore } from '../context/StoreContext';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { products } = useStore();
  const product = products.find((p) => p.id === id) || products[0];
  return <ProductDetailContent key={product.id} product={product} products={products} />;
}

function ProductDetailContent({ product, products }) {
  const { addToCart, wishlist, toggleWishlist, setIsCartOpen } = useStore();
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(
    product.colors?.[0] || '#111111'
  );
  const [activeImage, setActiveImage] = useState(product.image);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const isWishlisted = wishlist.includes(product.id);
  const related = products.filter((p) => p.id !== product.id).slice(0, 3);
  const galleryImages =
    product.gallery?.length > 0 ? product.gallery : [product.image];

  return (
    <section className="animate-page-enter relative bg-[#F3F3F5] py-10 sm:py-16">
      <div className="dashed-grid-overlay">
        <div />
        <div />
        <div />
        <div />
      </div>

      <div className="relative z-10 mx-auto max-w-[1440px] px-5 sm:px-10">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#111111] shadow-xs hover:bg-black/5"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Shop
        </Link>

        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Product Image + Gallery Thumbnails */}
          <div className="space-y-4 lg:col-span-6">
            <TiltCard maxTilt={4}>
              <div className="relative aspect-[4/4.3] overflow-hidden rounded-[26px] bg-white p-4 shadow-sm">
                {!imgLoaded && (
                  <div className="loomy-shimmer absolute inset-4 rounded-[20px]" />
                )}
                <img
                  src={activeImage}
                  alt={product.name}
                  onLoad={() => setImgLoaded(true)}
                  className={`h-full w-full rounded-[20px] object-cover object-top transition-all duration-300 ${
                    imgLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                />
                {product.discount && (
                  <span className="absolute top-8 right-8 rounded-full bg-[#E11D48] px-3 py-1 text-xs font-bold text-white">
                    {product.discount}
                  </span>
                )}
              </div>
            </TiltCard>

            {galleryImages.length > 1 && (
              <div className="flex gap-3">
                {galleryImages.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      if (img !== activeImage) {
                        setImgLoaded(false);
                        setActiveImage(img);
                      }
                    }}
                    className={`h-20 w-20 overflow-hidden rounded-2xl border-2 bg-white p-1 transition-all ${
                      activeImage === img
                        ? 'border-[#7C8BFF]'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} view ${i + 1}`}
                      className="h-full w-full rounded-xl object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col justify-center rounded-[32px] bg-white p-7 shadow-sm sm:p-10 lg:col-span-6">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold tracking-[0.15em] text-[#7C8BFF] uppercase">
                {product.category} · {product.badge}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#111111]">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            <h1 className="mt-3 text-3xl font-bold tracking-[-0.035em] text-[#111111] sm:text-4xl">
              {product.name}
            </h1>

            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-2xl font-extrabold text-[#111111]">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-sm font-medium text-[#E11D48]/75 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            <p className="mt-5 text-sm leading-relaxed text-[#6E6E73]">
              {product.description}
            </p>

            {/* Color Selector */}
            <div className="mt-7">
              <p className="text-xs font-semibold tracking-wider text-[#111111] uppercase">
                Color
              </p>
              <div className="mt-2.5 flex items-center gap-3">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelectedColor(c)}
                    style={{ backgroundColor: c }}
                    aria-label={`Select color ${c}`}
                    className={`h-8 w-8 rounded-full border-2 transition-transform ${
                      selectedColor === c
                        ? 'scale-110 border-[#7C8BFF] ring-2 ring-[#7C8BFF]/30'
                        : 'border-black/10'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="mt-6">
              <p className="text-xs font-semibold tracking-wider text-[#111111] uppercase">
                Size
              </p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-12 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                      selectedSize === size
                        ? 'bg-[#111111] text-white'
                        : 'bg-[#F3F3F5] text-[#111111] hover:bg-black/10'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity + Actions */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-3 rounded-full bg-[#F3F3F5] px-4 py-2.5">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-5 text-center text-sm font-bold">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  addToCart(product, {
                    size: selectedSize,
                    color: selectedColor,
                    quantity,
                  });
                  setIsCartOpen(true);
                }}
                className="flex flex-1 items-center justify-between rounded-full bg-[#111111] py-2 pr-2 pl-6 text-xs font-semibold text-white transition-colors hover:bg-[#1e1e24]"
              >
                <span>Add to Bag</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#7C8BFF] text-white">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                aria-label="Toggle wishlist"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-white"
              >
                <Heart
                  className={`h-5 w-5 ${
                    isWishlisted
                      ? 'fill-[#F5A6D8] text-[#F5A6D8]'
                      : 'text-[#111111]'
                  }`}
                />
              </button>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 border-t border-dashed border-black/15 pt-6 text-xs text-[#6E6E73]">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-[#111111]" />
                <span>Free express shipping over $250</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#111111]" />
                <span>Sustainably crafted</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold tracking-tight text-[#111111]">
            Complete the Look
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
