import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Heart,
  Loader2,
  Lock,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { FILTER_CATEGORIES, PRODUCTS } from '../../data/products';
import { DrawerRowSkeleton } from '../product/ProductSkeleton';
import LoomyLogo from '../ui/LoomyLogo';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function CartDrawer() {
  const {
    cart,
    cartSubtotal,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    placeOrder,
    user,
    requireAuth,
    busyCartKeys,
    showToast,
  } = useStore();
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [processingOrder, setProcessingOrder] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState('bag'); // 'bag' | 'shipping'
  const [shipping, setShipping] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
  });
  const [shippingErrors, setShippingErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isCartOpen) return;
    setLoading(true);
    setConfirmedOrder(null);
    setCheckoutStep('bag');
    setShippingErrors({});
    if (user?.name) {
      setShipping((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name,
      }));
    }
    const t = window.setTimeout(() => setLoading(false), 220);
    return () => window.clearTimeout(t);
  }, [isCartOpen, user]);

  if (!isCartOpen) return null;

  const handleCheckout = async (e) => {
    if (e) e.preventDefault();
    if (processingOrder) return;
    if (!user) {
      setIsCartOpen(false);
      requireAuth(
        () => setIsCartOpen(true),
        'Sign in to proceed to checkout and place your order.'
      );
      return;
    }

    if (checkoutStep === 'bag') {
      setCheckoutStep('shipping');
      return;
    }

    const nextErr = {};
    if (shipping.fullName.trim().length < 2) {
      nextErr.fullName = 'Recipient name is required.';
    }
    if (shipping.address.trim().length < 5) {
      nextErr.address = 'Street address is required.';
    }
    if (shipping.city.trim().length < 2) {
      nextErr.city = 'City is required.';
    }
    if (shipping.postalCode.trim().length < 3) {
      nextErr.postalCode = 'Postal code is required.';
    }
    if (Object.keys(nextErr).length > 0) {
      setShippingErrors(nextErr);
      return;
    }

    setProcessingOrder(true);
    const order = await placeOrder({
      fullName: shipping.fullName.trim(),
      address: shipping.address.trim(),
      city: shipping.city.trim(),
      postalCode: shipping.postalCode.trim(),
    });
    setProcessingOrder(false);
    if (order) {
      setConfirmedOrder(order);
      setCheckoutStep('bag');
      showToast('Order Placed Successfully', 'success');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
      <div className="animate-page-enter flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-black/10 px-6 py-5">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="h-5 w-5" />
            <h2 className="text-lg font-bold tracking-tight">Your Bag</h2>
          </div>
          <button
            type="button"
            onClick={() => setIsCartOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F3F3F5] hover:bg-black/10"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {loading ? (
          <div className="flex-1 space-y-4 p-6">
            <DrawerRowSkeleton />
            <DrawerRowSkeleton />
          </div>
        ) : confirmedOrder ? (
          <div className="animate-page-enter flex flex-1 flex-col items-center justify-center overflow-y-auto p-7 text-center">
            <LoomyLogo variant="dark" size="sm" />

            <div className="relative mt-5 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-tr from-[#7C8BFF]/25 via-[#E8EAFC] to-[#F5A6D8]/30 shadow-inner">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#111111] text-white shadow-xl">
                <CheckCircle2 className="h-8 w-8 text-[#7C8BFF]" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-md">
                <Sparkles className="h-3.5 w-3.5 text-[#7C8BFF]" />
              </span>
            </div>

            <span className="mt-5 rounded-full bg-[#E9EBFA] px-3.5 py-1 text-[10px] font-bold tracking-[0.16em] text-[#111111] uppercase">
              Order Confirmed
            </span>

            <h3 className="mt-3 text-2xl font-bold tracking-tight text-[#111111]">
              Thank You for Your Order
            </h3>
            <p className="mt-1.5 max-w-xs text-xs leading-relaxed text-[#6E6E73]">
              Your LOOMY pieces are packed and queued for priority studio dispatch.
            </p>

            <div className="mt-6 w-full rounded-2xl border border-black/[0.06] bg-[#F8F8FA] p-4 text-left text-xs">
              <div className="flex items-center justify-between border-b border-dashed border-black/10 pb-2.5">
                <span className="text-[#6E6E73]">Order Reference</span>
                <span className="font-bold text-[#111111]">
                  #
                  {String(confirmedOrder._id || confirmedOrder.id)
                    .slice(-6)
                    .toUpperCase()}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-dashed border-black/10 py-2.5">
                <span className="text-[#6E6E73]">Status</span>
                <span className="inline-flex items-center gap-1.5 font-semibold text-[#111111]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#7C8BFF]" />
                  Confirmed · Express Dispatch
                </span>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <span className="text-[#6E6E73]">Items</span>
                <span className="font-semibold text-[#111111]">
                  {confirmedOrder.items?.length || 1} piece(s)
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-dashed border-black/10 pt-2.5">
                <span className="text-[#6E6E73]">Total Paid</span>
                <span className="text-sm font-extrabold text-[#111111]">
                  ${Number(confirmedOrder.totalAmount || 0).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="mt-6 flex w-full flex-col gap-2.5">
              {user ? (
                <Link
                  to="/account"
                  onClick={() => {
                    setConfirmedOrder(null);
                    setIsCartOpen(false);
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#111111] py-3 text-xs font-semibold text-white transition-colors hover:bg-[#7C8BFF]"
                >
                  <span>View Order in Account</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              ) : null}
              <Link
                to="/shop"
                onClick={() => {
                  setConfirmedOrder(null);
                  setIsCartOpen(false);
                }}
                className="flex w-full items-center justify-center rounded-full border border-black/15 bg-white py-3 text-xs font-semibold text-[#111111] hover:bg-black/5"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : !user ? (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F3F3F5] text-[#111111]">
              <Lock className="h-5 w-5" />
            </div>
            <p className="mt-4 text-base font-semibold">Sign in to view your bag</p>
            <p className="mt-1 max-w-xs text-sm text-[#6E6E73]">
              Your shopping bag and checkout are protected by your LOOMY account.
            </p>
            <button
              type="button"
              onClick={() => {
                setIsCartOpen(false);
                requireAuth(
                  () => setIsCartOpen(true),
                  'Sign in to access your shopping bag and checkout.'
                );
              }}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#111111] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#7C8BFF]"
            >
              Sign In to Continue
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        ) : cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <p className="text-base font-semibold">Your bag is empty</p>
            <p className="mt-1 text-sm text-[#6E6E73]">
              Explore the 2026 Signature Series to add pieces.
            </p>
            <Link
              to="/shop"
              onClick={() => setIsCartOpen(false)}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#111111] px-6 py-3 text-sm font-semibold text-white"
            >
              Browse Shop
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto p-6">
              {cart.map((item, idx) => {
                const itemKey = `${item.id}-${item.selectedSize}-${item.selectedColor}`;
                const isBusy = busyCartKeys.includes(itemKey);
                return (
                <div
                  key={itemKey}
                  className={`flex gap-4 rounded-2xl bg-[#F6F6F8] p-3 transition-opacity ${
                    isBusy ? 'opacity-65' : ''
                  }`}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-22 w-20 rounded-xl object-cover"
                  />
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-semibold text-[#111111]">
                          {item.name}
                        </h4>
                        <p className="mt-0.5 text-xs text-[#6E6E73]">
                          Size {item.selectedSize}
                        </p>
                      </div>
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => removeFromCart(idx)}
                        className="text-[#6E6E73] hover:text-[#E11D48] disabled:opacity-40"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 rounded-full bg-white px-2 py-1">
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => updateQuantity(idx, -1)}
                          className="p-0.5 hover:text-[#7C8BFF] disabled:opacity-40"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="min-w-4 text-center text-xs font-bold">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => updateQuantity(idx, 1)}
                          className="p-0.5 hover:text-[#7C8BFF] disabled:opacity-40"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className="text-sm font-bold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                );
              })}
            </div>

            <div className="border-t border-black/10 p-6">
              {checkoutStep === 'shipping' ? (
                <form onSubmit={handleCheckout} noValidate className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold tracking-wider text-[#111111] uppercase">
                      Shipping Details
                    </p>
                    <button
                      type="button"
                      onClick={() => setCheckoutStep('bag')}
                      className="text-xs font-semibold text-[#6E6E73] hover:text-[#111111]"
                    >
                      Back to Bag
                    </button>
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={shipping.fullName}
                      onChange={(e) => {
                        setShipping((p) => ({ ...p, fullName: e.target.value }));
                        if (shippingErrors.fullName)
                          setShippingErrors((p) => ({ ...p, fullName: '' }));
                      }}
                      className={`w-full rounded-xl border px-3.5 py-2 text-xs outline-none ${
                        shippingErrors.fullName
                          ? 'border-[#E11D48]'
                          : 'border-black/10 focus:border-[#7C8BFF]'
                      }`}
                    />
                    {shippingErrors.fullName && (
                      <p className="mt-1 text-[11px] text-[#E11D48]">
                        {shippingErrors.fullName}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Street Address"
                      value={shipping.address}
                      onChange={(e) => {
                        setShipping((p) => ({ ...p, address: e.target.value }));
                        if (shippingErrors.address)
                          setShippingErrors((p) => ({ ...p, address: '' }));
                      }}
                      className={`w-full rounded-xl border px-3.5 py-2 text-xs outline-none ${
                        shippingErrors.address
                          ? 'border-[#E11D48]'
                          : 'border-black/10 focus:border-[#7C8BFF]'
                      }`}
                    />
                    {shippingErrors.address && (
                      <p className="mt-1 text-[11px] text-[#E11D48]">
                        {shippingErrors.address}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <input
                        type="text"
                        placeholder="City"
                        value={shipping.city}
                        onChange={(e) => {
                          setShipping((p) => ({ ...p, city: e.target.value }));
                          if (shippingErrors.city)
                            setShippingErrors((p) => ({ ...p, city: '' }));
                        }}
                        className={`w-full rounded-xl border px-3.5 py-2 text-xs outline-none ${
                          shippingErrors.city
                            ? 'border-[#E11D48]'
                            : 'border-black/10 focus:border-[#7C8BFF]'
                        }`}
                      />
                      {shippingErrors.city && (
                        <p className="mt-1 text-[11px] text-[#E11D48]">
                          {shippingErrors.city}
                        </p>
                      )}
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Postal Code"
                        value={shipping.postalCode}
                        onChange={(e) => {
                          setShipping((p) => ({
                            ...p,
                            postalCode: e.target.value,
                          }));
                          if (shippingErrors.postalCode)
                            setShippingErrors((p) => ({ ...p, postalCode: '' }));
                        }}
                        className={`w-full rounded-xl border px-3.5 py-2 text-xs outline-none ${
                          shippingErrors.postalCode
                            ? 'border-[#E11D48]'
                            : 'border-black/10 focus:border-[#7C8BFF]'
                        }`}
                      />
                      {shippingErrors.postalCode && (
                        <p className="mt-1 text-[11px] text-[#E11D48]">
                          {shippingErrors.postalCode}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-1 text-sm">
                    <span className="text-[#6E6E73]">Total</span>
                    <span className="text-lg font-bold">
                      ${cartSubtotal.toFixed(2)}
                    </span>
                  </div>
                  <button
                    type="submit"
                    disabled={processingOrder}
                    className="flex w-full items-center justify-between rounded-full bg-[#111111] py-3.5 pr-2 pl-6 text-sm font-semibold text-white transition-colors hover:bg-[#1f1f24] disabled:opacity-60"
                  >
                    <span>
                      {processingOrder ? 'Placing Order...' : 'Confirm & Place Order'}
                    </span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#7C8BFF] text-white">
                      {processingOrder ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <ArrowRight className="h-4 w-4" />
                      )}
                    </span>
                  </button>
                </form>
              ) : (
                <>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#6E6E73]">Subtotal</span>
                    <span className="text-lg font-bold">
                      ${cartSubtotal.toFixed(2)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-[#6E6E73]">
                    Complimentary express shipping on orders over $250.
                  </p>
                  <button
                    type="button"
                    disabled={processingOrder}
                    onClick={handleCheckout}
                    className="mt-4 flex w-full items-center justify-between rounded-full bg-[#111111] py-3.5 pr-2 pl-6 text-sm font-semibold text-white transition-colors hover:bg-[#1f1f24] disabled:opacity-60"
                  >
                    <span>Proceed to Checkout</span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#7C8BFF] text-white">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function WishlistDrawer() {
  const {
    products,
    wishlist,
    isWishlistOpen,
    setIsWishlistOpen,
    toggleWishlist,
    addToCart,
    setIsCartOpen,
    user,
    requireAuth,
  } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isWishlistOpen) return;
    setLoading(true);
    const t = window.setTimeout(() => setLoading(false), 200);
    return () => window.clearTimeout(t);
  }, [isWishlistOpen]);

  if (!isWishlistOpen) return null;

  const catalog = products.length > 0 ? products : PRODUCTS;
  const savedProducts = catalog.filter((p) => wishlist.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
      <div className="animate-page-enter flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-black/10 px-6 py-5">
          <div className="flex items-center gap-2.5">
            <Heart className="h-5 w-5 fill-[#F5A6D8] text-[#F5A6D8]" />
            <h2 className="text-lg font-bold tracking-tight">
              Saved ({savedProducts.length})
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setIsWishlistOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F3F3F5] hover:bg-black/10"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {loading ? (
          <div className="flex-1 space-y-4 p-6">
            <DrawerRowSkeleton />
            <DrawerRowSkeleton />
          </div>
        ) : !user ? (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F3F3F5] text-[#111111]">
              <Lock className="h-5 w-5" />
            </div>
            <p className="mt-4 text-base font-semibold">Sign in to view saved pieces</p>
            <p className="mt-1 max-w-xs text-sm text-[#6E6E73]">
              Your wishlist syncs securely to your LOOMY account across devices.
            </p>
            <button
              type="button"
              onClick={() => {
                setIsWishlistOpen(false);
                requireAuth(
                  () => setIsWishlistOpen(true),
                  'Sign in to view your saved wishlist pieces.'
                );
              }}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#111111] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#7C8BFF]"
            >
              Sign In to Continue
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        ) : savedProducts.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <p className="text-base font-semibold">No saved pieces yet</p>
            <p className="mt-1 text-sm text-[#6E6E73]">
              Tap the heart icon on any piece to save it for later.
            </p>
          </div>
        ) : (
          <div className="flex-1 space-y-4 overflow-y-auto p-6">
            {savedProducts.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 rounded-2xl bg-[#F6F6F8] p-3"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-20 w-18 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="truncate text-sm font-semibold text-[#111111]">
                    {item.name}
                  </h4>
                  <p className="mt-0.5 text-xs font-bold text-[#111111]">
                    ${item.price.toFixed(2)}
                  </p>
                  <div className="mt-2.5 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={async () => {
                        const added = await addToCart(item);
                        if (added) {
                          setIsWishlistOpen(false);
                          setIsCartOpen(true);
                        }
                      }}
                      className="rounded-full bg-[#111111] px-3.5 py-1.5 text-[11px] font-semibold text-white hover:bg-[#7C8BFF]"
                    >
                      Move to Bag
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleWishlist(item.id)}
                      className="text-[11px] font-medium text-[#6E6E73] hover:text-[#E11D48]"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function SearchModal() {
  const { isSearchOpen, setIsSearchOpen } = useStore();
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const navigate = useNavigate();

  const handleQueryChange = (val) => {
    setQuery(val);
    setSearching(true);
    window.clearTimeout(window.__loomySearchTimer);
    window.__loomySearchTimer = window.setTimeout(
      () => setSearching(false),
      180
    );
  };

  if (!isSearchOpen) return null;

  const matches = PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 6);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/45 p-4 pt-20 backdrop-blur-xs">
      <div className="animate-page-enter w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-center gap-3 border-b border-black/10 pb-4">
          <Search className="h-5 w-5 text-[#6E6E73]" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Search jackets, summer shirts, hoodies..."
            className="w-full text-base outline-none"
          />
          <button
            type="button"
            onClick={() => setIsSearchOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F3F3F5]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {searching ? (
            <>
              <DrawerRowSkeleton />
              <DrawerRowSkeleton />
            </>
          ) : matches.length === 0 ? (
            <p className="col-span-2 py-6 text-center text-sm text-[#6E6E73]">
              No pieces found for &ldquo;{query}&rdquo;.
            </p>
          ) : (
            matches.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setIsSearchOpen(false);
                  navigate(`/product/${p.id}`);
                }}
                className="flex items-center gap-3 rounded-2xl p-2 text-left transition-colors hover:bg-[#F3F3F5]"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="h-14 w-14 rounded-xl object-cover"
                />
                <div>
                  <p className="text-sm font-semibold">{p.name}</p>
                  <p className="text-xs text-[#6E6E73]">
                    {p.category} · ${p.price.toFixed(2)}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export function MenuDrawer() {
  const { isMenuOpen, setIsMenuOpen } = useStore();
  if (!isMenuOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-start bg-black/40 backdrop-blur-xs">
      <div className="animate-page-enter flex h-full w-80 flex-col justify-between bg-[#0D0D0F] p-7 text-white shadow-2xl">
        <div>
          <div className="flex items-center justify-between">
            <LoomyLogo variant="light" size="md" />
            <button
              type="button"
              onClick={() => setIsMenuOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <nav className="mt-10 space-y-4">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="block text-2xl font-semibold tracking-tight hover:text-[#7C8BFF]"
            >
              Home
            </Link>
            <Link
              to="/shop"
              onClick={() => setIsMenuOpen(false)}
              className="block text-2xl font-semibold tracking-tight hover:text-[#7C8BFF]"
            >
              Shop All
            </Link>
            <Link
              to="/shop?gender=Men"
              onClick={() => setIsMenuOpen(false)}
              className="block text-lg font-medium text-white/80 hover:text-[#7C8BFF]"
            >
              Men&apos;s Edit
            </Link>
            <Link
              to="/shop?gender=Women"
              onClick={() => setIsMenuOpen(false)}
              className="block text-lg font-medium text-white/80 hover:text-[#7C8BFF]"
            >
              Women&apos;s Edit
            </Link>

            <div className="pt-4">
              <p className="text-[11px] font-semibold tracking-[0.15em] text-white/45 uppercase">
                Categories
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {FILTER_CATEGORIES.map((cat) => (
                  <Link
                    key={cat}
                    to={`/shop?category=${encodeURIComponent(cat)}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="rounded-full border border-white/15 px-3.5 py-1.5 text-xs font-medium text-white/80 hover:border-[#7C8BFF] hover:text-white"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
          </nav>
        </div>

        <p className="text-xs text-white/45">
          © LOOMY.INC — Simply Iconics, Timeless Vibes
        </p>
      </div>
    </div>
  );
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

export function AuthModal() {
  const {
    isAuthOpen,
    dismissAuthModal,
    authPromptReason,
    user,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
  } = useStore();
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const [googleButtonReady, setGoogleButtonReady] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [confirmSignOut, setConfirmSignOut] = useState(false);
  const googleBtnRef = useRef(null);

  useEffect(() => {
    if (isAuthOpen && user) {
      setProfileLoading(true);
      const t = window.setTimeout(() => setProfileLoading(false), 220);
      return () => window.clearTimeout(t);
    }
  }, [isAuthOpen, user]);

  useEffect(() => {
    if (!isAuthOpen || user || !GOOGLE_CLIENT_ID) {
      setGoogleButtonReady(false);
      return;
    }

    let cancelled = false;
    const initGoogle = () => {
      if (cancelled || !window.google?.accounts?.id || !googleBtnRef.current) {
        return false;
      }
      try {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: async (response) => {
            if (!response?.credential) {
              setFormError('Google sign-in was cancelled or returned no token.');
              return;
            }
            setFormError('');
            setGoogleSubmitting(true);
            try {
              const res = await signInWithGoogle(response.credential);
              if (!res.ok) {
                setFormError(res.error);
              }
            } finally {
              setGoogleSubmitting(false);
            }
          },
        });
        googleBtnRef.current.innerHTML = '';
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          shape: 'pill',
          text: mode === 'signup' ? 'signup_with' : 'continue_with',
          width: 360,
        });
        setGoogleButtonReady(true);
        return true;
      } catch {
        return false;
      }
    };

    if (!initGoogle()) {
      const interval = window.setInterval(() => {
        if (initGoogle()) window.clearInterval(interval);
      }, 250);
      const timeout = window.setTimeout(() => window.clearInterval(interval), 4000);
      return () => {
        cancelled = true;
        window.clearInterval(interval);
        window.clearTimeout(timeout);
      };
    }

    return () => {
      cancelled = true;
    };
  }, [isAuthOpen, user, mode, signInWithGoogle]);

  if (!isAuthOpen) return null;

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setErrors({});
    setFormError('');
  };

  const handleFallbackGoogleClick = () => {
    setFormError('');
    if (!GOOGLE_CLIENT_ID) {
      setFormError(
        'Google Sign-In is not configured yet (VITE_GOOGLE_CLIENT_ID missing). Use email and password below.'
      );
      return;
    }
    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt((notification) => {
        if (
          notification.isNotDisplayed?.() ||
          notification.isSkippedMoment?.()
        ) {
          setFormError(
            'Google Sign-In prompt could not open. Please allow third-party sign-in or use email below.'
          );
        }
      });
    } else {
      setFormError(
        'Google Sign-In script is still loading or blocked by your browser.'
      );
    }
  };

  const validate = () => {
    const next = {};
    if (mode === 'signup' && name.trim().length < 2) {
      next.name = 'Full name must be at least 2 characters.';
    }
    if (!email.trim()) {
      next.email = 'Email address is required.';
    } else if (!EMAIL_REGEX.test(email.trim())) {
      next.email = 'Please enter a valid email address.';
    }

    if (!password) {
      next.password = 'Password is required.';
    } else if (mode === 'signup' && password.length < 8) {
      next.password = 'Password must be at least 8 characters.';
    }

    if (mode === 'signup' && confirmPassword !== password) {
      next.confirmPassword = 'Passwords do not match.';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setFormError('');
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      if (mode === 'signin') {
        const res = await signIn({ email, password });
        if (!res.ok) {
          setFormError(res.error);
        }
      } else {
        const res = await signUp({ name, email, password });
        if (!res.ok) {
          if (res.field) {
            setErrors((prev) => ({ ...prev, [res.field]: res.error }));
          } else {
            setFormError(res.error);
          }
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-xs">
      <div className="animate-page-enter w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl">
        <div className="flex items-center justify-between">
          <LoomyLogo variant="dark" size="sm" />
          <button
            type="button"
            onClick={dismissAuthModal}
            aria-label="Close authentication modal"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F3F3F5]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {user ? (
          profileLoading ? (
            <div className="mt-6 space-y-4">
              <div className="loomy-shimmer h-20 rounded-2xl" />
              <div className="loomy-shimmer h-11 rounded-full" />
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-[#F3F3F5] p-4">
                <p className="text-[11px] font-semibold tracking-widest text-[#7C8BFF] uppercase">
                  LOOMY MEMBER
                </p>
                <p className="mt-1 text-base font-bold text-[#111111]">
                  {user.name}
                </p>
                <p className="text-xs text-[#6E6E73]">{user.email}</p>
                <Link
                  to="/account"
                  onClick={dismissAuthModal}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#111111] hover:text-[#7C8BFF]"
                >
                  View Account &amp; Orders <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              {confirmSignOut ? (
                <div className="space-y-3 rounded-2xl border border-[#E11D48]/20 bg-[#E11D48]/5 p-4">
                  <p className="text-xs font-semibold text-[#111111]">
                    Are you sure you want to sign out?
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        signOut();
                        setConfirmSignOut(false);
                        dismissAuthModal();
                      }}
                      className="flex-1 rounded-full bg-[#E11D48] py-2.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                    >
                      Confirm Sign Out
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmSignOut(false)}
                      className="flex-1 rounded-full border border-black/15 bg-white py-2.5 text-xs font-semibold text-[#111111]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmSignOut(true)}
                  className="w-full rounded-full bg-[#111111] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#E11D48]"
                >
                  Sign Out
                </button>
              )}
            </div>
          )
        ) : (
          <>
            {authPromptReason && (
              <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-[#7C8BFF]/30 bg-[#7C8BFF]/8 px-3.5 py-2.5 text-xs text-[#111111]">
                <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#7C8BFF]" />
                <div>
                  <p className="font-semibold">Sign in required</p>
                  <p className="text-[#6E6E73]">{authPromptReason}</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex rounded-full bg-[#F3F3F5] p-1">
              <button
                type="button"
                onClick={() => switchMode('signin')}
                className={`flex-1 rounded-full py-2 text-xs font-bold transition-colors ${
                  mode === 'signin'
                    ? 'bg-[#111111] text-white'
                    : 'text-[#6E6E73]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => switchMode('signup')}
                className={`flex-1 rounded-full py-2 text-xs font-bold transition-colors ${
                  mode === 'signup'
                    ? 'bg-[#111111] text-white'
                    : 'text-[#6E6E73]'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Google Identity Services */}
            <div className="mt-4">
              <div
                ref={googleBtnRef}
                className={googleButtonReady ? 'flex justify-center' : 'hidden'}
              />
              {!googleButtonReady && (
                <button
                  type="button"
                  disabled={googleSubmitting || isSubmitting}
                  onClick={handleFallbackGoogleClick}
                  className="flex w-full items-center justify-center gap-2.5 rounded-full border border-black/15 bg-white py-2.5 text-xs font-semibold text-[#111111] transition-colors hover:bg-[#F6F6F8] disabled:opacity-55"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.3 0 6.08-1.09 8.11-2.96l-3.88-3.05c-1.09.73-2.48 1.16-4.23 1.16-3.25 0-6.01-2.19-7-5.14H1.01v3.14C3.05 21.2 7.24 24 12 24Z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5 14.01c-.25-.73-.39-1.51-.39-2.31s.14-1.58.39-2.31V6.25H1.01A11.99 11.99 0 0 0 0 11.7c0 1.93.46 3.76 1.01 5.45l3.99-3.14Z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.8 0 3.41.62 4.68 1.83l3.51-3.51C18.07 1.19 15.3 0 12 0 7.24 0 3.05 2.8 1.01 6.86l3.99 3.14c.99-2.95 3.75-5.25 7-5.25Z"
                    />
                  </svg>
                  <span>
                    {googleSubmitting
                      ? 'Connecting with Google...'
                      : 'Continue with Google'}
                  </span>
                </button>
              )}
              <div className="my-4 flex items-center gap-3">
                <div className="h-px flex-1 bg-black/10" />
                <span className="text-[10px] font-semibold tracking-widest text-[#6E6E73] uppercase">
                  or with email
                </span>
                <div className="h-px flex-1 bg-black/10" />
              </div>
            </div>

            {formError && (
              <div className="mt-4 rounded-xl border border-[#E11D48]/25 bg-[#E11D48]/8 px-3.5 py-2.5 text-xs font-medium text-[#E11D48]">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-3.5">
              {mode === 'signup' && (
                <div>
                  <label className="text-xs font-semibold text-[#6E6E73]">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors((p) => ({ ...p, name: '' }));
                    }}
                    placeholder="Alex Morgan"
                    className={`mt-1 w-full rounded-xl border px-4 py-2.5 text-sm outline-none ${
                      errors.name
                        ? 'border-[#E11D48]'
                        : 'border-black/10 focus:border-[#7C8BFF]'
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-[11px] font-medium text-[#E11D48]">
                      {errors.name}
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-[#6E6E73]">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((p) => ({ ...p, email: '' }));
                  }}
                  placeholder="demo@loomy.inc"
                  className={`mt-1 w-full rounded-xl border px-4 py-2.5 text-sm outline-none ${
                    errors.email
                      ? 'border-[#E11D48]'
                      : 'border-black/10 focus:border-[#7C8BFF]'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-[11px] font-medium text-[#E11D48]">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-[#6E6E73]">
                  Password
                </label>
                <div className="relative mt-1">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password)
                        setErrors((p) => ({ ...p, password: '' }));
                    }}
                    placeholder="••••••••"
                    className={`w-full rounded-xl border py-2.5 pr-10 pl-4 text-sm outline-none ${
                      errors.password
                        ? 'border-[#E11D48]'
                        : 'border-black/10 focus:border-[#7C8BFF]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-[#6E6E73] hover:text-[#111111]"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-[11px] font-medium text-[#E11D48]">
                    {errors.password}
                  </p>
                )}
              </div>

              {mode === 'signup' && (
                <div>
                  <label className="text-xs font-semibold text-[#6E6E73]">
                    Confirm Password
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword)
                        setErrors((p) => ({ ...p, confirmPassword: '' }));
                    }}
                    placeholder="••••••••"
                    className={`mt-1 w-full rounded-xl border px-4 py-2.5 text-sm outline-none ${
                      errors.confirmPassword
                        ? 'border-[#E11D48]'
                        : 'border-black/10 focus:border-[#7C8BFF]'
                    }`}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-[11px] font-medium text-[#E11D48]">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || googleSubmitting}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-[#111111] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#7C8BFF] disabled:cursor-not-allowed disabled:opacity-55"
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                <span>
                  {isSubmitting
                    ? 'Processing...'
                    : mode === 'signin'
                      ? 'Sign In'
                      : 'Create Account'}
                </span>
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export function ToastNotification() {
  const { toast } = useStore();
  if (!toast) return null;

  const { message, type = 'success', exiting } = toast;

  const renderIcon = () => {
    if (type === 'cart') {
      return <ShoppingBag className="h-4.5 w-4.5 shrink-0 text-[#7C8BFF]" />;
    }
    if (type === 'wishlist') {
      return <Heart className="h-4.5 w-4.5 shrink-0 fill-[#F5A6D8] text-[#F5A6D8]" />;
    }
    if (type === 'error') {
      return <AlertCircle className="h-4.5 w-4.5 shrink-0 text-[#F43F5E]" />;
    }
    return <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-[#7C8BFF]" />;
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-7 left-1/2 z-50 flex min-w-[260px] max-w-md -translate-x-1/2 items-center gap-3 rounded-2xl border border-white/10 bg-[#111111] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(0,0,0,0.28)] ${
        exiting ? 'animate-toast-out' : 'animate-toast-in'
      }`}
    >
      {renderIcon()}
      <span className="leading-snug">{message}</span>
    </div>
  );
}
