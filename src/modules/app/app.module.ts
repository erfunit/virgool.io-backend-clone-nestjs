import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { TypeOrmConfig } from 'src/config/typeorm.config';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { CategoryModule } from '../category/category.module';
import { BlogModule } from '../blog/blog.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(process.cwd(), '.env'),
    }),
    TypeOrmModule.forRoot(TypeOrmConfig()),
    AuthModule,
    UsersModule,
    BlogModule,
    CategoryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
