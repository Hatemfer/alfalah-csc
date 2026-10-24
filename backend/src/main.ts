import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import * as express from 'express';
import * as path from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('AlfalahBootstrap');
  const app = await NestFactory.create(AppModule);

  // Security Headers via Helmet
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
    }),
  );

  // Cookie Parser for HttpOnly Session Management
  app.use(cookieParser(process.env.COOKIE_SECRET || 'alfalah_dev_cookie_secret_key_2026'));

  // Serve persistent uploads directory
  const uploadsDir = path.resolve(process.env.MEDIA_UPLOAD_DIR || './uploads');
  app.use('/uploads', express.static(uploadsDir));

  // CORS configuration
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:4000',
    process.env.FRONTEND_URL,
  ].filter(Boolean);

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Allow during local development testing
      }
    },
    credentials: true,
  });

  // Global Prefix: /api/v1
  const apiPrefix = process.env.API_PREFIX || '/api/v1';
  app.setGlobalPrefix(apiPrefix.replace(/^\//, ''));

  // Global Validation Pipe with DTO whitelisting
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger OpenAPI Documentation
  const config = new DocumentBuilder()
    .setTitle('Alfalah Community Support Centre API')
    .setDescription(
      'Enterprise REST API documentation for the Alfalah Community Support Centre website and CMS.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addCookieAuth('alfalah_session')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${apiPrefix.replace(/^\//, '')}/docs`, app, document, {
    customSiteTitle: 'Alfalah CSC API Docs',
  });

  const port = parseInt(process.env.PORT || '4000', 10);
  await app.listen(port);
  logger.log(`🚀 Backend running on: http://localhost:${port}${apiPrefix}`);
  logger.log(`📖 Swagger docs available on: http://localhost:${port}${apiPrefix}/docs`);
}

bootstrap();
