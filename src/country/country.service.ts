import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { Country } from './entities/country.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createCountryDto: CreateCountryDto): Promise<any> {
    try {
      //Busca el pais
      const country = await this.countryRepository.findOne({
        where: { name: createCountryDto.name },
      });
      if (country) {
        throw new ConflictException('El país ya existe con este nombre');
      }

      return await this.countryRepository.save(createCountryDto);
    } catch (error) {
      if (error instanceof HttpException) {
        console.error('Error al crear el país:', error.message);
        throw error;
      } else {
        console.error('Error inesperado al crear el país:', error);
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        throw new InternalServerErrorException(
          `Error inesperado al crear el país, ${errorMessage}`,
        );
      }
    }
  }

  async findByCriteria(data: {
    id?: number;
    name?: string;
    code?: string;
    dial_code?: string;
  }): Promise<any> {
    try {
      const { id, name, code, dial_code } = data;

      const queryBuilder = this.countryRepository.createQueryBuilder('country');

      if (id) {
        queryBuilder.andWhere('country.id = :id', { id });
      }

      if (name) {
        queryBuilder.andWhere('country.name LIKE :name', {
          name: `%${name}%`,
        });
      }
      if (code) {
        queryBuilder.andWhere('country.code LIKE :code', {
          code: `%${code}%`,
        });
      }
      if (dial_code) {
        queryBuilder.andWhere('country.dial_code LIKE :dial_code', {
          dial_code: `%${dial_code}%`,
        });
      }

      queryBuilder.orderBy('country.created_at', 'DESC');
      const response = await queryBuilder.getMany();
      if (response.length === 0) {
        throw new NotFoundException(
          'No se encontraron países con esos criterios',
        );
      }
      return response;
    } catch (error) {
      if (error instanceof HttpException) {
        console.error('Error al listar países:', error.message);
        throw error;
      } else {
        console.error('Error inesperado al listar países:', error);
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        throw new InternalServerErrorException(
          `Error inesperado al listar países, ${errorMessage}`,
        );
      }
    }
  }

  async update(id: number, updateCountryDto: UpdateCountryDto) {
    try {
      // Busca el país
      const country = await this.countryRepository.findOne({ where: { id } });
      if (!country) {
        throw new ConflictException(`País con ID ${id} no encontrado`);
      }

      // Actualiza el país
      Object.assign(country, updateCountryDto);
      return await this.countryRepository.save(country);
    } catch (error) {
      if (error instanceof HttpException) {
        console.error('Error al actualizar el país:', error.message);
        throw error;
      } else {
        console.error('Error inesperado al actualizar el país:', error);
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        throw new InternalServerErrorException(
          `Error inesperado al actualizar el país, ${errorMessage}`,
        );
      }
    }
  }

  async remove(id: number) {
    try {
      // Busca el país
      const country = await this.countryRepository.findOne({ where: { id } });

      if (!country) {
        throw new NotFoundException(`País con ID ${id} no encontrado`);
      }

      // Busca resgistro en user
      const user = await this.userRepository.findOne({
        where: { country_id: country.id },
      });
      if (user) {
        throw new ConflictException(
          `No se puede eliminar el país con ID ${id} porque está asociado a un usuario`,
        );
      }

      // Elimina el país
      await this.countryRepository.delete(id);
      return { message: `País con ID ${id} eliminado correctamente` };
    } catch (error) {
      if (error instanceof HttpException) {
        console.error('Error al eliminar el país:', error.message);
        throw error;
      } else {
        console.error('Error inesperado al eliminar el país:', error);
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        throw new InternalServerErrorException(
          `Error inesperado al eliminar el país, ${errorMessage}`,
        );
      }
    }
  }
}
