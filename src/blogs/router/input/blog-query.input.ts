import {blogsSortFields} from "../../types/blogsSortFields";
import {PaginationAndSorting} from "../../../core/types/pagination-and-sorting";

export type BlogQueryInput = PaginationAndSorting<blogsSortFields> & Partial<
    {
        createdAt: string;
        name: string;
        description: string;
        websiteUri: string;
    }>;