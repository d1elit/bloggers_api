import { RequestWithBody } from '../../../core/types/requestTypes';
import { Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { PostInput } from '../input/post.input';
import { mapToPostViewModel } from '../mappers/map-to-post-view-model';
import { PostOutput } from '../output/post.output';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { postsService } from '../../../composition-root';

export async function createPostHandler(
  req: RequestWithBody<PostInput>,
  res: Response,
) {
  try {
    const createdPost = await postsService.create(req.body);
    const postViewModel: PostOutput = mapToPostViewModel(createdPost);
    res.status(HttpStatus.Created).send(postViewModel);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
