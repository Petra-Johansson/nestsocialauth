import { DataSource } from "typeorm";
import {config } from 'dotenv';

config();
export default new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    url: process.env.DB_URL,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    dropSchema: false,
    logging: true,
    entities: ['./src/**/*.entity{.ts, .js}'],
    migrations: ['./database/seeders/**/*{.ts,.js}'],
    migrationsTableName: 'seeders'
})