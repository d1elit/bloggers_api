import { RepositoryNotFoundError } from '../../../core/errors/domain.errors';
import { injectable } from 'inversify';
import { BlogDocument, BlogEntity, BlogModel } from '../../domain/blogEntity';

@injectable()
export class BlogsRepository {
  async save(blogEntity: BlogEntity): Promise<string> {
    const blogDocument = new BlogModel(blogEntity);
    const createdBlog = await blogDocument.save();
    return createdBlog._id.toString();
  }

  async delete(blog: BlogDocument): Promise<void> {
    await blog.deleteOne();
  }

  async update(blog: BlogDocument): Promise<void> {
    await blog.save();
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
