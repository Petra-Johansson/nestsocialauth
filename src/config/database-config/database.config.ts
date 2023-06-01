import { registerAs } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';
export default registerAs(
  'database',
  (): DataSourceOptions =>
    ({
      logging: false,
      entities: [`${__dirname}/../../**/**.entity{.ts,.js}`],
      migrations: [
        `${__dirname}/../../../database/migrations/*{.ts,.js}`
      ],
      migrationsRun: true,
      migrationsTableName: 'migrations',
      keepConnectionAlive: true,
      synchronize: false,
      type: 'postgres',
      host: process.env.DB_HOST.toString(),
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME.toString(),
      password: process.env.DB_PASSWORD.toString(),
      database: process.env.DB_NAME.toString()
    } as DataSourceOptions)
);