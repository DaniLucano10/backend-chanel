import { IsBooleanString, IsOptional, IsString } from 'class-validator';

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
}
