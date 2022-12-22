import { Schema ,model } from 'mongoose';

export const StyleSchema = new Schema({
  id: {type: String, required: true},
  productId: {type: String, required: true, index: true},
  name: {type: String, required: true},
  sale_price: {type: String, default: null},
  original_price: {type: String, required: true},
  default_style: {type: Boolean, required: true},
  skus: {type: Object},
  photos: {type: Array<object>}
})

export const Style = model<typeof StyleSchema>('Style', StyleSchema)