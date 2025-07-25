import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly name!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly guard_name!: string;
}
