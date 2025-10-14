import {PostQueryInput} from "../router/input/post-query.input";
import {ObjectId, WithId} from "mongodb";
import {Post} from "../types/post";
import {postsCollection} from "../../db/mongo.db";
import {RepositoryNotFoundError} from "../../core/errors/repostory-not-found.error";

export const postsQueryRepository = {
    async findAll(
        queryDto: PostQueryInput,
    ): Promise<{ items: WithId<Post>[]; totalCount: number }> {
        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            title,
            shortDescription,
            content,
            blogName,
            blogId,
        } = queryDto;
        const skip = (+pageNumber - 1) * +pageSize;
        const filter: any = {};
        if (title) {
            filter.title = { $regex: title, $options: 'i' };
        }
        if (shortDescription) {
            filter.shortDescription = { $regex: shortDescription, $options: 'i' };
        }
        if (content) {
            filter.content = { $regex: content, $options: 'i' };
        }
        if (blogName) {
            filter.blogName = { $regex: blogName, $options: 'i' };
        }
        if (blogId) {
            filter.blogId = { $regex: blogId, $options: 'i' };
        }

        const items = await postsCollection
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(+pageSize)
            .toArray();

        const totalCount = await postsCollection.countDocuments(filter);

        return { items, totalCount };
    },
    async findByIdOrError(id: string): Promise<WithId<Post>> {
        const res = await postsCollection.findOne({ _id: new ObjectId(id) });
        if (!res) {
            throw new RepositoryNotFoundError('Post not found');
        }
        return res;
    },
}