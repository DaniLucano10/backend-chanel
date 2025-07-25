import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guard/auth.guard';
import { ConfigModule } from '@nestjs/config';
import { CountryModule } from './country/country.module';
import { User } from './users/entities/user.entity';
import { Country } from './country/entities/country.entity';
import { BlacklistedToken } from './auth/entities/blacklisted-token.entity';
import { ActiveToken } from './auth/entities/active-token.entity';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { RoleHasPermissionModule } from './role_has_permission/role_has_permission.module';
import { UserHasRoleModule } from './user_has_role/user_has_role.module';
import { Role } from './role/entities/role.entity';
import { Permission } from './permission/entities/permission.entity';
import { UserHasRole } from './user_has_role/entities/user_has_role.entity';
import { RoleHasPermission } from './role_has_permission/entities/role_has_permission.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [
        User,
        Country,
        BlacklistedToken,
        ActiveToken,
        Role,
        Permission,
        UserHasRole,
        RoleHasPermission,
      ],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    CountryModule,
    RoleModule,
    PermissionModule,
    RoleHasPermissionModule,
    UserHasRoleModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
