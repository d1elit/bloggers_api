import {Blog} from "../types/blog";
import {ObjectId, WithId} from "mongodb";
import {blogsCollection} from "../../db/mongo.db";
import {RepositoryNotFoundError} from "../../core/errors/repostory-not-found.error";
import {BlogQueryInput} from "../router/input/blog-query.input";


export const blogsQueryRepository = {
    async findAll(
        queryDto: BlogQueryInput,
    ): Promise<{ items: WithId<Blog>[]; totalCount: number }> {
        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            searchNameTerm,
            searchDescriptionTerm,
        } = queryDto;
        const skip = (+pageNumber - 1) * +pageSize;
        const filter: any = {};
        if (searchNameTerm) {
            filter.name = { $regex: searchNameTerm, $options: 'i' };
        }
        if (searchDescriptionTerm) {
            filter.description = { $regex: searchDescriptionTerm, $options: 'i' };
        }

        const items = await blogsCollection
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(+pageSize)
            .toArray();

        const totalCount = await blogsCollection.countDocuments(filter);

        return { items, totalCount };

    },
    async findByIdOrError(id: string): Promise<WithId<Blog>> {
        const res = await blogsCollection.findOne({ _id: new ObjectId(id) });
        if (!res) {
            throw new RepositoryNotFoundError('blog not exist');
        }
        return res;
    },
}