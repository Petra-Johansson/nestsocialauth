import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JWTConfigService {
  constructor(private readonly configService: ConfigService) {}

  get jwtSecret(): string {
    return this.configService.get<string>('jwt-secret.jwtSecret');
  }

  get refreshJwtSecret(): string {
    return this.configService.get<string>('jwt-secret.refreshJwtSecret');
  }
}
