import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const application = await NestFactory.create(AppModule);

  application.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  application.enableShutdownHooks();

  const configService = application.get(ConfigService);
  application.enableCors({ origin: configService.getOrThrow<string>('CORS_ORIGIN') });
  await application.listen(configService.get<number>('PORT', 5000));
}

bootstrap();

