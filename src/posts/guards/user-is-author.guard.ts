import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Injectable,
} from '@nestjs/common';
import { PostsService } from '../posts.service';
import { extractUserId } from 'src/common/utility/extract-userid';

@Injectable()
export class UserIsAuthorGuard implements CanActivate {
  constructor(private readonly postsService: PostsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const post = await this.postsService.findOne(request.params.id);

    if (post.user.id !== extractUserId(request)) {
      switch (request.method) {
        case 'PATCH':
          throw new UnauthorizedException(
            'You are only allowed to update your own posts',
          );
        case 'DELETE':
          throw new UnauthorizedException(
            'You are only allowed to delete your own posts',
          );
        default:
          throw new UnauthorizedException(
            'You are only allowed to modify your own posts',
          );
      }
    }

    return true;
  }
}
