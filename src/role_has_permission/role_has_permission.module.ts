import { Module } from '@nestjs/common';
import { RoleHasPermissionService } from './role_has_permission.service';
import { RoleHasPermissionController } from './role_has_permission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleHasPermission } from './entities/role_has_permission.entity';
import { Role } from '../role/entities/role.entity';
import { Permission } from '../permission/entities/permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RoleHasPermission, Role, Permission])],
  controllers: [RoleHasPermissionController],
  providers: [RoleHasPermissionService],
})
export class RoleHasPermissionModule {}
