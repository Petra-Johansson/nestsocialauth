import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Injectable,
} from '@nestjs/common';
import { UsersService } from '../users.service';
import { extractUserId } from 'src/common/utility/extract-userid';

@Injectable()
export class UserIsUserGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = await this.usersService.findOne(request.params.id);
    console.log(user.id);
    console.log(extractUserId(request));
    if (user.id !== extractUserId(request)) {
      switch (request.method) {
        case 'PUT':
          throw new UnauthorizedException(
            'You are only allowed to update your own profile',
          );
        case 'DELETE':
          throw new UnauthorizedException(
            'You are only allowed to delete your own account',
          );
        default:
          throw new UnauthorizedException(
            'You are only allowed to modify your own account',
          );
      }
    }

    return true;
  }
}
