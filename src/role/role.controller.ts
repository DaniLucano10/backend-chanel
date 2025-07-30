import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ParsePositivePipe } from '../pipes/parse_positive/parse_positive.pipe';

@ApiBearerAuth('JWT-auth')
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un rol' })
  async create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los roles con sus permisos' })
  async findAll(): Promise<any> {
    return this.roleService.findAll();
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un rol' })
  async update(
    @Param('id', new ParsePositivePipe()) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.roleService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un rol' })
  async remove(@Param('id', new ParsePositivePipe()) id: number) {
    return this.roleService.remove(id);
  }
}
