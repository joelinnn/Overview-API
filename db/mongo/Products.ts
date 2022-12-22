import { Schema ,model } from 'mongoose';

export const ProductsSchema: Schema = new Schema({
  id: {type: String, required: true, index: true},
  name: {type : String, required: true},
  slogan: {type: String},
  description: {type: String},
  category: {type: String},
  default_price: {type: String, required: true},
  features: {type: Array<object>},
});

export const Product = model<typeof ProductsSchema>('Product', ProductsSchema);