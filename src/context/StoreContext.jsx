import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { CATEGORIES_LIST, PRODUCTS as LOCAL_PRODUCTS } from '../data/products';
import { api, getAuthToken, setAuthToken } from '../services/api';

const StoreContext = createContext(null);

const USERS_STORAGE_KEY = 'loomy_registered_users';
const SESSION_STORAGE_KEY = 'loomy_current_user';
const ORDERS_STORAGE_KEY = 'loomy_orders';

const DEFAULT_USERS = [
  {
    name: 'Alex Morgan',
    email: 'demo@loomy.inc',
    password: 'password123',
  },
];

function getStoredUsers() {
  try {
    const raw = window.localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) return DEFAULT_USERS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_USERS;
  } catch {
    return DEFAULT_USERS;
  }
}

function getStoredSession() {
  try {
    if (!getAuthToken()) return null;
    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function normalizeServerProduct(p) {
  return {
    ...p,
    id: p.slug || p._id || p.id,
    _id: p._id,
  };
}

function mapCartItems(items = []) {
  return items
    .filter((i) => i.product)
    .map((i) => ({
      ...normalizeServerProduct(i.product),
      cartItemId: i._id,
      quantity: i.quantity,
      selectedSize: i.selectedSize,
      selectedColor: i.selectedColor,
    }));
}

export function StoreProvider({ children }) {
  const [products, setProducts] = useState(LOCAL_PRODUCTS);
  const [categories, setCategories] = useState(CATEGORIES_LIST);
  const [productsLoading, setProductsLoading] = useState(true);

  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState([]);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authPromptReason, setAuthPromptReason] = useState('');
  const [user, setUser] = useState(getStoredSession);
  const [toast, setToast] = useState(null);
  const [busyCartKeys, setBusyCartKeys] = useState([]);
  const [busyWishlistIds, setBusyWishlistIds] = useState([]);

  const pendingActionRef = useRef(null);
  const inFlightCartRef = useRef(new Set());
  const inFlightWishlistRef = useRef(new Set());
  const lastToastRef = useRef({ message: '', at: 0 });
  const toastTimersRef = useRef({ exit: null, clear: null });

  const showToast = useCallback((message, type = 'success') => {
    const now = Date.now();
    if (
      lastToastRef.current.message === message &&
      now - lastToastRef.current.at < 800
    ) {
      return;
    }
    lastToastRef.current = { message, at: now };

    window.clearTimeout(toastTimersRef.current.exit);
    window.clearTimeout(toastTimersRef.current.clear);

    setToast({ id: now, message, type, exiting: false });

    toastTimersRef.current.exit = window.setTimeout(() => {
      setToast((prev) => (prev ? { ...prev, exiting: true } : null));
    }, 2800);

    toastTimersRef.current.clear = window.setTimeout(() => {
      setToast(null);
    }, 3100);
  }, []);

  const clearSessionState = useCallback(() => {
    setAuthToken(null);
    setUser(null);
    setCart([]);
    setWishlist([]);
    setOrders([]);
    pendingActionRef.current = null;
    setAuthPromptReason('');
    try {
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
      window.localStorage.removeItem(ORDERS_STORAGE_KEY);
    } catch {
      // ignore storage errors
    }
  }, []);

  const hydrateUserData = useCallback(async () => {
    if (!getAuthToken()) return;
    const [cartRes, wishRes, ordRes] = await Promise.all([
      api.getCart(),
      api.getWishlist(),
      api.getOrders(),
    ]);
    if (cartRes?.items) {
      setCart(mapCartItems(cartRes.items));
    }
    if (wishRes?.products) {
      setWishlist(wishRes.products.map((p) => p.slug || p._id || p.id));
    }
    if (ordRes?.orders) {
      setOrders(ordRes.orders);
    }
  }, []);

  // Load products, categories, and authenticated user state from backend when available
  useEffect(() => {
    let active = true;
    async function hydrateFromApi() {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.getProducts('?limit=40'),
          api.getCategories(),
        ]);
        if (!active) return;
        if (prodRes?.products?.length > 0) {
          setProducts(prodRes.products.map(normalizeServerProduct));
        }
        if (catRes?.categories?.length > 0) {
          setCategories(catRes.categories);
        }
      } catch {
        // Fallback to local catalog when backend is not running
      } finally {
        if (active) setProductsLoading(false);
      }

      if (getAuthToken()) {
        try {
          const meRes = await api.getMe();
          if (!active) return;
          if (meRes?.user) {
            setUser(meRes.user);
            window.localStorage.setItem(
              SESSION_STORAGE_KEY,
              JSON.stringify(meRes.user)
            );
            await hydrateUserData();
          }
        } catch (err) {
          if (!active) return;
          if (err?.status === 401) {
            clearSessionState();
            showToast('Session expired. Please sign in again.', 'error');
          }
        }
      }
    }

    hydrateFromApi();
    return () => {
      active = false;
    };
  }, [clearSessionState, hydrateUserData, showToast]);

  const completeAuthSuccess = useCallback(
    async (sessionUser, token, toastMessage) => {
      if (token) setAuthToken(token);
      setUser(sessionUser);
      try {
        window.localStorage.setItem(
          SESSION_STORAGE_KEY,
          JSON.stringify(sessionUser)
        );
      } catch {
        // ignore storage errors
      }
      setIsAuthOpen(false);
      setAuthPromptReason('');

      if (token) {
        try {
          await hydrateUserData();
        } catch {
          // ignore hydration errors when offline
        }
      }

      const queued = pendingActionRef.current;
      pendingActionRef.current = null;
      if (queued) {
        await queued(sessionUser);
      } else if (toastMessage) {
        showToast(toastMessage, 'success');
      }
    },
    [hydrateUserData, showToast]
  );

  const signIn = async ({ email, password }) => {
    try {
      const res = await api.login({ email, password });
      await completeAuthSuccess(
        res.user,
        res.token,
        'Signed In Successfully'
      );
      return { ok: true, user: res.user };
    } catch (err) {
      if (err.status === 401 || err.status === 400) {
        return { ok: false, error: err.message };
      }
      // Offline fallback validation
      await new Promise((r) => setTimeout(r, 350));
      const users = getStoredUsers();
      const normalized = email.trim().toLowerCase();
      const found = users.find(
        (u) => u.email.toLowerCase() === normalized && u.password === password
      );
      if (!found) {
        return { ok: false, error: 'Invalid email or password.' };
      }
      const sessionUser = { name: found.name, email: found.email };
      await completeAuthSuccess(sessionUser, null, 'Signed In Successfully');
      return { ok: true, user: sessionUser };
    }
  };

  const signUp = async ({ name, email, password }) => {
    try {
      const res = await api.register({ name, email, password });
      await completeAuthSuccess(
        res.user,
        res.token,
        'Account Created & Signed In'
      );
      return { ok: true, user: res.user };
    } catch (err) {
      if (err.status === 409 || err.status === 400 || err.status === 500) {
        return { ok: false, field: err.field || 'email', error: err.message };
      }
      // Offline fallback registration
      await new Promise((r) => setTimeout(r, 350));
      const users = getStoredUsers();
      const normalized = email.trim().toLowerCase();
      if (users.some((u) => u.email.toLowerCase() === normalized)) {
        return {
          ok: false,
          field: 'email',
          error: 'An account with this email already exists.',
        };
      }
      const newUser = { name: name.trim(), email: normalized, password };
      window.localStorage.setItem(
        USERS_STORAGE_KEY,
        JSON.stringify([...users, newUser])
      );
      const sessionUser = { name: newUser.name, email: newUser.email };
      await completeAuthSuccess(
        sessionUser,
        null,
        'Account Created & Signed In'
      );
      return { ok: true, user: sessionUser };
    }
  };

  const signInWithGoogle = async (credential) => {
    try {
      const res = await api.googleLogin(credential);
      await completeAuthSuccess(
        res.user,
        res.token,
        'Signed In with Google'
      );
      return { ok: true, user: res.user };
    } catch (err) {
      return {
        ok: false,
        error: err.message || 'Google authentication failed. Please try again.',
      };
    }
  };

  const updateProfile = async ({ name }) => {
    if (!user) return null;
    if (getAuthToken()) {
      try {
        const res = await api.updateProfile({ name });
        setUser(res.user);
        window.localStorage.setItem(
          SESSION_STORAGE_KEY,
          JSON.stringify(res.user)
        );
        return res.user;
      } catch {
        // fallback below
      }
    }
    const next = { ...user, name };
    setUser(next);
    window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(next));
    return next;
  };

  const signOut = async () => {
    try {
      if (getAuthToken()) await api.logout();
    } catch {
      // ignore
    }
    clearSessionState();
    showToast('Signed Out Successfully', 'info');
  };

  const requireAuth = useCallback(
    (action, reason) => {
      if (user) return true;
      pendingActionRef.current = action;
      setAuthPromptReason(reason);
      setIsAuthOpen(true);
      return false;
    },
    [user]
  );

  const dismissAuthModal = useCallback(() => {
    setIsAuthOpen(false);
    setAuthPromptReason('');
    pendingActionRef.current = null;
  }, []);

  const executeAddToCart = async (product, options = {}) => {
    const size = options.size || product.sizes?.[0] || 'M';
    const color = options.color || product.colors?.[0] || '#111111';
    const qty = options.quantity || 1;
    const key = `${product.id}-${size}-${color}`;

    if (inFlightCartRef.current.has(key)) return false;
    inFlightCartRef.current.add(key);
    setBusyCartKeys((prev) => [...prev, key]);

    try {
      if (getAuthToken()) {
        try {
          const res = await api.addToCart({
            productId: product._id || product.id,
            quantity: qty,
            selectedSize: size,
            selectedColor: color,
          });
          if (res?.items) {
            setCart(mapCartItems(res.items));
            showToast(`Added ${product.name} to Cart`, 'cart');
            return true;
          }
        } catch (err) {
          if (err?.status === 401) {
            clearSessionState();
            setIsAuthOpen(true);
            showToast('Session expired. Please sign in again.', 'error');
            return false;
          }
        }
      }

      setCart((prev) => {
        const idx = prev.findIndex(
          (item) =>
            item.id === product.id &&
            item.selectedSize === size &&
            item.selectedColor === color
        );
        if (idx > -1) {
          const next = [...prev];
          next[idx] = { ...next[idx], quantity: next[idx].quantity + qty };
          return next;
        }
        return [
          ...prev,
          { ...product, quantity: qty, selectedSize: size, selectedColor: color },
        ];
      });
      showToast(`Added ${product.name} to Cart`, 'cart');
      return true;
    } finally {
      inFlightCartRef.current.delete(key);
      setBusyCartKeys((prev) => prev.filter((k) => k !== key));
    }
  };

  const addToCart = async (product, options = {}) => {
    if (
      !requireAuth(
        () => executeAddToCart(product, options),
        'Sign in to add pieces to your bag.'
      )
    ) {
      return false;
    }
    return executeAddToCart(product, options);
  };

  const updateQuantity = async (index, delta) => {
    if (
      !requireAuth(
        () => {},
        'Sign in to update items in your bag.'
      )
    ) {
      return;
    }
    const target = cart[index];
    if (!target) return;
    const key = `${target.id}-${target.selectedSize}-${target.selectedColor}`;
    if (inFlightCartRef.current.has(key)) return;

    const nextQty = target.quantity + delta;
    inFlightCartRef.current.add(key);
    setBusyCartKeys((prev) => [...prev, key]);

    try {
      setCart((prev) =>
        prev
          .map((item, i) =>
            i === index ? { ...item, quantity: item.quantity + delta } : item
          )
          .filter((item) => item.quantity > 0)
      );

      if (getAuthToken() && target.cartItemId) {
        if (nextQty <= 0) {
          await api.removeCartItem(target.cartItemId);
        } else {
          await api.updateCartItem(target.cartItemId, nextQty);
        }
      }
      showToast('Cart Updated', 'cart');
    } catch {
      // keep state
    } finally {
      inFlightCartRef.current.delete(key);
      setBusyCartKeys((prev) => prev.filter((k) => k !== key));
    }
  };

  const removeFromCart = async (index) => {
    if (!requireAuth(() => {}, 'Sign in to manage your bag.')) return;
    const target = cart[index];
    if (!target) return;
    const key = `${target.id}-${target.selectedSize}-${target.selectedColor}`;
    if (inFlightCartRef.current.has(key)) return;

    inFlightCartRef.current.add(key);
    setBusyCartKeys((prev) => [...prev, key]);
    try {
      setCart((prev) => prev.filter((_, i) => i !== index));
      if (getAuthToken() && target.cartItemId) {
        await api.removeCartItem(target.cartItemId);
      }
      showToast('Cart Updated', 'cart');
    } catch {
      // ignore
    } finally {
      inFlightCartRef.current.delete(key);
      setBusyCartKeys((prev) => prev.filter((k) => k !== key));
    }
  };

  const clearCart = () => setCart([]);

  const executeToggleWishlist = async (productId) => {
    if (inFlightWishlistRef.current.has(productId)) return false;
    inFlightWishlistRef.current.add(productId);
    setBusyWishlistIds((prev) => [...prev, productId]);

    const exists = wishlist.includes(productId);
    try {
      setWishlist((prev) =>
        exists ? prev.filter((id) => id !== productId) : [...prev, productId]
      );
      showToast(
        exists ? 'Removed from Wishlist' : 'Added to Wishlist',
        'wishlist'
      );

      if (getAuthToken()) {
        try {
          if (exists) {
            await api.removeFromWishlist(productId);
          } else {
            await api.addToWishlist(productId);
          }
        } catch (err) {
          if (err?.status === 401) {
            clearSessionState();
            setIsAuthOpen(true);
            showToast('Session expired. Please sign in again.', 'error');
            return false;
          }
        }
      }
      return true;
    } finally {
      inFlightWishlistRef.current.delete(productId);
      setBusyWishlistIds((prev) => prev.filter((id) => id !== productId));
    }
  };

  const toggleWishlist = async (productId) => {
    if (
      !requireAuth(
        () => executeToggleWishlist(productId),
        'Sign in to save pieces to your wishlist.'
      )
    ) {
      return false;
    }
    return executeToggleWishlist(productId);
  };

  const placeOrder = async (shippingAddress = {}) => {
    if (
      !requireAuth(() => {}, 'Sign in to proceed to checkout and place your order.')
    ) {
      return null;
    }

    const payloadItems = cart.map((item) => ({
      productId: item._id || item.id,
      quantity: item.quantity,
      selectedSize: item.selectedSize,
      selectedColor: item.selectedColor,
    }));

    if (getAuthToken()) {
      try {
        const res = await api.createOrder({
          items: payloadItems,
          shippingAddress,
        });
        if (res?.order) {
          setOrders((prev) => [res.order, ...prev]);
          clearCart();
          return res.order;
        }
      } catch (err) {
        if (err?.status === 401) {
          clearSessionState();
          setIsAuthOpen(true);
          showToast('Session expired. Please sign in again.', 'error');
          return null;
        }
        showToast(err?.message || 'Unable to place order.', 'error');
        return null;
      }
    }

    const fallbackOrder = {
      id: `ORD-${Date.now()}`,
      items: cart,
      shippingAddress,
      totalAmount: Number(cartSubtotal.toFixed(2)),
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
    };
    const nextOrders = [fallbackOrder, ...orders];
    setOrders(nextOrders);
    window.localStorage.setItem(
      ORDERS_STORAGE_KEY,
      JSON.stringify(nextOrders)
    );
    clearCart();
    return fallbackOrder;
  };

  const cancelOrder = async (orderId) => {
    if (!user) return null;
    try {
      const res = await api.cancelOrder(orderId);
      if (res?.order) {
        setOrders((prev) =>
          prev.map((o) =>
            (o._id || o.id) === (res.order._id || res.order.id) ? res.order : o
          )
        );
        showToast('Order Cancelled', 'info');
        return res.order;
      }
    } catch (err) {
      showToast(err?.message || 'Unable to cancel order.', 'error');
    }
    return null;
  };

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const cartSubtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const value = {
    products,
    categories,
    productsLoading,
    cart,
    cartCount,
    cartSubtotal,
    wishlist,
    orders,
    isCartOpen,
    setIsCartOpen,
    isWishlistOpen,
    setIsWishlistOpen,
    isSearchOpen,
    setIsSearchOpen,
    isMenuOpen,
    setIsMenuOpen,
    isAuthOpen,
    setIsAuthOpen,
    authPromptReason,
    requireAuth,
    dismissAuthModal,
    user,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    updateProfile,
    toast,
    showToast,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    toggleWishlist,
    placeOrder,
    cancelOrder,
    busyCartKeys,
    busyWishlistIds,
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}
