import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, index: true },
    subCategory: { type: String },
    gender: { type: String, enum: ['Men', 'Women', 'Unisex'], default: 'Unisex' },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, default: null },
    discount: { type: String, default: null },
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    reviews: { type: Number, default: 0 },
    badge: { type: String, default: '' },
    trending: { type: Boolean, default: false },
    isNewDrop: { type: Boolean, default: false },
    bestSeller: { type: Boolean, default: false },
    colors: [{ type: String }],
    sizes: [{ type: String }],
    image: { type: String, required: true },
    hoverImage: { type: String },
    gallery: [{ type: String }],
    description: { type: String, required: true },
    stock: { type: Number, default: 50, min: 0 },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', category: 'text', description: 'text' });

export default mongoose.model('Product', productSchema);
