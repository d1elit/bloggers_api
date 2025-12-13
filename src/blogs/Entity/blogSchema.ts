import { HydratedDocument, model, Model } from 'mongoose';
import { Blog } from '../types/blog';
import mongoose from 'mongoose';
import { BlogInput } from '../router/input/blog.input';

type BlogModel = Model<Blog>;

export type BlogDocument = HydratedDocument<Blog>;

// export type BlogDBMethodsType = {
//   create: (dto: BlogInput) => void;
// };

export type BlogModelType = Model<BlogEntity>;

// export const BlogSchema = new mongoose.Schema<
//   Blog,
//   BlogModelType,
//   BlogDBMethodsType
// >({
//   name: { type: String, required: true },
//   description: { type: String, required: true },
//   websiteUrl: { type: String, required: true },
//   createdAt: { type: String, default: '', required: true },
//   isMembership: { type: Boolean, default: false, required: true },
// });

// BlogSchema.method('create', function create(dto: BlogInput) {
//   // const blog = new BlogModel();
//   const that = this as Blog;
//   that.name = dto.name;
//   that.description = dto.description;
//   that.websiteUrl = dto.websiteUrl;
//   that.createdAt = new Date().toISOString();
//   that.isMembership = false;
// });

export const BlogSchema = new mongoose.Schema<BlogEntity>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  websiteUrl: { type: String, required: true },
  createdAt: { type: String, required: true },
  isMembership: { type: Boolean, required: true },
});

export class BlogEntity {
  name!: string;
  description!: string;
  websiteUrl!: string;
  createdAt!: string;
  isMembership!: boolean;

  create(dto: BlogInput) {
    this.name = dto.name;
    this.description = dto.description;
    this.websiteUrl = dto.websiteUrl;
    this.createdAt = new Date().toISOString();
    this.isMembership = true;
  }
}

BlogSchema.loadClass(BlogEntity);

export const BlogModel = model<Blog, BlogModelType>('blogs', BlogSchema);
