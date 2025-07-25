import { Injectable } from '@nestjs/common';
import { CreateRoleHasPermissionDto } from './dto/create-role_has_permission.dto';
import { UpdateRoleHasPermissionDto } from './dto/update-role_has_permission.dto';

@Injectable()
export class RoleHasPermissionService {
  create(createRoleHasPermissionDto: CreateRoleHasPermissionDto) {
    return 'This action adds a new roleHasPermission';
  }

  findAll() {
    return `This action returns all roleHasPermission`;
  }

  findOne(id: number) {
    return `This action returns a #${id} roleHasPermission`;
  }

  update(id: number, updateRoleHasPermissionDto: UpdateRoleHasPermissionDto) {
    return `This action updates a #${id} roleHasPermission`;
  }

  remove(id: number) {
    return `This action removes a #${id} roleHasPermission`;
  }
}
