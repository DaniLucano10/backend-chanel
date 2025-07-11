import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsString({ message: "El campo 'email' debe ser una cadena de texto" })
  @IsNotEmpty({ message: "El campo 'email' es requerido" })
  @ApiProperty()
  email: string;

  @IsString({ message: "El campo 'password' debe ser una cadena de texto" })
  @IsNotEmpty({ message: "El campo 'password' es requerido" })
  @ApiProperty()
  password: string;
}
