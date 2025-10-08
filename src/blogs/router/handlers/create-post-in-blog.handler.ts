import { RequestWithParams } from '../../../core/types/requestTypes';
import { blogsService } from '../../application/blogs.service';
import { Response } from 'express';
import { PostOutput } from '../../../posts/router/output/post.output';
import { mapToPostViewModel } from '../../../posts/router/mappers/map-to-post-view-model';
import { HttpStatus } from '../../../core/types/http-statuses';
import { errorsHandler } from '../../../core/errors/errors.handler';

export async function createBlogsPostHandler(
  req: RequestWithParams<{ id: string }>,
  res: Response,
) {
  try {
    const createdPostInBlog = await blogsService.createPost(
      req.params.id,
      req.body,
    );
    const postViewModel: PostOutput = mapToPostViewModel(createdPostInBlog);
    res.status(HttpStatus.Created).send(postViewModel);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
