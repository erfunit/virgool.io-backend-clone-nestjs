import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function TypeOrmConfig(): TypeOrmModuleOptions {
  const { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USERNAME } = process.env;
  return {
    type: 'postgres',
    host: DB_HOST,
    database: DB_NAME,
    password: DB_PASSWORD,
    username: DB_USERNAME,
    port: +DB_PORT,
    entities: ['dist/**/*.entity{.js,.ts}'],
    synchronize: true,
  };
}
