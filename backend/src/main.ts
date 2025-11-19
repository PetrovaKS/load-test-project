import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors();

  app.use(
    compression({
      level: 6,
      threshold: 1024,
    }),
  );

  await app.listen(3000);
  console.log('Backend server running on http://localhost:3000');
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error.message);
  process.exit(1);
});
