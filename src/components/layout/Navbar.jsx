import { Heart, Menu, Search, ShoppingBag, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import LoomyLogo from '../ui/LoomyLogo';

const NAV_LINKS = [
  { label: 'Shop', to: '/shop' },
  { label: 'New Arrivals', to: '/#new-arrivals' },
  { label: 'Collections', to: '/#collections' },
  { label: 'Categories', to: '/#categories' },
];

export default function Navbar() {
  const {
    cartCount,
    wishlist,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsSearchOpen,
    setIsMenuOpen,
    setIsAuthOpen,
    user,
  } = useStore();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-black/[0.06] bg-[#F4F4F6]/85 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between gap-4 px-5 sm:px-10">
        {/* Left: Mobile Menu + Desktop Navigation */}
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open menu"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#111111] shadow-[0_2px_10px_rgba(0,0,0,0.06)] transition-transform hover:scale-105 active:scale-95 lg:hidden"
          >
            <Menu className="h-4 w-4" />
          </button>

          <Link to="/" className="transition-opacity hover:opacity-80">
            <LoomyLogo variant="dark" size="md" animate />
          </Link>

          <nav className="hidden items-center gap-7 pl-4 lg:flex">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="text-xs font-semibold tracking-[0.06em] text-[#111111]/80 uppercase transition-colors hover:text-[#7C8BFF]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right: Search, Wishlist, Bag, User */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            aria-label="Search products"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#111111] shadow-[0_2px_10px_rgba(0,0,0,0.06)] transition-transform hover:scale-105 active:scale-95"
          >
            <Search className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsWishlistOpen(true)}
            aria-label="Open wishlist"
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#111111] shadow-[0_2px_10px_rgba(0,0,0,0.06)] transition-transform hover:scale-105 active:scale-95"
          >
            <Heart className="h-4 w-4" />
            {wishlist.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-[#F5A6D8] px-1 text-[10px] font-bold text-[#111111] shadow-xs">
                {wishlist.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            aria-label="Open shopping bag"
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#111111] shadow-[0_2px_10px_rgba(0,0,0,0.06)] transition-transform hover:scale-105 active:scale-95"
          >
            <ShoppingBag className="h-4 w-4" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-[#7C8BFF] px-1 text-[10px] font-bold text-white shadow-xs">
                {cartCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsAuthOpen(true)}
            aria-label="Account"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#111111] shadow-[0_2px_10px_rgba(0,0,0,0.06)] transition-transform hover:scale-105 active:scale-95"
          >
            {user ? (
              <span className="text-xs font-bold uppercase">
                {user.name.slice(0, 2)}
              </span>
            ) : (
              <User className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
