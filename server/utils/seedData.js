import Category from '../models/Category.js';
import Product from '../models/Product.js';
import { CATEGORIES_LIST, PRODUCTS } from '../../src/data/products.js';

export async function seedDatabaseIfEmpty() {
  const catCount = await Category.countDocuments();
  if (catCount === 0) {
    await Category.insertMany(
      CATEGORIES_LIST.map((c) => ({
        name: c.name,
        slug: c.slug,
        count: c.count,
      }))
    );
  }

  const prodCount = await Product.countDocuments();
  if (prodCount === 0) {
    await Product.insertMany(
      PRODUCTS.map((p) => ({
        slug: p.id,
        name: p.name,
        category: p.category,
        subCategory: p.subCategory,
        gender: p.gender || 'Unisex',
        price: p.price,
        originalPrice: p.originalPrice,
        discount: p.discount,
        rating: p.rating,
        reviews: p.reviews,
        badge: p.badge,
        trending: Boolean(p.trending),
        isNewDrop: Boolean(p.isNewDrop),
        bestSeller: Boolean(p.bestSeller),
        colors: p.colors || [],
        sizes: p.sizes || [],
        image: p.image,
        hoverImage: p.hoverImage,
        gallery: p.gallery || [p.image],
        description: p.description,
      }))
    );
  }
}
