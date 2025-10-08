import {PaginationAndSorting} from "../../../core/types/pagination-and-sorting";
import {PostsSortFields} from "../../types/postsSortFields";

export type PostQueryInput = PaginationAndSorting<PostsSortFields> & Partial<
    {
        title: string;
        shortDescription: string;
        content: string;
        blogName: string;
        createdAt: string;
        blogId?: string;
    }>;