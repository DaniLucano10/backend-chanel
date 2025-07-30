import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { RoleHasPermissionService } from './role_has_permission.service';
import { CreateRoleHasPermissionDto } from './dto/create-role_has_permission.dto';
import { UpdateRoleHasPermissionDto } from './dto/update-role_has_permission.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ParsePositivePipe } from '../pipes/parse_positive/parse_positive.pipe';
import { UnassignRolePermissionDto } from './dto/unassign-role-permission.dto';

@ApiBearerAuth('JWT-auth')
@Controller('role-has-permission')
export class RoleHasPermissionController {
  constructor(
    private readonly roleHasPermissionService: RoleHasPermissionService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear una relación rol-permiso' })
  create(@Body() createRoleHasPermissionDto: CreateRoleHasPermissionDto) {
    return this.roleHasPermissionService.create(createRoleHasPermissionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar las relaciones rol-permiso' })
  @ApiQuery({ name: 'id', required: false })
  @ApiQuery({ name: 'role_id', required: false })
  @ApiQuery({ name: 'permission_id', required: false })
  async findByCriteria(
    @Query('id') id: number,
    @Query('role_id') role_id: number,
    @Query('permission_id') permission_id: number,
  ): Promise<CreateRoleHasPermissionDto> {
    const data = { id, role_id, permission_id };
    return (await this.roleHasPermissionService.findByCriteria(
      data,
    )) as CreateRoleHasPermissionDto;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una relación rol-permiso' })
  async update(
    @Param('id', new ParsePositivePipe()) id: number,
    @Body() updateRoleHasPermissionDto: UpdateRoleHasPermissionDto,
  ) {
    return this.roleHasPermissionService.update(id, updateRoleHasPermissionDto);
  }

  @Post('unassign-role-permission')
  @ApiOperation({ summary: 'Desasignar un permiso a un rol' })
  async unassignRolePermission(@Body() body: UnassignRolePermissionDto) {
    return this.roleHasPermissionService.unassignRolePermission(body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una relación rol-permiso' })
  remove(@Param('id', new ParsePositivePipe()) id: number) {
    return this.roleHasPermissionService.remove(id);
  }
}
