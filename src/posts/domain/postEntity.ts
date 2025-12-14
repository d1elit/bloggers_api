import { HydratedDocument, model, Model } from 'mongoose';
import mongoose from 'mongoose';
import { PostInput } from '../router/dto/input/post.input';
import { BlogDocument } from '../../blogs/domain/blogEntity';

export type NewestLike = {
  addedAt: string;
  userId: string;
  login: string;
};

export type ExtendedLikesInfo = {
  likesCount: number;
  dislikesCount: number;
  myStatus: string;
  newestLikes: NewestLike[] | undefined;
};

const NewestLikeSchema = new mongoose.Schema<NewestLike>(
  {
    addedAt: { type: String, required: true },
    userId: { type: String, required: true },
    login: { type: String, required: true },
  },
  { _id: false }, // <-- важно, чтобы не создавался _id
);

const ExtendedLikesInfoSchema = new mongoose.Schema<ExtendedLikesInfo>(
  {
    likesCount: { type: Number, default: 0 },
    dislikesCount: { type: Number, default: 0 },
    myStatus: { type: String, default: 'None' },
    newestLikes: {
      type: [NewestLikeSchema],
      default: [],
    },
  },
  { _id: false },
);

export const PostSchema = new mongoose.Schema<PostEntity>({
  title: { type: String, required: true },
  shortDescription: { type: String, required: true },
  content: { type: String, required: true },
  blogId: { type: String, required: true },
  blogName: { type: String, required: true },
  createdAt: { type: String, required: true },
  extendedLikesInfo: {
    type: ExtendedLikesInfoSchema,
    default: () => ({}), // <-- важно, иначе будет undefined
  },
});

export class PostEntity {
  title!: string;
  shortDescription!: string;
  content!: string;
  blogId!: string;
  blogName!: string;
  createdAt!: string;
  extendedLikesInfo!: ExtendedLikesInfo;

  static createNew(dto: PostInput, blog: BlogDocument) {
    const post = new PostEntity();
    post.title = dto.title;
    post.shortDescription = dto.shortDescription;
    post.content = dto.content;
    post.blogId = blog._id.toString();
    post.blogName = blog.name;
    post.createdAt = new Date().toISOString();
    post.extendedLikesInfo = {
      likesCount: 0,
      dislikesCount: 0,
      myStatus: 'None',
      newestLikes: [],
    };
    return post;
  }
  update(dto: PostInput): void {
    this.title = dto.title;
    this.shortDescription = dto.shortDescription;
    this.content = dto.content;
    // blogId НЕ обновляем - это бизнес-правило
  }
  updateLikeCount(newStatus: string, oldStatus?: string): void {
    if (oldStatus === 'Like') this.extendedLikesInfo.likesCount -= 1;
    if (oldStatus === 'Dislike') this.extendedLikesInfo.dislikesCount -= 1;

    if (newStatus === 'Like') this.extendedLikesInfo.likesCount += 1;
    if (newStatus === 'Dislike') this.extendedLikesInfo.dislikesCount += 1;
  }

  updateNewestLikes(likes: NewestLike[]): void {
    this.extendedLikesInfo.newestLikes = likes;
  }
}

type PostModel = Model<PostEntity>;

export type PostDocument = HydratedDocument<PostEntity>;
PostSchema.loadClass(PostEntity);

export const PostModel = model<PostEntity, PostModel>('posts', PostSchema);
