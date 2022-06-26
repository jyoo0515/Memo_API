import 'reflect-metadata';
import { DataSource } from 'typeorm';
import 'dotenv/config';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_SCHEMA,
  port: 5432,
  synchronize: false,
  logging: true,
  entities: ['src/**/**.entity{.ts,.js}'],
  migrations: ['src/database/migrations/**/*{.ts,.js}'],
  migrationsRun: true,
});

const TestDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  username: 'test',
  password: 'test',
  database: 'test',
  port: 5433,
  logging: false,
  entities: ['src/**/**.entity{.ts,.js}'],
  synchronize: true,
});

let DB = AppDataSource;
if (process.env.NODE_ENV === 'test') {
  DB = TestDataSource;
}

export default DB;
