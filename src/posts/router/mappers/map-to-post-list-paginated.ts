import {WithId} from "mongodb";
import {Post} from "../../types/post";
import {postListPaginatedOutput} from "../output/post-list-paginated.output";
import {PostOutput} from "../output/post.output";


export function mapToPostListPaginated(
    posts: WithId<Post>[],
    meta: { pageNumber: number; pageSize: number; totalCount: number }) :postListPaginatedOutput {
    return {
        pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
        page: +meta.pageNumber,
        pageSize: +meta.pageSize,
        totalCount: meta.totalCount,
        items: posts.map(
            (post): PostOutput => ({
                id: post._id.toString(),
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post. blogId,
                blogName: post.blogName,
                createdAt: post.createdAt,
            })
        )
    }

}