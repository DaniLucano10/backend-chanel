import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateRoleHasPermissionDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  readonly role_id!: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  readonly permission_id!: number;
}
