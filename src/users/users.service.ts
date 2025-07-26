import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from './entities/user.entity';

import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { Country } from 'src/country/entities/country.entity';
import { RoleHasPermission } from 'src/role_has_permission/entities/role_has_permission.entity';
import { Role } from 'src/role/entities/role.entity';
import { UserHasRole } from 'src/user_has_role/entities/user_has_role.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
    @InjectRepository(RoleHasPermission)
    private readonly roleHasPermissionRepository: Repository<RoleHasPermission>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(UserHasRole)
    private readonly userHasRoleRepository: Repository<UserHasRole>,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<any> {
    const { role_id, ...userData } = createUserDto;
    const existingUser = await this.userRepository.findOne({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new BadRequestException('El correo ya está registrado');
    }

    // Verifica si el pais existe
    const countryExists = await this.countryRepository.findOne({
      where: { id: userData.country_id },
    });

    if (!countryExists) {
      throw new ConflictException('El pais no existe');
    }

    // Verifica si el rol existe
    const roleExists = await this.roleRepository.findOne({
      where: { id: role_id },
    });

    if (!roleExists) {
      throw new ConflictException('El rol no existe');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);

    // Asignar el rol al usuario
    const userHasRole = this.userHasRoleRepository.create({
      user: savedUser,
      role: roleExists,
    });
    await this.userHasRoleRepository.save(userHasRole);

    //Remover password de forma segura
    const { password, ...safeUser } = savedUser;
    void password; // Esto evita warning de ESLint

    return safeUser;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return user;
  }

  async find(query: {
    status?: boolean;
    email?: string;
    fullname?: string;
  }): Promise<any[]> {
    const filters: Record<string, any> = {};

    if (query.status !== undefined) {
      filters.status = query.status;
    }
    if (query.email) {
      filters.email = query.email;
    }
    if (query.fullname) {
      filters.fullname = query.fullname;
    }

    const users = await this.userRepository.find({
      where: filters,
      relations: ['country', 'roles', 'roles.role'],
    });

    return users.map((user) => {
      const { password, roles, ...rest } = user;
      void password;
      return {
        ...rest,
        roles: roles.map((userHasRole) => ({
          id: userHasRole.role.id,
          name: userHasRole.role.name,
        })),
      };
    });
  }

  async findOne(id: number): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['country', 'roles', 'roles.role'],
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    const { password, roles, ...rest } = user;
    void password;

    return {
      ...rest,
      roles: roles.map((userHasRole) => ({
        id: userHasRole.role.id,
        name: userHasRole.role.name,
      })),
    };
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<Omit<User, 'password'>> {
    const { role_id, ...userData } = updateUserDto;
    try {
      // Busca usuario
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new ConflictException(`Usuario con ID ${id} no encontrado`);
      }

      // Si se proporciona un role_id, actualizarlo
      if (role_id) {
        // Verificar que el rol exista
        const roleExists = await this.roleRepository.findOne({
          where: { id: role_id },
        });
        if (!roleExists) {
          throw new NotFoundException(`Rol con ID ${role_id} no encontrado`);
        }

        // Buscar la asignación de rol existente para este usuario
        let userHasRole = await this.userHasRoleRepository.findOne({
          where: { user: { id } },
        });

        if (userHasRole) {
          // Si existe, actualizar el role_id
          userHasRole.role = roleExists;
        } else {
          // Si no existe, crear una nueva asignación
          userHasRole = this.userHasRoleRepository.create({
            user: user,
            role: roleExists,
          });
        }
        await this.userHasRoleRepository.save(userHasRole);
      }

      // Actualiza el usuario
      if (Object.keys(userData).length > 0) {
        await this.userRepository.update(id, userData);
      }

      // Recargar el usuario para obtener la relación actualizada
      const reloadedUser = await this.userRepository.findOne({
        where: { id },
        relations: ['country'],
      });

      if (!reloadedUser) {
        // Esto no debería suceder si el usuario existía antes, pero es una buena práctica de seguridad
        throw new NotFoundException(
          `Usuario con ID ${id} no encontrado después de la actualización`,
        );
      }

      // Excluir password correctamente
      const { password, ...safeUser } = reloadedUser;
      void password; // para que ESLint no se queje

      return safeUser;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      if (error instanceof Error) {
        throw new InternalServerErrorException(
          `Error interno al actualizar el usuario. ${error.message}`,
        );
      }

      // Si no es un Error (caso raro)
      throw new InternalServerErrorException(
        'Error interno al actualizar el usuario.',
      );
    }
  }

  async toggleStatus(id: number): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    user.status = !user.status; // ✅ Alternar el valor booleano
    const updatedUser = await this.userRepository.save(user);

    const { password, ...safeUser } = updatedUser;
    void password;

    return safeUser;
  }

  async remove(id: number): Promise<{ message: string }> {
    try {
      const result = await this.userRepository.delete(id);

      if (result.affected === 0) {
        throw new NotFoundException(`Usuario con id ${id} no encontrado`);
      }

      return { message: 'Usuario eliminado exitosamente' };
    } catch (error) {
      //  Manejo de errores más robusto
      if (error instanceof HttpException) {
        throw error;
      }

      // Para otros errores, registramos y lanzamos una excepción genérica
      console.error('Error al eliminar el usuario:', error);
      throw new InternalServerErrorException(
        'Ocurrió un error interno al intentar eliminar el usuario.',
      );
    }
  }
  async rolesAndPermissions(user_id: number): Promise<any> {
    try {
      // Busca el usuario y sus roles
      const user = await this.userRepository.findOne({
        where: { id: user_id },
        relations: ['roles.role'],
      });
      if (!user) throw new NotFoundException('Usuario no encontrado');

      // Obtiene los roles del usuario
      const roles = user.roles.map((userRole) => userRole.role);
      const roleIds = roles.map((role) => role.id);

      // Obtiene los permisos de los roles
      const permissions = await this.roleHasPermissionRepository.find({
        where: { role: { id: In(roleIds) } },
        relations: ['permission', 'role'],
      });

      // Elimina permisos duplicados usando un Set
      const uniquePermissions = Array.from(
        new Map(
          permissions.map((rp) => [rp.permission.id, rp.permission]),
        ).values(),
      );

      // Agregar cantidad de permisos a cada rol
      const permissionsByRole = new Map<number, number>();
      permissions.forEach((rp) => {
        const roleId = rp.role.id;
        permissionsByRole.set(roleId, (permissionsByRole.get(roleId) || 0) + 1);
      });
      const rolesWithPermissionsCount = roles.map((role) => ({
        ...role,
        permissions_count: permissionsByRole.get(role.id) || 0,
      }));

      return {
        roles: rolesWithPermissionsCount,
        permissions: uniquePermissions,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        console.error('Error al listar los roles y permisos:', error.message);
        throw error;
      } else {
        console.error('Error al listar los roles y permisos:', error);
        throw new InternalServerErrorException(
          `Error al listar los roles y permisos: ${
            typeof error === 'object' && error !== null && 'message' in error
              ? (error as { message: string }).message
              : String(error)
          }`,
        );
      }
    }
  }
}
