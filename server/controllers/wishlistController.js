import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Wishlist from '../models/Wishlist.js';

async function resolveProduct(productId) {
  const query = mongoose.Types.ObjectId.isValid(productId)
    ? { _id: productId }
    : { slug: productId };
  return Product.findOne(query);
}

export async function getWishlist(req, res, next) {
  try {
    const doc = await Wishlist.findOne({ user: req.user._id }).populate(
      'products'
    );
    return res.json({ products: doc?.products || [] });
  } catch (err) {
    next(err);
  }
}

export async function addToWishlist(req, res, next) {
  try {
    const product = await resolveProduct(req.body.productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let doc = await Wishlist.findOne({ user: req.user._id });
    if (!doc) {
      doc = new Wishlist({ user: req.user._id, products: [] });
    }

    if (!doc.products.some((p) => p.equals(product._id))) {
      doc.products.push(product._id);
      await doc.save();
    }
    await doc.populate('products');
    return res.status(201).json({ products: doc.products });
  } catch (err) {
    next(err);
  }
}

export async function removeFromWishlist(req, res, next) {
  try {
    const product = await resolveProduct(req.params.productId);
    const doc = await Wishlist.findOne({ user: req.user._id });
    if (!doc) return res.json({ products: [] });

    if (product) {
      doc.products = doc.products.filter((p) => !p.equals(product._id));
      await doc.save();
    }
    await doc.populate('products');
    return res.json({ products: doc.products });
  } catch (err) {
    next(err);
  }
}
