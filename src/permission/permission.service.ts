import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    @InjectRepository(RoleHasPermission)
    private readonly roleHasPermissionRepository: Repository<RoleHasPermission>,
  ) {}

  async create(createPermissionDto: CreatePermissionDto) {
    try {
      // Busca el permiso
      const permission = await this.permissionRepository.findOne({
        where: { name: createPermissionDto.name },
      });
      if (permission) {
        throw new ConflictException('Ya existe un permiso con este nombre.');
      }

      return await this.permissionRepository.save(createPermissionDto);
    } catch (error) {
      if (error instanceof HttpException) {
        console.error('Error al crear el permiso:', error.message);
        throw error;
      } else {
        console.error('Error al crear el permiso:', error);
        throw new InternalServerErrorException(
          `Error al crear el permiso: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }
  }

  async findByCriteria(data: { id?: number; name?: string }): Promise<any> {
    try {
      const { id, name } = data;
      const query = this.permissionRepository.createQueryBuilder('entity');

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
          'No existen permisos con los criterios de búsqueda proporcionados.',
        );
      }

      return response;
    } catch (error) {
      if (error instanceof HttpException) {
        console.error('Error al listar permisos:', error.message);
        throw error;
      } else {
        console.error('Error al listar permisos:', error);
        throw new InternalServerErrorException(
          `Error al listar permisos: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }
  }

  async update(id: number, updatePermissionDto: UpdatePermissionDto) {
    try {
      // Busca el permiso
      const permission = await this.permissionRepository.findOne({
        where: { id: id },
      });
      if (!permission) {
        throw new NotFoundException(`Permiso con id ${id} no encontrado`);
      }

      // Actualiza
      Object.assign(permission, updatePermissionDto);
      await this.permissionRepository.save(permission);
      return permission;
    } catch (error) {
      if (error instanceof HttpException) {
        console.error('Error al actualizar permiso:', error.message);
        throw error;
      } else {
        console.error('Error al actualizar permiso:', error);
        throw new InternalServerErrorException(
          `Error al actualizar permiso: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }
  }

  async remove(id: number) {
    try {
      // Busca el permiso
      const permission = await this.permissionRepository.findOne({
        where: { id: id },
      });
      if (!permission) {
        throw new NotFoundException(`Permiso con id ${id} no encontrado`);
      }

      // Busca registros en role_has_permission
      const role_permission = await this.roleHasPermissionRepository.find({
        where: { permission: { id: permission.id } },
      });
      if (role_permission.length > 0) {
        throw new BadRequestException(
          `El permiso cuenta con algún rol asociado`,
        );
      }

      // Eliminar
      await this.permissionRepository.remove(permission);
      return {
        message: 'Permiso eliminado correctamente',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        console.error('Error al eliminar permiso:', error.message);
        throw error;
      } else {
        console.error('Error al eliminar permiso:', error);
        throw new InternalServerErrorException(
          `Error al eliminar permiso: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }
  }
}
