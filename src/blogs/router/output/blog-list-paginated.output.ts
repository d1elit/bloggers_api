import {BlogOutput} from "./blog.output";
import {PaginatedOutput} from "../../../core/types/paginated.output";

export type BlogListPaginatedOutput = {
    meta:PaginatedOutput;
    items: BlogOutput[];
}