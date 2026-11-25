import mongoose from 'mongoose';
import Cart from '../models/Cart.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

export async function createOrder(req, res, next) {
  try {
    const { items: requestedItems, shippingAddress = {} } = req.body;

    let sourceItems = requestedItems;
    if (!sourceItems || sourceItems.length === 0) {
      const cart = await Cart.findOne({ user: req.user._id });
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ message: 'Your bag is empty' });
      }
      sourceItems = cart.items.map((i) => ({
        productId: i.product.toString(),
        quantity: i.quantity,
        selectedSize: i.selectedSize,
        selectedColor: i.selectedColor,
      }));
    }

    // Recompute prices and totals strictly from MongoDB Product documents
    const verifiedItems = [];
    let totalAmount = 0;

    for (const entry of sourceItems) {
      const id = entry.productId || entry.id;
      const query = mongoose.Types.ObjectId.isValid(id)
        ? { _id: id }
        : { slug: id };
      const product = await Product.findOne(query);
      if (!product) {
        return res
          .status(404)
          .json({ message: `Product not found: ${id}` });
      }
      const qty = Math.max(1, Math.min(50, Number(entry.quantity || 1)));
      const lineTotal = Number((product.price * qty).toFixed(2));
      totalAmount += lineTotal;

      verifiedItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: qty,
        selectedSize: entry.selectedSize || 'M',
        selectedColor: entry.selectedColor || '#111111',
        image: product.image,
      });
    }

    const order = await Order.create({
      user: req.user._id,
      items: verifiedItems,
      totalAmount: Number(totalAmount.toFixed(2)),
      shippingAddress,
      status: 'Confirmed',
    });

    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    return res.status(201).json({ order });
  } catch (err) {
    next(err);
  }
}

export async function getOrders(req, res, next) {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    return res.json({ orders });
  } catch (err) {
    next(err);
  }
}

export async function getOrderById(req, res, next) {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    return res.json({ order });
  } catch (err) {
    next(err);
  }
}
