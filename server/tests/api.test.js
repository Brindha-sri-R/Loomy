import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SERVER_DIR = path.resolve(__dirname, '..');
const PORT = 5098;
const BASE = `http://127.0.0.1:${PORT}/api`;

const results = [];
function record(name, passed, detail = '') {
  results.push({ name, passed, detail });
  console.log(`[${passed ? 'PASS' : 'FAIL'}] ${name}${detail ? ` — ${detail}` : ''}`);
}

async function req(p, options = {}) {
  const res = await fetch(`${BASE}${p}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const text = await res.text();
  let data = {};
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }
  return { status: res.status, data };
}

async function waitForServer(proc, logs) {
  const deadline = Date.now() + 15000;
  while (Date.now() < deadline) {
    if (proc.exitCode !== null) {
      throw new Error(`Server exited early (${proc.exitCode}): ${logs.join('')}`);
    }
    try {
      const r = await fetch(`${BASE}/health`);
      if (r.ok) return;
    } catch {
      // retry
    }
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error(`Server timed out. Logs:\n${logs.join('')}`);
}

async function main() {
  const logs = [];
  const serverProc = spawn('node', ['server.js'], {
    cwd: SERVER_DIR,
    env: { ...process.env, PORT: String(PORT) },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  serverProc.stdout.on('data', (d) => logs.push(d.toString()));
  serverProc.stderr.on('data', (d) => logs.push(d.toString()));

  const ts = Date.now();
  const emailA = `test.a.${ts}@loomy.test`;
  const emailB = `test.b.${ts}@loomy.test`;

  try {
    await waitForServer(serverProc, logs);
    const allLogs = logs.join('');

    record('MongoDB connection', allLogs.includes('MongoDB connected:'));
    const health = await req('/health');
    record('Health endpoint', health.status === 200 && health.data.status === 'ok');

    // Auth
    const regA = await req('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test User A', email: emailA, password: 'Password123!' }),
    });
    const tokenA = regA.data.token || '';
    record('Register User A', regA.status === 201 && Boolean(tokenA));

    const dup = await req('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test User A', email: emailA, password: 'Password123!' }),
    });
    record('Duplicate email rejected', dup.status === 409);

    const loginA = await req('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: emailA, password: 'Password123!' }),
    });
    record('Login User A', loginA.status === 200 && Boolean(loginA.data.token));

    const badGoogle = await req('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ credential: 'invalid.token' }),
    });
    record('Google token rejected when invalid/unconfigured', badGoogle.status === 401 || badGoogle.status === 503);

    // Products & Reviews
    const prodRes = await req('/products');
    const firstId = prodRes.data.products?.[0]?._id;
    record('Product listing', prodRes.status === 200 && Boolean(firstId));

    const authA = { Authorization: `Bearer ${tokenA}` };
    const revRes = await req(`/products/${firstId}/reviews`, {
      method: 'POST',
      headers: authA,
      body: JSON.stringify({ rating: 5, comment: 'Sharp tailoring and great fabric.' }),
    });
    const getRevRes = await req(`/products/${firstId}/reviews`);
    record(
      'Product review creation & fetch',
      revRes.status === 201 && getRevRes.status === 200 && getRevRes.data.reviews?.length >= 1
    );

    // Cart, Wishlist & Isolation
    const addCart = await req('/cart', {
      method: 'POST',
      headers: authA,
      body: JSON.stringify({ productId: firstId, quantity: 2, selectedSize: 'M' }),
    });
    const addWish = await req('/wishlist', {
      method: 'POST',
      headers: authA,
      body: JSON.stringify({ productId: firstId }),
    });
    record('Cart & Wishlist persistence', addCart.status === 201 && addWish.status === 201);

    const regB = await req('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test User B', email: emailB, password: 'Password123!' }),
    });
    const authB = { Authorization: `Bearer ${regB.data.token}` };
    const cartB = await req('/cart', { headers: authB });
    const wishB = await req('/wishlist', { headers: authB });
    record(
      'Cross-user cart/wishlist isolation',
      (cartB.data.items?.length ?? 0) === 0 && (wishB.data.products?.length ?? 0) === 0
    );

    // Order creation with shipping address + cancellation
    const ordRes = await req('/orders', {
      method: 'POST',
      headers: authA,
      body: JSON.stringify({
        shippingAddress: {
          fullName: 'Test User A',
          address: '42 Mercer Street',
          city: 'New York',
          postalCode: '10013',
        },
      }),
    });
    const orderId = ordRes.data.order?._id;
    const cancelRes = await req(`/orders/${orderId}/cancel`, {
      method: 'PATCH',
      headers: authA,
    });
    record(
      'Order creation with shipping & cancellation',
      ordRes.status === 201 &&
        ordRes.data.order?.shippingAddress?.city === 'New York' &&
        cancelRes.status === 200 &&
        cancelRes.data.order?.status === 'Cancelled'
    );

    // Newsletter
    const newsRes = await req('/newsletter', {
      method: 'POST',
      body: JSON.stringify({ email: `news.${ts}@loomy.test` }),
    });
    record('Newsletter persistence', newsRes.status === 201);

    const passed = results.filter((r) => r.passed).length;
    const failed = results.filter((r) => !r.passed).length;
    console.log(`\nSUMMARY: ${passed} passed, ${failed} failed out of ${results.length} checks.`);
    if (failed > 0) process.exitCode = 1;
  } finally {
    serverProc.kill('SIGTERM');
  }
}

main().catch((err) => {
  console.error('FATAL:', err);
  process.exit(1);
});
