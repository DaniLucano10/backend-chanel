import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive } from 'class-validator';

export class UnassignRolePermissionDto {
  @IsPositive({
    message: "El campo 'role_id' debe ser un número entero positivo",
  })
  @IsNotEmpty()
  @ApiProperty()
  role_id!: number;

  @IsPositive({
    message: "El campo 'permission_id' debe ser un número entero positivo",
  })
  @IsNotEmpty()
  @ApiProperty()
  permission_id!: number;
}
