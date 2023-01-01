import { Schema, model } from "mongoose";

export const StyleSchema = new Schema({
  productId: { type: String, required: true },
  id: { type: Number, required: true },
  name: { type: String, required: true },
  sale_price: { type: String, default: null },
  original_price: { type: String, required: true },
  default_style: { type: Boolean, required: true },
  photos: { type: Array<object> },
  skus: { type: Object },
});

export const Style = model<typeof StyleSchema>("Style", StyleSchema);
