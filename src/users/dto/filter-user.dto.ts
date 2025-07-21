import { Type } from 'class-transformer';
import {
  IsBooleanString,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class FilterUserDto {
  @IsString({ message: "El campo 'fullname' debe ser una cadena de texto" })
  @IsOptional()
  fullname!: string;

  @IsString({ message: "El campo 'email' deb ser una cadena de texto" })
  @IsOptional()
  email!: string;

  @IsBooleanString({ message: "El campo 'status' debe ser un valor boleano" })
  @IsOptional()
  status!: boolean;

  @IsPositive({
    message: "El campo 'country_id' debe ser un número entero positivo",
  })
  @IsOptional()
  @Type(() => Number)
  country_id!: number;
}
