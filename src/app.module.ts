import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { TagsModule } from './tags/tags.module';

import { ProjectConfigModule } from './config/project.config.module';
import { CommentsModule } from './comments/comments.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from './config/database-config/database.config';
import { DataSource } from 'typeorm';
import { LikedPostsModule } from './liked-posts/liked-posts.module';

const typeOrmConfig = {
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig],
    }),
  ],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) =>
    configService.get('database'),
  dataSourceFactory: async (options) => new DataSource(options).initialize(),
};

@Module({
  imports: [
    UsersModule,
    PostsModule,
    AuthModule,
    TagsModule,
    ProjectConfigModule,
    CommentsModule,
    TypeOrmModule.forRootAsync(typeOrmConfig),
    LikedPostsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
