import { Schema ,model } from 'mongoose';

export const SkuSchema: Schema = new Schema({
  id: {type: Number, required: true},
  styleId: {type: Number, required: true},
  size: {type: String, required: true},
  quantity: {type: Number, default: 0}
});

export const Sku = model<typeof SkuSchema>('Sku', SkuSchema);