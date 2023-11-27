import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name your product.'] },
    description: { type: String, required: [true, 'Describe your product.'] },
    category: { type: String, required: [true, 'Name your category.'] },
    price: { type: Number, required: [true, 'Set a price.'] },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);
