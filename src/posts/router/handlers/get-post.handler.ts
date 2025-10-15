import { RequestWithParams } from '../../../core/types/requestTypes';
import { Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { PostOutput } from '../output/post.output';
import { ErroreType } from '../../../blogs/types/validationError';
import { mapToPostViewModel } from '../mappers/map-to-post-view-model';
import { errorsHandler } from '../../../core/errors/errors.handler';
import {postsQueryRepository} from "../../repositories/posts.query-repository";

export async function getPostHandler(
  req: RequestWithParams<{ id: string }>,
  res: Response<PostOutput | ErroreType>,
): Promise<void> {
  try {
    let id = req.params.id;
    let post = await postsQueryRepository.findByIdOrError(id);
    const postViewModel = mapToPostViewModel(post);
    res.status(HttpStatus.Ok).send(postViewModel);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
