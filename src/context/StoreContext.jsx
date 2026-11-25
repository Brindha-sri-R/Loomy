import {
  createContext,
  useContext,
  useEffect,
  useMemo,
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

export function StoreProvider({ children }) {
  const [products, setProducts] = useState(LOCAL_PRODUCTS);
  const [categories, setCategories] = useState(CATEGORIES_LIST);
  const [productsLoading, setProductsLoading] = useState(false);

  const [cart, setCart] = useState([
    {
      ...LOCAL_PRODUCTS[0],
      quantity: 1,
      selectedSize: 'M',
      selectedColor: LOCAL_PRODUCTS[0].colors[0],
    },
    {
      ...LOCAL_PRODUCTS[2],
      quantity: 1,
      selectedSize: 'L',
      selectedColor: LOCAL_PRODUCTS[2].colors[0],
    },
  ]);

  const [wishlist, setWishlist] = useState(() =>
    LOCAL_PRODUCTS.filter((p) => p.wishlistedDefault).map((p) => p.id)
  );
  const [orders, setOrders] = useState(() => {
    try {
      const raw = window.localStorage.getItem(ORDERS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState(getStoredSession);
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    window.clearTimeout(window.__loomyToastTimer);
    window.__loomyToastTimer = window.setTimeout(() => setToast(null), 2600);
  };

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
          const [meRes, cartRes, wishRes, ordRes] = await Promise.all([
            api.getMe(),
            api.getCart(),
            api.getWishlist(),
            api.getOrders(),
          ]);
          if (!active) return;
          if (meRes?.user) {
            setUser(meRes.user);
            window.localStorage.setItem(
              SESSION_STORAGE_KEY,
              JSON.stringify(meRes.user)
            );
          }
          if (cartRes?.items) {
            setCart(
              cartRes.items
                .filter((i) => i.product)
                .map((i) => ({
                  ...normalizeServerProduct(i.product),
                  cartItemId: i._id,
                  quantity: i.quantity,
                  selectedSize: i.selectedSize,
                  selectedColor: i.selectedColor,
                }))
            );
          }
          if (wishRes?.products) {
            setWishlist(
              wishRes.products.map((p) => p.slug || p._id || p.id)
            );
          }
          if (ordRes?.orders) {
            setOrders(ordRes.orders);
          }
        } catch {
          // Token expired or backend offline
        }
      }
    }

    hydrateFromApi();
    return () => {
      active = false;
    };
  }, []);

  const signIn = async ({ email, password }) => {
    try {
      const res = await api.login({ email, password });
      setAuthToken(res.token);
      setUser(res.user);
      window.localStorage.setItem(
        SESSION_STORAGE_KEY,
        JSON.stringify(res.user)
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
      setUser(sessionUser);
      window.localStorage.setItem(
        SESSION_STORAGE_KEY,
        JSON.stringify(sessionUser)
      );
      return { ok: true, user: sessionUser };
    }
  };

  const signUp = async ({ name, email, password }) => {
    try {
      const res = await api.register({ name, email, password });
      setAuthToken(res.token);
      setUser(res.user);
      window.localStorage.setItem(
        SESSION_STORAGE_KEY,
        JSON.stringify(res.user)
      );
      return { ok: true, user: res.user };
    } catch (err) {
      if (err.status === 409 || err.status === 400) {
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
      setUser(sessionUser);
      window.localStorage.setItem(
        SESSION_STORAGE_KEY,
        JSON.stringify(sessionUser)
      );
      return { ok: true, user: sessionUser };
    }
  };

  const updateProfile = async ({ name }) => {
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
    setAuthToken(null);
    setUser(null);
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
    showToast('Signed out');
  };

  const addToCart = async (product, options = {}) => {
    const size = options.size || product.sizes?.[0] || 'M';
    const color = options.color || product.colors?.[0] || '#111111';
    const qty = options.quantity || 1;

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
    showToast(`Added ${product.name} to bag`);

    if (getAuthToken()) {
      try {
        const res = await api.addToCart({
          productId: product._id || product.id,
          quantity: qty,
          selectedSize: size,
          selectedColor: color,
        });
        if (res?.items) {
          setCart(
            res.items
              .filter((i) => i.product)
              .map((i) => ({
                ...normalizeServerProduct(i.product),
                cartItemId: i._id,
                quantity: i.quantity,
                selectedSize: i.selectedSize,
                selectedColor: i.selectedColor,
              }))
          );
        }
      } catch {
        // keep optimistic local state
      }
    }
  };

  const updateQuantity = async (index, delta) => {
    const target = cart[index];
    if (!target) return;
    const nextQty = target.quantity + delta;

    setCart((prev) =>
      prev
        .map((item, i) =>
          i === index ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );

    if (getAuthToken() && target.cartItemId) {
      try {
        if (nextQty <= 0) {
          await api.removeCartItem(target.cartItemId);
        } else {
          await api.updateCartItem(target.cartItemId, nextQty);
        }
      } catch {
        // ignore
      }
    }
  };

  const removeFromCart = async (index) => {
    const target = cart[index];
    setCart((prev) => prev.filter((_, i) => i !== index));
    if (getAuthToken() && target?.cartItemId) {
      try {
        await api.removeCartItem(target.cartItemId);
      } catch {
        // ignore
      }
    }
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = async (productId) => {
    const exists = wishlist.includes(productId);
    setWishlist((prev) =>
      exists ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
    showToast(exists ? 'Removed from wishlist' : 'Saved to wishlist');

    if (getAuthToken()) {
      try {
        if (exists) {
          await api.removeFromWishlist(productId);
        } else {
          await api.addToWishlist(productId);
        }
      } catch {
        // keep optimistic state
      }
    }
  };

  const placeOrder = async () => {
    const payloadItems = cart.map((item) => ({
      productId: item._id || item.id,
      quantity: item.quantity,
      selectedSize: item.selectedSize,
      selectedColor: item.selectedColor,
    }));

    if (getAuthToken()) {
      try {
        const res = await api.createOrder({ items: payloadItems });
        if (res?.order) {
          setOrders((prev) => [res.order, ...prev]);
          clearCart();
          return res.order;
        }
      } catch {
        // fallback below
      }
    }

    const fallbackOrder = {
      id: `ORD-${Date.now()}`,
      items: cart,
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
    user,
    signIn,
    signUp,
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
