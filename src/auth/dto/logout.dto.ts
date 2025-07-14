import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LogOutDto {
  @IsString({ message: "El campo 'email' debe ser una cadena de texto" })
  @IsNotEmpty({ message: "El campo 'email' es requerido" })
  @ApiProperty()
  email!: string;

  @IsString({ message: "El campo 'token_active' debe ser una cadena de texto" })
  @IsNotEmpty({ message: "El campo 'access_token' es requerido" })
  @ApiProperty()
  access_token!: string;
}
