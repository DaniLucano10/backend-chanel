import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: "El campo 'fullname' debe ser una cadena de texto" })
  @IsNotEmpty({ message: "El campo 'fullname' es requerido" })
  @ApiProperty()
  fullname!: string;

  @IsString({ message: "El campo 'email' debe ser una cadena de texto" })
  @IsNotEmpty({ message: "El campo 'email' es requerido" })
  @ApiProperty()
  email!: string;

  @IsString({ message: "El campo 'password' debe ser una cadena de texto" })
  @IsNotEmpty({ message: "El campo 'password' es requerido" })
  @ApiProperty()
  password!: string;

  @IsPositive({ message: "El campo 'country_id' debe ser un número positivo" })
  @IsNotEmpty({ message: "El campo 'country_id' es requerido" })
  @ApiProperty()
  country_id!: number;

  @IsPositive({ message: "El campo 'role_id' debe ser un número positivo" })
  @IsNotEmpty({ message: "El campo 'role_id' es requerido" })
  @ApiProperty()
  role_id!: number;
}
