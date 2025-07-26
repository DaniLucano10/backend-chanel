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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { ParsePositivePipe } from '../pipes/parse_positive/parse_positive.pipe';
@ApiBearerAuth('JWT-auth')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Crear usuario' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar los usuarios' })
  @ApiQuery({ name: 'country_id', type: Number, required: false })
  @ApiQuery({ name: 'status', type: Boolean, required: false })
  @ApiQuery({ name: 'email', type: String, required: false })
  @ApiQuery({ name: 'fullname', type: String, required: false })
  find(
    @Query() query: { status?: boolean; email?: string; fullname?: string },
  ) {
    return this.usersService.find(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un usuario por su ID' })
  findOne(@Param('id', new ParsePositivePipe()) id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un usuario' })
  update(
    @Param('id', new ParsePositivePipe()) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Patch('toggle-status/:id')
  @ApiOperation({ summary: 'Cambiar el estado de un usuario' })
  toggleStatus(@Param('id') id: string) {
    return this.usersService.toggleStatus(+id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un usuario' })
  remove(@Param('id', new ParsePositivePipe()) id: string) {
    return this.usersService.remove(+id);
  }
}
