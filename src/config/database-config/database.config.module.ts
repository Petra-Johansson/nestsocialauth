import * as Joi from 'joi';
import { Module } from "@nestjs/common";
import { DatabaseConfigService } from "./database.config.service";
import configuration from './database.config';
import { ConfigModule } from '@nestjs/config';
@Module({
    imports: [ConfigModule.forRoot({
        load: [configuration],
        validationSchema: Joi.object({
            DB_HOST: Joi.string().required(),
            DB_PORT: Joi.number().required(),
            DB_USERNAME: Joi.string().required(),
            DB_PASSWORD: Joi.string().required(),
            DB_NAME: Joi.string().required(),
})
    })],
    providers:[DatabaseConfigService],
    exports: [DatabaseConfigModule, DatabaseConfigService],
})
export class DatabaseConfigModule{}