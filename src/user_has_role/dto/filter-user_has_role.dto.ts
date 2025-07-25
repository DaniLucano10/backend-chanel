import { Type } from 'class-transformer';
import { IsOptional, IsPositive } from 'class-validator';

export class FilterUserHasRoleDto {
  @IsPositive({ message: "El campo 'id' debe ser un número entero positivo" })
  @IsOptional()
  @Type(() => Number)
  id!: number;

  @IsPositive({
    message: "El campo 'user_id' debe ser un número entero positivo",
  })
  @IsOptional()
  @Type(() => Number)
  user_id!: number;

  @IsPositive({
    message: "El campo 'role_id' debe ser un número entero positivo",
  })
  @IsOptional()
  @Type(() => Number)
  role_id!: number;
}
