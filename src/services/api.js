const API_BASE =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

const TOKEN_KEY = 'loomy_jwt_token';

export function getAuthToken() {
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAuthToken(token) {
  try {
    if (token) {
      window.localStorage.setItem(TOKEN_KEY, token);
    } else {
      window.localStorage.removeItem(TOKEN_KEY);
    }
  } catch {
    // ignore storage errors
  }
}

async function request(path, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || 'Request failed');
    err.status = res.status;
    err.field = data.field;
    throw err;
  }
  return data;
}

export const api = {
  // Auth
  register: (payload) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  googleLogin: (credential) =>
    request('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ credential }),
    }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  getMe: () => request('/auth/me'),
  updateProfile: (payload) =>
    request('/auth/profile', { method: 'PUT', body: JSON.stringify(payload) }),

  // Catalog & Reviews
  getProducts: (params = '') => request(`/products${params}`),
  getProduct: (id) => request(`/products/${id}`),
  searchProducts: (q) =>
    request(`/products/search?q=${encodeURIComponent(q)}`),
  getCategories: () => request('/categories'),
  getProductReviews: (id) => request(`/products/${id}/reviews`),
  createProductReview: (id, payload) =>
    request(`/products/${id}/reviews`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Cart
  getCart: () => request('/cart'),
  addToCart: (payload) =>
    request('/cart', { method: 'POST', body: JSON.stringify(payload) }),
  updateCartItem: (itemId, quantity) =>
    request(`/cart/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    }),
  removeCartItem: (itemId) =>
    request(`/cart/${itemId}`, { method: 'DELETE' }),

  // Wishlist
  getWishlist: () => request('/wishlist'),
  addToWishlist: (productId) =>
    request('/wishlist', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    }),
  removeFromWishlist: (productId) =>
    request(`/wishlist/${productId}`, { method: 'DELETE' }),

  // Orders
  createOrder: (payload) =>
    request('/orders', { method: 'POST', body: JSON.stringify(payload) }),
  getOrders: () => request('/orders'),
  cancelOrder: (id) =>
    request(`/orders/${id}/cancel`, { method: 'PATCH' }),

  // Newsletter
  subscribeNewsletter: (email) =>
    request('/newsletter', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
};