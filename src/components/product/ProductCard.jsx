import { Heart, Plus, Star } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import TiltCard from '../ui/TiltCard';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80';

export default function ProductCard({ product }) {
  const { wishlist, toggleWishlist, addToCart } = useStore();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState(product.image);
  const [heartAnim, setHeartAnim] = useState(false);
  const isWishlisted = wishlist.includes(product.id);

  const handleWishlist = () => {
    setHeartAnim(true);
    toggleWishlist(product.id);
    window.setTimeout(() => setHeartAnim(false), 360);
  };

  return (
    <TiltCard maxTilt={5}>
      <article className="group flex flex-col rounded-[22px] border border-black/[0.045] bg-white p-3 shadow-[0_2px_12px_rgba(0,0,0,0.025)] transition-shadow duration-300 hover:shadow-[0_18px_40px_rgba(0,0,0,0.08)]">
      {/* Studio Image Container */}
      <div className="relative aspect-[4/4.5] w-full overflow-hidden rounded-[16px] bg-[#F3F3F5]">
        {!imgLoaded && (
          <div className="absolute inset-0 animate-pulse bg-[#EAEAEF]" />
        )}

        <Link to={`/product/${product.id}`} className="block h-full w-full">
          <img
            src={imgSrc}
            alt={product.name}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            onError={() => {
              setImgSrc(FALLBACK_IMAGE);
              setImgLoaded(true);
            }}
            className={`h-full w-full object-cover object-top transition-all duration-500 ${
              product.hoverImage
                ? 'group-hover:scale-[1.04] group-hover:opacity-0'
                : 'group-hover:scale-[1.04]'
            } ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
          {product.hoverImage && (
            <img
              src={product.hoverImage}
              alt={`${product.name} alternate view`}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
              className="absolute inset-0 h-full w-full scale-[1.04] object-cover object-top opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100"
            />
          )}
        </Link>

        {/* Top-left Wishlist Heart */}
        <button
          type="button"
          onClick={handleWishlist}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-3 left-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 shadow-xs backdrop-blur-xs transition-transform hover:scale-110 active:scale-95 ${
            heartAnim ? 'animate-heart-pop' : ''
          }`}
        >
          <Heart
            className={`h-3.5 w-3.5 transition-colors ${
              isWishlisted
                ? 'fill-[#F5A6D8] text-[#F5A6D8]'
                : 'text-[#111111]'
            }`}
          />
        </button>

        {product.discount && (
          <span className="absolute top-3 right-3 z-10 rounded-full bg-[#E11D48] px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-white">
            {product.discount}
          </span>
        )}
      </div>

      {/* Product Meta Footer */}
      <div className="mt-3.5 flex items-end justify-between gap-2 px-1 pb-1">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold tracking-wider text-[#6E6E73] uppercase">
            {product.subCategory || product.category} · {product.sizes?.length || 1} Sizes
          </p>
          <Link
            to={`/product/${product.id}`}
            className="mt-0.5 block truncate text-[15px] font-semibold tracking-tight text-[#111111] transition-colors hover:text-[#7C8BFF]"
          >
            {product.name}
          </Link>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-[15px] font-bold tracking-tight text-[#111111]">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-xs font-medium text-[#6E6E73] line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2.5">
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#6E6E73]">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            {product.rating}
          </span>
          <button
            type="button"
            onClick={() => addToCart(product)}
            aria-label={`Add ${product.name} to bag`}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#111111] text-white transition-all hover:scale-105 hover:bg-[#7C8BFF] active:scale-95"
          >
            <Plus className="h-4 w-4 stroke-[2.2]" />
          </button>
        </div>
      </div>
    </article>
    </TiltCard>
  );
}
