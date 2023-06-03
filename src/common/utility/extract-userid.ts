import { UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export function extractUserId(request): string {
  const jsonWebToken = request.cookies['jwt'];
  if (!jsonWebToken) {
    throw new UnauthorizedException('Authorization header not found');
  }
  try {
    const decoded = jwt.decode(jsonWebToken);
    if (typeof decoded === 'string' || decoded === null) {
      throw new Error('Unable to decode jwt');
    }

    const userId = decoded['sub'];

    if (!userId) {
      throw new UnauthorizedException('User Id not found in JWT');
    }
    return userId;
  } catch (error) {
    throw new UnauthorizedException(error.message);
  }
}
