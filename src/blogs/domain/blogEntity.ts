import { HydratedDocument, model, Model, Schema } from 'mongoose';
import { BlogInput } from '../router/dto/input/blog.input';

export const BlogSchema = new Schema<BlogEntity>({
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

  static createNew(dto: BlogInput): BlogEntity {
    const blog = new BlogEntity();
    blog.name = dto.name;
    blog.description = dto.description;
    blog.websiteUrl = dto.websiteUrl;
    blog.createdAt = new Date().toISOString();
    blog.isMembership = false; // по умолчанию false
    return blog;
  }

  update(dto: BlogInput): void {
    this.name = dto.name;
    this.description = dto.description;
    this.websiteUrl = dto.websiteUrl;
  }
}

export type BlogDocument = HydratedDocument<BlogEntity>;
export type BlogModelType = Model<BlogEntity>;

BlogSchema.loadClass(BlogEntity);
export const BlogModel = model<BlogEntity, BlogModelType>('blogs', BlogSchema);
