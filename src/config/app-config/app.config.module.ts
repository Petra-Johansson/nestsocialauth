import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import { AppConfigService } from './app.config.service';
import configuration from './app.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        APP_PORT: Joi.number().required(),
      }),
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigModule, AppConfigService],
})
export class AppConfigModule {}
