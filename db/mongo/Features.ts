import { Schema ,model } from 'mongoose';

export const FeaturesSchema: Schema = new Schema({
  id: {type: Number, required: true},
  product_id: {type: String, required: true},
  feature: {type: String, required: true},
  value: {type: String}
})

export const Features = model<typeof FeaturesSchema>('Features', FeaturesSchema);