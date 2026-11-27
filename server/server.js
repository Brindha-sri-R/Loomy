import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { connectDB } from './config/db.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import newsletterRoutes from './routes/newsletterRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import productRoutes from './routes/productRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import { seedDatabaseIfEmpty } from './utils/seedData.js';

dotenv.config();

const REQUIRED_ENV_VARS = ['MONGODB_URI', 'JWT_SECRET'];
const missingEnvVars = REQUIRED_ENV_VARS.filter(
  (key) => !process.env[key] || !String(process.env[key]).trim()
);
if (missingEnvVars.length > 0) {
  console.error(
    `Missing required environment variable(s): ${missingEnvVars.join(', ')}`
  );
  process.exit(1);
}

const app = express();

const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'loomy-api' });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/newsletter', newsletterRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

async function startServer() {
  const connected = await connectDB();
  if (connected) {
    await seedDatabaseIfEmpty();
  }
  app.listen(PORT, () => {
    console.log(`LOOMY server running on port ${PORT}`);
  });
}

startServer();
