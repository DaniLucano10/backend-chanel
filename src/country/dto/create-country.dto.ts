import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCountryDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly name!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly code!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly dial_code!: string;
}
