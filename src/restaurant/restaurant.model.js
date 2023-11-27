import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name your restaurant.'] },
    description: { type: String, required: [true, 'Describe your restaurant.'] },
    category: { type: String, required: [true, 'Name your category.'] },
    address: { type: mongoose.Schema.Types.ObjectId, ref: 'address' },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Restaurant', restaurantSchema);
