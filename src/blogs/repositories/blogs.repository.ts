import { RepositoryNotFoundError } from '../../core/errors/domain.errors';
import { injectable } from 'inversify';
import { BlogDocument, BlogModel } from '../Schemas/blog.schema';

@injectable()
export class BlogsRepository {
  async save(newBlog: BlogDocument): Promise<string> {
    const createdUser = await newBlog.save();
    return createdUser._id.toString();
  }

  async delete(blog: BlogDocument): Promise<void> {
    await blog.deleteOne().exec();
    return;
  }

  async update(blog: BlogDocument): Promise<void> {
    await blog.save();
    return;
  }

  async findByIdOrError(id: string): Promise<BlogDocument> {
    const res = await BlogModel.findById(id);
    if (!res) {
      throw new RepositoryNotFoundError('blog not exist');
    }
    return res;
  }
  async find(id: string): Promise<BlogDocument | null> {
    return BlogModel.findById(id);
  }
}
