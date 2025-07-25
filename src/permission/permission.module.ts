import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { RoleHasPermission } from '../role_has_permission/entities/role_has_permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Permission, RoleHasPermission])],
  controllers: [PermissionController],
  providers: [PermissionService],
})
export class PermissionModule {}
