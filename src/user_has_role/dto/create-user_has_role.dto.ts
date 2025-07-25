import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive } from 'class-validator';

export class CreateUserHasRoleDto {
  @IsPositive({
    message: "El campo 'user_id' debe ser un número entero positivo",
  })
  @IsNotEmpty()
  @ApiProperty()
  user_id!: number;

  @IsPositive({
    message: "El campo 'role_id' debe ser un número entero positivo",
  })
  @IsNotEmpty()
  @ApiProperty()
  role_id!: number;
}
