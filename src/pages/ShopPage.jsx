import { SlidersHorizontal } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard';
import ProductSkeleton from '../components/product/ProductSkeleton';
import { useStore } from '../context/StoreContext';
import { FILTER_CATEGORIES } from '../data/products';

const GENDER_FILTERS = ['All', 'Men', 'Women', 'Unisex'];

export default function ShopPage() {
  const { products, productsLoading } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category') || 'All Items';
  const selectedGender = searchParams.get('gender') || 'All';

  const [sortBy, setSortBy] = useState('featured');
  const [isLoading, setIsLoading] = useState(false);

  const triggerLoad = () => {
    setIsLoading(true);
    window.setTimeout(() => setIsLoading(false), 220);
  };

  const updateFilters = (nextCategory, nextGender) => {
    triggerLoad();

    const params = {};
    if (nextCategory !== 'All Items') params.category = nextCategory;
    if (nextGender !== 'All') params.gender = nextGender;
    setSearchParams(params);
  };

  const filteredAndSorted = useMemo(() => {
    const base = products.filter((p) => {
      const matchCat =
        selectedCategory === 'All Items' ||
        p.category === selectedCategory ||
        p.subCategory === selectedCategory;
      const matchGender =
        selectedGender === 'All' ||
        p.gender === selectedGender ||
        (selectedGender !== 'Unisex' && p.gender === 'Unisex');
      return matchCat && matchGender;
    });

    if (sortBy === 'price-asc') {
      return [...base].sort((a, b) => a.price - b.price);
    }
    if (sortBy === 'price-desc') {
      return [...base].sort((a, b) => b.price - a.price);
    }
    if (sortBy === 'rating') {
      return [...base].sort((a, b) => b.rating - a.rating);
    }
    return base;
  }, [products, selectedCategory, selectedGender, sortBy]);

  return (
    <section className="animate-page-enter relative min-h-[80vh] bg-[#F2F2F4] py-12 sm:py-16">
      <div className="dashed-grid-overlay">
        <div />
        <div />
        <div />
        <div />
      </div>

      <div className="relative z-10 mx-auto max-w-[1440px] px-5 sm:px-10">
        <div className="flex flex-col justify-between gap-6 border-b border-dashed border-black/15 pb-8 sm:flex-row sm:items-end">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.15em] text-[#6E6E73] uppercase">
              LOOMY CATALOG
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-[-0.035em] text-[#111111] sm:text-5xl">
              {selectedGender !== 'All' ? `${selectedGender}'s ` : ''}
              {selectedCategory === 'All Items'
                ? 'Collections'
                : selectedCategory}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Gender Edit Switcher */}
            <div className="flex items-center rounded-full bg-white p-1 shadow-xs">
              {GENDER_FILTERS.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => updateFilters(selectedCategory, g)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                    selectedGender === g
                      ? 'bg-[#111111] text-white'
                      : 'text-[#6E6E73] hover:text-[#111111]'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2">
              <SlidersHorizontal className="h-3.5 w-3.5 text-[#6E6E73]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs font-semibold text-[#111111] outline-none"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="no-scrollbar mt-6 flex items-center gap-2.5 overflow-x-auto pb-2">
          {FILTER_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => updateFilters(cat, selectedGender)}
              className={`shrink-0 rounded-full px-5 py-2 text-xs font-semibold transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#111111] text-white'
                  : 'bg-white text-[#111111] hover:bg-white/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading || productsLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))
            : filteredAndSorted.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>

        {!isLoading && filteredAndSorted.length === 0 && (
          <div className="mt-12 rounded-3xl bg-white p-12 text-center">
            <p className="text-lg font-bold">No pieces match this filter</p>
            <button
              type="button"
              onClick={() => updateFilters('All Items', 'All')}
              className="mt-4 rounded-full bg-[#111111] px-6 py-2.5 text-xs font-semibold text-white"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
