import { Schema, model } from "mongoose";

export const SkuSchema: Schema = new Schema({
  styleId: { type: Number, required: true },
  id: { type: Number, required: true },
  size: { type: String, required: true },
  quantity: { type: Number, default: 0 },
});

export const Sku = model<typeof SkuSchema>("Sku", SkuSchema);
