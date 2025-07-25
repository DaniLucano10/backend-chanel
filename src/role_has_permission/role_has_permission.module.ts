import { Module } from '@nestjs/common';
import { RoleHasPermissionService } from './role_has_permission.service';
import { RoleHasPermissionController } from './role_has_permission.controller';

@Module({
  controllers: [RoleHasPermissionController],
  providers: [RoleHasPermissionService],
})
export class RoleHasPermissionModule {}
