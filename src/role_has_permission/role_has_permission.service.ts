import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleHasPermissionDto } from './dto/create-role_has_permission.dto';
import { UpdateRoleHasPermissionDto } from './dto/update-role_has_permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleHasPermission } from './entities/role_has_permission.entity';
import { Role } from '../role/entities/role.entity';
import { Repository } from 'typeorm';
import { Permission } from '../permission/entities/permission.entity';

@Injectable()
export class RoleHasPermissionService {
  constructor(
    @InjectRepository(RoleHasPermission)
    private readonly roleHasPermissionRepository: Repository<RoleHasPermission>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async create(createRoleHasPermissionDto: CreateRoleHasPermissionDto) {
    try {
      // Busca el rol
      const role = await this.roleRepository.findOne({
        where: { id: createRoleHasPermissionDto.role_id },
      });
      if (!role) {
        throw new ConflictException(
          `Rol con id ${createRoleHasPermissionDto.role_id} no encontrado.`,
        );
      }

      // Busca el permiso
      const permission = await this.permissionRepository.findOne({
        where: { id: createRoleHasPermissionDto.permission_id },
      });
      if (!permission) {
        throw new ConflictException(
          `Permiso con id ${createRoleHasPermissionDto.permission_id} no encontrado.`,
        );
      }

      // Busca la relación rol-permiso
      const role_permission = await this.roleHasPermissionRepository.findOne({
        where: {
          role: { id: createRoleHasPermissionDto.role_id },
          permission: { id: createRoleHasPermissionDto.permission_id },
        },
      });
      if (role_permission) {
        throw new ConflictException('Ya existe esa relación rol-permiso.');
      }

      // Crea la nueva relación rol-permiso
      const newRolePermission = this.roleHasPermissionRepository.create({
        role,
        permission,
      });
      return await this.roleHasPermissionRepository.save(newRolePermission);
    } catch (error) {
      if (error instanceof HttpException) {
        console.error('Error al crear la relación rol-permiso:', error.message);
        throw error;
      } else {
        console.error('Error al crear la relación rol-permiso:', error);
        throw new InternalServerErrorException(
          `Error al crear el rol-permiso: ${
            typeof error === 'object' && error !== null && 'message' in error
              ? (error as { message: string }).message
              : String(error)
          }`,
        );
      }
    }
  }

  async findByCriteria(data: {
    id?: number;
    role_id?: number;
    permission_id: number;
  }): Promise<any> {
    try {
      const { id, role_id, permission_id } = data;
      const query = this.roleHasPermissionRepository
        .createQueryBuilder('entity')
        .leftJoinAndSelect('entity.role', 'role')
        .leftJoinAndSelect('entity.permission', 'permission');

      if (id) {
        query.andWhere('entity.id = :id', { id });
      }
      if (role_id) {
        query.andWhere('entity.role_id = :role_id', { role_id });
      }
      if (permission_id) {
        query.andWhere('entity.permission_id = :permission_id', {
          permission_id,
        });
      }

      query.orderBy('entity.created_at', 'DESC');
      const response = await query.getMany();

      if (response.length === 0) {
        throw new NotFoundException(
          'No existen relaciones rol-permiso con los criterios de búsqueda proporcionados.',
        );
      }

      return response;
    } catch (error) {
      if (error instanceof HttpException) {
        console.error('Error al listar relaciones rol-permiso:', error.message);
        throw error;
      } else {
        console.error('Error al listar relaciones rol-permiso:', error);
        throw new InternalServerErrorException(
          `Error al listar rol-permiso: ${
            typeof error === 'object' && error !== null && 'message' in error
              ? (error as { message: string }).message
              : String(error)
          }`,
        );
      }
    }
  }

  async update(
    id: number,
    updateRoleHasPermissionDto: UpdateRoleHasPermissionDto,
  ) {
    try {
      // Busca la relación rol-permiso
      const role_permission = await this.roleHasPermissionRepository.findOne({
        where: { id: id },
      });
      if (!role_permission) {
        throw new ConflictException(
          `Relación rol-permiso con id ${id} no encontrada.`,
        );
      }

      // Busca el rol
      const role = await this.roleRepository.findOne({
        where: { id: updateRoleHasPermissionDto.role_id },
      });
      if (!role) {
        throw new ConflictException(
          `Rol con id ${updateRoleHasPermissionDto.role_id} no encontrado.`,
        );
      }

      // Busca el permiso
      const permission = await this.permissionRepository.findOne({
        where: { id: updateRoleHasPermissionDto.permission_id },
      });
      if (!permission) {
        throw new ConflictException(
          `Permiso con id ${updateRoleHasPermissionDto.permission_id} no encontrado.`,
        );
      }

      // Actualiza
      role_permission.role = role;
      role_permission.permission = permission;
      Object.assign(role_permission, updateRoleHasPermissionDto);
      await this.roleHasPermissionRepository.save(role_permission);
      return role_permission;
    } catch (error) {
      if (error instanceof HttpException) {
        console.error(
          'Error al actualizar relación rol-permiso:',
          error.message,
        );
        throw error;
      } else {
        console.error('Error al actualizar relación rol-permiso:', error);
        throw new InternalServerErrorException(
          `Error al actualizar rol-permiso: ${
            typeof error === 'object' && error !== null && 'message' in error
              ? (error as { message: string }).message
              : String(error)
          }`,
        );
      }
    }
  }

  async unassignRolePermission(data: {
    role_id: number;
    permission_id: number;
  }) {
    const { role_id, permission_id } = data;

    try {
      const relation = await this.roleHasPermissionRepository.findOne({
        where: {
          role: { id: role_id },
          permission: { id: permission_id },
        },
        relations: ['role', 'permission'],
      });

      if (!relation) {
        throw new NotFoundException(
          `No existe la relación entre rol ${role_id} y permiso ${permission_id}`,
        );
      }

      await this.roleHasPermissionRepository.remove(relation);

      return {
        message: `Permiso ${permission_id} desasignado del rol ${role_id} correctamente.`,
      };
    } catch (error) {
      console.error('Error al desasignar permiso del rol:', error);
      throw new InternalServerErrorException(
        'No se pudo desasignar el permiso.',
      );
    }
  }

  async remove(id: number) {
    try {
      // Busca la relación rol-permiso
      const role_permission = await this.roleHasPermissionRepository.findOne({
        where: { id: id },
      });
      if (!role_permission) {
        throw new ConflictException(
          `Relación rol-permiso con id ${id} no encontrada.`,
        );
      }

      // Eliminar
      await this.roleHasPermissionRepository.remove(role_permission);
      return {
        message: 'Relación rol-permiso eliminada correctamente',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        console.error('Error al eliminar relación rol-permiso:', error.message);
        throw error;
      } else {
        console.error('Error al eliminar relación rol-permiso:', error);
        throw new InternalServerErrorException(
          `Error al eliminar rol-permiso: ${
            typeof error === 'object' && error !== null && 'message' in error
              ? (error as { message: string }).message
              : String(error)
          }`,
        );
      }
    }
  }
}
