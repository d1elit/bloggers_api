import { Post } from '../types/post';
import { PostInput } from '../router/input/post.input';
import { RepositoryNotFoundError } from '../../core/errors/domain.errors';
import 'reflect-metadata';
import { injectable } from 'inversify';
import { PostDocument, PostModel } from '../Schemas/post.schema';

@injectable()
export class PostsRepository {
  async create(newPost: Post): Promise<PostDocument> {
    return PostModel.create(newPost);
  }

  async delete(id: string): Promise<void> {
    await PostModel.deleteOne({ _id: id });
    return;
  }

  async update(id: string, dto: PostInput): Promise<void> {
    await PostModel.updateOne({ _id: id }, { $set: dto });
    return;
  }

  async findByIdOrError(id: string): Promise<PostDocument> {
    const res = await PostModel.findById(id);
    if (!res) {
      throw new RepositoryNotFoundError('Post not found');
    }
    return res;
  }
  async save(post: PostDocument) {
    await post.save();
    return;
  }
}
