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
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
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
  @ApiOperation({ summary: 'Listar los roles' })
  @ApiQuery({ name: 'id', required: false })
  @ApiQuery({ name: 'name', required: false })
  async findByCriteria(
    @Query('id') id: number,
    @Query('name') name: string,
  ): Promise<CreateRoleDto[]> {
    const data = { id, name };
    return (await this.roleService.findByCriteria(data)) as CreateRoleDto[];
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
