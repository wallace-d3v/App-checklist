import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateLojaDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nome: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  codigo: string;
}
