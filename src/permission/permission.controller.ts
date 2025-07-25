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
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ParsePositivePipe } from '../pipes/parse_positive/parse_positive.pipe';

@ApiBearerAuth('JWT-auth')
@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  @ApiOperation({ summary: 'Crear permiso' })
  async create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionService.create(createPermissionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar permisos' })
  @ApiQuery({ name: 'id', required: false })
  @ApiQuery({ name: 'name', required: false })
  async findByCriteria(
    @Query('id') id: number,
    @Query('name') name: string,
  ): Promise<CreatePermissionDto[]> {
    const data = { id, name };
    return this.permissionService.findByCriteria(data) as Promise<
      CreatePermissionDto[]
    >;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un permiso' })
  async update(
    @Param('id', new ParsePositivePipe()) id: number,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionService.update(id, updatePermissionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un permiso' })
  remove(@Param('id', new ParsePositivePipe()) id: number) {
    return this.permissionService.remove(id);
  }
}
