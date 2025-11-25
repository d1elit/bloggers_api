import { HydratedDocument, model, Model } from 'mongoose';
import { Blog } from '../types/blog';
import mongoose from 'mongoose';

type BlogModel = Model<Blog>;

export type BlogDocument = HydratedDocument<Blog>;

export const BlogSchema = new mongoose.Schema<Blog>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  websiteUrl: { type: String, required: true },
  createdAt: { type: String, default: '', required: true },
  isMembership: { type: Boolean, default: false, required: true },
});

export const BlogModel = model<Blog, BlogModel>('blogs', BlogSchema);
