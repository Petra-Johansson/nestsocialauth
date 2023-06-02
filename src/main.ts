import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { AppConfigService } from './config/app-config/app.config.service';
import * as cookieParser from 'cookie-parser';
import { corsOptions } from './config/cors-config';
import * as cors from 'cors';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.use(cors(corsOptions));
  app.useGlobalPipes(new ValidationPipe());

  // Retrieve instances of ConfigService and AppConfigService
  const configService = app.get(ConfigService);
  const appConfigService = app.get(AppConfigService);

  const config = new DocumentBuilder()
    .setTitle('Nest Social Auth')
    .setDescription(
      'This API provides comprehensive blogging capabilities. Users can register and authenticate themselves to access the system. Once authenticated, users can create, update, view, and delete blog posts. Each blog post can be associated with multiple tags, creating an efficient way to categorize and retrieve content. Users can also leave comments on posts, facilitating discussion around the content. The API is designed to provide a robust, secure, and interactive blogging platform.',
    )
    .setVersion('1.0')
    .addTag('nest-social-auth')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {});

  // Get the port value from the AppConfigService getter
  // If the value is not found or is invalid, we'll fallback to retrieving it from ConfigService
  // If we still can't find a valid port value, we'll default to using port 8080
  const port =
    appConfigService.port || configService.get<number>('app.port') || 8080;

  // Start the app and listen on the determined port
  await app.listen(port);
}

bootstrap();
