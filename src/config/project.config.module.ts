import { Module } from '@nestjs/common';
import { DatabaseConfigModule } from './database-config/database.config.module';
//import { JWTConfigModule } from "./jwt-config/jwt.config.module";
import { AppConfigModule } from './app-config/app.config.module';

@Module({ imports: [DatabaseConfigModule, AppConfigModule] })
export class ProjectConfigModule {}
