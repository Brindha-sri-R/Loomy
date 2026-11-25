import mongoose from 'mongoose';
import Product from '../models/Product.js';

export async function getProducts(req, res, next) {
  try {
    const {
      category,
      gender,
      sort = 'featured',
      page = 1,
      limit = 24,
      trending,
      newDrop,
      bestSeller,
    } = req.query;

    const filter = {};
    if (category && category !== 'All Items') {
      if (category === 'New Arrivals') {
        filter.isNewDrop = true;
      } else if (category === 'Best Sellers') {
        filter.bestSeller = true;
      } else {
        filter.$or = [{ category }, { subCategory: category }];
      }
    }
    if (gender && gender !== 'All') {
      filter.gender = { $in: [gender, 'Unisex'] };
    }
    if (trending === 'true') filter.trending = true;
    if (newDrop === 'true') filter.isNewDrop = true;
    if (bestSeller === 'true') filter.bestSeller = true;

    let sortObj = { createdAt: -1 };
    if (sort === 'price-asc') sortObj = { price: 1 };
    else if (sort === 'price-desc') sortObj = { price: -1 };
    else if (sort === 'rating') sortObj = { rating: -1 };

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Math.max(1, Number(limit)));

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort(sortObj)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Product.countDocuments(filter),
    ]);

    return res.json({
      products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function searchProducts(req, res, next) {
  try {
    const q = String(req.query.q || '').trim();
    if (!q) {
      const products = await Product.find({}).limit(8);
      return res.json({ products });
    }
    const regex = new RegExp(q, 'i');
    const products = await Product.find({
      $or: [{ name: regex }, { category: regex }, { description: regex }],
    }).limit(20);
    return res.json({ products });
  } catch (err) {
    next(err);
  }
}

export async function getProductById(req, res, next) {
  try {
    const { id } = req.params;
    const query = mongoose.Types.ObjectId.isValid(id)
      ? { _id: id }
      : { slug: id };
    const product = await Product.findOne(query);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.json({ product });
  } catch (err) {
    next(err);
  }
}
