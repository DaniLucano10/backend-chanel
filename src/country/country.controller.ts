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
import { CountryService } from './country.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiBearerAuth('JWT-auth')
@Controller('country')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Post()
  @ApiOperation({ summary: 'Crear país' })
  async create(
    @Body() createCountryDto: CreateCountryDto,
  ): Promise<CreateCountryDto> {
    return (await this.countryService.create(
      createCountryDto,
    )) as CreateCountryDto;
  }

  @Get()
  @ApiOperation({ summary: 'Listar países' })
  @ApiQuery({ name: 'id', required: false })
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'code', required: false })
  @ApiQuery({ name: 'dial_code', required: false })
  async findByCriteria(
    @Query('id') id: number,
    @Query('name') name: string,
    @Query('code') code: string,
    @Query('dial_code') dial_code: string,
  ): Promise<any> {
    const data = { id, name, code, dial_code };
    return this.countryService.findByCriteria(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar país' })
  async update(
    @Param('id') id: number,
    @Body() updateCountryDto: UpdateCountryDto,
  ) {
    return this.countryService.update(id, updateCountryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar país' })
  async remove(@Param('id') id: number) {
    return this.countryService.remove(id);
  }
}
