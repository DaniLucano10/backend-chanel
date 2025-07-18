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
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<any> {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('El correo ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);

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
  }): Promise<Omit<User, 'password'>[]> {
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
      select: ['id', 'fullname', 'email', 'status', 'created_at', 'updated_at'],
    });

    // Si no hay password en select, esto es más que suficiente:
    return users.map(({ password, ...rest }) => {
      void password; // silencia ESLint si hace falta
      return rest;
    });
  }

  async findOne(id: number): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'fullname', 'email', 'status', 'created_at', 'updated_at'],
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    // El password ya está excluido por el `select`
    return user;
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<Omit<User, 'password'>> {
    try {
      // Busca usuario
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new ConflictException(`Usuario con ID ${id} no encontrado`);
      }

      // Actualiza el usuario
      Object.assign(user, updateUserDto);
      const updatedUser = await this.userRepository.save(user);

      // Excluir password correctamente
      const { password, ...safeUser } = updatedUser;
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
}
