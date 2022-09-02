import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { ApiAccess } from './entity/ApiAccess';
import { ApiRole } from './entity/ApiRole';
import { ApiUser } from './entity/ApiUser';
import { UserModule } from './features/user/user.module';
import { AccessModule } from './features/access/access.module';
import { RoleModule } from './features/role/role.module';
import { AuthModule } from './features/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      database: process.env.DB_DATABASE,
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      synchronize: false,
      entities: [ApiAccess, ApiRole, ApiUser],
      subscribers: ['dist/subscriber/*.js'],
      migrations: ['dist/migration/*.js'],
      cli: {
        entitiesDir: 'src/entity',
        migrationsDir: 'src/migration',
        subscribersDir: 'src/subscriber',
      },
    }),
    AuthModule,
    UserModule,
    AccessModule,
    RoleModule,
  ],
})
export class AppModule {}
