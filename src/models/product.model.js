import mongoose from 'mongoose';
import paginate from 'mongoose-paginate-v2';

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    code: { type: String, required: true, unique: true },
    price: { type: Number, required: true, min: 0 },
    status: { type: Boolean, default: true },   // disponibilidad
    stock: { type: Number, default: 0, min: 0 },
    category: { type: String, index: true },
    thumbnails: { type: [String], default: [] }
  },
  { timestamps: true }
);

productSchema.plugin(paginate);

export default mongoose.model('Product', productSchema);
