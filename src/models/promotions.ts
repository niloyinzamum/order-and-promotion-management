import { Schema, model, models } from 'mongoose';

const SlabSchema = new Schema({
    minWeight: { type: Number, required: true },
    maxWeight: { type: Number, required: true },
    discount: { type: Number, required: true },
});

const PromotionSchema = new Schema({
    title: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    enabled: { type: Boolean, default: true },
    discountType: { type: String, enum: ['percentage', 'fixed', 'weighted'], required: true },
    slabs: [SlabSchema], // Array of slabs for weighted discounts
});

const Promotion = models.Promotion || model('Promotion', PromotionSchema);

export default Promotion;