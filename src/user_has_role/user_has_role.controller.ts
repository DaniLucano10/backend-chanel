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
import { UserHasRoleService } from './user_has_role.service';
import { CreateUserHasRoleDto } from './dto/create-user_has_role.dto';
import { UpdateUserHasRoleDto } from './dto/update-user_has_role.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { FilterUserHasRoleDto } from './dto/filter-user_has_role.dto';
import { ParsePositivePipe } from '../pipes/parse_positive/parse_positive.pipe';

@ApiBearerAuth('JWT-auth')
@Controller('user-has-role')
export class UserHasRoleController {
  constructor(private readonly userHasRoleService: UserHasRoleService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una relación usuario-rol' })
  create(@Body() createUserHasRoleDto: CreateUserHasRoleDto) {
    return this.userHasRoleService.create(createUserHasRoleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar las relaciones usuario-rol' })
  @ApiQuery({ name: 'role_id', required: false })
  @ApiQuery({ name: 'user_id', required: false })
  @ApiQuery({ name: 'id', required: false })
  find(@Query() filter: FilterUserHasRoleDto) {
    return this.userHasRoleService.find(filter);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una relación usuario-rol' })
  update(
    @Param('id', new ParsePositivePipe()) id: string,
    @Body() updateUserHasRoleDto: UpdateUserHasRoleDto,
  ) {
    return this.userHasRoleService.update(+id, updateUserHasRoleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una relación usuario-rol' })
  remove(@Param('id', new ParsePositivePipe()) id: string) {
    return this.userHasRoleService.remove(+id);
  }
}
