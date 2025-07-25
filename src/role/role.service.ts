import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { UserHasRole } from '../user_has_role/entities/user_has_role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(UserHasRole)
    private readonly userHasRoleRepository: Repository<UserHasRole>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    try {
      // Busca el rol
      const role = await this.roleRepository.findOne({
        where: { name: createRoleDto.name },
      });
      if (role) {
        throw new ConflictException('Ya existe un rol con este nombre.');
      }

      return await this.roleRepository.save(createRoleDto);
    } catch (error) {
      if (error instanceof HttpException) {
        console.error('Error al crear el rol:', error.message);
        throw error;
      } else {
        console.error('Error al crear el rol:', error);
        throw new InternalServerErrorException(
          `Error al crear el rol: ${
            typeof error === 'object' && error !== null && 'message' in error
              ? (error as { message: string }).message
              : String(error)
          }`,
        );
      }
    }
  }

  async findByCriteria(data: { id?: number; name?: string }): Promise<any> {
    try {
      const { id, name } = data;
      const query = this.roleRepository.createQueryBuilder('entity');

      if (id) {
        query.andWhere('entity.id = :id', { id });
      }
      if (name) {
        query.andWhere('entity.name ILIKE :name', { name: `%${name}%` });
      }

      query.orderBy('entity.created_at', 'DESC');
      const response = await query.getMany();

      if (response.length === 0) {
        throw new NotFoundException(
          'No existen roles con los criterios de búsqueda proporcionados.',
        );
      }

      return response;
    } catch (error) {
      if (error instanceof HttpException) {
        console.error('Error al listar roles:', error.message);
        throw error;
      } else {
        console.error('Error al listar roles:', error);
        throw new InternalServerErrorException(
          `Error al listar roles: ${
            typeof error === 'object' && error !== null && 'message' in error
              ? (error as { message: string }).message
              : String(error)
          }`,
        );
      }
    }
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    try {
      // Busca el rol
      const role = await this.roleRepository.findOne({
        where: { id: id },
      });
      if (!role) {
        throw new NotFoundException(`Rol con id ${id} no encontrado`);
      }

      // Actualiza
      Object.assign(role, updateRoleDto);
      await this.roleRepository.save(role);
      return role;
    } catch (error) {
      if (error instanceof HttpException) {
        console.error('Error al actualizar rol:', error.message);
        throw error;
      } else {
        console.error('Error al actualizar rol:', error);
        throw new InternalServerErrorException(
          `Error al actualizar rol: ${
            typeof error === 'object' && error !== null && 'message' in error
              ? (error as { message: string }).message
              : String(error)
          }`,
        );
      }
    }
  }

  async remove(id: number) {
    try {
      // Busca el rol
      const role = await this.roleRepository.findOne({
        where: { id: id },
      });
      if (!role) {
        throw new NotFoundException(`Rol con id ${id} no encontrado`);
      }

      // Busca la relación usuario-rol
      const user_role = await this.userHasRoleRepository.find({
        where: { role: { id: role.id } },
      });
      if (user_role.length > 0) {
        throw new BadRequestException(
          'El rol cuenta con algún usuario asociado',
        );
      }

      // Eliminar
      await this.roleRepository.remove(role);
      return {
        message: 'Rol eliminado correctamente',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        console.error('Error al eliminar rol:', error.message);
        throw error;
      } else {
        console.error('Error al eliminar rol:', error);
        throw new InternalServerErrorException(
          `Error al eliminar rol: ${
            typeof error === 'object' && error !== null && 'message' in error
              ? (error as { message: string }).message
              : String(error)
          }`,
        );
      }
    }
  }
}
