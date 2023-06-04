import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { extractUserId } from 'src/common/utility/extract-userid';

export const UserId = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const userId = extractUserId(request);
    return userId;
  },
);
