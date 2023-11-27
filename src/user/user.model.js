import mongoose from 'mongoose';

const userSchema = mongoose.Schema(
  {
    email: { type: String, required: [true, 'Insert an email.'] },
    name: { type: String, required: [true, 'Insert a name.'] },
    password: { type: String, required: [true, 'Insert a password.'] },
    phone: { type: String, required: [true, 'Insert a phone number.'] },
    addresses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'address' }],
    role: { type: String, enum: ['client', 'deliveryMan', 'admin'], default: 'client' },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('user', userSchema);
