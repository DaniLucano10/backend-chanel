import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Country } from '../country/entities/country.entity';
import { RoleHasPermission } from '../role_has_permission/entities/role_has_permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Country, RoleHasPermission])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
