import { Schema ,model } from 'mongoose';

export const PhotoSchema: Schema = new Schema({
  id: {type: Number, required: true},
  styleId: {type: Number, required: true},
  url: {type: String, default: null},
  thumbnail_url: {type: String, default: null},
});

export const Photos = model<typeof PhotoSchema>('Photos', PhotoSchema);