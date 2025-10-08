import {  Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { postsService } from '../../application/posts.service';
import { errorsHandler } from '../../../core/errors/errors.handler';
import {setDefaultSortAndPaginationIfNotExist} from "../../../core/helpers/set-default-query-params";
import {mapToPostListPaginated} from "../mappers/map-to-post-list-paginated";
import {PostQueryInput} from "../input/post-query.input";
import {postListPaginatedOutput} from "../output/post-list-paginated.output";
import {RequestWithQuery} from "../../../core/types/requestTypes";

export async function getPostListHandler(
  req: RequestWithQuery<PostQueryInput>,
  res: Response<postListPaginatedOutput>,
) {
  try {
    const queryInput = setDefaultSortAndPaginationIfNotExist(req.query)
  console.log(queryInput);
    const {items, totalCount} = await postsService.findAll(queryInput);

    console.log(items);
    const postOutput = mapToPostListPaginated(items, {
      pageNumber: queryInput.pageNumber,
      pageSize: queryInput.pageSize,
      totalCount
    })


    res.status(HttpStatus.Ok).send(postOutput);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
