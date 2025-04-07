import { Schema, model, models } from 'mongoose';

const ProductSchema = new Schema({
    id: { type: String, required: false },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    weight: { type: Number, required: true },
    disabled: { type: Boolean, default: false }, // New field to track disabled status
    createdAt: { type: Date, default: Date.now },
});

const Product = models.Product || model('Product', ProductSchema);

export default Product;