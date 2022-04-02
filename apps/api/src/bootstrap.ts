import './config';
import 'newrelic';
import '@sentry/tracing';

import { INestApplication, ValidationPipe, Logger } from '@nestjs/common';
import * as passport from 'passport';
import * as compression from 'compression';
import { NestFactory, Reflector } from '@nestjs/core';

import * as Sentry from '@sentry/node';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { ExpressAdapter } from '@nestjs/platform-express';
import { version } from '../package.json';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './app/shared/framework/response.interceptor';
import { RolesGuard } from './app/auth/framework/roles.guard';
import { SubscriberRouteGuard } from './app/auth/framework/subscriber-route.guard';
import { validateEnv } from './config/env-validator';

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    release: `v${version}`,
    integrations: [
      // enable HTTP calls tracing
      new Sentry.Integrations.Http({ tracing: true }),
    ],
  });
}

// Validate the ENV variables after launching SENTRY, so missing variables will report to sentry
validateEnv();

export async function bootstrap(expressApp?): Promise<INestApplication> {
  let app;
  if (expressApp) {
    app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
  } else {
    app = await NestFactory.create(AppModule);
  }

  if (process.env.SENTRY_DSN) {
    app.use(Sentry.Handlers.requestHandler());
    app.use(Sentry.Handlers.tracingHandler());
  }

  app.enableCors({
    origin: ['dev', 'test', 'local'].includes(process.env.NODE_ENV)
      ? '*'
      : [process.env.FRONT_BASE_URL, process.env.WIDGET_BASE_URL],
    preflightContinue: false,
    allowedHeaders: ['Content-Type', 'Authorization', 'sentry-trace'],
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  });

  app.setGlobalPrefix('v1');

  app.use(passport.initialize());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  );

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalGuards(new RolesGuard(app.get(Reflector)));
  app.useGlobalGuards(new SubscriberRouteGuard(app.get(Reflector)));

  app.use(compression());

  if (process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'local') {
    const options = new DocumentBuilder()
      .setTitle('novu API')
      .setDescription('The novu API description')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, options);

    SwaggerModule.setup('api', app, document);
  }

  if (expressApp) {
    await app.init();
  } else {
    await app.listen(process.env.PORT);
  }

  Logger.log(`Started application in NODE_ENV=${process.env.NODE_ENV} on port ${process.env.PORT}`);

  return app;
}
