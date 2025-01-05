import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { SwaggerConfigInit } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  SwaggerConfigInit(app);
  await app.listen(process.env.PORT, () => {
    console.log('PROJECT IS RUNNING ON PORT: ', process.env.PORT);
    console.log(`swagger: http://localhost:${process.env.PORT}/swagger`);
  });
}
bootstrap();
