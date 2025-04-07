import { Schema, model, models } from 'mongoose';

const OrderSchema = new Schema(
    {
        customerName: { type: String, required: true },
        products: [
            {
                id: { type: String, required: true },
                name: { type: String, required: true },
                price: { type: Number, required: true },
                weight: { type: Number, required: true },
                quantity: { type: Number, required: true },
            },
        ],
        subTotal: { type: Number, required: true },
        totalDiscount: { type: Number, required: true },
        grandTotal: { type: Number, required: true },
        createdAt: { type: Date, default: Date.now },
    },
    { collection: 'orders' }
);

const Order = models.Order || model('Order', OrderSchema);

export default Order;