import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JWTConfigService } from './jwt.config.service';
import configuration from './jwt.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string().required(),
      }),
    }),
  ],
  providers: [JWTConfigService],
  exports: [JWTConfigModule, JWTConfigService],
})
export class JWTConfigModule {}
