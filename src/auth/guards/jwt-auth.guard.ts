import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

/*    modify this to add blacklisting of used tokens (for logout)
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly tokenService: TokenService) {
    super();
  }

  handleRequest(err, user, info, context) {
    const token = this.getTokenFromRequest(context.getRequest());
    if (this.tokenService.isBlacklisted(token)) {
      throw new UnauthorizedException('Token is blacklisted');
    }
    return super.handleRequest(err, user, info, context);
  }

  // Implement this method according to your setup to get the JWT token from the request
  getTokenFromRequest(req): string {
    // Your logic here
  }
}

*/
