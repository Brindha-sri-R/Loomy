import mongoose from 'mongoose';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

async function resolveProduct(productId) {
  const query = mongoose.Types.ObjectId.isValid(productId)
    ? { _id: productId }
    : { slug: productId };
  return Product.findOne(query);
}

export async function getCart(req, res, next) {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      'items.product'
    );
    return res.json({ items: cart?.items || [] });
  } catch (err) {
    next(err);
  }
}

export async function addToCart(req, res, next) {
  try {
    const {
      productId,
      quantity = 1,
      selectedSize = 'M',
      selectedColor = '#111111',
    } = req.body;

    const product = await resolveProduct(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const existing = cart.items.find(
      (i) =>
        i.product.equals(product._id) &&
        i.selectedSize === selectedSize &&
        i.selectedColor === selectedColor
    );

    if (existing) {
      existing.quantity += Number(quantity);
    } else {
      cart.items.push({
        product: product._id,
        quantity: Number(quantity),
        selectedSize,
        selectedColor,
      });
    }

    await cart.save();
    await cart.populate('items.product');
    return res.status(201).json({ items: cart.items });
  } catch (err) {
    next(err);
  }
}

export async function updateCartItem(req, res, next) {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.id(itemId);
    if (!item) return res.status(404).json({ message: 'Cart item not found' });

    item.quantity = Number(quantity);
    await cart.save();
    await cart.populate('items.product');
    return res.json({ items: cart.items });
  } catch (err) {
    next(err);
  }
}

export async function removeCartItem(req, res, next) {
  try {
    const { itemId } = req.params;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter((i) => i._id.toString() !== itemId);
    await cart.save();
    await cart.populate('items.product');
    return res.json({ items: cart.items });
  } catch (err) {
    next(err);
  }
}
