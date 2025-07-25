import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoleHasPermissionService } from './role_has_permission.service';
import { CreateRoleHasPermissionDto } from './dto/create-role_has_permission.dto';
import { UpdateRoleHasPermissionDto } from './dto/update-role_has_permission.dto';

@Controller('role-has-permission')
export class RoleHasPermissionController {
  constructor(private readonly roleHasPermissionService: RoleHasPermissionService) {}

  @Post()
  create(@Body() createRoleHasPermissionDto: CreateRoleHasPermissionDto) {
    return this.roleHasPermissionService.create(createRoleHasPermissionDto);
  }

  @Get()
  findAll() {
    return this.roleHasPermissionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleHasPermissionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleHasPermissionDto: UpdateRoleHasPermissionDto) {
    return this.roleHasPermissionService.update(+id, updateRoleHasPermissionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roleHasPermissionService.remove(+id);
  }
}
