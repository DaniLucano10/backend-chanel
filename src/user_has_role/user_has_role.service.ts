import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserHasRoleDto } from './dto/create-user_has_role.dto';
import { UpdateUserHasRoleDto } from './dto/update-user_has_role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserHasRole } from './entities/user_has_role.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Role } from '../role/entities/role.entity';
import { FilterUserHasRoleDto } from './dto/filter-user_has_role.dto';
import { UnassignUserRoleDto } from './dto/unassign-user-role.dto';

@Injectable()
export class UserHasRoleService {
  constructor(
    @InjectRepository(UserHasRole)
    private readonly userHasRoleRepository: Repository<UserHasRole>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(
    createUserHasRoleDto: CreateUserHasRoleDto,
  ): Promise<UserHasRole> {
    try {
      // Busca el usuario
      const user = await this.userRepository.findOne({
        where: { id: createUserHasRoleDto.user_id },
      });
      if (!user) {
        throw new ConflictException(
          `Usuario con id ${createUserHasRoleDto.user_id} no encontrado.`,
        );
      }

      // Busca el rol
      const role = await this.roleRepository.findOne({
        where: { id: createUserHasRoleDto.role_id },
      });
      if (!role) {
        throw new ConflictException(
          `Rol con id ${createUserHasRoleDto.role_id} no encontrado.`,
        );
      }

      // Busca la relación usuario-rol
      const user_role = await this.userHasRoleRepository.findOne({
        where: {
          user: { id: createUserHasRoleDto.user_id },
          role: { id: createUserHasRoleDto.role_id },
        },
      });
      if (user_role) {
        throw new ConflictException('Ya existe esa relación usuario-rol.');
      }

      // Crea la nueva relación usuario-rol
      const userHasRole = this.userHasRoleRepository.create({
        user,
        role,
      });
      const userRole = await this.userHasRoleRepository.save(userHasRole);
      // delete userRole.user.password;
      return userRole;
    } catch (error) {
      if (error instanceof HttpException) {
        console.error('Error al crear la relación usuario-rol:', error.message);
        throw error;
      }
      throw new InternalServerErrorException(
        `Error interno al crear la relación usuario-rol. ${
          typeof error === 'object' && error !== null && 'message' in error
            ? (error as { message: string }).message
            : String(error)
        }.`,
      );
    }
  }

  async find(filter: FilterUserHasRoleDto): Promise<UserHasRole[]> {
    try {
      const query = this.userHasRoleRepository
        .createQueryBuilder('user_has_role')
        .leftJoinAndSelect('user_has_role.user', 'user')
        .leftJoinAndSelect('user_has_role.role', 'role');

      // Verifica si las propiedades son válidas
      const validProperties = ['id', 'user_id', 'role_id'];
      const nonAccepted = Object.keys(filter).some(
        (key) => !validProperties.includes(key),
      );
      if (nonAccepted) {
        throw new BadRequestException('Propiedades de búsqueda no válidas.');
      }

      if (filter.id) {
        query.andWhere('user_has_role.id = :id', { id: filter.id });
      }
      if (filter.user_id) {
        query.andWhere('user_has_role.user_id = :user_id', {
          user_id: filter.user_id,
        });
      }
      if (filter.role_id) {
        query.andWhere('user_has_role.role_id = :role_id', {
          role_id: filter.role_id,
        });
      }

      query.orderBy('user_has_role.id', 'ASC');
      const response = await query.getMany();

      if (response.length === 0) {
        throw new NotFoundException(
          'No se encontraron relaciones usuario-rol.',
        );
      }
      return response.map((userHasRole) => {
        // delete userHasRole.user.password;
        return userHasRole;
      });
    } catch (error) {
      if (error instanceof HttpException) {
        console.error(
          'Error al buscar la relación usuario-rol:',
          error.message,
        );
        throw error;
      }
      throw new InternalServerErrorException(
        `Error interno al buscar la relación usuario-rol. ${
          typeof error === 'object' && error !== null && 'message' in error
            ? (error as { message: string }).message
            : String(error)
        }.`,
      );
    }
  }

  async update(
    id: number,
    updateUserHasRoleDto: UpdateUserHasRoleDto,
  ): Promise<UserHasRole> {
    try {
      const userHasRole = await this.userHasRoleRepository.findOneBy({ id });
      if (!userHasRole) {
        throw new ConflictException(
          `Relación usuario-rol con id ${id} no encontrada.`,
        );
      }

      // Busca el usuario
      const user = await this.userRepository.findOne({
        where: { id: updateUserHasRoleDto.user_id },
      });
      if (!user) {
        throw new ConflictException(
          `Usuario con id ${updateUserHasRoleDto.user_id} no encontrado.`,
        );
      }

      // Busca el rol
      const role = await this.roleRepository.findOne({
        where: { id: updateUserHasRoleDto.role_id },
      });
      if (!role) {
        throw new ConflictException(
          `Rol con id ${updateUserHasRoleDto.role_id} no encontrado.`,
        );
      }

      // Actualiza la relación usuario-rol
      userHasRole.user = user;
      userHasRole.role = role;

      Object.assign(userHasRole, updateUserHasRoleDto);
      await this.userHasRoleRepository.save(userHasRole);
      // delete userHasRole.user.password;
      return userHasRole;
    } catch (error) {
      if (error instanceof HttpException) {
        console.error(
          'Error al actualizar la relación usuario-rol:',
          error.message,
        );
        throw error;
      }
      throw new InternalServerErrorException(
        `Error interno al actualizar la relación usuario-rol. ${
          typeof error === 'object' && error !== null && 'message' in error
            ? (error as { message: string }).message
            : String(error)
        }.`,
      );
    }
  }

  async unassignUserRole(dto: UnassignUserRoleDto) {
    try {
      const { user_id, role_id } = dto;

      const relation = await this.userHasRoleRepository.findOne({
        where: {
          user: { id: user_id },
          role: { id: role_id },
        },
        relations: ['user', 'role'], // Asegura que se pueda eliminar correctamente
      });

      if (!relation) {
        throw new NotFoundException(
          `No se encontró relación entre usuario ${user_id} y rol ${role_id}`,
        );
      }

      await this.userHasRoleRepository.remove(relation);

      return {
        message: `Rol ${role_id} desasignado del usuario ${user_id} correctamente.`,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        console.error('Error al desasignar rol:', error.message);
        throw error;
      }
      throw new InternalServerErrorException(
        `Error interno al desasignar rol. ${
          typeof error === 'object' && error !== null && 'message' in error
            ? (error as { message: string }).message
            : String(error)
        }.`,
      );
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    try {
      const userHasRole = await this.userHasRoleRepository.findOneBy({ id });
      if (!userHasRole) {
        throw new ConflictException(
          `Relación usuario-rol con id ${id} no encontrada.`,
        );
      }

      await this.userHasRoleRepository.remove(userHasRole);
      return { message: 'Relación usuario-rol eliminada' };
    } catch (error) {
      if (error instanceof HttpException) {
        console.error(
          'Error al eliminar la relación usuario-rol:',
          error.message,
        );
        throw error;
      }
      throw new InternalServerErrorException(
        `Error interno al eliminar la relación usuario-rol. ${
          typeof error === 'object' && error !== null && 'message' in error
            ? (error as { message: string }).message
            : String(error)
        }.`,
      );
    }
  }
}
